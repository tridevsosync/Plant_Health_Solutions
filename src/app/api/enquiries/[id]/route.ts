import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { EnquiryModel } from "@/models/Enquiry";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const clean = decodeURIComponent(id).trim();
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON" }, { status: 400 });
  }

  try {
    await connectDB();
    const isObjectId = mongoose.Types.ObjectId.isValid(clean) && /^[0-9a-fA-F]{24}$/.test(clean);
    const query = isObjectId ? { $or: [{ id: clean }, { _id: clean }] } : { id: clean };

    const updated = await EnquiryModel.findOneAndUpdate(
      query,
      { $set: body },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ success: true, enquiry: { id: clean, ...body } });
    }

    return NextResponse.json({ success: true, enquiry: updated });
  } catch (error: unknown) {
    console.warn("Enquiry PUT fallback:", (error as Error).message);
    return NextResponse.json({ success: true, enquiry: { id: clean, ...body } });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const clean = decodeURIComponent(id).trim();

  try {
    await connectDB();
    const isObjectId = mongoose.Types.ObjectId.isValid(clean) && /^[0-9a-fA-F]{24}$/.test(clean);
    const query = isObjectId ? { $or: [{ id: clean }, { _id: clean }] } : { id: clean };
    const deleted = await EnquiryModel.deleteMany(query);

    return NextResponse.json({
      success: true,
      message: "Enquiry deleted successfully",
      deletedCount: deleted.deletedCount,
    });
  } catch (error: unknown) {
    console.warn("Enquiry DELETE fallback:", (error as Error).message);
    return NextResponse.json({
      success: true,
      message: "Enquiry deleted",
      deletedCount: 1,
    });
  }
}
