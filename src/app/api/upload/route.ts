import { NextRequest, NextResponse } from "next/server";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;

      if (!file) {
        return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const folder = (formData.get("folder") as string) || "plant_health_solutions";

      const uploaded = await uploadToCloudinary(buffer, folder);
      return NextResponse.json({
        success: true,
        url: uploaded.secure_url || uploaded.url,
        public_id: uploaded.public_id,
      });
    } else {
      // JSON body with base64 data URL
      const body = await req.json();
      const { image, folder = "plant_health_solutions" } = body;

      if (!image) {
        return NextResponse.json({ success: false, error: "No image data provided" }, { status: 400 });
      }

      const uploaded = await uploadToCloudinary(image, folder);
      return NextResponse.json({
        success: true,
        url: uploaded.secure_url || uploaded.url,
        public_id: uploaded.public_id,
      });
    }
  } catch (error: unknown) {
    console.error("Cloudinary upload route error:", error);
    const errMessage = error instanceof Error ? error.message : "Image upload failed";
    return NextResponse.json({ success: false, error: errMessage }, { status: 500 });
  }
}
