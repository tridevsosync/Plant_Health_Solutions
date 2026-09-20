import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { CategoryModel } from "@/models/Category";

function buildCategoryQuery(rawId: string) {
  const decoded = decodeURIComponent(rawId).trim();
  const isObjectId = mongoose.Types.ObjectId.isValid(decoded) && /^[0-9a-fA-F]{24}$/.test(decoded);
  if (isObjectId) {
    return { $or: [{ id: decoded }, { _id: decoded }, { slug: decoded }, { name: decoded }] };
  }
  return { $or: [{ id: decoded }, { slug: decoded }, { name: decoded }] };
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();

    if (body.name && !body.slug) {
      body.slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    }

    const query = buildCategoryQuery(id);
    const updated = await CategoryModel.findOneAndUpdate(
      query,
      { $set: body },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ success: false, error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, category: updated });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to update category";
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
    const query = buildCategoryQuery(id);
    const result = await CategoryModel.deleteMany(query);

    return NextResponse.json({ success: true, message: "Category deleted successfully", deletedCount: result.deletedCount });
  } catch (error: unknown) {
    console.warn("Category DELETE error:", (error as Error).message);
    const errMessage = error instanceof Error ? error.message : "Failed to delete category";
    return NextResponse.json({ success: false, error: errMessage }, { status: 500 });
  }
}

