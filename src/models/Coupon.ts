import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICoupon extends Document {
  code: string;
  discount: number;
  discountType: "percentage" | "fixed";
  minOrder: number;
  maxDiscount?: number;
  description: string;
  isActive: boolean;
  expiryDate?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CouponSchema = new Schema<ICoupon>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    discount: { type: Number, required: true },
    discountType: { type: String, enum: ["percentage", "fixed"], default: "percentage" },
    minOrder: { type: Number, default: 0 },
    maxDiscount: { type: Number, default: 0 },
    description: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    expiryDate: { type: String, default: "" },
  },
  { timestamps: true }
);

export const CouponModel: Model<ICoupon> =
  mongoose.models.Coupon || mongoose.model<ICoupon>("Coupon", CouponSchema);
