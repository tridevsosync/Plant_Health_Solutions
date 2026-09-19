import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { UserModel } from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await UserModel.findOne({ email: cleanEmail });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "No account found with this email address" },
        { status: 401 }
      );
    }

    let isValid = false;
    if (user.password) {
      if (user.password.startsWith("$2a$") || user.password.startsWith("$2b$")) {
        isValid = await bcrypt.compare(password, user.password);
      } else {
        isValid = user.password === password;
      }
    }

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Invalid password. Please try again." },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        role: user.role,
        addresses: user.addresses || [],
      },
    });
  } catch (error: unknown) {
    console.error("Login API error:", error);
    const errMessage = error instanceof Error ? error.message : "Login failed";
    return NextResponse.json({ success: false, error: errMessage }, { status: 500 });
  }
}
