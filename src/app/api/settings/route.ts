import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { SettingModel } from "@/models/Setting";
import { COMPANY } from "@/lib/data";

export async function GET() {
  try {
    await connectDB();
    let settings = await SettingModel.findOne({ key: "company_settings" });

    if (!settings) {
      settings = await SettingModel.create({
        key: "company_settings",
        name: COMPANY.name,
        owner: COMPANY.owner,
        phone: COMPANY.phone,
        email1: COMPANY.email1,
        email2: COMPANY.email2,
        address: COMPANY.address,
        description: COMPANY.description,
      });
    }

    return NextResponse.json({ success: true, settings });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to fetch settings";
    return NextResponse.json({ success: false, error: errMessage }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const settings = await SettingModel.findOneAndUpdate(
      { key: "company_settings" },
      { $set: body },
      { new: true, upsert: true }
    );

    return NextResponse.json({ success: true, settings });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to update settings";
    return NextResponse.json({ success: false, error: errMessage }, { status: 500 });
  }
}
