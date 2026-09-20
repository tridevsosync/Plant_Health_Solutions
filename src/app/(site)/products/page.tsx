"use client";

import * as React from "react";
import { Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Grid3X3, List, Search, SlidersHorizontal, X, ArrowRight, Eye, Check, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { ProductCard, Stars } from "@/components/site/ProductCard";
import { Pagination } from "@/components/site/Pagination";
import { PageHero } from "@/components/site/Section";
import type { Product } from "@/lib/data";
import { inr, useApp } from "@/lib/store";

const normalize = (str: string) => str.toLowerCase().trim().replace(/[^a-z0-9]/g, "");

function CatalogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { state, addToCart } = useApp();

  const queryQ = searchParams?.get("q") ?? "";
  const queryCat = searchParams?.get("category") ?? "";
  const queryPage = parseInt(searchParams?.get("page") ?? "1", 10) || 1;

  const [q, setQ] = React.useState(queryQ);
  const [category, setCategory] = React.useState(queryCat);
  const [maxPrice, setMaxPrice] = React.useState(5000);
  const [inStock, setInStock] = React.useState(false);
  const [sort, setSort] = React.useState("popular");
  const [view, setView] = React.useState<"grid" | "list">("grid");
  const [quick, setQuick] = React.useState<Product | null>(null);
  const [mobileFilterOpen, setMobileFilterOpen] = React.useState(false);
  const [page, setPage] = React.useState(queryPage);
  const [pageSize, setPageSize] = React.useState(9);

  React.useEffect(() => {
    setQ(queryQ);
    setCategory(queryCat);
    setPage(queryPage);
  }, [queryQ, queryCat, queryPage]);

  const list = React.useMemo(() => {
    let out = state.products.filter((p) => {
      const matchQ =
        !q ||
        p.name.toLowerCase().includes(q.toLowerCase()) ||
        p.description.toLowerCase().includes(q.toLowerCase()) ||
        p.category.toLowerCase().includes(q.toLowerCase()) ||
        (p.ingredients && p.ingredients.toLowerCase().includes(q.toLowerCase()));

      const normCat = normalize(category);
      const normPCat = normalize(p.category);
      const matchCat =
        !category ||
        category === "All" ||
        p.category.toLowerCase() === category.toLowerCase() ||
        normPCat === normCat ||
        normPCat.includes(normCat) ||
        normCat.includes(normPCat);

      const matchPrice = maxPrice >= 5000 ? true : p.price <= maxPrice;
      const matchStock = !inStock || p.stock > 0;

      return matchQ && matchCat && matchPrice && matchStock;
    });

    out = [...out].sort((a, b) => {
      if (sort === "low") return a.price - b.price;
      if (sort === "high") return b.price - a.price;
      if (sort === "rating") return b.rating - a.rating;
      return b.reviews - a.reviews;
    });

    return out;
  }, [state.products, q, category, maxPrice, inStock, sort]);

  const totalPages = Math.max(1, Math.ceil(list.length / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, list.length);
  const paginatedList = list.slice(startIndex, endIndex);

  const applyCategory = (catName: string) => {
    setCategory(catName);
    setPage(1);
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (catName) params.set("category", catName);
    const qs = params.toString();
    router.push(`/products${qs ? `?${qs}` : ""}`);
  };

  const handleSearch = (val: string) => {
    setQ(val);
    setPage(1);
    const params = new URLSearchParams();
    if (val) params.set("q", val);
    if (category) params.set("category", category);
    const qs = params.toString();
    router.push(`/products${qs ? `?${qs}` : ""}`);
  };

  const handlePageChange = (newPage: number) => {
    const target = Math.min(Math.max(1, newPage), totalPages);
    setPage(target);
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (category) params.set("category", category);
    if (target > 1) params.set("page", String(target));
    const qs = params.toString();
    router.push(`/products${qs ? `?${qs}` : ""}`, { scroll: false });

    // Smooth scroll to catalog products header
    const el = document.getElementById("catalog-products-container");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPage(1);
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (category) params.set("category", category);
    const qs = params.toString();
    router.push(`/products${qs ? `?${qs}` : ""}`, { scroll: false });
  };

  return (
    <div>
      <PageHero
        title="Products Catalogue"
        subtitle="Explore our comprehensive agricultural portfolio: Bio Fertilizers, Organic Manures, Water Soluble Fertilizers, Micronutrients, Biostimulants and Crop Protection."
        image="https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=1920&q=70"
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-6">
          <button
            type="button"
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="flex w-full items-center justify-between rounded-2xl border border-border bg-card p-4 text-sm font-bold text-foreground shadow-xs"
          >
            <span className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-primary" /> Filter &amp; Search Products
              {(category || q || inStock || maxPrice < 5000) && (
                <span className="h-2 w-2 rounded-full bg-primary" />
              )}
            </span>
            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${mobileFilterOpen ? "rotate-180" : ""}`} />
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* Left Sidebar Filter */}
          <aside className={`h-fit rounded-2xl border border-border bg-card p-5 shadow-xs space-y-6 ${mobileFilterOpen ? "block mb-6 lg:mb-0" : "hidden"} lg:block`}>
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="flex items-center gap-2 font-display text-lg font-bold text-foreground">
                <SlidersHorizontal className="h-4 w-4 text-primary" /> Filter Products
              </h3>
              {(category || q || inStock || maxPrice < 5000) && (
                <button
                  onClick={() => {
                    setQ("");
                    setCategory("");
                    setMaxPrice(5000);
                    setInStock(false);
                    router.push("/products");
                  }}
                  className="text-xs font-bold text-destructive hover:underline"
                >
                  Clear All
                </button>
              )}
            </div>

          {/* Search box */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">
              Search by Keyword
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Crop, pest, formula…"
                className="w-full rounded-xl border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          {/* Categories list */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Categories
              </span>
              <span className="text-xs font-medium text-muted-foreground">
                {state.categories.length} Total
              </span>
            </div>
            <div className="space-y-1 max-h-[340px] overflow-y-auto pr-1">
              <button
                onClick={() => applyCategory("")}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-semibold transition-all ${
                  !category
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                <span>All Categories</span>
                <span className={`text-xs ${!category ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                  {state.products.length}
                </span>
              </button>

              {state.categories.map((c) => {
                const count = state.products.filter(
                  (p) => normalize(p.category) === normalize(c.name)
                ).length;
                const isSelected =
                  category.toLowerCase() === c.name.toLowerCase() ||
                  normalize(category) === normalize(c.name);

                return (
                  <button
                    key={c.id || c.name}
                    onClick={() => applyCategory(c.name)}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-semibold transition-all ${
                      isSelected
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    <span className="truncate pr-2">{c.name}</span>
                    <span className={`text-xs shrink-0 ${isSelected ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="border-t border-border pt-4">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <span>Price Range</span>
              <span className="font-bold text-primary">{maxPrice >= 5000 ? "Any Price" : `Up to ${inr(maxPrice)}`}</span>
            </div>
            <input
              type="range"
              min={300}
              max={5000}
              step={100}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="mt-2.5 w-full accent-primary cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-muted-foreground mt-1">
              <span>₹300</span>
              <span>₹5,000+</span>
            </div>
          </div>

          {/* Stock filter */}
          <div className="border-t border-border pt-4">
            <label className="flex items-center gap-2 text-sm font-semibold text-foreground cursor-pointer select-none">
              <input
                type="checkbox"
                checked={inStock}
                onChange={(e) => setInStock(e.target.checked)}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
              />
              In Stock Only ({state.products.filter((p) => p.stock > 0).length})
            </label>
          </div>
        </aside>

        {/* Right Content */}
        <div id="catalog-products-container" className="scroll-mt-6">
          {/* Top Filter & Sort Bar */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card px-5 py-3.5 shadow-sm">
            <div>
              <p className="text-sm text-muted-foreground">
                {list.length === 0 ? (
                  "No products found"
                ) : (
                  <>
                    Showing <strong className="text-foreground">{startIndex + 1}</strong>–
                    <strong className="text-foreground">{endIndex}</strong> of{" "}
                    <strong className="text-foreground">{list.length}</strong> products
                    {category ? (
                      <>
                        {" "}in <span className="font-bold text-primary">&ldquo;{category}&rdquo;</span>
                      </>
                    ) : null}
                  </>
                )}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden sm:inline">Sort:</span>
                <select
                  value={sort}
                  onChange={(e) => {
                    setSort(e.target.value);
                    setPage(1);
                  }}
                  className="rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-semibold outline-none focus:border-primary"
                >
                  <option value="popular">Most Popular</option>
                  <option value="low">Price: Low to High</option>
                  <option value="high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>

              <div className="flex overflow-hidden rounded-xl border border-border bg-background p-0.5">
                <button
                  onClick={() => setView("grid")}
                  aria-label="Grid view"
                  className={`rounded-lg p-1.5 transition-colors ${
                    view === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setView("list")}
                  aria-label="List view"
                  className={`rounded-lg p-1.5 transition-colors ${
                    view === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Active filter badges */}
          {(category || q) && (
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted-foreground">Active Filters:</span>
              {category && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                  Category: {category}
                  <button onClick={() => applyCategory("")} className="hover:text-destructive">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {q && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/10 px-3 py-1 text-xs font-bold text-secondary">
                  Search: {q}
                  <button onClick={() => handleSearch("")} className="hover:text-destructive">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
            </div>
          )}

          {/* Products List */}
          {list.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border bg-card p-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground mb-4">
                <Search className="h-8 w-8" />
              </div>
              <h3 className="font-display text-lg font-bold text-foreground">No matching products found</h3>
              <p className="mt-1 text-sm text-muted-foreground max-w-md mx-auto">
                We couldn&apos;t find any products matching your current category or search criteria.
              </p>
              <button
                onClick={() => {
                  setQ("");
                  setCategory("");
                  setMaxPrice(5000);
                  setInStock(false);
                  setPage(1);
                  router.push("/products");
                }}
                className="mt-5 rounded-full bg-primary px-6 py-2.5 text-xs font-bold text-primary-foreground shadow hover:opacity-90 transition-all"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <>
              <div className={view === "grid" ? "grid gap-5 sm:grid-cols-2 xl:grid-cols-3" : "flex flex-col gap-5"}>
                {paginatedList.map((p) => (
                  <ProductCard key={p.id} product={p} view={view} onQuickView={setQuick} />
                ))}
              </div>

              {/* Pagination controls */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={list.length}
                pageSize={pageSize}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                pageSizeOptions={[6, 9, 12, 18, 24]}
              />
            </>
          )}
        </div>
      </div>
    </div>

      {/* Quick View Modal */}
      {quick && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
          onClick={() => setQuick(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-3xl overflow-auto rounded-3xl bg-card border border-border shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid gap-6 p-6 md:grid-cols-2">
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted border border-border">
                <img src={quick.image} alt={quick.name} className="h-full w-full object-cover" />
              </div>
              <div className="flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between">
                    <span className="rounded-md bg-secondary/10 px-2.5 py-0.5 text-xs font-bold text-secondary">
                      {quick.category}
                    </span>
                    <button
                      onClick={() => setQuick(null)}
                      className="rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <h3 className="mt-2 font-display text-2xl font-bold text-primary">{quick.name}</h3>
                  <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                    <Stars rating={quick.rating} />
                    <span className="font-semibold text-foreground">{quick.rating}</span>
                    <span>({quick.reviews} farmer reviews)</span>
                  </div>

                  <p className="mt-3 text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                    {quick.description}
                  </p>

                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="font-display text-2xl font-extrabold text-primary">
                      {inr(quick.price)}
                    </span>
                    {quick.oldPrice > quick.price && (
                      <span className="text-sm font-normal text-muted-foreground line-through">
                        {inr(quick.oldPrice)}
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground ml-auto">Pack size: {quick.unit}</span>
                  </div>

                  <div className="mt-2">
                    <span
                      className={`text-xs font-semibold ${
                        quick.stock > 0 ? "text-emerald-600" : "text-destructive"
                      }`}
                    >
                      {quick.stock > 0 ? `✓ In Stock (${quick.stock} units available)` : "✕ Out of Stock"}
                    </span>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-2 pt-4 border-t border-border">
                  <button
                    disabled={quick.stock === 0}
                    onClick={() => {
                      addToCart(quick.id);
                      toast.success(`${quick.name} added to cart`);
                      setQuick(null);
                    }}
                    className="w-full rounded-full bg-primary py-3 text-sm font-bold text-primary-foreground shadow hover:opacity-90 disabled:opacity-50 transition-all"
                  >
                    Add to Cart
                  </button>
                  <Link
                    href={`/products/${quick.id}`}
                    onClick={() => setQuick(null)}
                    className="inline-flex items-center justify-center gap-1.5 w-full rounded-full border border-border py-2.5 text-xs font-bold text-foreground hover:bg-muted transition-colors"
                  >
                    View Full Product Details <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
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
    <Suspense fallback={<div className="flex min-h-[400px] items-center justify-center">Loading catalogue…</div>}>
      <CatalogContent />
    </Suspense>
  );
}
