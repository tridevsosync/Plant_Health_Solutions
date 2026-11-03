import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProductVariant {
  id?: string;
  packSize: string;
  price: number;
  oldPrice?: number;
  quantity: number;
  image?: string;
  sku?: string;
}

export interface IProduct extends Document {
  id: string;
  name: string;
  category: string;
  price: number;
  oldPrice: number;
  rating: number;
  reviews: number;
  stock: number;
  unit: string;
  image: string;
  image2?: string;
  images?: string[];
  description: string;
  benefits: string[];
  usage: string;
  ingredients: string;
  badges: string[];
  variants?: IProductVariant[];
  createdAt: Date;
  updatedAt: Date;
}

const VariantSchema = new Schema(
  {
    id: { type: String },
    packSize: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
    oldPrice: { type: Number, default: 0 },
    quantity: { type: Number, default: 100 },
    image: { type: String, default: "" },
    sku: { type: String, default: "" },
  },
  { _id: false }
);

const ProductSchema = new Schema<IProduct>(
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
    image2: { type: String, default: "" },
    images: { type: [String], default: [] },
    description: { type: String, default: "" },
    benefits: { type: [String], default: [] },
    usage: { type: String, default: "" },
    ingredients: { type: String, default: "" },
    badges: { type: [String], default: [] },
    variants: { type: [VariantSchema], default: [] },
  },
  { timestamps: true }
);

export const ProductModel: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);
