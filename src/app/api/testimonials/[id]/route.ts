import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { TestimonialModel } from "@/models/Testimonial";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();

    const updated = await TestimonialModel.findOneAndUpdate(
      { id },
      { $set: body },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ success: false, error: "Testimonial not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, testimonial: updated });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to update testimonial";
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
    const deleted = await TestimonialModel.findOneAndDelete({ id });

    if (!deleted) {
      return NextResponse.json({ success: false, error: "Testimonial not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Testimonial deleted successfully" });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to delete testimonial";
    return NextResponse.json({ success: false, error: errMessage }, { status: 500 });
  }
}
