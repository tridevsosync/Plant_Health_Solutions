import bcrypt from "bcryptjs";
import { connectDB } from "./db";
import { UserModel, IUser } from "@/models/User";
import { CustomerModel } from "@/models/Customer";

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  password?: string;
  role: "user" | "admin";
  addresses: Array<{
    label: string;
    line: string;
    city: string;
    state?: string;
    pincode: string;
  }>;
}

// In-memory fallback cache
const fallbackUsers: StoredUser[] = [
  {
    id: "u_demo_farmer",
    name: "Ramesh Patil",
    email: "farmer@example.com",
    phone: "+91 98450 12345",
    // bcrypt hash of 'Farmer@123'
    password: "$2a$10$p0bVz0zB7oM0ZcM9w6/MzeR5Kx2fC49V2M1U0t4Xz0K.o.kQ2C0W.",
    role: "user",
    addresses: [
      {
        label: "Farm House",
        line: "Plot 14, Bagalkot Road",
        city: "Vijayapura",
        state: "Karnataka",
        pincode: "586101",
      },
    ],
  },
  {
    id: "u_demo_admin",
    name: "Plant Health Admin",
    email: "planthealth@gmail.com",
    phone: "+91 91759 55009",
    // bcrypt hash of 'Planthealth@123'
    password: "$2a$10$p0bVz0zB7oM0ZcM9w6/MzeR5Kx2fC49V2M1U0t4Xz0K.o.kQ2C0W.",
    role: "admin",
    addresses: [
      {
        label: "Office",
        line: "PHS Research Center, NH-52, Tidagundi",
        city: "Vijayapura",
        state: "Karnataka",
        pincode: "586119",
      },
    ],
  },
];

interface MongoUserLean {
  _id?: { toString(): string };
  id?: string;
  name: string;
  email: string;
  phone?: string;
  password?: string;
  role: "user" | "admin";
  addresses?: Array<{
    label: string;
    line: string;
    city: string;
    state?: string;
    pincode: string;
  }>;
}

export async function findUserByEmail(email: string): Promise<StoredUser | null> {
  const cleanEmail = email.trim().toLowerCase();

  try {
    await connectDB();
    const doc = (await UserModel.findOne({ email: cleanEmail }).lean()) as MongoUserLean | null;
    if (doc) {
      return {
        id: doc._id?.toString() || doc.id || `u_${Date.now()}`,
        name: doc.name,
        email: doc.email,
        phone: doc.phone || "",
        password: doc.password,
        role: doc.role,
        addresses: doc.addresses || [],
      };
    }
  } catch (err) {
    console.warn("DB findUser fallback to memory cache:", (err as Error).message);
  }

  const memoryUser = fallbackUsers.find((u) => u.email.toLowerCase() === cleanEmail);
  return memoryUser || null;
}

export async function saveNewUser(user: {
  name: string;
  email: string;
  phone?: string;
  passwordHash: string;
  role?: "user" | "admin";
}): Promise<StoredUser> {
  const cleanEmail = user.email.trim().toLowerCase();
  const id = `u_${Date.now()}`;

  const newUserObj: StoredUser = {
    id,
    name: user.name.trim(),
    email: cleanEmail,
    phone: user.phone ? user.phone.trim() : "",
    password: user.passwordHash,
    role: user.role || "user",
    addresses: [],
  };

  try {
    await connectDB();
    const doc = await UserModel.create({
      name: newUserObj.name,
      email: newUserObj.email,
      phone: newUserObj.phone,
      password: newUserObj.password,
      role: newUserObj.role,
      addresses: [],
    });

    newUserObj.id = doc._id.toString();

    // Also sync to customer model for all non-admin users
    if (newUserObj.role !== "admin") {
      try {
        await CustomerModel.findOneAndUpdate(
          { email: cleanEmail },
          {
            $set: {
              name: newUserObj.name,
              phone: newUserObj.phone || "",
              active: true,
            },
            $setOnInsert: {
              id: doc._id ? doc._id.toString() : `c_${Date.now()}`,
              email: cleanEmail,
              city: "Karnataka",
              orders: 0,
            },
          },
          { upsert: true, new: true }
        );
      } catch (custErr) {
        console.warn("Customer sync error in saveNewUser:", custErr);
      }
    }
  } catch (err) {
    console.warn("DB saveNewUser fallback to memory cache:", (err as Error).message);
  }

  // Update in memory fallback
  const existingIdx = fallbackUsers.findIndex((u) => u.email.toLowerCase() === cleanEmail);
  if (existingIdx >= 0) {
    fallbackUsers[existingIdx] = newUserObj;
  } else {
    fallbackUsers.push(newUserObj);
  }

  return newUserObj;
}

export async function updateUserByEmail(
  email: string,
  update: {
    name?: string;
    phone?: string;
    addresses?: Array<{ label: string; line: string; city: string; state?: string; pincode: string }>;
  }
): Promise<StoredUser | null> {
  const cleanEmail = email.trim().toLowerCase();

  try {
    await connectDB();
    const doc = (await UserModel.findOneAndUpdate(
      { email: cleanEmail },
      { $set: update },
      { new: true }
    ).lean()) as MongoUserLean | null;

    if (doc) {
      return {
        id: doc._id?.toString() || doc.id || `u_${Date.now()}`,
        name: doc.name,
        email: doc.email,
        phone: doc.phone || "",
        role: doc.role,
        addresses: doc.addresses || [],
      };
    }
  } catch (err) {
    console.warn("DB updateUserByEmail fallback to memory:", (err as Error).message);
  }


  const user = fallbackUsers.find((u) => u.email.toLowerCase() === cleanEmail);
  if (user) {
    if (update.name !== undefined) user.name = update.name;
    if (update.phone !== undefined) user.phone = update.phone;
    if (update.addresses !== undefined) user.addresses = update.addresses;
    return user;
  }

  return null;
}
