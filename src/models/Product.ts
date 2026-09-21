import mongoose, { Schema, Document, Model } from "mongoose";

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
  createdAt: Date;
  updatedAt: Date;
}

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
  },
  { timestamps: true }
);

export const ProductModel: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);
