import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { TestimonialModel } from "@/models/Testimonial";
import { testimonials as seedTestimonials, type Testimonial } from "@/lib/data";

// In-memory fallback cache for serverless environments
let memoryTestimonials: Testimonial[] = [...seedTestimonials];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const all = searchParams.get("all") === "true";
  const status = searchParams.get("status");

  try {
    await connectDB();

    const query: Record<string, unknown> = {};
    if (status) {
      query.status = status;
    } else if (!all) {
      // Default public query: show Approved testimonials or items without status
      query.$or = [{ status: "Approved" }, { status: { $exists: false } }, { status: null }];
    }

    const rawTestimonials = await TestimonialModel.find(query).sort({ createdAt: -1 }).lean();
    const testimonials = rawTestimonials.map((t) => ({
      ...t,
      id: t.id ? String(t.id) : String(t._id),
      _id: String(t._id || t.id),
    }));

    return NextResponse.json({ success: true, testimonials });
  } catch (error: unknown) {
    console.warn("Testimonials GET fallback:", (error as Error).message);
    let list = [...memoryTestimonials];
    if (status) {
      list = list.filter((t) => (t.status || "Approved") === status);
    } else if (!all) {
      list = list.filter((t) => t.status === "Approved" || !t.status);
    }
    return NextResponse.json({ success: true, testimonials: list });
  }
}

export async function POST(req: NextRequest) {
  let body: Partial<Testimonial>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON payload" },
      { status: 400 }
    );
  }

  if (!body.name || !body.quote) {
    return NextResponse.json(
      { success: false, error: "Farmer name and feedback message are required" },
      { status: 400 }
    );
  }

  const id = body.id || `t_${Date.now()}`;
  const date = body.date || new Date().toISOString().split("T")[0];
  const status = (body.status as "Pending" | "Approved" | "Rejected") || "Pending";

  const newTestimonial: Testimonial = {
    id,
    name: body.name.trim(),
    place: body.place?.trim() || "Vijayapura, Karnataka",
    crop: body.crop?.trim() || "Sugarcane",
    rating: Number(body.rating || 5),
    quote: body.quote.trim(),
    productId: body.productId || "",
    productName: body.productName || "",
    status,
    date,
    image: body.image || "",
  };

  try {
    await connectDB();
    const created = await TestimonialModel.create(newTestimonial);
    const resultObj = created.toObject ? created.toObject() : newTestimonial;
    const finalObj: Testimonial = {
      ...newTestimonial,
      ...resultObj,
      id: resultObj.id || id,
    };
    memoryTestimonials = [finalObj, ...memoryTestimonials.filter((t) => t.id !== id)];

    return NextResponse.json({
      success: true,
      message:
        status === "Pending"
          ? "Thank you! Your feedback has been submitted for review. It will appear once approved by our team."
          : "Thank you! Your feedback has been submitted and is now live on our website!",
      testimonial: finalObj,
    });
  } catch (error: unknown) {
    console.warn("Testimonials POST fallback:", (error as Error).message);
    memoryTestimonials = [newTestimonial, ...memoryTestimonials.filter((t) => t.id !== id)];

    return NextResponse.json({
      success: true,
      message:
        status === "Pending"
          ? "Thank you! Your feedback has been submitted for review."
          : "Thank you! Your feedback has been submitted and is now live on our website!",
      testimonial: newTestimonial,
    });
  }
}

export async function DELETE() {
  try {
    await connectDB();
    const result = await TestimonialModel.deleteMany({});
    memoryTestimonials = [];
    return NextResponse.json({
      success: true,
      message: "All testimonials deleted successfully from MongoDB",
      deletedCount: result.deletedCount,
    });
  } catch (error: unknown) {
    console.warn("Testimonials DELETE fallback:", (error as Error).message);
    memoryTestimonials = [];
    return NextResponse.json({
      success: true,
      message: "All testimonials cleared",
      deletedCount: 0,
    });
  }
}
