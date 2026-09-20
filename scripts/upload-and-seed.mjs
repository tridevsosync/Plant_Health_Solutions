import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// 1. Manually parse .env file
function loadEnv() {
  const envPath = path.join(rootDir, '.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        let val = trimmed.slice(idx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        process.env[key] = val;
      }
    }
  }
}

loadEnv();

const MONGODB_URI = process.env.MONGODB_URI;
const CLOUDINARY_URL = process.env.CLOUDINARY_URL;

console.log("====================================================");
console.log("🌿 Plant Health Solutions — Cloudinary & MongoDB Sync");
console.log("====================================================");
console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("API Key:", process.env.CLOUDINARY_API_KEY ? 'Present (***' + process.env.CLOUDINARY_API_KEY.slice(-4) + ')' : 'Missing');
console.log("MongoDB:", MONGODB_URI ? 'Atlas URI Present' : 'Missing');

// 2. Configure Cloudinary
if (CLOUDINARY_URL) {
  cloudinary.config({ cloudinary_url: CLOUDINARY_URL });
} else {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

// 3. Mongoose Schemas
const ProductSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, index: true },
    price: { type: Number, required: true, default: 0 },
    oldPrice: { type: Number, default: 0 },
    rating: { type: Number, default: 4.8 },
    reviews: { type: Number, default: 0 },
    stock: { type: Number, default: 100 },
    unit: { type: String, default: "1 L" },
    image: { type: String, default: "" },
    description: { type: String, default: "" },
    benefits: { type: [String], default: [] },
    usage: { type: String, default: "" },
    ingredients: { type: String, default: "" },
    badges: { type: [String], default: [] },
  },
  { timestamps: true }
);

const CategorySchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, default: "" },
    icon: { type: String, default: "Sprout" },
    image: { type: String, default: "" },
  },
  { timestamps: true }
);

const ProductModel = mongoose.models.Product || mongoose.model("Product", ProductSchema);
const CategoryModel = mongoose.models.Category || mongoose.model("Category", CategorySchema);

async function uploadFileToCloudinary(localPath, folder = "plant_health_solutions/products") {
  if (!fs.existsSync(localPath)) {
    console.warn(`[SKIP] Local file not found: ${localPath}`);
    return null;
  }
  const filename = path.basename(localPath, path.extname(localPath));
  try {
    const result = await cloudinary.uploader.upload(localPath, {
      folder,
      public_id: filename,
      overwrite: true,
      resource_type: "image",
    });
    console.log(`[Cloudinary ✓] ${filename} -> ${result.secure_url}`);
    return result.secure_url;
  } catch (error) {
    console.error(`[Cloudinary ✗] Error uploading ${filename}:`, error.message);
    return null;
  }
}

// Function to extract products array from data.ts
function extractProductsAndCategoriesFromDataTs() {
  const dataTsPath = path.join(rootDir, 'src', 'lib', 'data.ts');
  const code = fs.readFileSync(dataTsPath, 'utf8');

  // Parse products
  const productsMatch = code.match(/export const products: Product\[\] = (\[[\s\S]*?\n\];)/);
  if (!productsMatch) {
    throw new Error("Could not find products array in data.ts");
  }

  // Parse categories
  const categoriesMatch = code.match(/export const categories: Category\[\] = (\[[\s\S]*?\n\];)/);
  if (!categoriesMatch) {
    throw new Error("Could not find categories array in data.ts");
  }

  // Evaluate safely in Function context
  const getProducts = new Function(`
    const categories = ${categoriesMatch[1]}
    const products = ${productsMatch[1]}
    return { categories, products };
  `);

  return getProducts();
}

async function main() {
  const { categories, products } = extractProductsAndCategoriesFromDataTs();
  console.log(`\nExtracted ${products.length} products and ${categories.length} categories from src/lib/data.ts`);

  // 1. Upload Product Images to Cloudinary
  console.log("\n--- 1. Uploading Product Images to Cloudinary ---");
  const productsDir = path.join(rootDir, 'public', 'products');
  const cloudinaryUrls = {};

  for (const product of products) {
    const localRelative = product.image; // e.g. /products/sonar.png
    const localFilename = path.basename(localRelative);
    const localFilePath = path.join(productsDir, localFilename);

    if (fs.existsSync(localFilePath)) {
      const secureUrl = await uploadFileToCloudinary(localFilePath, "plant_health_solutions/products");
      if (secureUrl) {
        cloudinaryUrls[product.id] = secureUrl;
        product.image = secureUrl; // Update in-memory product image with Cloudinary URL
      }
    } else {
      console.warn(`[WARN] Image not found for product ${product.id}: ${localFilePath}`);
    }
  }

  // 2. Upload Category Images to Cloudinary if local
  console.log("\n--- 2. Uploading Category Images to Cloudinary ---");
  for (const cat of categories) {
    if (cat.image.startsWith('/products/')) {
      const localFilename = path.basename(cat.image);
      const localFilePath = path.join(productsDir, localFilename);
      if (fs.existsSync(localFilePath)) {
        const secureUrl = await uploadFileToCloudinary(localFilePath, "plant_health_solutions/categories");
        if (secureUrl) {
          cat.image = secureUrl;
        }
      }
    }
  }

  // 3. Connect to MongoDB Atlas
  console.log("\n--- 3. Connecting to MongoDB Atlas ---");
  await mongoose.connect(MONGODB_URI, {
    dbName: "plant_health_solutions",
    serverSelectionTimeoutMS: 20000,
  });
  console.log("✓ Connected to MongoDB Atlas!");

  // 4. Upsert all Categories to MongoDB Atlas
  console.log("\n--- 4. Syncing Categories to MongoDB Atlas ---");
  for (const cat of categories) {
    await CategoryModel.findOneAndUpdate(
      { id: cat.id },
      { $set: cat },
      { upsert: true, new: true }
    );
    console.log(`[MongoDB ✓] Category: ${cat.name} (${cat.slug})`);
  }

  // 5. Upsert all Products to MongoDB Atlas
  console.log("\n--- 5. Syncing Products to MongoDB Atlas ---");
  for (const prod of products) {
    await ProductModel.findOneAndUpdate(
      { id: prod.id },
      { $set: prod },
      { upsert: true, new: true }
    );
    console.log(`[MongoDB ✓] Product: ${prod.name} | Category: ${prod.category} | Price: ₹${prod.price} | Image: ${prod.image}`);
  }

  const totalInDb = await ProductModel.countDocuments();
  const totalCatsInDb = await CategoryModel.countDocuments();
  console.log(`\n====================================================`);
  console.log(`🎉 SUCCESS: ${totalInDb} Products and ${totalCatsInDb} Categories active in MongoDB Atlas!`);
  console.log(`====================================================`);

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("Fatal Error:", err);
  process.exit(1);
});
