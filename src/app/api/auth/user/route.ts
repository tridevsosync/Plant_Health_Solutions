import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail, updateUserByEmail } from "@/lib/authStore";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ success: false, error: "Email query param required" }, { status: 400 });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    // Return sanitized user
    const { password, ...safeUser } = user;
    return NextResponse.json({ success: true, user: safeUser });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to fetch user";
    return NextResponse.json({ success: false, error: errMessage }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, phone, addresses } = body;

    if (!email) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 });
    }

    const updated = await updateUserByEmail(email, {
      name,
      phone,
      addresses,
    });

    if (!updated) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    const { password, ...safeUser } = updated;
    return NextResponse.json({ success: true, user: safeUser });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to update profile";
    return NextResponse.json({ success: false, error: errMessage }, { status: 500 });
  }
}

