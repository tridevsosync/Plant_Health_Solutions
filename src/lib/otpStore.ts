import { connectDB } from "./db";
import { OtpModel } from "@/models/Otp";
import { sendOtpEmail } from "./email";

interface MemoryOtpRecord {
  email: string;
  otp: string;
  type: "login" | "registration" | "reset";
  payload?: Record<string, unknown>;
  attempts: number;
  expiresAt: number;
}

// In-memory fallback map for serverless / local environments
const memoryOtpStore = new Map<string, MemoryOtpRecord>();

/**
 * Generate a cryptographically secure 6-digit numeric OTP code
 */
export function generateOtpCode(): string {
  // Generate random 6 digits between 100000 and 999999
  const num = Math.floor(100000 + Math.random() * 900000);
  return num.toString();
}

/**
 * Create, store, and dispatch OTP to user email
 */
export async function createAndSendOtp({
  email,
  name,
  type,
  payload,
}: {
  email: string;
  name?: string;
  type: "login" | "registration" | "reset";
  payload?: Record<string, unknown>;
}): Promise<{ success: boolean; otp?: string; error?: string }> {
  const cleanEmail = email.trim().toLowerCase();
  const otp = generateOtpCode();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

  // 1. Try storing in MongoDB
  try {
    await connectDB();
    // Delete any older OTPs for this email and type
    await OtpModel.deleteMany({ email: cleanEmail, type });

    await OtpModel.create({
      email: cleanEmail,
      otp,
      type,
      payload,
      attempts: 0,
      expiresAt,
    });
  } catch (err) {
    console.warn("DB OTP store fallback to memory:", (err as Error).message);
  }

  // 2. Always store in in-memory map as fallback
  const storeKey = `${cleanEmail}_${type}`;
  memoryOtpStore.set(storeKey, {
    email: cleanEmail,
    otp,
    type,
    payload,
    attempts: 0,
    expiresAt: expiresAt.getTime(),
  });

  // 3. Send email to user
  const emailRes = await sendOtpEmail({
    email: cleanEmail,
    name,
    otp,
    type: type === "registration" ? "registration" : "login",
  });

  if (!emailRes.success && !emailRes.simulated) {
    return { success: false, error: emailRes.error || "Failed to send email" };
  }

  return { success: true, otp };
}

/**
 * Verify 6-digit OTP code against MongoDB and memory fallback
 */
export async function verifyOtpCode({
  email,
  otp,
  type,
}: {
  email: string;
  otp: string;
  type: "login" | "registration" | "reset";
}): Promise<{ valid: boolean; payload?: Record<string, unknown>; error?: string }> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanOtp = otp.trim();
  const storeKey = `${cleanEmail}_${type}`;

  // 1. Try checking MongoDB
  try {
    await connectDB();
    const doc = await OtpModel.findOne({ email: cleanEmail, type });

    if (doc) {
      if (new Date() > doc.expiresAt) {
        await OtpModel.deleteOne({ _id: doc._id });
        return { valid: false, error: "OTP code has expired. Please request a new one." };
      }

      if (doc.attempts >= 5) {
        await OtpModel.deleteOne({ _id: doc._id });
        return { valid: false, error: "Too many failed attempts. Please request a new OTP." };
      }

      if (doc.otp !== cleanOtp) {
        doc.attempts += 1;
        await doc.save();
        return { valid: false, error: "Invalid verification code. Please check your email." };
      }

      // Valid! Delete OTP record to prevent replay
      const payload = doc.payload as Record<string, unknown> | undefined;
      await OtpModel.deleteOne({ _id: doc._id });
      memoryOtpStore.delete(storeKey);
      return { valid: true, payload };
    }
  } catch (err) {
    console.warn("DB verifyOtp fallback to memory store:", (err as Error).message);
  }

  // 2. Check Memory Fallback
  const memRecord = memoryOtpStore.get(storeKey);
  if (!memRecord) {
    return { valid: false, error: "No active OTP request found. Please request a new code." };
  }

  if (Date.now() > memRecord.expiresAt) {
    memoryOtpStore.delete(storeKey);
    return { valid: false, error: "OTP code has expired. Please request a new one." };
  }

  if (memRecord.attempts >= 5) {
    memoryOtpStore.delete(storeKey);
    return { valid: false, error: "Too many failed attempts. Please request a new OTP." };
  }

  if (memRecord.otp !== cleanOtp) {
    memRecord.attempts += 1;
    return { valid: false, error: "Invalid verification code. Please check your email." };
  }

  // Valid! Delete memory record
  const payload = memRecord.payload;
  memoryOtpStore.delete(storeKey);
  return { valid: true, payload };
}
