import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { OrderModel } from "@/models/Order";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const order = await OrderModel.findOne({ id });

    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, order });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to fetch order";
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

    const updated = await OrderModel.findOneAndUpdate(
      { id },
      { $set: body },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to update order";
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
    const clean = decodeURIComponent(id).trim();
    const isObjectId = mongoose.Types.ObjectId.isValid(clean) && /^[0-9a-fA-F]{24}$/.test(clean);
    const query = isObjectId ? { $or: [{ id: clean }, { _id: clean }] } : { id: clean };
    const deleted = await OrderModel.deleteMany(query);

    return NextResponse.json({ success: true, message: "Order deleted successfully", deletedCount: deleted.deletedCount });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to delete order";
    return NextResponse.json({ success: false, error: errMessage }, { status: 500 });
  }
}
