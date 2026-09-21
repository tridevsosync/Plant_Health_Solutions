import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { ReviewModel } from "@/models/Review";
import { ProductModel } from "@/models/Product";
import { reviews as seedReviews, type Review } from "@/lib/data";

let memoryReviews: Review[] = [...seedReviews];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");
  const all = searchParams.get("all") === "true";
  const status = searchParams.get("status");

  try {
    await connectDB();

    const query: Record<string, unknown> = {};
    if (productId) query.productId = productId;

    if (status) {
      query.status = status;
    } else if (!all) {
      query.$or = [{ status: "Approved" }, { status: { $exists: false } }, { status: null }];
    }

    const rawReviews = await ReviewModel.find(query).sort({ createdAt: -1 }).lean();
    const reviews = rawReviews.map((r) => ({
      ...r,
      id: r.id ? String(r.id) : String(r._id),
      _id: String(r._id || r.id),
    }));

    return NextResponse.json({ success: true, reviews });
  } catch (error: unknown) {
    console.warn("Reviews GET fallback:", (error as Error).message);
    let list = [...memoryReviews];
    if (productId) {
      list = list.filter((r) => r.productId === productId);
    }
    if (status) {
      list = list.filter((r) => (r.status || "Approved") === status);
    } else if (!all) {
      list = list.filter((r) => r.status === "Approved" || !r.status);
    }
    return NextResponse.json({ success: true, reviews: list });
  }
}

export async function POST(req: NextRequest) {
  let body: Partial<Review>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.productId || !body.name || !body.comment) {
    return NextResponse.json(
      { success: false, error: "Product ID, name, and review comment are required" },
      { status: 400 }
    );
  }

  const id = body.id || `r_${Date.now()}`;
  const date = body.date || new Date().toISOString().split("T")[0];
  const status = (body.status as "Pending" | "Approved" | "Rejected") || "Pending";

  const newReview: Review = {
    id,
    productId: body.productId,
    name: body.name.trim(),
    rating: Number(body.rating || 5),
    date,
    comment: body.comment.trim(),
    status,
  };

  try {
    await connectDB();

    const review = await ReviewModel.create(newReview);
    const resultObj = review.toObject ? review.toObject() : newReview;
    const finalObj: Review = {
      ...newReview,
      ...resultObj,
      id: resultObj.id || id,
    };
    memoryReviews = [finalObj, ...memoryReviews.filter((r) => r.id !== id)];

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
        ).catch(() => {});
      }
    }

    return NextResponse.json({
      success: true,
      message:
        status === "Pending"
          ? "Thank you! Your feedback has been submitted for review."
          : "Thank you! Your crop review has been posted successfully.",
      review: finalObj,
    });
  } catch (error: unknown) {
    console.warn("Reviews POST fallback:", (error as Error).message);
    memoryReviews = [newReview, ...memoryReviews.filter((r) => r.id !== id)];
    return NextResponse.json({
      success: true,
      message:
        status === "Pending"
          ? "Thank you! Your feedback has been submitted for review."
          : "Thank you! Your crop review has been posted successfully.",
      review: newReview,
    });
  }
}

export async function DELETE() {
  try {
    await connectDB();
    const result = await ReviewModel.deleteMany({});
    memoryReviews = [];
    return NextResponse.json({
      success: true,
      message: "All reviews deleted successfully from MongoDB",
      deletedCount: result.deletedCount,
    });
  } catch (error: unknown) {
    console.warn("Reviews DELETE fallback:", (error as Error).message);
    memoryReviews = [];
    return NextResponse.json({
      success: true,
      message: "All reviews cleared",
      deletedCount: 0,
    });
  }
}
