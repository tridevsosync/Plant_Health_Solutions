import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { CategoryModel } from "@/models/Category";
import { categories as seedCategories } from "@/lib/data";

export async function GET() {
  try {
    await connectDB();
    const count = await CategoryModel.countDocuments();
    if (count === 0 && seedCategories.length > 0) {
      await CategoryModel.insertMany(seedCategories).catch(() => {});
    }
    const categories = await CategoryModel.find({}).sort({ createdAt: 1 });
    return NextResponse.json({
      success: true,
      categories,
    });
  } catch (error: unknown) {
    console.warn("Categories GET fallback:", (error as Error).message);
    return NextResponse.json({ success: true, categories: seedCategories });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    if (!body.name) {
      return NextResponse.json({ success: false, error: "Name is required" }, { status: 400 });
    }

    const slug = body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const id = body.id || `c_${Date.now()}`;

    const category = await CategoryModel.create({
      ...body,
      id,
      slug,
    });

    return NextResponse.json({ success: true, category });
  } catch (error: unknown) {
    console.error("Category POST error:", error);
    const errMessage = error instanceof Error ? error.message : "Failed to create category";
    return NextResponse.json({ success: false, error: errMessage }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await connectDB();
    await CategoryModel.deleteMany({});
    return NextResponse.json({ success: true, message: "All categories deleted" });
  } catch (error: unknown) {
    console.error("Categories DELETE error:", error);
    return NextResponse.json({ success: true, message: "All categories cleared" });
  }
}
