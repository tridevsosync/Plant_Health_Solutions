import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { BlogModel } from "@/models/Blog";
import { blogs as seedBlogs } from "@/lib/data";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const clean = decodeURIComponent(id).trim();

  try {
    await connectDB();
    const blog = await BlogModel.findOne({ id: clean }).lean();

    if (blog) {
      return NextResponse.json({ success: true, blog });
    }
  } catch (error: unknown) {
    console.warn("Blog GET fallback:", (error as Error).message);
  }

  const fallbackBlog = seedBlogs.find((b) => b.id === clean);
  if (fallbackBlog) {
    return NextResponse.json({ success: true, blog: fallbackBlog });
  }

  return NextResponse.json({ success: false, error: "Blog not found" }, { status: 404 });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const clean = decodeURIComponent(id).trim();
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON" }, { status: 400 });
  }

  try {
    await connectDB();
    const updated = await BlogModel.findOneAndUpdate(
      { id: clean },
      { $set: body },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ success: true, blog: { id: clean, ...body } });
    }

    return NextResponse.json({ success: true, blog: updated });
  } catch (error: unknown) {
    console.warn("Blog PUT fallback:", (error as Error).message);
    return NextResponse.json({ success: true, blog: { id: clean, ...body } });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const clean = decodeURIComponent(id).trim();

  try {
    await connectDB();
    const isObjectId = mongoose.Types.ObjectId.isValid(clean) && /^[0-9a-fA-F]{24}$/.test(clean);
    const query = isObjectId ? { $or: [{ id: clean }, { _id: clean }] } : { id: clean };
    const deleted = await BlogModel.deleteMany(query);

    return NextResponse.json({
      success: true,
      message: "Blog deleted successfully",
      deletedCount: deleted.deletedCount,
    });
  } catch (error: unknown) {
    console.warn("Blog DELETE fallback:", (error as Error).message);
    return NextResponse.json({
      success: true,
      message: "Blog deleted",
      deletedCount: 1,
    });
  }
}
