import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOtp extends Document {
  email: string;
  otp: string;
  type: "login" | "registration" | "reset";
  payload?: Record<string, unknown>;
  attempts: number;
  expiresAt: Date;
  createdAt: Date;
}

const OtpSchema = new Schema<IOtp>(
  {
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    otp: { type: String, required: true },
    type: { type: String, enum: ["login", "registration", "reset"], default: "login" },
    payload: { type: Schema.Types.Mixed },
    attempts: { type: Number, default: 0 },
    expiresAt: { type: Date, required: true, expires: 0 }, // MongoDB TTL index (automatically deletes expired documents)
  },
  { timestamps: true }
);

export const OtpModel: Model<IOtp> =
  mongoose.models.Otp || mongoose.model<IOtp>("Otp", OtpSchema);
