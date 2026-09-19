"use client";

import * as React from "react";
import Link from "next/link";
import { Leaf, Mail, MapPin, Phone } from "lucide-react";
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
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white p-1 shadow-xs transition-transform group-hover:scale-105">
                <img
                  src="/logo.png"
                  alt="Plant Health Solutions"
                  className="h-full w-full object-contain"
                />
              </div>
              <span className="font-display text-xl font-bold tracking-tight text-white">
                Plant Health Solutions
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#d1dbcd]">
              Research-driven agricultural products for sustainable farming across India.
              Manufactured at our Vijayapura facility.
            </p>
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
                  FAQ
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
                <Link href="/account" className="transition-colors hover:text-white">
                  Order Tracking
                </Link>
              </li>
              <li>
                <Link href="/account" className="transition-colors hover:text-white">
                  My Account
                </Link>
              </li>
              <li>
                <Link href="/cart" className="transition-colors hover:text-white">
                  Cart
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
                  NH-52, Vijayapur–Solapur Road, Tidagundi, Vijayapura, Karnataka 586119
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
                  href="mailto:hello@planthealthsolutions.com"
                  className="transition-colors hover:text-white"
                >
                  hello@planthealthsolutions.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Sub-footer */}
      <div className="border-t border-[#234b2b] bg-[#142d19]">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-xs text-[#a9bca5] sm:px-8 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Plant Health Solutions Pvt. Ltd. All rights reserved.</p>
          <div className="flex flex-wrap gap-4 sm:gap-6">
            <Link href="/privacy-policy" className="transition-colors hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-white">
              Terms & Conditions
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
