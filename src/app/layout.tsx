import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/lib/store";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Plant Health Solutions Pvt. Ltd. — Agriculture Research & Inputs",
    template: "%s | Plant Health Solutions",
  },
  description:
    "Bio fertilizers, biostimulants, micronutrients and crop protection products manufactured at our Tidagundi horticulture research center, Vijayapura.",
  authors: [{ name: "Plant Health Solutions Pvt. Ltd." }],
  keywords: [
    "Agriculture",
    "Bio fertilizers",
    "Biostimulants",
    "Micronutrients",
    "Crop Protection",
    "Plant Health",
    "Farming Solutions",
    "Vijayapura",
  ],
  openGraph: {
    title: "Plant Health Solutions Pvt. Ltd.",
    description:
      "Bio fertilizers, biostimulants, micronutrients and crop protection products manufactured at our Tidagundi horticulture research center, Vijayapura.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <AppProvider>
          {children}
          <Toaster position="top-right" richColors />
        </AppProvider>
      </body>
    </html>
  );
}
