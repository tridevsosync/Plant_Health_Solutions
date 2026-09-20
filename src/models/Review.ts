import mongoose, { Schema, Document, Model } from "mongoose";

export interface IReview extends Document {
  id: string;
  productId: string;
  name: string;
  rating: number;
  date: string;
  comment: string;
  status: "Pending" | "Approved" | "Rejected";
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    id: { type: String, required: true, unique: true, index: true },
    productId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    rating: { type: Number, default: 5 },
    date: { type: String, required: true },
    comment: { type: String, required: true },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
      index: true,
    },
  },
  { timestamps: true }
);

export const ReviewModel: Model<IReview> =
  mongoose.models.Review || mongoose.model<IReview>("Review", ReviewSchema);
