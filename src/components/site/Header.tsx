"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import {
  Heart,
  Menu,
  Phone,
  Search,
  ShoppingCart,
  User,
  X,
  LogOut,
  Package,
  MapPin,
  ShieldCheck,
  Home,
  Boxes,
  Sprout,
  FileText,
  Info,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useApp, useCartTotals, useUser } from "@/lib/store";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home", icon: Home },
  { href: "/products", label: "Products", icon: Package },
  { href: "/categories", label: "Categories", icon: Boxes },
  { href: "/farmer-solutions", label: "Farmer Solutions", icon: Sprout },
  { href: "/blog", label: "Blog", icon: FileText },
  { href: "/about", label: "About", icon: Info },
  { href: "/contact", label: "Contact", icon: Phone },
] as const;

export function Header() {
  const { state, logout } = useApp();
  const user = useUser();
  const { count } = useCartTotals();
  const router = useRouter();
  const pathname = usePathname();

  const [q, setQ] = React.useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const userMenuRef = React.useRef<HTMLDivElement>(null);

  // Close menus on route change
  React.useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  React.useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Close user menu on outside click
  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
    toast.success("Successfully signed out");
  };

  const userInitial = user?.name ? user.name.trim().charAt(0).toUpperCase() : "U";

  return (
    <header className="sticky top-0 z-40 w-full shadow-xs">
      {/* Top Announcement & Helpline Bar */}
      <div className="bg-[#18361e] text-[#f4efe4] py-1.5 px-3 sm:px-8 border-b border-[#234b2b]">
        <div className="mx-auto flex max-w-7xl items-center justify-between text-[11px] sm:text-xs tracking-wide">
          <div className="flex items-center gap-1.5 font-normal text-[#f4efe4]/90 truncate">
            <Sparkles className="h-3 w-3 text-[#a8d672] shrink-0" />
            <span className="truncate">{state.settings.announcement || "Free soil testing on orders above ₹5,000"}</span>
          </div>
          <div className="flex items-center gap-1.5 font-medium shrink-0 ml-2">
            <a
              href={`tel:${(state.settings.phone || "+91 91759 55009").replace(/[^0-9+]/g, "")}`}
              className="inline-flex items-center gap-1 text-[#f4efe4]/95 transition-colors hover:text-white"
            >
              <Phone className="h-3 w-3 stroke-[2.2] text-[#a8d672]" />
              <span className="hidden xs:inline">{state.settings.phone || "+91 91759 55009"}</span>
              <span className="xs:hidden">Call Helpline</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="bg-[#fbf8f1] border-b border-[#e9e2d3]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3.5">
          {/* Left: Mobile Hamburger & Brand Logo */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {/* Mobile Menu Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              className="flex h-9 w-9 items-center justify-center rounded-xl text-[#1a3820] hover:bg-black/5 lg:hidden transition-colors shrink-0"
            >
              <Menu className="h-5 w-5 stroke-[2]" />
            </button>

            {/* Logo & Brand Name */}
            <Link
              href="/"
              className="flex items-center gap-2 sm:gap-3 group select-none shrink-0 min-w-0"
            >
              <div className="flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl bg-white p-1 shadow-xs border border-[#e5decb]">
                <img
                  src="/logo.png"
                  alt="Plant Health Solutions"
                  className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col leading-tight min-w-0">
                <span className="font-display text-base sm:text-xl lg:text-2xl font-bold tracking-tight text-[#1a3820] truncate">
                  Plant Health <span className="text-[#4e8837]">Solutions</span>
                </span>
                <span className="text-[10px] text-[#5c6b59] hidden sm:block">Agricultural Research &amp; Bio Inputs</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7">
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
                    "text-[14px] xl:text-[15px] font-semibold transition-colors duration-200 py-1 border-b-2",
                    isActive
                      ? "text-[#4e8837] border-[#4e8837]"
                      : "text-[#283928] border-transparent hover:text-[#4e8837]"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Search Toggle Button */}
            <button
              onClick={() => setSearchOpen((prev) => !prev)}
              aria-label="Search"
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full text-[#1a3820] transition-colors hover:bg-black/5 hover:text-[#4e8837]",
                searchOpen && "bg-black/5 text-[#4e8837]"
              )}
            >
              <Search className="h-5 w-5 stroke-[1.8]" />
            </button>

            {/* Wishlist Button */}
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="relative flex h-9 w-9 items-center justify-center rounded-full text-[#1a3820] transition-colors hover:bg-black/5 hover:text-[#4e8837]"
            >
              <Heart className="h-5 w-5 stroke-[1.8]" />
              {state.wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#4e8837] px-1 text-[10px] font-bold text-white shadow-xs">
                  {state.wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart Button */}
            <Link
              href="/cart"
              aria-label="Cart"
              className="relative flex h-9 w-9 items-center justify-center rounded-full text-[#1a3820] transition-colors hover:bg-black/5 hover:text-[#4e8837]"
            >
              <ShoppingCart className="h-5 w-5 stroke-[1.8]" />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#4e8837] px-1 text-[10px] font-bold text-white shadow-xs">
                  {count}
                </span>
              )}
            </Link>

            {/* User / Account Button with Dropdown */}
            <div className="relative" ref={userMenuRef}>
              {user ? (
                <div>
                  <button
                    onClick={() => setUserMenuOpen((prev) => !prev)}
                    className="flex items-center gap-1.5 rounded-full p-1 pl-1.5 sm:pl-2 text-xs font-semibold text-[#1a3820] transition-colors hover:bg-black/5"
                    aria-label="User menu"
                  >
                    <span className="hidden md:inline-block max-w-[100px] truncate text-[#1a3820]">
                      {user.name?.split(" ")[0] || "Account"}
                    </span>
                    <div className="relative flex h-7 w-7 items-center justify-center rounded-full bg-[#4e8837] text-white text-xs font-bold shadow-xs">
                      {userInitial}
                      <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-[#fbf8f1]" />
                    </div>
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-border bg-card p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 text-foreground">
                      <div className="px-3 py-2 border-b border-border/60">
                        <p className="font-bold text-sm text-foreground truncate">{user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        {user.role === "admin" && (
                          <span className="mt-1 inline-block rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-600">
                            Admin Account
                          </span>
                        )}
                      </div>

                      <div className="py-1">
                        <Link
                          href="/account"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
                        >
                          <User className="h-4 w-4 text-primary" /> My Dashboard
                        </Link>
                        <Link
                          href="/account?tab=orders"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <Package className="h-4 w-4 text-primary" />
                            <span>My Orders &amp; Tracking</span>
                          </div>
                          {state.orders.filter((o) => o.email?.toLowerCase() === user.email?.toLowerCase()).length > 0 && (
                            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                              {state.orders.filter((o) => o.email?.toLowerCase() === user.email?.toLowerCase()).length}
                            </span>
                          )}
                        </Link>
                        <Link
                          href="/account?tab=addresses"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
                        >
                          <MapPin className="h-4 w-4 text-primary" /> Farm Addresses
                        </Link>
                        <Link
                          href="/wishlist"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <Heart className="h-4 w-4 text-rose-500" />
                            <span>Wishlist</span>
                          </div>
                          {state.wishlist.length > 0 && (
                            <span className="rounded-full bg-rose-500/10 px-2 py-0.5 text-[10px] font-bold text-rose-600">
                              {state.wishlist.length}
                            </span>
                          )}
                        </Link>
                        {user.role === "admin" && (
                          <Link
                            href="/admin"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-amber-600 hover:bg-amber-500/10 transition-colors"
                          >
                            <ShieldCheck className="h-4 w-4" /> Admin Console
                          </Link>
                        )}
                      </div>

                      <div className="pt-1 border-t border-border/60">
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-destructive hover:bg-destructive/10 transition-colors"
                        >
                          <LogOut className="h-4 w-4" /> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  aria-label="Sign in"
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#4e8837] text-white px-3 py-1.5 text-xs font-semibold transition-all hover:bg-[#3e7230] shadow-2xs"
                >
                  <User className="h-3.5 w-3.5 stroke-[2.2]" />
                  <span>Sign In</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Expandable Search Drawer / Dropdown */}
        {searchOpen && (
          <div className="border-t border-[#e9e2d3] bg-[#fbf8f1] px-4 py-3.5 shadow-inner sm:px-8 animate-in fade-in slide-in-from-top-2 duration-200">
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
              <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs text-[#5c6b59]">
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
                    className="rounded-full border border-[#dcd4c0] bg-white px-2.5 py-1 hover:bg-[#4e8837] hover:text-white transition-colors text-[11px] font-medium shadow-2xs"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Slide-Out Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Slide-out Sheet */}
          <aside className="fixed inset-y-0 left-0 flex w-80 max-w-[85vw] flex-col bg-[#fbf8f1] shadow-2xl transition-transform animate-in slide-in-from-left duration-300">
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-[#e9e2d3] bg-[#18361e] p-4 text-[#f4efe4]">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white p-1 shadow-xs">
                  <img src="/logo.png" alt="Plant Health Solutions" className="h-full w-full object-contain" />
                </div>
                <div>
                  <p className="font-display text-base font-bold text-white leading-tight">Plant Health Solutions</p>
                  <p className="text-[10px] text-[#a8d672]">Vijayapura Center</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                aria-label="Close menu"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Search Input in Mobile Drawer */}
            <div className="p-3.5 border-b border-[#e9e2d3] bg-white/60">
              <form onSubmit={handleSearchSubmit} className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search bio fertilizers & products..."
                  className="w-full rounded-xl border border-[#dcd4c0] bg-white py-2 pl-9 pr-3 text-xs text-[#1a3820] outline-none focus:border-[#4e8837] focus:ring-1 focus:ring-[#4e8837]"
                />
              </form>
            </div>

            {/* Scrollable Navigation Links */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground px-3 py-1.5">
                Navigation
              </div>

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
                      "flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all",
                      isActive
                        ? "bg-[#4e8837] text-white shadow-xs font-bold"
                        : "text-[#283928] hover:bg-black/5 hover:text-[#4e8837]"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <link.icon className={cn("h-4 w-4", isActive ? "text-white" : "text-[#4e8837]")} />
                      <span>{link.label}</span>
                    </div>
                    <ChevronRight className={cn("h-4 w-4 opacity-50", isActive && "opacity-100")} />
                  </Link>
                );
              })}

              {/* Mobile Wishlist Link */}
              <Link
                href="/wishlist"
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all",
                  pathname === "/wishlist"
                    ? "bg-[#4e8837] text-white shadow-xs font-bold"
                    : "text-[#283928] hover:bg-black/5 hover:text-[#4e8837]"
                )}
              >
                <div className="flex items-center gap-3">
                  <Heart className={cn("h-4 w-4", pathname === "/wishlist" ? "text-white" : "text-rose-500")} />
                  <span>Wishlist</span>
                </div>
                {state.wishlist.length > 0 && (
                  <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-rose-500 px-1.5 text-[11px] font-bold text-white">
                    {state.wishlist.length}
                  </span>
                )}
              </Link>

              {/* Quick Categories Section */}
              <div className="pt-3">
                <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground px-3 py-1.5">
                  Popular Categories
                </div>
                <div className="grid grid-cols-2 gap-1.5 px-1 pt-1">
                  {[
                    "Bio Fertilizers",
                    "Micronutrients",
                    "Biostimulants",
                    "Crop Protection",
                  ].map((cat) => (
                    <Link
                      key={cat}
                      href={`/products?category=${encodeURIComponent(cat)}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="rounded-xl border border-[#e5decb] bg-white/80 p-2 text-center text-xs font-semibold text-[#1a3820] hover:bg-[#4e8837] hover:text-white transition-colors"
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile Drawer Bottom User & Action Area */}
            <div className="border-t border-[#e9e2d3] bg-white p-3.5 space-y-3">
              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between rounded-xl bg-[#fbf8f1] p-2.5 border border-[#e5decb]">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#4e8837] text-white text-xs font-bold">
                        {userInitial}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-xs text-foreground truncate">{user.name}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
                      </div>
                    </div>
                    {user.role === "admin" && (
                      <Link
                        href="/admin"
                        onClick={() => setMobileMenuOpen(false)}
                        className="rounded-lg bg-amber-500/15 px-2 py-1 text-[10px] font-bold text-amber-700 hover:bg-amber-500/25 transition-colors shrink-0"
                      >
                        Admin
                      </Link>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/account?tab=orders"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-1.5 rounded-xl border border-border bg-background py-2 text-xs font-bold text-foreground hover:bg-muted"
                    >
                      <Package className="h-3.5 w-3.5 text-primary" /> My Orders
                    </Link>
                    <Link
                      href="/account"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-1.5 rounded-xl border border-border bg-background py-2 text-xs font-bold text-foreground hover:bg-muted"
                    >
                      <User className="h-3.5 w-3.5 text-primary" /> My Profile
                    </Link>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-destructive/20 bg-destructive/5 py-2 text-xs font-bold text-destructive hover:bg-destructive/10"
                  >
                    <LogOut className="h-3.5 w-3.5" /> Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 rounded-xl bg-[#4e8837] py-2.5 text-center text-xs font-bold text-white shadow-xs hover:bg-[#3e7230]"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 rounded-xl border border-[#dcd4c0] bg-white py-2.5 text-center text-xs font-bold text-[#1a3820] hover:bg-muted"
                  >
                    Register
                  </Link>
                </div>
              )}

              {/* Helpline Quick Dial */}
              <a
                href={`tel:${state.settings.phone.replace(/[^0-9+]/g, "")}`}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#18361e] py-2 text-xs font-semibold text-white hover:bg-[#234b2b] transition-colors"
              >
                <Phone className="h-3.5 w-3.5 text-[#a8d672]" />
                Helpline: {state.settings.phone || "+91 91759 55009"}
              </a>
            </div>
          </aside>
        </div>
      )}
    </header>
  );
}

