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
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-primary text-primary-foreground transition-transform md:static md:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="border-b border-white/10 px-5 py-5">
          <p className="font-display text-lg font-bold">PHS Admin</p>
          <p className="text-xs opacity-70">Plant Health Solutions</p>
        </div>
        <nav className="grid gap-1 p-3">
          {nav.map((n) => {
            const active = n.exact ? pathname === n.href : pathname.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${active ? "bg-white/15" : "hover:bg-white/10"}`}
              >
                <n.icon className="h-4 w-4" />
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3">
          <button
            onClick={() => {
              adminLogout();
              router.replace("/admin/login");
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-white/10"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>

      {open && <div className="fixed inset-0 z-30 bg-foreground/40 md:hidden" onClick={() => setOpen(false)} />}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-4 border-b border-border bg-card px-4 py-3">
          <div className="flex items-center gap-3">
            <button className="rounded-lg border border-border p-2 md:hidden" onClick={() => setOpen(true)}>
              <Menu className="h-4 w-4" />
            </button>
            <div className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{state.orders.length}</span> orders ·{" "}
              <span className="font-semibold text-foreground">{state.products.length}</span> products ·{" "}
              <span className="font-semibold text-foreground">{state.customers.length}</span> customers
            </div>
          </div>
          <Link href="/" className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold">
            View site
          </Link>
        </header>
        <main className="min-w-0 flex-1 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
