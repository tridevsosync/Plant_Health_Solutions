import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOrderItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  unit?: string;
  image?: string;
}

export interface IOrder extends Document {
  id: string;
  customer: string;
  email: string;
  phone: string;
  date: string;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  items: IOrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  address: string;
  city?: string;
  state?: string;
  pincode?: string;
  payment: string;
  paymentId?: string;
  paymentStatus?: "Pending" | "Paid" | "Failed";
  trackingNumber?: string;
  courier?: string;
  estimatedDelivery?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    qty: { type: Number, required: true, default: 1 },
    unit: { type: String, default: "" },
    image: { type: String, default: "" },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    id: { type: String, required: true, unique: true, index: true },
    customer: { type: String, required: true },
    email: { type: String, required: true, index: true },
    phone: { type: String, default: "" },
    date: { type: String, required: true },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
      index: true,
    },
    items: { type: [OrderItemSchema], default: [] },
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    shipping: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    total: { type: Number, required: true },
    address: { type: String, required: true },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    pincode: { type: String, default: "" },
    payment: { type: String, default: "Razorpay (Online)" },
    paymentId: { type: String, default: "" },
    paymentStatus: { type: String, enum: ["Pending", "Paid", "Failed"], default: "Paid" },
    trackingNumber: { type: String, default: "" },
    courier: { type: String, default: "VRL Logistics / DTDC Express" },
    estimatedDelivery: { type: String, default: "3 - 5 business days" },
  },
  { timestamps: true }
);

export const OrderModel: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);
