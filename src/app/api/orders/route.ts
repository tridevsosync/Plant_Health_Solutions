import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { OrderModel } from "@/models/Order";
import { CustomerModel } from "@/models/Customer";
import { orders as seedOrders, type Order } from "@/lib/data";
import { sendOrderConfirmationEmail } from "@/lib/email";

let memoryOrders: Order[] = [...seedOrders];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  try {
    await connectDB();
    const count = await OrderModel.countDocuments();
    if (count === 0 && seedOrders.length > 0) {
      await OrderModel.insertMany(seedOrders).catch(() => {});
    }

    const query: Record<string, unknown> = {};
    if (email) query.email = email.toLowerCase();

    const orders = await OrderModel.find(query).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, orders });
  } catch (error: unknown) {
    console.warn("Orders GET fallback:", (error as Error).message);
    let list = [...memoryOrders];
    if (email) {
      list = list.filter((o) => o.email.toLowerCase() === email.toLowerCase());
    }
    return NextResponse.json({ success: true, orders: list });
  }
}

export async function POST(req: NextRequest) {
  let body: Partial<Order>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON" }, { status: 400 });
  }

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

  const newOrder: Order = {
    id,
    date,
    customer: body.customer,
    email: body.email.trim().toLowerCase(),
    phone: body.phone || "",
    address: body.address || "",
    items: body.items,
    subtotal: Number(body.subtotal || body.total || 0),
    discount: Number(body.discount || 0),
    shipping: Number(body.shipping || 0),
    tax: Number(body.tax || 0),
    total: Number(body.total || 0),
    status: (body.status as "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled") || "Processing",
    payment: body.payment || "Cash on Delivery (COD)",
    paymentId: body.paymentId,
    paymentStatus,
    trackingNumber,
    courier: body.courier || "VRL Logistics / DTDC Express",
    estimatedDelivery: body.estimatedDelivery || "3 - 5 business days",
  };

  try {
    await connectDB();
    const order = await OrderModel.create(newOrder);
    const resultObj = order.toObject ? order.toObject() : newOrder;
    memoryOrders = [resultObj, ...memoryOrders.filter((o) => o.id !== id)];

    // Update customer stats
    const cleanEmail = body.email.trim().toLowerCase();
    const existingCust = await CustomerModel.findOne({ email: cleanEmail });
    if (existingCust) {
      await CustomerModel.updateOne(
        { email: cleanEmail },
        {
          $inc: { orders: 1 },
          $set: { active: true },
        }
      ).catch(() => {});
    }

    // Trigger Order Confirmation Email asynchronously
    sendOrderConfirmationEmail(resultObj).catch((e) =>
      console.error("Async order confirmation email error:", e)
    );

    return NextResponse.json({ success: true, order: resultObj });
  } catch (error: unknown) {
    console.warn("Order POST fallback:", (error as Error).message);
    memoryOrders = [newOrder, ...memoryOrders.filter((o) => o.id !== id)];

    // Trigger Order Confirmation Email in fallback mode as well
    sendOrderConfirmationEmail(newOrder).catch((e) =>
      console.error("Async order confirmation email fallback error:", e)
    );

    return NextResponse.json({ success: true, order: newOrder });
  }
}

export async function DELETE() {
  try {
    await connectDB();
    const result = await OrderModel.deleteMany({});
    memoryOrders = [];
    return NextResponse.json({
      success: true,
      message: "All orders deleted successfully from MongoDB",
      deletedCount: result.deletedCount,
    });
  } catch (error: unknown) {
    console.warn("Orders DELETE fallback:", (error as Error).message);
    memoryOrders = [];
    return NextResponse.json({
      success: true,
      message: "All orders cleared",
      deletedCount: 0,
    });
  }
}
