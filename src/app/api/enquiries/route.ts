import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { EnquiryModel } from "@/models/Enquiry";
import { enquiries as seedEnquiries, type Enquiry } from "@/lib/data";
import { sendEnquiryConfirmationEmail } from "@/lib/email";

let memoryEnquiries: Enquiry[] = [...seedEnquiries];

export async function GET() {
  try {
    await connectDB();
    const count = await EnquiryModel.countDocuments();
    if (count === 0 && seedEnquiries.length > 0) {
      await EnquiryModel.insertMany(seedEnquiries).catch(() => {});
    }
    const docs = await EnquiryModel.find({}).sort({ createdAt: -1 }).lean();
    const enquiries = docs.map((doc) => ({
      ...doc,
      id: doc.id || (doc._id ? String(doc._id) : `e_${Date.now()}`),
      _id: doc._id ? String(doc._id) : undefined,
    }));
    return NextResponse.json({ success: true, enquiries });
  } catch (error: unknown) {
    console.warn("Enquiries GET fallback:", (error as Error).message);
    return NextResponse.json({ success: true, enquiries: memoryEnquiries });
  }
}

export async function POST(req: NextRequest) {
  let body: Partial<Enquiry>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.name || !body.email || !body.message) {
    return NextResponse.json(
      { success: false, error: "Name, email, and message are required" },
      { status: 400 }
    );
  }

  const id = body.id || `e_${Date.now()}`;
  const date = body.date || new Date().toISOString().split("T")[0];

  const newEnquiry: Enquiry = {
    id,
    name: body.name.trim(),
    phone: body.phone?.trim() || "",
    email: body.email.trim(),
    subject: body.subject?.trim() || "General Farming Enquiry",
    message: body.message.trim(),
    date,
    status: (body.status as "New" | "Answered") || "New",
  };

  try {
    await connectDB();
    const created = await EnquiryModel.create(newEnquiry);
    const resultObj = created.toObject ? created.toObject() : newEnquiry;
    memoryEnquiries = [resultObj, ...memoryEnquiries.filter((e) => e.id !== id)];

    // Send acknowledgment email to user
    sendEnquiryConfirmationEmail(resultObj).catch((e) =>
      console.error("Async enquiry confirmation email error:", e)
    );

    return NextResponse.json({ success: true, enquiry: resultObj });
  } catch (error: unknown) {
    console.warn("Enquiry POST fallback:", (error as Error).message);
    memoryEnquiries = [newEnquiry, ...memoryEnquiries.filter((e) => e.id !== id)];

    sendEnquiryConfirmationEmail(newEnquiry).catch((e) =>
      console.error("Async enquiry confirmation email error:", e)
    );

    return NextResponse.json({ success: true, enquiry: newEnquiry });
  }
}

export async function DELETE() {
  try {
    await connectDB();
    const result = await EnquiryModel.deleteMany({});
    memoryEnquiries = [];
    return NextResponse.json({
      success: true,
      message: "All enquiries deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error: unknown) {
    console.warn("Enquiries DELETE fallback:", (error as Error).message);
    memoryEnquiries = [];
    return NextResponse.json({
      success: true,
      message: "All enquiries cleared",
      deletedCount: 0,
    });
  }
}
