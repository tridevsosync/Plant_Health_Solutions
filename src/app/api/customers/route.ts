import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { CustomerModel } from "@/models/Customer";
import { seedDatabase } from "@/lib/seedDb";

export async function GET() {
  try {
    await connectDB();
    const count = await CustomerModel.countDocuments();
    if (count === 0) {
      await seedDatabase(false);
    }
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
    const customer = await CustomerModel.create({
      ...body,
      id,
      email: body.email.toLowerCase().trim(),
    });

    return NextResponse.json({ success: true, customer });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to create customer";
    return NextResponse.json({ success: false, error: errMessage }, { status: 500 });
  }
}
