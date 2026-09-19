import mongoose, { Schema, Document, Model } from "mongoose";

export interface IEnquiry extends Document {
  id: string;
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  status: "New" | "Answered";
  createdAt: Date;
  updatedAt: Date;
}

const EnquirySchema = new Schema<IEnquiry>(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    phone: { type: String, default: "" },
    email: { type: String, required: true },
    subject: { type: String, default: "General Enquiry" },
    message: { type: String, required: true },
    date: { type: String, required: true },
    status: { type: String, enum: ["New", "Answered"], default: "New" },
  },
  { timestamps: true }
);

export const EnquiryModel: Model<IEnquiry> =
  mongoose.models.Enquiry || mongoose.model<IEnquiry>("Enquiry", EnquirySchema);
