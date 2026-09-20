import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { CustomerModel } from "@/models/Customer";
import { UserModel } from "@/models/User";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const clean = decodeURIComponent(id).trim();
    const body = await req.json();

    const isObjectId = mongoose.Types.ObjectId.isValid(clean) && /^[0-9a-fA-F]{24}$/.test(clean);
    const orConditions: Array<Record<string, unknown>> = [
      { id: clean },
      { email: clean.toLowerCase() },
    ];
    if (isObjectId) {
      orConditions.push({ _id: clean });
    }

    const updated = await CustomerModel.findOneAndUpdate(
      { $or: orConditions },
      { $set: body },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ success: false, error: "Customer not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, customer: updated });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to update customer";
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
    const escaped = clean.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const orConditions: Array<Record<string, unknown>> = [
      { id: clean },
      { id: clean.toUpperCase() },
      { id: clean.toLowerCase() },
      { email: clean.toLowerCase() },
      { email: { $regex: new RegExp(`^${escaped}$`, "i") } },
    ];
    if (isObjectId) {
      orConditions.push({ _id: new mongoose.Types.ObjectId(clean) });
    }

    const deleted = await CustomerModel.deleteMany({ $or: orConditions });

    if (clean.includes("@")) {
      await UserModel.deleteMany({ email: clean.toLowerCase(), role: { $ne: "admin" } });
    }

    return NextResponse.json({
      success: true,
      message: "Customer deleted successfully",
      deletedCount: deleted.deletedCount,
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to delete customer";
    return NextResponse.json({ success: false, error: errMessage }, { status: 500 });
  }
}
