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
  workingHours: "Mon – Sat: 9:00 AM – 6:30 PM",
  contactHeroBadge: "Direct Farmer & Dealer Support",
  contactHeroTitle: "Get in Touch with Our Agronomists",
  contactHeroSubtitle:
    "Whether you need crop advice, soil test recommendations, dealership inquiries, or bulk orders, our research and extension team is here to help.",
  contactHeroImage: "https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=1920&q=80",
  facilityName: "Horticulture Research & Extension Center",
  facilityDescription:
    "Our 40-acre center on National Highway 52 houses state-of-the-art microbiology testing, blending plants, and demonstration plots.",
  facilityLocationTitle: "Tidagundi, Vijayapura (NH-52)",
  facilityImage: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80",
  googleMapsUrl: "https://maps.google.com/?q=Plant+Health+Solutions+Tidagundi+Vijayapura",
  enquiryFormTitle: "Send an Enquiry",
  enquiryFormSubtitle:
    "Fill out the form below and our agronomy extension team will review your query and get back to you promptly.",
  dealerBadge: "Distribution Network",
  dealerTitle: "Become an Authorized Dealer",
  dealerDesc:
    "Join our 300+ strong dealer network across Karnataka, Maharashtra, AP, Telangana, and MP. Benefit from high-demand research-backed formulations and marketing support.",
  dealerButtonText: "Inquire for Dealership →",
  dealerWhatsappText: "Hello, I am interested in dealership registration with Plant Health Solutions.",
  soilTestingBadge: "Soil Health",
  soilTestingTitle: "Free Soil & Water Testing",
  soilTestingDesc:
    "Bring or courier your soil and water sample to our Tidagundi lab. Our chief agronomists will analyze pH, organic carbon, and micronutrient status free of cost.",
  soilTestingButtonText: "Explore Crop Solutions →",
  soilTestingLinkUrl: "/farmer-solutions",
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
