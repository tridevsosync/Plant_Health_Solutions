import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { TestimonialModel } from "@/models/Testimonial";
import { seedDatabase } from "@/lib/seedDb";

export async function GET() {
  try {
    await connectDB();
    const count = await TestimonialModel.countDocuments();
    if (count === 0) {
      await seedDatabase(false);
    }
    const testimonials = await TestimonialModel.find({}).sort({ createdAt: -1 });
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
        { success: false, error: "Name and testimonial quote are required" },
        { status: 400 }
      );
    }

    const id = body.id || `t_${Date.now()}`;
    const testimonial = await TestimonialModel.create({
      ...body,
      id,
    });

    return NextResponse.json({ success: true, testimonial });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to create testimonial";
    return NextResponse.json({ success: false, error: errMessage }, { status: 500 });
  }
}
