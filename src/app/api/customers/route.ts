import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { CustomerModel } from "@/models/Customer";
import { UserModel } from "@/models/User";

export async function GET() {
  try {
    await connectDB();
    const customers = await CustomerModel.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, customers });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to fetch customers";
    return NextResponse.json({ success: false, error: errMessage }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    if (!body.name || !body.email) {
      return NextResponse.json(
        { success: false, error: "Name and email are required" },
        { status: 400 }
      );
    }

    const id = body.id || `c_${Date.now()}`;
    const cleanEmail = body.email.toLowerCase().trim();

    const customer = await CustomerModel.create({
      ...body,
      id,
      email: cleanEmail,
    });

    return NextResponse.json({ success: true, customer });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to create customer";
    return NextResponse.json({ success: false, error: errMessage }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await connectDB();
    const result = await CustomerModel.deleteMany({});
    await UserModel.deleteMany({ role: { $ne: "admin" } });

    return NextResponse.json({
      success: true,
      message: "All customers deleted successfully from MongoDB",
      deletedCount: result.deletedCount,
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to delete all customers";
    return NextResponse.json({ success: false, error: errMessage }, { status: 500 });
  }
}
