import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { SettingModel } from "@/models/Setting";
import { COMPANY } from "@/lib/data";

export async function GET() {
  try {
    await connectDB();
    let settings = await SettingModel.findOne({ key: "company_settings" }).lean();

    if (!settings) {
      settings = await SettingModel.create({
        key: "company_settings",
        name: COMPANY.name,
        owner: COMPANY.owner,
        phone: COMPANY.phone,
        whatsapp: COMPANY.phone,
        email1: COMPANY.email1,
        email2: COMPANY.email2,
        address: COMPANY.address,
        description: COMPANY.description,
        gst: "29AAGCP1234F1Z5",
        announcement: "Free soil testing on orders above ₹5,000",
        freeShippingThreshold: 2000,
        shippingFee: 90,
        facebook: "https://facebook.com",
        instagram: "https://instagram.com",
        youtube: "https://youtube.com",
        twitter: "https://twitter.com",
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

    // Remove immutable fields if present
    const updateData = { ...body };
    delete updateData._id;
    delete updateData.key;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    const settings = await SettingModel.findOneAndUpdate(
      { key: "company_settings" },
      { $set: updateData },
      { new: true, upsert: true, runValidators: true }
    ).lean();

    return NextResponse.json({ success: true, settings });
  } catch (error: unknown) {
    console.error("PUT /api/settings error:", error);
    const errMessage = error instanceof Error ? error.message : "Failed to update settings";
    return NextResponse.json({ success: false, error: errMessage }, { status: 500 });
  }
}
