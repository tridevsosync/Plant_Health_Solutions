import mongoose, { Schema, Document, Model } from "mongoose";

export interface IGallery extends Document {
  id: string;
  title: string;
  description: string;
  type: "photo" | "video";
  mediaUrl: string;
  thumbnailUrl: string;
  videoLink: string;
  category: string;
  featured: boolean;
  status: "Active" | "Draft";
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const GallerySchema = new Schema<IGallery>(
  {
    id: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    type: {
      type: String,
      enum: ["photo", "video"],
      default: "photo",
      index: true,
    },
    mediaUrl: { type: String, default: "" },
    thumbnailUrl: { type: String, default: "" },
    videoLink: { type: String, default: "" },
    category: { type: String, default: "General", index: true },
    featured: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["Active", "Draft"],
      default: "Active",
      index: true,
    },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const GalleryModel: Model<IGallery> =
  mongoose.models.Gallery || mongoose.model<IGallery>("Gallery", GallerySchema);
