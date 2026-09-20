import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { findUserByEmail, saveNewUser } from "@/lib/authStore";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, password, confirmPassword } = body;

    // Validation
    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, error: "Full name is required" }, { status: 400 });
    }
    if (!email || !email.trim()) {
      return NextResponse.json({ success: false, error: "Valid email is required" }, { status: 400 });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json({ success: false, error: "Please enter a valid email address" }, { status: 400 });
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

    const existingUser = await findUserByEmail(cleanEmail);
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "An account with this email already exists. Please sign in." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await saveNewUser({
      name: name.trim(),
      email: cleanEmail,
      phone: phone ? phone.trim() : "",
      passwordHash: hashedPassword,
      role: "user",
    });

    return NextResponse.json({
      success: true,
      message: "Registration successful",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone || "",
        role: newUser.role,
        addresses: newUser.addresses || [],
      },
    });
  } catch (error: unknown) {
    console.error("Register API error:", error);
    const errMessage = error instanceof Error ? error.message : "Registration failed";
    return NextResponse.json({ success: false, error: errMessage }, { status: 500 });
  }
}

