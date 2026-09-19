import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { UserModel } from "@/models/User";
import { CustomerModel } from "@/models/Customer";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { name, email, phone, password, confirmPassword } = body;

    // Validation
    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, error: "Full name is required" }, { status: 400 });
    }
    if (!email || !email.trim()) {
      return NextResponse.json({ success: false, error: "Valid email is required" }, { status: 400 });
    }
    if (!password) {
      return NextResponse.json({ success: false, error: "Password is required" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }
    if (confirmPassword !== undefined && password !== confirmPassword) {
      return NextResponse.json(
        { success: false, error: "Passwords do not match. Please re-enter." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    const existingUser = await UserModel.findOne({ email: cleanEmail });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "An account with this email already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await UserModel.create({
      name: name.trim(),
      email: cleanEmail,
      phone: phone ? phone.trim() : "",
      password: hashedPassword,
      role: "user",
      addresses: [],
    });

    // Also register in Customer model for Admin management
    const existingCustomer = await CustomerModel.findOne({ email: cleanEmail });
    if (!existingCustomer) {
      await CustomerModel.create({
        id: `c_${Date.now()}`,
        name: name.trim(),
        email: cleanEmail,
        phone: phone ? phone.trim() : "",
        city: "Karnataka",
        orders: 0,
        active: true,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Registration successful",
      user: {
        id: newUser._id.toString(),
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        addresses: newUser.addresses,
      },
    });
  } catch (error: unknown) {
    console.error("Register API error:", error);
    const errMessage = error instanceof Error ? error.message : "Registration failed";
    return NextResponse.json({ success: false, error: errMessage }, { status: 500 });
  }
}
