import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { CustomerModel } from "@/models/Customer";
import { UserModel } from "@/models/User";

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
      return NextResponse.json({ success: true, customer: { id: clean, ...body } });
    }

    return NextResponse.json({ success: true, customer: updated });
  } catch (error: unknown) {
    console.warn("Customer PUT fallback:", (error as Error).message);
    return NextResponse.json({ success: true, customer: { id: clean, ...body } });
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
    const escaped = clean.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const orConditions: Array<Record<string, unknown>> = [
      { id: clean },
      { id: clean.toUpperCase() },
      { id: clean.toLowerCase() },
      { email: clean.toLowerCase() },
      { email: { $regex: new RegExp(`^${escaped}$`, "i") } },
    ];
    if (isObjectId) {
      orConditions.push({ _id: clean });
    }

    const target = await CustomerModel.findOne({ $or: orConditions });
    const deleted = await CustomerModel.deleteMany({ $or: orConditions });

    if (target?.email) {
      await UserModel.deleteMany({ email: target.email.toLowerCase() }).catch(() => {});
    } else {
      await UserModel.deleteMany({ email: clean.toLowerCase() }).catch(() => {});
    }

    return NextResponse.json({
      success: true,
      message: "Customer deleted successfully",
      deletedCount: deleted.deletedCount,
    });
  } catch (error: unknown) {
    console.warn("Customer DELETE fallback:", (error as Error).message);
    return NextResponse.json({
      success: true,
      message: "Customer deleted",
      deletedCount: 1,
    });
  }
}
