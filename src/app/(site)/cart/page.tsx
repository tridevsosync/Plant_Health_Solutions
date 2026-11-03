"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Minus,
  Plus,
  Trash2,
  Lock,
  ArrowRight,
  ShieldCheck,
  Tag,
  CheckCircle2,
  X,
  Sparkles,
  Percent,
} from "lucide-react";
import { toast } from "sonner";
import {
  FREE_SHIPPING,
  SHIPPING_FEE,
  inr,
  useApp,
  useCartTotals,
  useUser,
  type Coupon,
} from "@/lib/store";
import { PageHero } from "@/components/site/Section";

export default function CartPage() {
  const router = useRouter();
  const { state, setQty, removeFromCart, applyCoupon, removeCoupon, calculateCouponDiscount } = useApp();
  const user = useUser();
  const { lines, subtotal } = useCartTotals();

  const [couponInput, setCouponInput] = React.useState("");
  const [applying, setApplying] = React.useState(false);

  const appliedCoupon = state.appliedCoupon;
  const discount = calculateCouponDiscount(appliedCoupon, subtotal);

  const freeShippingLimit = state.settings.freeShippingThreshold ?? FREE_SHIPPING;
  const standardShippingFee = state.settings.shippingFee ?? SHIPPING_FEE;
  const shipping = subtotal >= freeShippingLimit || subtotal === 0 ? 0 : standardShippingFee;
  const taxableAmount = Math.max(0, subtotal - discount);
  const tax = Math.round(taxableAmount * 0.05);
  const total = taxableAmount + shipping + tax;

  const handleApplyCoupon = (codeToApply?: string) => {
    const code = (codeToApply || couponInput).trim();
    if (!code) {
      toast.error("Please enter a coupon code");
      return;
    }
    setApplying(true);
    const result = applyCoupon(code, subtotal);
    setApplying(false);

    if (result.success) {
      toast.success(result.message);
      setCouponInput("");
    } else {
      toast.error(result.message);
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    toast.info("Coupon removed");
  };

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

  // Active coupons for display
  const availableCoupons = (state.coupons || []).filter((c) => c.isActive !== false);

  return (
    <div>
      <PageHero
        title="Your Shopping Cart"
        subtitle="Review and manage your selected bio fertilizers, micronutrients, and crop care formulations."
        image="https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=1920&q=80"
      />
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* Left Column: Cart items */}
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-sm text-muted-foreground">
                {subtotal >= freeShippingLimit
                  ? "You have unlocked free shipping!"
                  : `Add ${inr(freeShippingLimit - subtotal)} more for free shipping`}
              </p>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-secondary"
                  style={{ width: `${Math.min(100, (subtotal / freeShippingLimit) * 100)}%` }}
                />
              </div>
            </div>

            {lines.map(({ line, product, itemPrice, itemUnit, itemImage }) =>
              product ? (
                <div key={`${line.id}-${line.packSize || ""}`} className="flex flex-wrap items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-xs">
                  <img src={itemImage || product.image} alt={product.name} className="h-20 w-20 rounded-lg object-cover" />
                  <div className="min-w-[180px] flex-1">
                    <Link href={`/products/${product.id}`} className="font-semibold text-foreground hover:text-primary transition-colors">
                      {product.name}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      {product.category} · <span className="font-semibold text-foreground">{itemUnit || product.unit}</span>
                    </p>
                    <p className="mt-1 font-semibold text-primary">{inr(itemPrice)}</p>
                  </div>
                  <div className="flex items-center rounded-full border border-border">
                    <button onClick={() => setQty(line.id, line.qty - 1, line.packSize)} className="p-2"><Minus className="h-4 w-4" /></button>
                    <span className="w-9 text-center text-sm font-semibold">{line.qty}</span>
                    <button onClick={() => setQty(line.id, line.qty + 1, line.packSize)} className="p-2"><Plus className="h-4 w-4" /></button>
                  </div>
                  <p className="w-24 text-right font-display font-bold text-primary">{inr(itemPrice * line.qty)}</p>
                  <button onClick={() => removeFromCart(line.id, line.packSize)} className="rounded-full p-2 text-destructive hover:bg-muted">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ) : null,
            )}

            {/* Available Coupon Offers section */}
            {availableCoupons.length > 0 && (
              <div className="mt-6 rounded-2xl border border-border/80 bg-card p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <h3 className="font-display text-sm font-bold text-foreground">
                    Available Offers &amp; Promo Codes
                  </h3>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {availableCoupons.map((c) => {
                    const isFixed = c.discountType === "fixed" || (!c.discountType && c.discount > 100);
                    const isApplied = appliedCoupon?.code === c.code;
                    const meetsMin = !c.minOrder || subtotal >= c.minOrder;

                    return (
                      <div
                        key={c.code}
                        className={`flex flex-col justify-between rounded-xl border p-3.5 transition-all ${
                          isApplied
                            ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20"
                            : "border-border bg-muted/20 hover:border-primary/40"
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                              {c.code}
                            </span>
                            <span className="text-xs font-bold text-emerald-600">
                              {isFixed ? `${inr(c.discount)} OFF` : `${c.discount}% OFF`}
                            </span>
                          </div>
                          <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2">
                            {c.description || (c.minOrder ? `On orders above ${inr(c.minOrder)}` : "Applicable on all items")}
                          </p>
                        </div>

                        <div className="mt-3 flex items-center justify-between border-t border-border/50 pt-2 text-[11px]">
                          {c.minOrder && subtotal < c.minOrder ? (
                            <span className="text-muted-foreground">
                              Add {inr(c.minOrder - subtotal)} more
                            </span>
                          ) : (
                            <span className="text-emerald-600 font-medium">Eligible</span>
                          )}

                          {isApplied ? (
                            <span className="inline-flex items-center gap-1 font-bold text-emerald-600 text-xs">
                              <CheckCircle2 className="h-3.5 w-3.5" /> Applied
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleApplyCoupon(c.code)}
                              disabled={!meetsMin}
                              className="font-bold text-primary hover:text-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                              Apply Coupon
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Order Summary & Coupon Form */}
          <aside className="h-fit rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6">
            <h2 className="font-display text-xl font-bold text-foreground">Order Summary</h2>

            {/* Coupon Application Box */}
            <div className="space-y-2 rounded-xl border border-border bg-muted/30 p-3.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5 text-primary" /> Apply Coupon Code
              </label>

              {appliedCoupon ? (
                <div className="flex items-center justify-between rounded-lg border border-emerald-500/40 bg-emerald-50 p-2.5 dark:bg-emerald-950/30">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <div>
                      <p className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-300">
                        {appliedCoupon.code}
                      </p>
                      <p className="text-[11px] text-emerald-600 dark:text-emerald-400">
                        Saved {inr(discount)} on this purchase
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground hover:bg-emerald-100 hover:text-destructive transition-colors"
                    title="Remove coupon"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="Enter coupon code"
                    className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-xs font-mono font-bold uppercase placeholder:font-sans placeholder:font-normal placeholder:text-muted-foreground/60 outline-none focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={() => handleApplyCoupon()}
                    disabled={applying || !couponInput.trim()}
                    className="rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    {applying ? "Applying..." : "Apply"}
                  </button>
                </div>
              )}
            </div>

            {/* Price Breakdown */}
            <dl className="space-y-2.5 text-sm">
              <Row label="Subtotal" value={inr(subtotal)} />

              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <dt className="flex items-center gap-1.5">
                    <Tag className="h-3.5 w-3.5" /> Coupon Discount ({appliedCoupon?.code})
                  </dt>
                  <dd>-{inr(discount)}</dd>
                </div>
              )}

              <Row label="Doorstep Delivery" value={shipping ? inr(shipping) : "Free"} />
              <Row label="GST (5%)" value={inr(tax)} />
              <div className="border-t border-border pt-3">
                <Row label="Total Amount" value={inr(total)} bold />
              </div>
            </dl>

            {user ? (
              <Link
                href="/checkout"
                className="flex items-center justify-center gap-2 rounded-full bg-primary py-3 text-center text-sm font-bold text-primary-foreground shadow-md hover:bg-secondary transition-all"
              >
                Proceed to Checkout <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <button
                onClick={() => {
                  toast.info("Please sign in or register to complete your purchase.");
                  router.push("/login?redirect=/checkout");
                }}
                className="w-full flex items-center justify-center gap-2 rounded-full bg-primary py-3 text-center text-sm font-bold text-primary-foreground shadow-md hover:bg-secondary transition-all"
              >
                <Lock className="h-4 w-4" /> Sign In to Checkout
              </button>
            )}

            {!user && (
              <div className="rounded-xl bg-muted/70 p-3 text-[11px] text-muted-foreground border border-border flex items-start gap-2 leading-relaxed">
                <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>
                  Account required to select delivery farm addresses and confirm your order. Your cart and coupon are preserved.
                </span>
              </div>
            )}
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
