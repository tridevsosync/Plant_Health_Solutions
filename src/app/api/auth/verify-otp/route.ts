import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail, saveNewUser } from "@/lib/authStore";
import { verifyOtpCode } from "@/lib/otpStore";
import { sendWelcomeEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, otp, type } = body;

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, error: "Email and 6-digit verification code are required" },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = otp.trim();

    const verifyResult = await verifyOtpCode({
      email: cleanEmail,
      otp: cleanOtp,
      type: type === "registration" ? "registration" : "login",
    });

    if (!verifyResult.valid) {
      return NextResponse.json(
        { success: false, error: verifyResult.error || "Invalid verification code" },
        { status: 400 }
      );
    }

    // 1. REGISTRATION COMPLETE
    if (type === "registration") {
      const payload = verifyResult.payload as
        | { name: string; email: string; phone?: string; passwordHash: string }
        | undefined;
      if (!payload || !payload.email || !payload.passwordHash) {
        return NextResponse.json(
          { success: false, error: "Registration session expired. Please register again." },
          { status: 400 }
        );
      }

      // Save user to database
      const newUser = await saveNewUser({
        name: payload.name,
        email: payload.email,
        phone: payload.phone || "",
        passwordHash: payload.passwordHash,
        role: "user",
      });

      // Send Welcome Email asynchronously
      sendWelcomeEmail({
        email: newUser.email,
        name: newUser.name,
      }).catch((e) => console.error("Async welcome email error:", e));

      return NextResponse.json({
        success: true,
        message: "Account verified & created successfully!",
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone || "",
          role: newUser.role,
          addresses: newUser.addresses || [],
        },
      });
    }

    // 2. LOGIN COMPLETE
    const user = await findUserByEmail(cleanEmail);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User account not found. Please register." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "2-Step Verification successful! Welcome back.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        role: user.role,
        addresses: user.addresses || [],
      },
    });
  } catch (err: unknown) {
    console.error("verify-otp error:", err);
    return NextResponse.json(
      { success: false, error: (err as Error).message || "Verification failed" },
      { status: 500 }
    );
  }
}
