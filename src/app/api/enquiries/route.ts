import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { EnquiryModel } from "@/models/Enquiry";
import { seedDatabase } from "@/lib/seedDb";

export async function GET() {
  try {
    await connectDB();
    const count = await EnquiryModel.countDocuments();
    if (count === 0) {
      await seedDatabase(false);
    }
    const enquiries = await EnquiryModel.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, enquiries });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to fetch enquiries";
    return NextResponse.json({ success: false, error: errMessage }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { success: false, error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    const id = body.id || `e_${Date.now()}`;
    const date = body.date || new Date().toISOString().split("T")[0];

    const enquiry = await EnquiryModel.create({
      ...body,
      id,
      date,
      status: body.status || "New",
    });

    return NextResponse.json({ success: true, enquiry });
  } catch (error: unknown) {
    console.error("Enquiry POST error:", error);
    const errMessage = error instanceof Error ? error.message : "Failed to submit enquiry";
    return NextResponse.json({ success: false, error: errMessage }, { status: 500 });
  }
}
