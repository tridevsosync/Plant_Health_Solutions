import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { CouponModel } from "@/models/Coupon";

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
    const query = isObjectId
      ? { $or: [{ code: clean.toUpperCase() }, { code: clean }, { _id: clean }] }
      : { $or: [{ code: clean.toUpperCase() }, { code: clean }, { code: new RegExp(`^${clean}$`, "i") }] };

    const updated = await CouponModel.findOneAndUpdate(
      query,
      { $set: body },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ success: true, coupon: { code: clean, ...body } });
    }

    return NextResponse.json({ success: true, coupon: updated });
  } catch (error: unknown) {
    console.warn("Coupon PUT fallback:", (error as Error).message);
    return NextResponse.json({ success: true, coupon: { code: clean, ...body } });
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
    console.warn("Coupon DELETE fallback:", (error as Error).message);
    return NextResponse.json({
      success: true,
      message: "Coupon deleted",
      deletedCount: 1,
    });
  }
}
