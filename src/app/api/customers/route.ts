import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { CustomerModel } from "@/models/Customer";
import { UserModel } from "@/models/User";
import { OrderModel } from "@/models/Order";
import { type Customer } from "@/lib/data";

let memoryCustomers: Customer[] = [];

export async function GET() {
  try {
    await connectDB();

    // 1. Fetch all non-admin registered users
    const users = await UserModel.find({ role: { $ne: "admin" } }).lean();

    // 2. Fetch all orders to compute real-time order counts per customer email
    const orders = await OrderModel.find({}, "email customer phone address city total").lean();

    // 3. Auto-sync registered users into CustomerModel so every registered person is a customer
    for (const u of users) {
      if (!u.email) continue;
      const cleanEmail = u.email.trim().toLowerCase();
      const userOrdersCount = orders.filter(
        (o) => o.email && o.email.trim().toLowerCase() === cleanEmail
      ).length;

      const userCity =
        u.addresses && u.addresses.length > 0 && u.addresses[0].city
          ? `${u.addresses[0].city}${u.addresses[0].state ? `, ${u.addresses[0].state}` : ""}`
          : "Karnataka";

      await CustomerModel.findOneAndUpdate(
        { email: cleanEmail },
        {
          $set: {
            name: u.name || "Customer",
            phone: u.phone || "",
            orders: userOrdersCount,
          },
          $setOnInsert: {
            id: u._id ? u._id.toString() : `c_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            email: cleanEmail,
            city: userCity,
            active: true,
          },
        },
        { upsert: true, new: true }
      ).catch((err) => {
        console.warn(`Customer sync warning for ${cleanEmail}:`, err.message);
      });
    }

    // 4. Also auto-sync any unique email from orders into CustomerModel if not present
    for (const o of orders) {
      if (!o.email) continue;
      const cleanEmail = o.email.trim().toLowerCase();
      const orderCount = orders.filter(
        (ord) => ord.email && ord.email.trim().toLowerCase() === cleanEmail
      ).length;

      await CustomerModel.findOneAndUpdate(
        { email: cleanEmail },
        {
          $setOnInsert: {
            id: `c_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            name: o.customer || "Customer",
            email: cleanEmail,
            phone: o.phone || "",
            city: o.city || "Karnataka",
            active: true,
          },
          $set: {
            orders: orderCount,
          },
        },
        { upsert: true, new: true }
      ).catch(() => {});
    }

    // 5. Fetch all customers sorted by newest first
    const customers = await CustomerModel.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, customers });
  } catch (error: unknown) {
    console.warn("Customers GET fallback:", (error as Error).message);
    return NextResponse.json({ success: true, customers: memoryCustomers });
  }
}

export async function POST(req: NextRequest) {
  let body: Partial<Customer>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.name || !body.email) {
    return NextResponse.json(
      { success: false, error: "Name and email are required" },
      { status: 400 }
    );
  }

  const id = body.id || `c_${Date.now()}`;
  const cleanEmail = body.email.toLowerCase().trim();

  const newCustomer: Customer = {
    id,
    name: body.name.trim(),
    email: cleanEmail,
    phone: body.phone?.trim() || "",
    city: body.city?.trim() || "Vijayapura, Karnataka",
    orders: Number(body.orders || 0),
    active: body.active !== undefined ? body.active : true,
  };

  try {
    await connectDB();
    const customer = await CustomerModel.create(newCustomer);
    const resultObj = customer.toObject ? customer.toObject() : newCustomer;
    memoryCustomers = [resultObj, ...memoryCustomers.filter((c) => c.email !== cleanEmail)];
    return NextResponse.json({ success: true, customer: resultObj });
  } catch (error: unknown) {
    console.warn("Customer POST fallback:", (error as Error).message);
    memoryCustomers = [newCustomer, ...memoryCustomers.filter((c) => c.email !== cleanEmail)];
    return NextResponse.json({ success: true, customer: newCustomer });
  }
}

export async function DELETE() {
  try {
    await connectDB();
    const result = await CustomerModel.deleteMany({});
    await UserModel.deleteMany({ role: { $ne: "admin" } }).catch(() => {});
    memoryCustomers = [];

    return NextResponse.json({
      success: true,
      message: "All customers deleted successfully from MongoDB",
      deletedCount: result.deletedCount,
    });
  } catch (error: unknown) {
    console.warn("Customers DELETE fallback:", (error as Error).message);
    memoryCustomers = [];
    return NextResponse.json({
      success: true,
      message: "All customers cleared",
      deletedCount: 0,
    });
  }
}
