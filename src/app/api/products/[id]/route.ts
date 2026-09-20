import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { ProductModel } from "@/models/Product";
import { products as seedProducts } from "@/lib/data";

function buildIdQuery(rawId: string) {
  const decoded = decodeURIComponent(rawId).trim();
  const isObjectId = mongoose.Types.ObjectId.isValid(decoded) && /^[0-9a-fA-F]{24}$/.test(decoded);
  if (isObjectId) {
    return { $or: [{ id: decoded }, { _id: decoded }, { name: decoded }] };
  }
  return { $or: [{ id: decoded }, { name: decoded }] };
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const query = buildIdQuery(id);
    const product = await ProductModel.findOne(query);

    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, product });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to fetch product";
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
    const query = buildIdQuery(id);

    const updated = await ProductModel.findOneAndUpdate(
      query,
      { $set: body },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, product: updated });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to update product";
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
    const query = buildIdQuery(id);
    const res = await ProductModel.deleteMany(query);

    return NextResponse.json({ success: true, message: "Product deleted successfully", deletedCount: res.deletedCount });
  } catch (error: unknown) {
    console.warn("Product DELETE error:", (error as Error).message);
    const errMessage = error instanceof Error ? error.message : "Failed to delete product";
    return NextResponse.json({ success: false, error: errMessage }, { status: 500 });
  }
}

