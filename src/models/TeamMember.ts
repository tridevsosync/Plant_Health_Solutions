import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITeamMember extends Document {
  id: string;
  name: string;
  role: string;
  department?: string;
  bio?: string;
  image: string;
  email?: string;
  phone?: string;
  order?: number;
  status: "Active" | "Hidden";
  createdAt: Date;
  updatedAt: Date;
}

const TeamMemberSchema = new Schema<ITeamMember>(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    role: { type: String, required: true },
    department: { type: String, default: "Agronomy" },
    bio: { type: String, default: "" },
    image: { type: String, default: "" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    order: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["Active", "Hidden"],
      default: "Active",
      index: true,
    },
  },
  { timestamps: true }
);

export const TeamMemberModel: Model<ITeamMember> =
  mongoose.models.TeamMember || mongoose.model<ITeamMember>("TeamMember", TeamMemberSchema);
