import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const ONES = [
  "",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen",
];

const TENS = [
  "",
  "",
  "Twenty",
  "Thirty",
  "Forty",
  "Fifty",
  "Sixty",
  "Seventy",
  "Eighty",
  "Ninety",
];

function convertBelowThousand(n: number): string {
  let str = "";
  if (n >= 100) {
    str += ONES[Math.floor(n / 100)] + " Hundred ";
    n %= 100;
  }
  if (n >= 20) {
    str += TENS[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + ONES[n % 10] : "");
  } else if (n > 0) {
    str += ONES[n];
  }
  return str.trim();
}

/**
 * Converts a number to Indian Currency words (e.g., "INR Three Thousand Four Hundred Ninety Only")
 */
export function numberToIndianWords(amount: number): string {
  if (isNaN(amount) || amount === 0) {
    return "INR Zero Only";
  }

  const rounded = Math.round(amount * 100) / 100;
  const rupees = Math.floor(Math.abs(rounded));
  const paise = Math.round((Math.abs(rounded) - rupees) * 100);

  let remaining = rupees;
  const parts: string[] = [];

  // Crores (1,00,00,000)
  const crore = Math.floor(remaining / 10000000);
  if (crore > 0) {
    parts.push(convertBelowThousand(crore) + " Crore");
    remaining %= 10000000;
  }

  // Lakhs (1,00,000)
  const lakh = Math.floor(remaining / 100000);
  if (lakh > 0) {
    parts.push(convertBelowThousand(lakh) + " Lakh");
    remaining %= 100000;
  }

  // Thousands (1,000)
  const thousand = Math.floor(remaining / 1000);
  if (thousand > 0) {
    parts.push(convertBelowThousand(thousand) + " Thousand");
    remaining %= 1000;
  }

  // Hundreds & below
  if (remaining > 0) {
    parts.push(convertBelowThousand(remaining));
  }

  let words = parts.filter(Boolean).join(" ");
  if (!words) {
    words = "Zero";
  }

  let result = `INR ${words} Rupees`;
  if (paise > 0) {
    result += ` and ${convertBelowThousand(paise)} Paise`;
  }
  result += " Only";

  return result;
}

/**
 * Formats order ID into standard GST Tax Invoice number (e.g., PHS/26-27/00482)
 */
export function formatTaxInvoiceNo(orderId: string): string {
  if (!orderId) return "PHS/INV/2026";
  const cleanId = orderId.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  const shortCode = cleanId.length > 6 ? cleanId.slice(-6) : cleanId.padStart(5, "0");
  return `PHS/2026-27/INV-${shortCode}`;
}
