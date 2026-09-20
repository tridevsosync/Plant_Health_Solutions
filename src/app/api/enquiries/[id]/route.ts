import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { EnquiryModel } from "@/models/Enquiry";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();

    const updated = await EnquiryModel.findOneAndUpdate(
      { id },
      { $set: body },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ success: false, error: "Enquiry not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, enquiry: updated });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to update enquiry";
    return NextResponse.json({ success: false, error: errMessage }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const clean = decodeURIComponent(id).trim();
    const isObjectId = mongoose.Types.ObjectId.isValid(clean) && /^[0-9a-fA-F]{24}$/.test(clean);
    const query = isObjectId ? { $or: [{ id: clean }, { _id: clean }] } : { id: clean };
    const deleted = await EnquiryModel.deleteMany(query);

    return NextResponse.json({ success: true, message: "Enquiry deleted successfully", deletedCount: deleted.deletedCount });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to delete enquiry";
    return NextResponse.json({ success: false, error: errMessage }, { status: 500 });
  }
}
