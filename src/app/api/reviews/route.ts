import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { ReviewModel } from "@/models/Review";
import { ProductModel } from "@/models/Product";
import { seedDatabase } from "@/lib/seedDb";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const count = await ReviewModel.countDocuments();
    if (count === 0) {
      await seedDatabase(false);
    }

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");
    const query: Record<string, unknown> = {};
    if (productId) query.productId = productId;

    const reviews = await ReviewModel.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, reviews });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to fetch reviews";
    return NextResponse.json({ success: false, error: errMessage }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    if (!body.productId || !body.name || !body.comment) {
      return NextResponse.json(
        { success: false, error: "Product ID, name, and comment are required" },
        { status: 400 }
      );
    }

    const id = body.id || `r_${Date.now()}`;
    const date = body.date || new Date().toISOString().split("T")[0];

    const review = await ReviewModel.create({
      ...body,
      id,
      date,
      rating: Number(body.rating || 5),
    });

    // Update product reviews count and rating
    const allReviews = await ReviewModel.find({ productId: body.productId });
    const avgRating =
      allReviews.reduce((sum, r) => sum + (r.rating || 5), 0) / allReviews.length;
    await ProductModel.updateOne(
      { id: body.productId },
      {
        $set: {
          reviews: allReviews.length,
          rating: Number(avgRating.toFixed(1)),
        },
      }
    );

    return NextResponse.json({ success: true, review });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to post review";
    return NextResponse.json({ success: false, error: errMessage }, { status: 500 });
  }
}
