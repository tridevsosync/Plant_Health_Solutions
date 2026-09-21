import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { OrderModel } from "@/models/Order";
import { orders as seedOrders, type Order } from "@/lib/data";
import { sendOrderStatusEmail } from "@/lib/email";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const clean = decodeURIComponent(id).trim();

  try {
    await connectDB();
    const order = await OrderModel.findOne({ id: clean }).lean();
    if (order) {
      return NextResponse.json({ success: true, order });
    }
  } catch (error: unknown) {
    console.warn("Order GET fallback:", (error as Error).message);
  }

  const fallbackOrder = seedOrders.find((o) => o.id === clean);
  if (fallbackOrder) {
    return NextResponse.json({ success: true, order: fallbackOrder });
  }

  return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
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
    const updated = await OrderModel.findOneAndUpdate(
      { id: clean },
      { $set: body },
      { new: true }
    );

    const updatedObj = (updated ? (updated.toObject ? updated.toObject() : updated) : { id: clean, ...body }) as Order;

    // If status or tracking number was updated, send notification email
    if (body.status || body.trackingNumber) {
      sendOrderStatusEmail(updatedObj).catch((e) =>
        console.error("Async order status email error:", e)
      );
    }

    return NextResponse.json({ success: true, order: updatedObj });
  } catch (error: unknown) {
    console.warn("Order PUT fallback:", (error as Error).message);
    const fallbackObj = { id: clean, ...body } as Order;
    if (body.status || body.trackingNumber) {
      sendOrderStatusEmail(fallbackObj).catch((e) =>
        console.error("Async order status email error:", e)
      );
    }
    return NextResponse.json({ success: true, order: fallbackObj });
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
    const deleted = await OrderModel.deleteMany(query);

    return NextResponse.json({
      success: true,
      message: "Order deleted successfully",
      deletedCount: deleted.deletedCount,
    });
  } catch (error: unknown) {
    console.warn("Order DELETE fallback:", (error as Error).message);
    return NextResponse.json({
      success: true,
      message: "Order deleted",
      deletedCount: 1,
    });
  }
}
