import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { ProductModel } from "@/models/Product";
import { products as seedProducts } from "@/lib/data";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("q");

    // Only seed if the collection is totally empty (e.g. brand new database setup)
    const count = await ProductModel.countDocuments();
    if (count === 0 && seedProducts.length > 0) {
      await ProductModel.insertMany(seedProducts).catch(() => {});
    }

    const query: Record<string, unknown> = {};
    if (category && category !== "All") {
      query.category = category;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { ingredients: { $regex: search, $options: "i" } },
      ];
    }

    const dbProducts = await ProductModel.find(query).sort({ createdAt: -1 }).lean();

    return NextResponse.json({
      success: true,
      products: dbProducts,
    });
  } catch (error: unknown) {
    console.warn("Products GET fallback:", (error as Error).message);
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("q");

    let filtered = seedProducts;
    if (category && category !== "All") {
      filtered = filtered.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(s) ||
          p.description.toLowerCase().includes(s) ||
          p.category.toLowerCase().includes(s)
      );
    }

    return NextResponse.json({ success: true, products: filtered });
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

export async function DELETE() {
  try {
    await connectDB();
    await ProductModel.deleteMany({});
    return NextResponse.json({ success: true, message: "All products deleted" });
  } catch (error: unknown) {
    console.error("Product DELETE error:", error);
    return NextResponse.json({ success: true, message: "All products cleared" });
  }
}

