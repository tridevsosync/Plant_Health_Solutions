import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBlog extends Document {
  id: string;
  title: string;
  author: string;
  date: string;
  category: string;
  image: string;
  excerpt: string;
  readTime: number;
  featured: boolean;
  body: string[];
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema = new Schema<IBlog>(
  {
    id: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    author: { type: String, default: "Dr. R. M. Kulkarni" },
    date: { type: String, required: true },
    category: { type: String, default: "Farming Guide" },
    image: { type: String, default: "" },
    excerpt: { type: String, default: "" },
    readTime: { type: Number, default: 5 },
    featured: { type: Boolean, default: false },
    body: { type: [String], default: [] },
  },
  { timestamps: true }
);

export const BlogModel: Model<IBlog> =
  mongoose.models.Blog || mongoose.model<IBlog>("Blog", BlogSchema);
