import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITestimonial extends Document {
  id: string;
  name: string;
  place: string;
  crop: string;
  rating: number;
  quote: string;
  productId?: string;
  productName?: string;
  status: "Pending" | "Approved" | "Rejected";
  date?: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    place: { type: String, default: "Karnataka" },
    crop: { type: String, default: "Sugarcane" },
    rating: { type: Number, default: 5 },
    quote: { type: String, required: true },
    productId: { type: String, default: "" },
    productName: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
      index: true,
    },
    date: { type: String, default: () => new Date().toISOString().split("T")[0] },
    image: { type: String, default: "" },
  },
  { timestamps: true }
);

export const TestimonialModel: Model<ITestimonial> =
  mongoose.models.Testimonial || mongoose.model<ITestimonial>("Testimonial", TestimonialSchema);
