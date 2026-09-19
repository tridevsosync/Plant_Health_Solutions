import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { CouponModel } from "@/models/Coupon";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();

    const updated = await CouponModel.findOneAndUpdate(
      { code: id.toUpperCase() },
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
    const deleted = await CouponModel.findOneAndDelete({ code: id.toUpperCase() });

    if (!deleted) {
      return NextResponse.json({ success: false, error: "Coupon not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Coupon deleted successfully" });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to delete coupon";
    return NextResponse.json({ success: false, error: errMessage }, { status: 500 });
  }
}
