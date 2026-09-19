import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { ProductModel } from "@/models/Product";
import { seedDatabase } from "@/lib/seedDb";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    let count = await ProductModel.countDocuments();
    if (count === 0) {
      await seedDatabase(false);
      count = await ProductModel.countDocuments();
    }

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("q");

    const query: Record<string, unknown> = {};
    if (category && category !== "All") {
      query.category = category;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }

    const products = await ProductModel.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, products });
  } catch (error: unknown) {
    console.error("Products GET error:", error);
    const errMessage = error instanceof Error ? error.message : "Failed to fetch products";
    return NextResponse.json({ success: false, error: errMessage }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    if (!body.name || !body.category) {
      return NextResponse.json(
        { success: false, error: "Name and Category are required" },
        { status: 400 }
      );
    }

    const id = body.id || `p_${Date.now()}`;
    const product = await ProductModel.create({
      ...body,
      id,
    });

    return NextResponse.json({ success: true, product });
  } catch (error: unknown) {
    console.error("Product POST error:", error);
    const errMessage = error instanceof Error ? error.message : "Failed to create product";
    return NextResponse.json({ success: false, error: errMessage }, { status: 500 });
  }
}
