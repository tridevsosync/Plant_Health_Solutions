import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { SettingModel } from "@/models/Setting";
import { COMPANY } from "@/lib/data";

const defaultSettings = {
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
};

let memorySettings = { ...defaultSettings };

export async function GET() {
  try {
    await connectDB();
    let settings = await SettingModel.findOne({ key: "company_settings" }).lean();

    if (!settings) {
      settings = await SettingModel.create(defaultSettings);
    }

    return NextResponse.json({ success: true, settings });
  } catch (error: unknown) {
    console.warn("Settings GET fallback:", (error as Error).message);
    return NextResponse.json({ success: true, settings: memorySettings });
  }
}

export async function PUT(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON" }, { status: 400 });
  }

  // Remove immutable fields if present
  const updateData = { ...body };
  delete updateData._id;
  delete updateData.key;
  delete updateData.createdAt;
  delete updateData.updatedAt;

  try {
    await connectDB();
    const settings = await SettingModel.findOneAndUpdate(
      { key: "company_settings" },
      { $set: updateData },
      { new: true, upsert: true, runValidators: true }
    ).lean();

    memorySettings = { ...memorySettings, ...updateData };
    return NextResponse.json({ success: true, settings });
  } catch (error: unknown) {
    console.warn("Settings PUT fallback:", (error as Error).message);
    memorySettings = { ...memorySettings, ...updateData };
    return NextResponse.json({ success: true, settings: memorySettings });
  }
}
