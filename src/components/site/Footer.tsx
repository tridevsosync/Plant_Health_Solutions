"use client";

import * as React from "react";
import Link from "next/link";
import { Mail, MapPin, Phone, MessageCircle } from "lucide-react";
import { useApp } from "@/lib/store";

export function Footer() {
  const { state } = useApp();
  const s = state.settings;

  return (
    <footer className="mt-20 bg-[#18361e] text-[#f4efe4] border-t border-[#234b2b]">
      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-8 lg:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.3fr] lg:gap-8 xl:gap-12">
          {/* Column 1: Brand Info */}
          <div className="flex flex-col">
            <Link href="/" className="inline-flex items-center gap-3 group w-fit">
              <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-white p-1 shadow-xs transition-transform group-hover:scale-105 shrink-0 overflow-hidden">
                <img
                  src="/logo.png"
                  alt={s.name || "Plant Health Solutions"}
                  className="h-full w-full object-contain"
                />
              </div>
              <span className="font-display text-xl font-bold tracking-tight text-white">
                {s.name || "Plant Health Solutions"}
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#d1dbcd]">
              {s.description ||
                "Research-driven agricultural products for sustainable farming across India. Manufactured at our Vijayapura facility."}
            </p>

            {/* Social / WhatsApp icons */}
            <div className="mt-5 flex items-center gap-3">
              {s.whatsapp && (
                <a
                  href={`https://wa.me/${s.whatsapp.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-emerald-600 transition-colors"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="h-4 w-4" />
                </a>
              )}
              {s.facebook && (
                <a
                  href={s.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-blue-600 transition-colors"
                  aria-label="Facebook"
                >
                  <span className="text-xs font-bold">f</span>
                </a>
              )}
              {s.instagram && (
                <a
                  href={s.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-pink-600 transition-colors"
                  aria-label="Instagram"
                >
                  <span className="text-xs font-bold">ig</span>
                </a>
              )}
              {s.youtube && (
                <a
                  href={s.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-red-600 transition-colors"
                  aria-label="YouTube"
                >
                  <span className="text-xs font-bold">yt</span>
                </a>
              )}
              {s.twitter && (
                <a
                  href={s.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-sky-500 transition-colors"
                  aria-label="Twitter"
                >
                  <span className="text-xs font-bold">𝕏</span>
                </a>
              )}
            </div>
          </div>

          {/* Column 2: COMPANY */}
          <div>
            <h3 className="font-display text-sm font-bold tracking-wider text-white uppercase sm:text-base">
              COMPANY
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-[#d1dbcd]">
              <li>
                <Link href="/about" className="transition-colors hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/farmer-solutions"
                  className="transition-colors hover:text-white"
                >
                  Farmer Solutions
                </Link>
              </li>
              <li>
                <Link href="/blog" className="transition-colors hover:text-white">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition-colors hover:text-white">
                  Become a Dealer
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition-colors hover:text-white">
                  FAQ &amp; Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: SHOP */}
          <div>
            <h3 className="font-display text-sm font-bold tracking-wider text-white uppercase sm:text-base">
              SHOP
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-[#d1dbcd]">
              <li>
                <Link href="/products" className="transition-colors hover:text-white">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/categories" className="transition-colors hover:text-white">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="transition-colors hover:text-white">
                  Wishlist ({state.wishlist.length})
                </Link>
              </li>
              <li>
                <Link href="/account" className="transition-colors hover:text-white">
                  My Account
                </Link>
              </li>
              <li>
                <Link href="/cart" className="transition-colors hover:text-white">
                  Shopping Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: CONTACT */}
          <div>
            <h3 className="font-display text-sm font-bold tracking-wider text-white uppercase sm:text-base">
              CONTACT
            </h3>
            <ul className="mt-4 space-y-3.5 text-sm text-[#d1dbcd]">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#6bb055]" />
                <span className="leading-relaxed">
                  {s.address || "NH-52, Vijayapur–Solapur Road, Tidagundi, Vijayapura, Karnataka 586119"}
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-[#6bb055]" />
                <a
                  href={`tel:${(s.phone || "+91 91759 55009").replace(/[^0-9+]/g, "")}`}
                  className="transition-colors hover:text-white"
                >
                  {s.phone || "+91 91759 55009"}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-[#6bb055]" />
                <a
                  href={`mailto:${s.email1 || "planthealthsol@gmail.com"}`}
                  className="transition-colors hover:text-white"
                >
                  {s.email1 || "planthealthsol@gmail.com"}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Sub-footer */}
      <div className="border-t border-[#234b2b] bg-[#142d19]">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-xs text-[#a9bca5] sm:px-8 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} {s.name || "Plant Health Solutions Pvt. Ltd."}. All rights reserved.</p>
          <div className="flex flex-wrap gap-4 sm:gap-6">
            <Link href="/privacy-policy" className="transition-colors hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-white">
              Terms &amp; Conditions
            </Link>
            <Link href="/refund-policy" className="transition-colors hover:text-white">
              Refund Policy
            </Link>
            <Link href="/shipping-policy" className="transition-colors hover:text-white">
              Shipping Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
