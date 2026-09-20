import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { BlogModel } from "@/models/Blog";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const query: Record<string, unknown> = {};
    if (category && category !== "All") query.category = category;

    const blogs = await BlogModel.find(query).sort({ date: -1 });
    return NextResponse.json({ success: true, blogs });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to fetch blogs";
    return NextResponse.json({ success: false, error: errMessage }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    if (!body.title) {
      return NextResponse.json({ success: false, error: "Title is required" }, { status: 400 });
    }

    const id = body.id || `b_${Date.now()}`;
    const date = body.date || new Date().toISOString().split("T")[0];

    const blog = await BlogModel.create({
      ...body,
      id,
      date,
    });

    return NextResponse.json({ success: true, blog });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to create blog";
    return NextResponse.json({ success: false, error: errMessage }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await connectDB();
    const result = await BlogModel.deleteMany({});
    return NextResponse.json({
      success: true,
      message: "All blogs deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to delete all blogs";
    return NextResponse.json({ success: false, error: errMessage }, { status: 500 });
  }
}
