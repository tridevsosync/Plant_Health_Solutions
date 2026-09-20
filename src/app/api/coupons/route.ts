import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { CouponModel } from "@/models/Coupon";

export async function GET() {
  try {
    await connectDB();
    const coupons = await CouponModel.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, coupons });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to fetch coupons";
    return NextResponse.json({ success: false, error: errMessage }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    if (!body.code || body.discount === undefined) {
      return NextResponse.json(
        { success: false, error: "Coupon code and discount percentage are required" },
        { status: 400 }
      );
    }

    const cleanCode = body.code.trim().toUpperCase();
    const existing = await CouponModel.findOne({ code: cleanCode });
    if (existing) {
      return NextResponse.json(
        { success: false, error: `Coupon code '${cleanCode}' already exists` },
        { status: 400 }
      );
    }

    const coupon = await CouponModel.create({
      code: cleanCode,
      discount: Number(body.discount),
      minOrder: Number(body.minOrder || 0),
      description: body.description || "",
    });

    return NextResponse.json({ success: true, coupon });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to create coupon";
    return NextResponse.json({ success: false, error: errMessage }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await connectDB();
    const result = await CouponModel.deleteMany({});
    return NextResponse.json({
      success: true,
      message: "All coupons deleted successfully from MongoDB",
      deletedCount: result.deletedCount,
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to delete all coupons";
    return NextResponse.json({ success: false, error: errMessage }, { status: 500 });
  }
}
