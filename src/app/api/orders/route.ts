import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { OrderModel } from "@/models/Order";
import { CustomerModel } from "@/models/Customer";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const query: Record<string, unknown> = {};
    if (email) query.email = email.toLowerCase();

    const orders = await OrderModel.find(query).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, orders });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to fetch orders";
    return NextResponse.json({ success: false, error: errMessage }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    if (!body.customer || !body.email || !body.items || !body.items.length) {
      return NextResponse.json(
        { success: false, error: "Order details (customer, email, items) are required" },
        { status: 400 }
      );
    }

    const id = body.id || `PHS-2026-${Math.floor(2000 + Math.random() * 7999)}`;
    const date = body.date || new Date().toISOString().split("T")[0];
    const trackingNumber =
      body.trackingNumber || `PHS-TRK-${Math.floor(100000 + Math.random() * 900000)}`;

    const isOnlinePaid =
      body.payment?.toLowerCase().includes("razorpay") ||
      body.payment?.toLowerCase().includes("upi") ||
      body.payment?.toLowerCase().includes("paid");

    const paymentStatus = body.paymentStatus || (isOnlinePaid ? "Paid" : "Pending");

    const order = await OrderModel.create({
      ...body,
      id,
      date,
      status: body.status || "Pending",
      trackingNumber,
      courier: body.courier || "VRL Logistics / DTDC Express",
      estimatedDelivery: body.estimatedDelivery || "3 - 5 business days",
      paymentStatus,
    });

    // Update or create customer
    const cleanEmail = body.email.trim().toLowerCase();
    const existingCust = await CustomerModel.findOne({ email: cleanEmail });
    if (existingCust) {
      await CustomerModel.updateOne(
        { email: cleanEmail },
        {
          $inc: { orders: 1 },
          $set: {
            name: body.customer,
            phone: body.phone || existingCust.phone,
          },
        }
      );
    } else {
      await CustomerModel.create({
        id: `c_${Date.now()}`,
        name: body.customer,
        email: cleanEmail,
        phone: body.phone || "",
        city: body.address ? body.address.split(",").slice(-2)[0]?.trim() || "Karnataka" : "Karnataka",
        orders: 1,
        active: true,
      });
    }

    return NextResponse.json({ success: true, order });
  } catch (error: unknown) {
    console.error("Order POST error:", error);
    const errMessage = error instanceof Error ? error.message : "Failed to place order";
    return NextResponse.json({ success: false, error: errMessage }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await connectDB();
    const result = await OrderModel.deleteMany({});
    return NextResponse.json({
      success: true,
      message: "All orders deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to delete all orders";
    return NextResponse.json({ success: false, error: errMessage }, { status: 500 });
  }
}
