"use client";

import * as React from "react";
import Link from "next/link";
import { toast } from "sonner";
import { inr, useApp, useUser } from "@/lib/store";
import { PageHero } from "@/components/site/Section";

export default function AccountPage() {
  const { state, set, login, register, logout, addToCart, toggleWishlist } = useApp();
  const user = useUser();
  const [mode, setMode] = React.useState<"login" | "register">("login");
  const [form, setForm] = React.useState({ name: "", email: "", phone: "", password: "" });
  const [tab, setTab] = React.useState("dashboard");

  if (!user) {
    return (
      <div>
        <PageHero title="My Account" subtitle="Sign in to track orders, save products and manage addresses." />
        <div className="mx-auto max-w-md px-4 py-12">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex gap-2">
              {(["login", "register"] as const).map((m) => (
                <button key={m} onClick={() => setMode(m)} className={`flex-1 rounded-full py-2 text-sm font-semibold capitalize ${mode === m ? "bg-primary text-primary-foreground" : "border border-border"}`}>
                  {m}
                </button>
              ))}
            </div>
            <form
              className="mt-5 grid gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                const err = mode === "login" ? login(form.email, form.password) : register(form);
                if (err) toast.error(err);
                else toast.success(mode === "login" ? "Welcome back" : "Account created");
              }}
            >
              {mode === "register" && (
                <>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" className="rounded-lg border border-border bg-background px-3 py-2 text-sm" />
                  <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone" className="rounded-lg border border-border bg-background px-3 py-2 text-sm" />
                </>
              )}
              <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" className="rounded-lg border border-border bg-background px-3 py-2 text-sm" />
              <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Password" className="rounded-lg border border-border bg-background px-3 py-2 text-sm" />
              <button className="rounded-full bg-primary py-2.5 text-sm font-semibold text-primary-foreground">
                {mode === "login" ? "Sign In" : "Create Account"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  const myOrders = state.orders.filter((o) => o.email === user.email);
  const wishlist = state.products.filter((p) => state.wishlist.includes(p.id));

  return (
    <div>
      <PageHero title={`Welcome, ${user.name || user.email}`} subtitle="Manage your profile, addresses, wishlist and orders." />
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="flex flex-wrap gap-2">
          {["dashboard", "profile", "addresses", "wishlist", "orders"].map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`rounded-full px-5 py-2 text-sm font-semibold capitalize ${tab === t ? "bg-primary text-primary-foreground" : "border border-border bg-card"}`}>
              {t}
            </button>
          ))}
          <button onClick={() => { logout(); toast.success("Signed out"); }} className="ml-auto rounded-full border border-destructive px-5 py-2 text-sm font-semibold text-destructive">
            Logout
          </button>
        </div>

        <div className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
          {tab === "dashboard" && (
            <div className="grid gap-4 sm:grid-cols-3">
              <Stat label="Orders placed" value={String(myOrders.length)} />
              <Stat label="Wishlist items" value={String(wishlist.length)} />
              <Stat label="Cart items" value={String(state.cart.length)} />
            </div>
          )}

          {tab === "profile" && (
            <div className="grid max-w-md gap-3">
              {(["name", "phone", "email"] as const).map((k) => (
                <label key={k} className="text-sm">
                  <span className="mb-1 block font-medium capitalize">{k}</span>
                  <input
                    value={user[k]}
                    onChange={(e) =>
                      set((s) => ({
                        ...s,
                        users: s.users.map((u) => (u.email === s.currentUser ? { ...u, [k]: e.target.value } : u)),
                        currentUser: k === "email" ? e.target.value : s.currentUser,
                      }))
                    }
                    className="w-full rounded-lg border border-border bg-background px-3 py-2"
                  />
                </label>
              ))}
              <button onClick={() => toast.success("Profile saved")} className="w-fit rounded-full bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground">Save</button>
            </div>
          )}

          {tab === "addresses" && (
            <AddressBook />
          )}

          {tab === "wishlist" && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {wishlist.length === 0 && <p className="text-sm text-muted-foreground">Your wishlist is empty.</p>}
              {wishlist.map((p) => (
                <div key={p.id} className="rounded-xl border border-border p-4">
                  <img src={p.image} alt={p.name} className="h-32 w-full rounded-lg object-cover" />
                  <p className="mt-2 font-semibold">{p.name}</p>
                  <p className="text-sm text-primary">{inr(p.price)}</p>
                  <div className="mt-3 flex gap-2">
                    <button onClick={() => { addToCart(p.id); toggleWishlist(p.id); toast.success("Moved to cart"); }} className="rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground">
                      Move to cart
                    </button>
                    <button onClick={() => toggleWishlist(p.id)} className="rounded-full border border-border px-4 py-1.5 text-xs">Remove</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "orders" && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border text-left text-muted-foreground"><th className="py-2">Order</th><th>Date</th><th>Status</th><th>Total</th><th></th></tr></thead>
                <tbody>
                  {myOrders.length === 0 && <tr><td colSpan={5} className="py-6 text-muted-foreground">No orders yet.</td></tr>}
                  {myOrders.map((o) => (
                    <tr key={o.id} className="border-b border-border">
                      <td className="py-2 font-medium">{o.id}</td>
                      <td>{o.date}</td>
                      <td><span className="rounded-full bg-muted px-2 py-0.5 text-xs">{o.status}</span></td>
                      <td>{inr(o.total)}</td>
                      <td><Link href={`/orders/${o.id}`} className="text-secondary underline">Invoice</Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AddressBook() {
  const { set } = useApp();
  const user = useUser();
  const [a, setA] = React.useState({ label: "Home", line: "", city: "", pincode: "" });
  if (!user) return null;
  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2">
        {user.addresses.map((ad, i) => (
          <div key={i} className="rounded-xl border border-border p-4 text-sm">
            <p className="font-semibold">{ad.label}</p>
            <p className="text-muted-foreground">{ad.line}, {ad.city} - {ad.pincode}</p>
          </div>
        ))}
      </div>
      <div className="mt-5 grid max-w-xl gap-3 sm:grid-cols-2">
        <input value={a.label} onChange={(e) => setA({ ...a, label: e.target.value })} placeholder="Label" className="rounded-lg border border-border bg-background px-3 py-2 text-sm" />
        <input value={a.city} onChange={(e) => setA({ ...a, city: e.target.value })} placeholder="City" className="rounded-lg border border-border bg-background px-3 py-2 text-sm" />
        <input value={a.pincode} onChange={(e) => setA({ ...a, pincode: e.target.value })} placeholder="Pincode" className="rounded-lg border border-border bg-background px-3 py-2 text-sm" />
        <input value={a.line} onChange={(e) => setA({ ...a, line: e.target.value })} placeholder="Address line" className="rounded-lg border border-border bg-background px-3 py-2 text-sm" />
        <button
          onClick={() => {
            if (!a.line) return;
            set((s) => ({ ...s, users: s.users.map((u) => (u.email === s.currentUser ? { ...u, addresses: [...u.addresses, a] } : u)) }));
            setA({ label: "Home", line: "", city: "", pincode: "" });
            toast.success("Address saved");
          }}
          className="w-fit rounded-full bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground"
        >
          Add address
        </button>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-muted/60 p-5 text-center">
      <p className="font-display text-3xl font-bold text-primary">{value}</p>
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
