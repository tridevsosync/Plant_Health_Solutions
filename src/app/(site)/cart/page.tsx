"use client";

import * as React from "react";
import Link from "next/link";
import { Minus, Plus, Tag, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { FREE_SHIPPING, SHIPPING_FEE, inr, useApp, useCartTotals } from "@/lib/store";
import { PageHero } from "@/components/site/Section";

export default function CartPage() {
  const { state, setQty, removeFromCart } = useApp();
  const { lines, subtotal } = useCartTotals();
  const [code, setCode] = React.useState("");
  const [applied, setApplied] = React.useState<string | null>(null);
  const coupon = state.coupons.find((c) => c.code === applied) ?? null;
  const discount = coupon ? Math.round((subtotal * coupon.discount) / 100) : 0;
  const shipping = subtotal - discount >= FREE_SHIPPING || subtotal === 0 ? 0 : SHIPPING_FEE;
  const tax = Math.round((subtotal - discount) * 0.05);
  const total = subtotal - discount + shipping + tax;

  if (lines.length === 0) {
    return (
      <div>
        <PageHero
          title="Your Shopping Cart"
          subtitle="Review and manage your selected bio fertilizers, micronutrients, and crop care formulations."
          image="https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=1920&q=80"
        />
        <div className="mx-auto max-w-3xl px-4 py-20 text-center">
          <h2 className="font-display text-2xl font-bold text-primary">Your cart is currently empty</h2>
          <p className="mt-2 text-muted-foreground">Add bio fertilizers, micronutrients or crop protection products to get started.</p>
          <Link
            href="/products"
            className="mt-6 inline-block rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground hover:bg-secondary transition-colors"
          >
            Browse products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHero
        title="Your Shopping Cart"
        subtitle="Review and manage your selected bio fertilizers, micronutrients, and crop care formulations."
        image="https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=1920&q=80"
      />
      <div className="mx-auto max-w-7xl px-4 py-12">

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">
              {subtotal >= FREE_SHIPPING
                ? "You have unlocked free shipping!"
                : `Add ${inr(FREE_SHIPPING - subtotal)} more for free shipping`}
            </p>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-secondary"
                style={{ width: `${Math.min(100, (subtotal / FREE_SHIPPING) * 100)}%` }}
              />
            </div>
          </div>

          {lines.map(({ line, product }) =>
            product ? (
              <div key={line.id} className="flex flex-wrap items-center gap-4 rounded-xl border border-border bg-card p-4">
                <img src={product.image} alt={product.name} className="h-20 w-20 rounded-lg object-cover" />
                <div className="min-w-[180px] flex-1">
                  <Link href={`/products/${product.id}`} className="font-semibold text-foreground hover:text-primary">
                    {product.name}
                  </Link>
                  <p className="text-xs text-muted-foreground">{product.category} · {product.unit}</p>
                  <p className="mt-1 font-semibold text-primary">{inr(product.price)}</p>
                </div>
                <div className="flex items-center rounded-full border border-border">
                  <button onClick={() => setQty(line.id, line.qty - 1)} className="p-2"><Minus className="h-4 w-4" /></button>
                  <span className="w-9 text-center text-sm font-semibold">{line.qty}</span>
                  <button onClick={() => setQty(line.id, line.qty + 1)} className="p-2"><Plus className="h-4 w-4" /></button>
                </div>
                <p className="w-24 text-right font-display font-bold text-primary">{inr(product.price * line.qty)}</p>
                <button onClick={() => removeFromCart(line.id)} className="rounded-full p-2 text-destructive hover:bg-muted">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ) : null,
          )}
        </div>

        <aside className="h-fit rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="font-display text-xl font-semibold">Order Summary</h2>
          <div className="mt-4 flex gap-2">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Coupon code"
              className="w-full rounded-full border border-border bg-background px-4 py-2 text-sm"
            />
            <button
              onClick={() => {
                const c = state.coupons.find((x) => x.code === code);
                if (!c) {
                  toast.error("Invalid coupon code");
                  return;
                }
                if (subtotal < c.minOrder) {
                  toast.error(`Minimum order ${inr(c.minOrder)} required`);
                  return;
                }
                setApplied(c.code);
                localStorage.setItem("phs_coupon", c.code);
                toast.success(`${c.code} applied — ${c.discount}% off`);
              }}
              className="rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground"
            >
              Apply
            </button>
          </div>
          {coupon && (
            <p className="mt-2 flex items-center gap-1 text-xs text-secondary">
              <Tag className="h-3 w-3" /> {coupon.code} — {coupon.description}
            </p>
          )}
          <dl className="mt-5 space-y-2 text-sm">
            <Row label="Subtotal" value={inr(subtotal)} />
            <Row label="Discount" value={`- ${inr(discount)}`} />
            <Row label="Shipping" value={shipping ? inr(shipping) : "Free"} />
            <Row label="GST (5%)" value={inr(tax)} />
            <div className="border-t border-border pt-2">
              <Row label="Total" value={inr(total)} bold />
            </div>
          </dl>
          <Link
            href="/checkout"
            className="mt-5 block rounded-full bg-primary py-3 text-center text-sm font-semibold text-primary-foreground hover:bg-secondary"
          >
            Proceed to Checkout
          </Link>
          <p className="mt-3 text-center text-xs text-muted-foreground">Available coupons: {state.coupons.map((c) => c.code).join(", ")}</p>
        </aside>
      </div>
    </div>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex justify-between ${bold ? "font-display text-lg font-bold text-primary" : "text-muted-foreground"}`}>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
