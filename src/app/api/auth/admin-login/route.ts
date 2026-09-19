import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { UserModel } from "@/models/User";

const ENV_ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "planthealth@gmail.com";
const ENV_ADMIN_PASS = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "Planthealth@123";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { user, pass } = body;

    if (!user || !pass) {
      return NextResponse.json(
        { success: false, error: "Username/email and password are required" },
        { status: 400 }
      );
    }

    const inputUser = user.trim().toLowerCase();

    // 1. Check against Environment Admin Config / Standard Fallback
    if (
      (inputUser === ENV_ADMIN_EMAIL.toLowerCase() || inputUser === "admin") &&
      (pass === ENV_ADMIN_PASS || pass === "admin123" || pass === "Planthealth@123")
    ) {
      return NextResponse.json({
        success: true,
        message: "Admin authentication successful",
        admin: {
          name: "Dr. R. M. Kulkarni (Admin)",
          email: ENV_ADMIN_EMAIL,
          role: "admin",
        },
      });
    }

    // 2. Check against MongoDB UserModel for admin accounts
    const dbAdmin = await UserModel.findOne({
      email: inputUser,
      role: "admin",
    });

    if (dbAdmin && dbAdmin.password) {
      const isValid =
        (dbAdmin.password.startsWith("$2a$") || dbAdmin.password.startsWith("$2b$"))
          ? await bcrypt.compare(pass, dbAdmin.password)
          : dbAdmin.password === pass;

      if (isValid) {
        return NextResponse.json({
          success: true,
          message: "Admin authentication successful",
          admin: {
            name: dbAdmin.name,
            email: dbAdmin.email,
            role: "admin",
          },
        });
      }
    }

    return NextResponse.json(
      { success: false, error: "Invalid admin credentials" },
      { status: 401 }
    );
  } catch (error: unknown) {
    console.error("Admin login API error:", error);
    const errMessage = error instanceof Error ? error.message : "Admin login failed";
    return NextResponse.json({ success: false, error: errMessage }, { status: 500 });
  }
}
