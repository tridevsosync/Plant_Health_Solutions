import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { TestimonialModel } from "@/models/Testimonial";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const all = searchParams.get("all") === "true";
    const status = searchParams.get("status");

    const query: Record<string, unknown> = {};
    if (status) {
      query.status = status;
    } else if (!all) {
      // Default public query: show Approved testimonials or legacy items without status
      query.$or = [{ status: "Approved" }, { status: { $exists: false } }, { status: null }];
    }

    const testimonials = await TestimonialModel.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, testimonials });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to fetch testimonials";
    return NextResponse.json({ success: false, error: errMessage }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    if (!body.name || !body.quote) {
      return NextResponse.json(
        { success: false, error: "Farmer name and testimonial quote/feedback are required" },
        { status: 400 }
      );
    }

    const id = body.id || `t_${Date.now()}`;
    const date = body.date || new Date().toISOString().split("T")[0];
    const status = body.status || "Pending";

    const testimonial = await TestimonialModel.create({
      id,
      name: body.name.trim(),
      place: body.place || "Vijayapura, Karnataka",
      crop: body.crop || "Sugarcane",
      rating: Number(body.rating || 5),
      quote: body.quote.trim(),
      productId: body.productId || "",
      productName: body.productName || "",
      status,
      date,
      image: body.image || "",
    });

    return NextResponse.json({
      success: true,
      message: status === "Pending"
        ? "Thank you! Your feedback has been submitted for review. It will appear on the site once approved by our team."
        : "Testimonial created successfully.",
      testimonial,
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to submit testimonial";
    return NextResponse.json({ success: false, error: errMessage }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await connectDB();
    const result = await TestimonialModel.deleteMany({});
    return NextResponse.json({
      success: true,
      message: "All testimonials deleted successfully from MongoDB",
      deletedCount: result.deletedCount,
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to delete all testimonials";
    return NextResponse.json({ success: false, error: errMessage }, { status: 500 });
  }
}
