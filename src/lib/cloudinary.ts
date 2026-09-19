import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary explicitly and support CLOUDINARY_URL fallback
if (process.env.CLOUDINARY_URL) {
  cloudinary.config({
    cloudinary_url: process.env.CLOUDINARY_URL,
  });
} else {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME  ,
    api_key: process.env.CLOUDINARY_API_KEY  ,
    api_secret: process.env.CLOUDINARY_API_SECRET ,
    secure: true,
  });
}

export async function uploadToCloudinary(
  fileBufferOrBase64: string | Buffer,
  folder = "plant_health_solutions"
): Promise<{ url: string; secure_url: string; public_id: string }> {
  return new Promise((resolve, reject) => {
    if (typeof fileBufferOrBase64 === "string") {
      cloudinary.uploader.upload(
        fileBufferOrBase64,
        {
          folder,
          resource_type: "auto",
        },
        (error, result) => {
          if (error || !result) {
            return reject(error || new Error("Cloudinary upload failed"));
          }
          resolve({
            url: result.url,
            secure_url: result.secure_url,
            public_id: result.public_id,
          });
        }
      );
    } else {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "auto",
        },
        (error, result) => {
          if (error || !result) {
            return reject(error || new Error("Cloudinary upload stream failed"));
          }
          resolve({
            url: result.url,
            secure_url: result.secure_url,
            public_id: result.public_id,
          });
        }
      );
      uploadStream.end(fileBufferOrBase64);
    }
  });
}

export { cloudinary };
