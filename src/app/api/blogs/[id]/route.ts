import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { BlogModel } from "@/models/Blog";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const blog = await BlogModel.findOne({ id });

    if (!blog) {
      return NextResponse.json({ success: false, error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, blog });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to fetch blog";
    return NextResponse.json({ success: false, error: errMessage }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();

    const updated = await BlogModel.findOneAndUpdate(
      { id },
      { $set: body },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ success: false, error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, blog: updated });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to update blog";
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
    const deleted = await BlogModel.findOneAndDelete({ id });

    if (!deleted) {
      return NextResponse.json({ success: false, error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Blog deleted successfully" });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to delete blog";
    return NextResponse.json({ success: false, error: errMessage }, { status: 500 });
  }
}
