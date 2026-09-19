"use client";

import * as React from "react";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Grid3X3, List, Search, SlidersHorizontal, X } from "lucide-react";
import { toast } from "sonner";
import { ProductCard, Stars } from "@/components/site/ProductCard";
import { PageHero } from "@/components/site/Section";
import type { Product } from "@/lib/data";
import { inr, useApp } from "@/lib/store";

function CatalogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { state, addToCart } = useApp();

  const queryQ = searchParams?.get("q") ?? "";
  const queryCat = searchParams?.get("category") ?? "";

  const [q, setQ] = React.useState(queryQ);
  const [category, setCategory] = React.useState(queryCat);
  const [maxPrice, setMaxPrice] = React.useState(2000);
  const [inStock, setInStock] = React.useState(false);
  const [sort, setSort] = React.useState("popular");
  const [view, setView] = React.useState<"grid" | "list">("grid");
  const [quick, setQuick] = React.useState<Product | null>(null);

  React.useEffect(() => {
    setQ(queryQ);
    setCategory(queryCat);
  }, [queryQ, queryCat]);

  const list = React.useMemo(() => {
    let out = state.products.filter(
      (p) =>
        (!q || p.name.toLowerCase().includes(q.toLowerCase()) || p.description.toLowerCase().includes(q.toLowerCase())) &&
        (!category || p.category === category) &&
        p.price <= maxPrice &&
        (!inStock || p.stock > 0),
    );
    out = [...out].sort((a, b) => {
      if (sort === "low") return a.price - b.price;
      if (sort === "high") return b.price - a.price;
      if (sort === "rating") return b.rating - a.rating;
      return b.reviews - a.reviews;
    });
    return out;
  }, [state.products, q, category, maxPrice, inStock, sort]);

  const apply = (cat: string) => {
    setCategory(cat);
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (cat) params.set("category", cat);
    const qs = params.toString();
    router.push(`/products${qs ? `?${qs}` : ""}`);
  };

  return (
    <div>
      <PageHero
        title="Product Catalog"
        subtitle="Bio fertilizers, organic manures, micronutrients, soluble fertilizers, biostimulants and crop protection."
        image="https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=1920&q=70"
      />

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 lg:grid-cols-[260px_1fr]">
        <aside className="h-fit rounded-xl border border-border bg-card p-5 shadow-sm">
          <h3 className="flex items-center gap-2 font-display text-lg font-semibold">
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </h3>

          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search products"
              className="w-full rounded-full border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:border-secondary"
            />
          </div>

          <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Categories</p>
          <div className="mt-2 space-y-1">
            <button
              onClick={() => apply("")}
              className={`block w-full rounded-lg px-3 py-1.5 text-left text-sm ${!category ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
            >
              All Products ({state.products.length})
            </button>
            {state.categories.map((c) => (
              <button
                key={c.id}
                onClick={() => apply(c.name)}
                className={`block w-full rounded-lg px-3 py-1.5 text-left text-sm ${category === c.name ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
              >
                {c.name} ({state.products.filter((p) => p.category === c.name).length})
              </button>
            ))}
          </div>

          <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Max price: {inr(maxPrice)}
          </p>
          <input
            type="range"
            min={300}
            max={2000}
            step={50}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="mt-2 w-full accent-[#4f8a3c]"
          />

          <label className="mt-5 flex items-center gap-2 text-sm">
            <input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} className="accent-[#4f8a3c]" />
            In stock only
          </label>

          <button
            onClick={() => {
              setQ("");
              setMaxPrice(2000);
              setInStock(false);
              apply("");
            }}
            className="mt-5 w-full rounded-full border border-border py-2 text-sm font-medium hover:bg-muted"
          >
            Reset filters
          </button>
        </aside>

        <div>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3 shadow-sm">
            <p className="text-sm text-muted-foreground">
              Showing <strong className="text-foreground">{list.length}</strong> products
              {category ? ` in ${category}` : ""}
            </p>
            <div className="flex items-center gap-3">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="rounded-full border border-border bg-background px-3 py-1.5 text-sm outline-none"
              >
                <option value="popular">Most Popular</option>
                <option value="low">Price: Low to High</option>
                <option value="high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
              <div className="flex overflow-hidden rounded-full border border-border">
                <button onClick={() => setView("grid")} className={`p-2 ${view === "grid" ? "bg-primary text-primary-foreground" : ""}`}>
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button onClick={() => setView("list")} className={`p-2 ${view === "list" ? "bg-primary text-primary-foreground" : ""}`}>
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {list.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-card p-16 text-center text-muted-foreground">
              No products match your filters.
            </div>
          ) : (
            <div className={view === "grid" ? "grid gap-5 sm:grid-cols-2 xl:grid-cols-3" : "flex flex-col gap-5"}>
              {list.map((p) => (
                <ProductCard key={p.id} product={p} view={view} onQuickView={setQuick} />
              ))}
            </div>
          )}
        </div>
      </div>

      {quick && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4" onClick={() => setQuick(null)}>
          <div className="max-h-[90vh] w-full max-w-3xl overflow-auto rounded-2xl bg-card" onClick={(e) => e.stopPropagation()}>
            <div className="grid gap-6 p-6 md:grid-cols-2">
              <img src={quick.image} alt={quick.name} className="h-64 w-full rounded-xl object-cover" />
              <div>
                <div className="flex items-start justify-between">
                  <span className="text-xs font-semibold uppercase text-secondary">{quick.category}</span>
                  <button onClick={() => setQuick(null)}>
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <h3 className="mt-1 font-display text-2xl font-bold text-primary">{quick.name}</h3>
                <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                  <Stars rating={quick.rating} /> {quick.rating} ({quick.reviews} reviews)
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{quick.description}</p>
                <p className="mt-4 font-display text-2xl font-bold text-primary">
                  {inr(quick.price)} <span className="text-base font-normal text-muted-foreground line-through">{inr(quick.oldPrice)}</span>
                </p>
                <button
                  onClick={() => {
                    addToCart(quick.id);
                    toast.success(`${quick.name} added to cart`);
                    setQuick(null);
                  }}
                  className="mt-5 w-full rounded-full bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-secondary"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[400px] items-center justify-center">Loading catalog…</div>}>
      <CatalogContent />
    </Suspense>
  );
}
