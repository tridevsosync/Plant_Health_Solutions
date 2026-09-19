"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Check, Minus, Plus, ShieldCheck, Truck } from "lucide-react";
import { toast } from "sonner";
import { ProductCard, Stars } from "@/components/site/ProductCard";
import { inr, useApp } from "@/lib/store";

export default function ProductDetailPage() {
  const params = useParams();
  const id = (params?.id as string) ?? "";
  const router = useRouter();
  const { state, addToCart, set } = useApp();
  const product = state.products.find((p) => p.id === id);
  const [qty, setQty] = React.useState(1);
  const [tab, setTab] = React.useState("description");
  const [form, setForm] = React.useState({ name: "", rating: 5, comment: "" });

  if (!product) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-display text-2xl font-bold">Product not found</h1>
        <Link href="/products" className="mt-4 inline-block text-secondary underline">
          Back to catalog
        </Link>
      </div>
    );
  }

  const reviews = state.reviews.filter((r) => r.productId === product.id);
  const related = state.products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  const off = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <img src={product.image} alt={product.name} className="h-96 w-full rounded-2xl object-cover shadow" />
          <div className="mt-3 grid grid-cols-4 gap-3">
            {[0, 1, 2, 3].map((i) => (
              <img key={i} src={product.image} alt="" className="h-20 w-full rounded-lg object-cover opacity-80" />
            ))}
          </div>
        </div>

        <div>
          <span className="text-xs font-semibold uppercase tracking-wide text-secondary">{product.category}</span>
          <h1 className="mt-1 font-display text-3xl font-bold text-primary">{product.name}</h1>
          <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <Stars rating={product.rating} /> {product.rating} · {product.reviews} farmer reviews
          </div>
          <div className="mt-4 flex items-end gap-3">
            <span className="font-display text-4xl font-bold text-primary">{inr(product.price)}</span>
            <span className="text-lg text-muted-foreground line-through">{inr(product.oldPrice)}</span>
            {off > 0 && <span className="rounded-full bg-destructive px-2 py-0.5 text-xs font-semibold text-white">{off}% OFF</span>}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">Pack size: {product.unit} · Inclusive of all taxes</p>
          <p className={`mt-2 text-sm font-semibold ${product.stock ? "text-secondary" : "text-destructive"}`}>
            {product.stock ? `In stock — ${product.stock} units available` : "Currently out of stock"}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-full border border-border">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-2.5"><Minus className="h-4 w-4" /></button>
              <span className="w-10 text-center text-sm font-semibold">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="p-2.5"><Plus className="h-4 w-4" /></button>
            </div>
            <button
              onClick={() => {
                addToCart(product.id, qty);
                toast.success("Added to cart");
              }}
              className="rounded-full bg-primary px-7 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-secondary"
            >
              Add to Cart
            </button>
            <button
              onClick={() => {
                addToCart(product.id, qty);
                router.push("/checkout");
              }}
              className="rounded-full bg-accent px-7 py-2.5 text-sm font-semibold text-accent-foreground"
            >
              Buy Now
            </button>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <p className="flex items-center gap-2 text-sm text-muted-foreground"><Truck className="h-4 w-4 text-secondary" /> Free shipping above ₹2,000</p>
            <p className="flex items-center gap-2 text-sm text-muted-foreground"><ShieldCheck className="h-4 w-4 text-secondary" /> Batch tested at Tidagundi QC lab</p>
          </div>
        </div>
      </div>

      <div className="mt-12 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-wrap gap-2 border-b border-border pb-3">
          {["description", "benefits", "usage", "ingredients", "reviews"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize ${tab === t ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="pt-5 text-sm leading-relaxed text-muted-foreground">
          {tab === "description" && <p>{product.description}</p>}
          {tab === "benefits" && (
            <ul className="space-y-2">
              {product.benefits.map((b) => (
                <li key={b} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />{b}</li>
              ))}
            </ul>
          )}
          {tab === "usage" && <p>{product.usage}</p>}
          {tab === "ingredients" && <p>{product.ingredients}</p>}
          {tab === "reviews" && (
            <div>
              <div className="space-y-4">
                {reviews.length === 0 && <p>No reviews yet. Be the first to review this product.</p>}
                {reviews.map((r) => (
                  <div key={r.id} className="rounded-xl border border-border p-4">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-foreground">{r.name}</p>
                      <Stars rating={r.rating} />
                    </div>
                    <p className="mt-1 text-xs">{r.date}</p>
                    <p className="mt-2">{r.comment}</p>
                  </div>
                ))}
              </div>
              <form
                className="mt-6 grid gap-3 rounded-xl bg-muted/60 p-4 sm:grid-cols-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!form.name || !form.comment) return;
                  set((s) => ({
                    ...s,
                    reviews: [
                      {
                        id: `R${Date.now()}`,
                        productId: product.id,
                        name: form.name,
                        rating: Number(form.rating),
                        date: new Date().toISOString().slice(0, 10),
                        comment: form.comment,
                      },
                      ...s.reviews,
                    ],
                  }));
                  setForm({ name: "", rating: 5, comment: "" });
                  toast.success("Thank you for your review");
                }}
              >
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your name"
                  className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
                />
                <select
                  value={form.rating}
                  onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
                  className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
                >
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>{n} star</option>
                  ))}
                </select>
                <textarea
                  value={form.comment}
                  onChange={(e) => setForm({ ...form, comment: e.target.value })}
                  placeholder="Share your field experience"
                  className="sm:col-span-2 rounded-lg border border-border bg-background px-3 py-2 text-sm"
                  rows={3}
                />
                <button className="rounded-full bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground sm:w-fit">
                  Submit Review
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-14">
          <h2 className="font-display text-2xl font-bold text-primary">Related Products</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
