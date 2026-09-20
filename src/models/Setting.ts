import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISetting extends Document {
  key: string;
  name: string;
  owner: string;
  phone: string;
  whatsapp?: string;
  email1: string;
  email2: string;
  address: string;
  description: string;
  gst?: string;
  announcement?: string;
  freeShippingThreshold?: number;
  shippingFee?: number;
  facebook?: string;
  instagram?: string;
  youtube?: string;
  twitter?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SettingSchema = new Schema<ISetting>(
  {
    key: { type: String, required: true, unique: true, default: "company_settings" },
    name: { type: String, default: "Plant Health Solutions Pvt. Ltd." },
    owner: { type: String, default: "Dr. R. M. Kulkarni" },
    phone: { type: String, default: "+91 91759 55009" },
    whatsapp: { type: String, default: "+91 91759 55009" },
    email1: { type: String, default: "planthealthsol@gmail.com" },
    email2: { type: String, default: "dr_prashant84@yahoo.com" },
    address: {
      type: String,
      default:
        "Plant Health Solutions Horticulture Research and Extension Center, NH-52, Vijayapur - Solapur Road, Tidagundi, Vijayapura, Karnataka 586119",
    },
    description: {
      type: String,
      default:
        "Working in Agriculture and Agricultural Research manufacturing Bio Fertilizers, Biostimulants, Bio Chemical Fertilizers, Bio Control Agents, Organic Manures, Plant/Animal/Fish Extracts, Water Soluble Fertilizers, Micronutrients and Crop Protection Products.",
    },
    gst: { type: String, default: "29AAGCP1234F1Z5" },
    announcement: { type: String, default: "Free soil testing on orders above ₹5,000" },
    freeShippingThreshold: { type: Number, default: 2000 },
    shippingFee: { type: Number, default: 90 },
    facebook: { type: String, default: "https://facebook.com" },
    instagram: { type: String, default: "https://instagram.com" },
    youtube: { type: String, default: "https://youtube.com" },
    twitter: { type: String, default: "https://twitter.com" },
  },
  { timestamps: true }
);

export const SettingModel: Model<ISetting> =
  mongoose.models.Setting || mongoose.model<ISetting>("Setting", SettingSchema);
