import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { CategoryModel } from "@/models/Category";
import { seedDatabase } from "@/lib/seedDb";

export async function GET() {
  try {
    await connectDB();
    const count = await CategoryModel.countDocuments();
    if (count === 0) {
      await seedDatabase(false);
    }
    const categories = await CategoryModel.find({}).sort({ createdAt: 1 });
    return NextResponse.json({ success: true, categories });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to fetch categories";
    return NextResponse.json({ success: false, error: errMessage }, { status: 500 });
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
    const errMessage = error instanceof Error ? error.message : "Failed to create category";
    return NextResponse.json({ success: false, error: errMessage }, { status: 500 });
  }
}
