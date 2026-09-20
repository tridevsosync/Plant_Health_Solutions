import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { ReviewModel } from "@/models/Review";
import { ProductModel } from "@/models/Product";

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
    const query = isObjectId ? { $or: [{ id: clean }, { _id: clean }] } : { id: clean };

    const updated = await ReviewModel.findOneAndUpdate(
      query,
      { $set: body },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ success: false, error: "Review not found" }, { status: 404 });
    }

    // Recalculate product rating
    if (updated.productId) {
      const approvedReviews = await ReviewModel.find({
        productId: updated.productId,
        $or: [{ status: "Approved" }, { status: { $exists: false } }, { status: null }],
      });
      const avgRating =
        approvedReviews.length > 0
          ? approvedReviews.reduce((sum, r) => sum + (r.rating || 5), 0) / approvedReviews.length
          : 5.0;
      await ProductModel.updateOne(
        { id: updated.productId },
        {
          $set: {
            reviews: approvedReviews.length,
            rating: Number(avgRating.toFixed(1)),
          },
        }
      );
    }

    return NextResponse.json({ success: true, review: updated });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to update review";
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

    const review = await ReviewModel.findOne(query);
    const deleted = await ReviewModel.deleteMany(query);

    if (review?.productId) {
      const approvedReviews = await ReviewModel.find({
        productId: review.productId,
        $or: [{ status: "Approved" }, { status: { $exists: false } }, { status: null }],
      });
      const avgRating =
        approvedReviews.length > 0
          ? approvedReviews.reduce((sum, r) => sum + (r.rating || 5), 0) / approvedReviews.length
          : 5.0;
      await ProductModel.updateOne(
        { id: review.productId },
        {
          $set: {
            reviews: approvedReviews.length,
            rating: Number(avgRating.toFixed(1)),
          },
        }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Review deleted successfully",
      deletedCount: deleted.deletedCount,
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to delete review";
    return NextResponse.json({ success: false, error: errMessage }, { status: 500 });
  }
}
