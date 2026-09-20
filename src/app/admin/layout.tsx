"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BadgePercent,
  Boxes,
  FileText,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  MessageSquareQuote,
  Package,
  Settings,
  ShoppingCart,
  Users,
  X,
} from "lucide-react";
import { useApp } from "@/lib/store";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Products", icon: Package, exact: false },
  { href: "/admin/categories", label: "Categories", icon: Boxes, exact: false },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart, exact: false },
  { href: "/admin/customers", label: "Customers", icon: Users, exact: false },
  { href: "/admin/blogs", label: "Blogs", icon: FileText, exact: false },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote, exact: false },
  { href: "/admin/enquiries", label: "Enquiries", icon: Mail, exact: false },
  { href: "/admin/coupons", label: "Coupons", icon: BadgePercent, exact: false },
  { href: "/admin/settings", label: "Settings", icon: Settings, exact: false },
] as const;

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { state, ready, adminLogout } = useApp();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const isLogin = pathname === "/admin/login";

  React.useEffect(() => {
    if (ready && !state.admin && !isLogin) {
      router.replace("/admin/login");
    }
  }, [ready, state.admin, isLogin, router]);

  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  if (isLogin) {
    return <>{children}</>;
  }

  if (!ready || !state.admin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
        Checking admin session…
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-muted/40">
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-[#1b3d24] text-[#f4efe4] shadow-2xl transition-transform duration-300 ease-in-out md:static md:w-64 md:translate-x-0 md:shadow-none ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white p-1.5 shadow-sm">
              <img src="/logo.png" alt="Plant Health Solutions" className="h-full w-full object-contain" />
            </div>
            <div>
              <p className="font-display text-base font-bold text-white leading-tight">PHS Admin</p>
              <p className="text-[11px] text-[#f4efe4]/70">Management Console</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white md:hidden hover:bg-white/20 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {nav.map((n) => {
            const active = n.exact ? pathname === n.href : pathname.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                  active
                    ? "bg-[#3e7230] text-white shadow-xs font-semibold"
                    : "text-[#f4efe4]/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                <n.icon className={`h-4 w-4 shrink-0 ${active ? "text-[#a8d672]" : "text-[#f4efe4]/70"}`} />
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-3">
          <button
            onClick={() => {
              adminLogout();
              router.replace("/admin/login");
            }}
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-rose-300 hover:bg-rose-500/15 hover:text-rose-200 transition-colors"
          >
            <LogOut className="h-4 w-4 shrink-0" /> Sign Out
          </button>
        </div>
      </aside>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs transition-opacity md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <div className="flex min-w-0 flex-1 flex-col overflow-x-hidden">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-border bg-card/95 backdrop-blur-xs px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3 min-w-0">
            <button
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-muted/30 p-2 text-foreground hover:bg-muted md:hidden transition-colors"
              onClick={() => setOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="text-xs sm:text-sm text-muted-foreground truncate">
              <span className="font-bold text-foreground">{state.orders.length}</span> orders ·{" "}
              <span className="font-bold text-foreground">{state.products.length}</span> products ·{" "}
              <span className="font-bold text-foreground">{state.categories.length}</span> categories
            </div>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3.5 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors shadow-2xs shrink-0"
          >
            View Site &rarr;
          </Link>
        </header>

        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
