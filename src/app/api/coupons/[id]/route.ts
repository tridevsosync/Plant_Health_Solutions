import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { CouponModel } from "@/models/Coupon";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const clean = decodeURIComponent(id).trim();
    const body = await req.json();

    const isObjectId = mongoose.Types.ObjectId.isValid(clean) && /^[0-9a-fA-F]{24}$/.test(clean);
    const query = isObjectId
      ? { $or: [{ code: clean.toUpperCase() }, { code: clean }, { _id: clean }] }
      : { $or: [{ code: clean.toUpperCase() }, { code: clean }, { code: new RegExp(`^${clean}$`, "i") }] };

    const updated = await CouponModel.findOneAndUpdate(
      query,
      { $set: body },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ success: false, error: "Coupon not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, coupon: updated });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to update coupon";
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
    const query = isObjectId
      ? { $or: [{ code: clean.toUpperCase() }, { code: clean }, { _id: clean }] }
      : { $or: [{ code: clean.toUpperCase() }, { code: clean }, { code: new RegExp(`^${clean}$`, "i") }] };

    const deleted = await CouponModel.deleteMany(query);

    return NextResponse.json({
      success: true,
      message: "Coupon deleted successfully",
      deletedCount: deleted.deletedCount,
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to delete coupon";
    return NextResponse.json({ success: false, error: errMessage }, { status: 500 });
  }
}
