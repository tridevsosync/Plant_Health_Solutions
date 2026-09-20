import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { ReviewModel } from "@/models/Review";
import { ProductModel } from "@/models/Product";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");
    const all = searchParams.get("all") === "true";
    const status = searchParams.get("status");

    const query: Record<string, unknown> = {};
    if (productId) query.productId = productId;

    if (status) {
      query.status = status;
    } else if (!all) {
      query.$or = [{ status: "Approved" }, { status: { $exists: false } }, { status: null }];
    }

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
        { success: false, error: "Product ID, name, and review comment are required" },
        { status: 400 }
      );
    }

    const id = body.id || `r_${Date.now()}`;
    const date = body.date || new Date().toISOString().split("T")[0];
    const status = body.status || "Pending";

    const review = await ReviewModel.create({
      id,
      productId: body.productId,
      name: body.name.trim(),
      rating: Number(body.rating || 5),
      date,
      comment: body.comment.trim(),
      status,
    });

    // If approved immediately, recalculate product rating
    if (status === "Approved") {
      const approvedReviews = await ReviewModel.find({
        productId: body.productId,
        $or: [{ status: "Approved" }, { status: { $exists: false } }, { status: null }],
      });
      if (approvedReviews.length > 0) {
        const avgRating =
          approvedReviews.reduce((sum, r) => sum + (r.rating || 5), 0) / approvedReviews.length;
        await ProductModel.updateOne(
          { id: body.productId },
          {
            $set: {
              reviews: approvedReviews.length,
              rating: Number(avgRating.toFixed(1)),
            },
          }
        );
      }
    }

    return NextResponse.json({
      success: true,
      message:
        status === "Pending"
          ? "Thank you! Your feedback has been submitted for review. It will be published once approved by admin."
          : "Review submitted successfully.",
      review,
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to post review";
    return NextResponse.json({ success: false, error: errMessage }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await connectDB();
    const result = await ReviewModel.deleteMany({});
    return NextResponse.json({
      success: true,
      message: "All reviews deleted successfully from MongoDB",
      deletedCount: result.deletedCount,
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to delete all reviews";
    return NextResponse.json({ success: false, error: errMessage }, { status: 500 });
  }
}
