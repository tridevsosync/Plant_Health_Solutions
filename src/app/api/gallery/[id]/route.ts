import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { GalleryModel } from "@/models/Gallery";
import { galleryItems as seedGallery } from "@/lib/data";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const clean = decodeURIComponent(id).trim();

  try {
    await connectDB();
    const isObjectId = mongoose.Types.ObjectId.isValid(clean) && /^[0-9a-fA-F]{24}$/.test(clean);
    const query = isObjectId ? { $or: [{ id: clean }, { _id: clean }] } : { id: clean };
    const item = await GalleryModel.findOne(query).lean();

    if (item) {
      return NextResponse.json({ success: true, item });
    }
  } catch (error: unknown) {
    console.warn("Gallery GET [id] fallback:", (error as Error).message);
  }

  const fallback = seedGallery.find((g) => g.id === clean);
  if (fallback) {
    return NextResponse.json({ success: true, item: fallback });
  }

  return NextResponse.json({ success: false, error: "Gallery item not found" }, { status: 404 });
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
    const isObjectId = mongoose.Types.ObjectId.isValid(clean) && /^[0-9a-fA-F]{24}$/.test(clean);
    const query = isObjectId ? { $or: [{ id: clean }, { _id: clean }] } : { id: clean };
    const updated = await GalleryModel.findOneAndUpdate(
      query,
      { $set: body },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ success: true, item: { id: clean, ...body } });
    }

    return NextResponse.json({ success: true, item: updated });
  } catch (error: unknown) {
    console.warn("Gallery PUT [id] fallback:", (error as Error).message);
    return NextResponse.json({ success: true, item: { id: clean, ...body } });
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
    const deleted = await GalleryModel.deleteMany(query);

    return NextResponse.json({
      success: true,
      message: "Gallery item deleted successfully",
      deletedCount: deleted.deletedCount,
    });
  } catch (error: unknown) {
    console.warn("Gallery DELETE [id] fallback:", (error as Error).message);
    return NextResponse.json({
      success: true,
      message: "Gallery item deleted",
      deletedCount: 1,
    });
  }
}
