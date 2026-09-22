import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { GalleryModel } from "@/models/Gallery";
import { galleryItems as seedGallery, type GalleryItem } from "@/lib/data";

let memoryGallery: GalleryItem[] = [...seedGallery];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const category = searchParams.get("category");
  const status = searchParams.get("status");

  try {
    await connectDB();
    const count = await GalleryModel.countDocuments();
    if (count === 0 && seedGallery.length > 0) {
      await GalleryModel.insertMany(seedGallery).catch(() => {});
    }

    const query: Record<string, unknown> = {};
    if (type && type !== "all") query.type = type;
    if (category && category !== "All") query.category = category;
    if (status && status !== "all") query.status = status;

    let items = await GalleryModel.find(query).sort({ order: 1, createdAt: -1 }).lean();
    if (items.length === 0 && (!type || type === "all") && (!category || category === "All") && seedGallery.length > 0) {
      try {
        await GalleryModel.insertMany(seedGallery);
        items = await GalleryModel.find(query).sort({ order: 1, createdAt: -1 }).lean();
      } catch {
        return NextResponse.json({ success: true, items: seedGallery });
      }
    }
    return NextResponse.json({ success: true, items: items.length > 0 ? items : seedGallery });
  } catch (error: unknown) {
    console.warn("Gallery GET fallback:", (error as Error).message);
    let list = memoryGallery.length > 0 ? [...memoryGallery] : [...seedGallery];
    if (type && type !== "all") {
      list = list.filter((g) => g.type === type);
    }
    if (category && category !== "All") {
      list = list.filter((g) => (g.category || "").toLowerCase() === category.toLowerCase());
    }
    if (status && status !== "all") {
      list = list.filter((g) => (g.status || "Active").toLowerCase() === status.toLowerCase());
    }
    return NextResponse.json({ success: true, items: list.length > 0 ? list : seedGallery });
  }
}

export async function POST(req: NextRequest) {
  let body: Partial<GalleryItem>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.title) {
    return NextResponse.json({ success: false, error: "Name / Title is required" }, { status: 400 });
  }

  const id = body.id || `g_${Date.now()}`;
  const date = body.date || new Date().toISOString().split("T")[0];

  const newItem: GalleryItem = {
    id,
    title: body.title,
    description: body.description || "",
    type: body.type === "video" ? "video" : "photo",
    mediaUrl: body.mediaUrl || "",
    thumbnailUrl: body.thumbnailUrl || body.mediaUrl || "",
    videoLink: body.videoLink || "",
    category: body.category || "General",
    featured: Boolean(body.featured),
    status: body.status === "Draft" ? "Draft" : "Active",
    order: Number(body.order || 0),
    date,
  };

  try {
    await connectDB();
    const item = await GalleryModel.create(newItem);
    const resultObj = item.toObject ? item.toObject() : newItem;
    memoryGallery = [resultObj, ...memoryGallery.filter((g) => g.id !== id)];
    return NextResponse.json({ success: true, item: resultObj });
  } catch (error: unknown) {
    console.warn("Gallery POST fallback:", (error as Error).message);
    memoryGallery = [newItem, ...memoryGallery.filter((g) => g.id !== id)];
    return NextResponse.json({ success: true, item: newItem });
  }
}

export async function DELETE() {
  try {
    await connectDB();
    const result = await GalleryModel.deleteMany({});
    memoryGallery = [];
    return NextResponse.json({
      success: true,
      message: "All gallery items deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error: unknown) {
    console.warn("Gallery DELETE fallback:", (error as Error).message);
    memoryGallery = [];
    return NextResponse.json({
      success: true,
      message: "All gallery items cleared",
      deletedCount: 0,
    });
  }
}
