import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITestimonial extends Document {
  id: string;
  name: string;
  place: string;
  crop: string;
  rating: number;
  quote: string;
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
  },
  { timestamps: true }
);

export const TestimonialModel: Model<ITestimonial> =
  mongoose.models.Testimonial || mongoose.model<ITestimonial>("Testimonial", TestimonialSchema);
