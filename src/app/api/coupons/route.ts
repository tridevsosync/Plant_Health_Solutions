import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { CouponModel } from "@/models/Coupon";
import { coupons as seedCoupons, type Coupon } from "@/lib/data";

let memoryCoupons: Coupon[] = [...seedCoupons];

export async function GET() {
  try {
    await connectDB();
    const count = await CouponModel.countDocuments();
    if (count === 0 && seedCoupons.length > 0) {
      await CouponModel.insertMany(seedCoupons).catch(() => {});
    }
    const coupons = await CouponModel.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, coupons });
  } catch (error: unknown) {
    console.warn("Coupons GET fallback:", (error as Error).message);
    return NextResponse.json({ success: true, coupons: memoryCoupons });
  }
}

export async function POST(req: NextRequest) {
  let body: Partial<Coupon>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.code || body.discount === undefined) {
    return NextResponse.json(
      { success: false, error: "Coupon code and discount percentage are required" },
      { status: 400 }
    );
  }

  const cleanCode = body.code.trim().toUpperCase();
  const newCoupon: Coupon = {
    code: cleanCode,
    discount: Number(body.discount),
    minOrder: Number(body.minOrder || 0),
    description: body.description || "",
  };

  try {
    await connectDB();
    const existing = await CouponModel.findOne({ code: cleanCode });
    if (existing) {
      return NextResponse.json(
        { success: false, error: `Coupon code '${cleanCode}' already exists` },
        { status: 400 }
      );
    }

    const coupon = await CouponModel.create(newCoupon);
    const resultObj = coupon.toObject ? coupon.toObject() : newCoupon;
    memoryCoupons = [resultObj, ...memoryCoupons.filter((c) => c.code !== cleanCode)];
    return NextResponse.json({ success: true, coupon: resultObj });
  } catch (error: unknown) {
    console.warn("Coupon POST fallback:", (error as Error).message);
    memoryCoupons = [newCoupon, ...memoryCoupons.filter((c) => c.code !== cleanCode)];
    return NextResponse.json({ success: true, coupon: newCoupon });
  }
}

export async function DELETE() {
  try {
    await connectDB();
    const result = await CouponModel.deleteMany({});
    memoryCoupons = [];
    return NextResponse.json({
      success: true,
      message: "All coupons deleted successfully from MongoDB",
      deletedCount: result.deletedCount,
    });
  } catch (error: unknown) {
    console.warn("Coupons DELETE fallback:", (error as Error).message);
    memoryCoupons = [];
    return NextResponse.json({
      success: true,
      message: "All coupons cleared",
      deletedCount: 0,
    });
  }
}
