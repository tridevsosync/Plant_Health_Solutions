import { NextResponse } from "next/server";
import { seedDatabase } from "@/lib/seedDb";

export async function GET() {
  try {
    const result = await seedDatabase(false);
    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("Seed API error:", error);
    const errMessage = error instanceof Error ? error.message : "Failed to seed database";
    return NextResponse.json({ success: false, error: errMessage }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const force = Boolean(body.force);
    const result = await seedDatabase(force);
    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("Seed POST API error:", error);
    const errMessage = error instanceof Error ? error.message : "Failed to seed database";
    return NextResponse.json({ success: false, error: errMessage }, { status: 500 });
  }
}
