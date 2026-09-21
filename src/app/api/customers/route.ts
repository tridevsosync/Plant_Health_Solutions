import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { CustomerModel } from "@/models/Customer";
import { UserModel } from "@/models/User";
import { type Customer } from "@/lib/data";

let memoryCustomers: Customer[] = [];

export async function GET() {
  try {
    await connectDB();
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
