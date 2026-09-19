import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { UserModel } from "@/models/User";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ success: false, error: "Email query param required" }, { status: 400 });
    }

    const user = await UserModel.findOne({ email: email.toLowerCase() }).select("-password");
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to fetch user";
    return NextResponse.json({ success: false, error: errMessage }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { email, name, phone, addresses } = body;

    if (!email) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (addresses !== undefined) updateData.addresses = addresses;

    const updated = await UserModel.findOneAndUpdate(
      { email: email.toLowerCase() },
      { $set: updateData },
      { new: true }
    ).select("-password");

    if (!updated) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user: updated });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to update profile";
    return NextResponse.json({ success: false, error: errMessage }, { status: 500 });
  }
}
