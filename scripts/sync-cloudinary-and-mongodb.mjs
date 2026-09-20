import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// 1. Parse .env
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

console.log("==================================================================");
console.log("🌿 Plant Health Solutions — Cloudinary & MongoDB Complete Sync");
console.log("==================================================================");

// Configure Cloudinary explicitly
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "tridevsosync",
  api_key: process.env.CLOUDINARY_API_KEY || "646377147624538",
  api_secret: process.env.CLOUDINARY_API_SECRET || "lJ0e_lBISZalqjpFhJwvfSGp3gM",
  secure: true,
});

console.log("Cloudinary configured:", {
  cloud_name: cloudinary.config().cloud_name,
  api_key: cloudinary.config().api_key ? '***' + String(cloudinary.config().api_key).slice(-4) : 'missing'
});

// Mongoose Model
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

async function uploadToCloudinary(filePath, folder = "plant_health_solutions/products") {
  const filename = path.basename(filePath, path.extname(filePath));
  try {
    const res = await cloudinary.uploader.upload(filePath, {
      folder,
      public_id: filename,
      overwrite: true,
      resource_type: "image",
    });
    console.log(`[Cloudinary ✓] ${filename} -> ${res.secure_url}`);
    return res.secure_url;
  } catch (err) {
    console.error(`[Cloudinary ✗] Upload error for ${filename}:`, err.message);
    return null;
  }
}

function parseDataTs() {
  const dataTsPath = path.join(rootDir, 'src', 'lib', 'data.ts');
  const code = fs.readFileSync(dataTsPath, 'utf8');

  const productsMatch = code.match(/export const products: Product\[\] = (\[[\s\S]*?\n\];)/);
  const categoriesMatch = code.match(/export const categories: Category\[\] = (\[[\s\S]*?\n\];)/);

  if (!productsMatch || !categoriesMatch) {
    throw new Error("Failed to extract data arrays from data.ts");
  }

  const evalFn = new Function(`
    const categories = ${categoriesMatch[1]}
    const products = ${productsMatch[1]}
    return { categories, products };
  `);

  return { ...evalFn(), rawCode: code };
}

async function startSync() {
  const { categories, products, rawCode } = parseDataTs();
  console.log(`Loaded ${products.length} products and ${categories.length} categories.`);

  // 1. Upload all images in public/products to Cloudinary
  console.log("\n--- 1. Uploading images to Cloudinary ---");
  const productsDir = path.join(rootDir, 'public', 'products');
  const urlMap = {};

  if (fs.existsSync(productsDir)) {
    const files = fs.readdirSync(productsDir);
    for (const file of files) {
      if (/\.(png|jpe?g|webp|svg)$/i.test(file)) {
        const localPath = path.join(productsDir, file);
        const cdnUrl = await uploadToCloudinary(localPath, "plant_health_solutions/products");
        if (cdnUrl) {
          urlMap[file] = cdnUrl;
          urlMap[`/products/${file}`] = cdnUrl;
        }
      }
    }
  }

  // Map products to their Cloudinary URL
  for (const p of products) {
    const baseName = path.basename(p.image);
    if (urlMap[baseName]) {
      p.image = urlMap[baseName];
      urlMap[p.id] = urlMap[baseName];
    } else if (urlMap[p.image]) {
      p.image = urlMap[p.image];
    }
  }

  // Map categories to Cloudinary URLs
  for (const c of categories) {
    const baseName = path.basename(c.image);
    if (urlMap[baseName]) {
      c.image = urlMap[baseName];
      urlMap[c.id] = urlMap[baseName];
    } else if (urlMap[c.image]) {
      c.image = urlMap[c.image];
    }
  }

  // 3. Connect to MongoDB Atlas
  console.log("\n--- 2. Connecting to MongoDB Atlas ---");
  await mongoose.connect(MONGODB_URI, {
    dbName: "plant_health_solutions",
    serverSelectionTimeoutMS: 20000,
  });
  console.log("✓ Successfully connected to MongoDB Atlas!");

  // 4. Upsert all Categories into MongoDB (match by slug or id)
  console.log("\n--- 3. Syncing Categories into MongoDB Atlas ---");
  for (const c of categories) {
    const updated = await CategoryModel.findOneAndUpdate(
      { $or: [{ id: c.id }, { slug: c.slug }] },
      { $set: c },
      { upsert: true, returnDocument: 'after' }
    );
    console.log(`[MongoDB ✓] Category: ${updated.name} | Slug: ${updated.slug} | Image: ${updated.image}`);
  }

  // 5. Upsert all Products into MongoDB with Cloudinary URLs (match by id or name)
  console.log("\n--- 4. Syncing Products into MongoDB Atlas ---");
  for (const p of products) {
    const updated = await ProductModel.findOneAndUpdate(
      { $or: [{ id: p.id }, { name: p.name }] },
      { $set: p },
      { upsert: true, returnDocument: 'after' }
    );
    console.log(`[MongoDB ✓] Product: ${updated.name} (₹${updated.price}) -> ${updated.image}`);
  }

  // 6. Update src/lib/data.ts with Cloudinary secure URLs
  console.log("\n--- 5. Updating src/lib/data.ts with Cloudinary URLs ---");
  let updatedCode = rawCode;
  for (const [key, cdnUrl] of Object.entries(urlMap)) {
    if (key.startsWith('/products/')) {
      updatedCode = updatedCode.replaceAll(`"${key}"`, `"${cdnUrl}"`);
    }
  }
  fs.writeFileSync(path.join(rootDir, 'src', 'lib', 'data.ts'), updatedCode, 'utf8');
  console.log("✓ src/lib/data.ts updated with Cloudinary CDN URLs!");

  const finalProdCount = await ProductModel.countDocuments();
  const finalCatCount = await CategoryModel.countDocuments();

  console.log("\n==================================================================");
  console.log(`🎉 COMPLETED: ${finalProdCount} Products & ${finalCatCount} Categories active in MongoDB Atlas & Cloudinary!`);
  console.log("==================================================================");

  await mongoose.disconnect();
}

startSync().catch((e) => {
  console.error("Sync failed:", e);
  process.exit(1);
});
