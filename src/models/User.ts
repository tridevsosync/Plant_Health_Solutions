import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUserAddress {
  label: string;
  line: string;
  city: string;
  state?: string;
  pincode: string;
}

export interface IUser extends Document {
  name: string;
  email: string;
  phone?: string;
  password?: string;
  role: "user" | "admin";
  addresses: IUserAddress[];
  createdAt: Date;
  updatedAt: Date;
}

const AddressSchema = new Schema<IUserAddress>(
  {
    label: { type: String, default: "Home" },
    line: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, default: "" },
    pincode: { type: String, required: true },
  },
  { _id: false }
);

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, default: "" },
    password: { type: String, select: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    addresses: { type: [AddressSchema], default: [] },
  },
  { timestamps: true }
);

export const UserModel: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
