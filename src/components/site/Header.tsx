"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Heart,
  Leaf,
  Menu,
  Phone,
  Search,
  ShoppingCart,
  User,
  X,
} from "lucide-react";
import { useApp, useCartTotals } from "@/lib/store";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/products", label: "Products" },
  { href: "/categories", label: "Categories" },
  { href: "/farmer-solutions", label: "Farmer Solutions" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
] as const;

export function Header() {
  const { state } = useApp();
  const { count } = useCartTotals();
  const router = useRouter();
  const pathname = usePathname();

  const [q, setQ] = React.useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  // Close mobile menu and search on route change
  React.useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  // Focus search input when toggled open
  React.useEffect(() => {
    if (searchOpen) {
      searchInputRef.current?.focus();
    }
  }, [searchOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) {
      router.push(`/products?q=${encodeURIComponent(q.trim())}`);
      setSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full shadow-xs">
      {/* Top Announcement & Helpline Bar */}
      <div className="bg-[#18361e] text-[#f4efe4] py-2 px-4 sm:px-8 border-b border-[#234b2b]">
        <div className="mx-auto flex max-w-7xl items-center justify-between text-xs sm:text-[13px] tracking-wide">
          <div className="flex items-center font-normal text-[#f4efe4]/90">
            <span>Free soil testing on orders above ₹5,000</span>
          </div>
          <div className="flex items-center gap-1.5 font-medium">
            <a
              href={`tel:${state.settings.phone.replace(/[^0-9+]/g, "")}`}
              className="inline-flex items-center gap-1.5 text-[#f4efe4]/95 transition-colors hover:text-white"
            >
              <Phone className="h-3.5 w-3.5 stroke-[2.2]" />
              <span>{state.settings.phone || "+91 91759 55009"}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="bg-[#fbf8f1] border-b border-[#e9e2d3]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-8 sm:py-3.5">
          {/* Logo & Brand Name */}
          <Link
            href="/"
            className="flex items-center gap-2.5 sm:gap-3 group select-none shrink-0"
          >
            <img
              src="/logo.png"
              alt="Plant Health Solutions"
              className="h-10 sm:h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <span className="font-display text-xl sm:text-2xl font-bold tracking-tight text-[#1a3820]">
              Plant Health <span className="text-[#4e8837]">Solutions</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {links.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname === link.href || pathname.startsWith(`${link.href}/`);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-[15px] font-medium transition-colors duration-200",
                    isActive
                      ? "text-[#4e8837] font-semibold"
                      : "text-[#283928] hover:text-[#4e8837]"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Search Toggle Button */}
            <button
              onClick={() => setSearchOpen((prev) => !prev)}
              aria-label="Search"
              className={cn(
                "rounded-full p-2 text-[#1a3820] transition-colors hover:bg-black/5 hover:text-[#4e8837]",
                searchOpen && "bg-black/5 text-[#4e8837]"
              )}
            >
              <Search className="h-5 w-5 stroke-[1.8]" />
            </button>

            {/* Wishlist Button */}
            <Link
              href="/account"
              aria-label="Wishlist"
              className="relative rounded-full p-2 text-[#1a3820] transition-colors hover:bg-black/5 hover:text-[#4e8837]"
            >
              <Heart className="h-5 w-5 stroke-[1.8]" />
              {state.wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#4e8837] px-1 text-[10px] font-bold text-white">
                  {state.wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart Button */}
            <Link
              href="/cart"
              aria-label="Cart"
              className="relative rounded-full p-2 text-[#1a3820] transition-colors hover:bg-black/5 hover:text-[#4e8837]"
            >
              <ShoppingCart className="h-5 w-5 stroke-[1.8]" />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#4e8837] px-1 text-[10px] font-bold text-white">
                  {count}
                </span>
              )}
            </Link>

            {/* Account / User Button */}
            <Link
              href="/account"
              aria-label="Account"
              className="rounded-full p-2 text-[#1a3820] transition-colors hover:bg-black/5 hover:text-[#4e8837]"
            >
              <User className="h-5 w-5 stroke-[1.8]" />
            </Link>

            {/* Mobile Menu Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle navigation menu"
              className="rounded-full p-2 text-[#1a3820] transition-colors hover:bg-black/5 lg:hidden"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5 stroke-[2]" />
              ) : (
                <Menu className="h-5 w-5 stroke-[2]" />
              )}
            </button>
          </div>
        </div>

        {/* Expandable Search Drawer / Dropdown */}
        {searchOpen && (
          <div className="border-t border-[#e9e2d3] bg-[#fbf8f1] px-4 py-3 shadow-inner sm:px-8 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="mx-auto max-w-3xl">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search bio fertilizers, micronutrients, crop protection..."
                  className="w-full rounded-full border border-[#dcd4c0] bg-white py-2.5 pl-10 pr-24 text-sm text-[#1a3820] outline-none transition-all placeholder:text-[#8a9885] focus:border-[#4e8837] focus:ring-1 focus:ring-[#4e8837]"
                />
                <div className="absolute right-1.5 flex items-center gap-1">
                  <button
                    type="submit"
                    className="rounded-full bg-[#467c34] px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-[#386628]"
                  >
                    Search
                  </button>
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="rounded-full p-1.5 text-muted-foreground hover:bg-black/5"
                    aria-label="Close search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </form>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-[#5c6b59]">
                <span className="font-semibold">Popular:</span>
                {[
                  "Bio Fertilizers",
                  "Organic Fertilizers",
                  "Biostimulants",
                  "Micronutrients",
                  "Crop Protection",
                ].map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => {
                      setQ(term);
                      router.push(`/products?category=${encodeURIComponent(term)}`);
                      setSearchOpen(false);
                    }}
                    className="rounded-full border border-[#dcd4c0] bg-white/60 px-2.5 py-0.5 hover:bg-white hover:text-[#4e8837] transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Mobile Navigation Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="border-t border-[#e9e2d3] bg-[#fbf8f1] px-4 py-4 lg:hidden animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Mobile Search Bar */}
            <form onSubmit={handleSearchSubmit} className="mb-4">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search products..."
                  className="w-full rounded-full border border-[#dcd4c0] bg-white py-2 pl-9 pr-4 text-sm outline-none focus:border-[#4e8837]"
                />
              </div>
            </form>

            {/* Links */}
            <div className="flex flex-col divide-y divide-[#ece5d5]">
              {links.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname === link.href || pathname.startsWith(`${link.href}/`);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "py-3 text-base font-medium transition-colors",
                      isActive
                        ? "text-[#4e8837] font-semibold"
                        : "text-[#283928] hover:text-[#4e8837]"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Mobile Bottom Quick Links & Helpline */}
            <div className="mt-4 pt-4 border-t border-[#ece5d5] flex flex-col gap-3">
              <div className="flex items-center justify-around py-2 rounded-xl bg-white/80 border border-[#e5decb]">
                <Link
                  href="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex flex-col items-center text-xs font-medium text-[#1a3820]"
                >
                  <User className="h-4 w-4 mb-1" />
                  Account
                </Link>
                <Link
                  href="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex flex-col items-center text-xs font-medium text-[#1a3820]"
                >
                  <Heart className="h-4 w-4 mb-1" />
                  Wishlist ({state.wishlist.length})
                </Link>
                <Link
                  href="/cart"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex flex-col items-center text-xs font-medium text-[#1a3820]"
                >
                  <ShoppingCart className="h-4 w-4 mb-1" />
                  Cart ({count})
                </Link>
              </div>

              <a
                href={`tel:${state.settings.phone.replace(/[^0-9+]/g, "")}`}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#18361e] py-2.5 text-xs font-medium text-white"
              >
                <Phone className="h-3.5 w-3.5" />
                Helpline: {state.settings.phone || "+91 91759 55009"}
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
