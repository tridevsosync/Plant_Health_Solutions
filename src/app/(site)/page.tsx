"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  FlaskConical,
  Heart,
  Leaf,
  Phone,
  Quote,
  ShieldCheck,
  Sprout,
  Star,
  Tractor,
} from "lucide-react";
import { toast } from "sonner";
import { COMPANY } from "@/lib/data";
import { inr, useApp } from "@/lib/store";

export default function HomePage() {
  const { state, addToCart, toggleWishlist } = useApp();
  const [selectedCat, setSelectedCat] = React.useState("All");

  // Top rated / featured products based on selected tab
  const filteredProducts = React.useMemo(() => {
    if (selectedCat === "All") {
      return state.products.slice(0, 8);
    }
    return state.products
      .filter((p) => p.category.toLowerCase() === selectedCat.toLowerCase())
      .slice(0, 8);
  }, [state.products, selectedCat]);

  return (
    <div>
      {/* 1. Hero Section */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img
            alt="Agricultural field"
            loading="lazy"
            className="h-full w-full object-cover"
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1920&q=80"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#122b17]/95 via-[#183a1f]/90 to-[#285724]/80 opacity-90" />
        </div>

        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 md:py-36 lg:px-8">
          <div className="max-w-3xl text-white">
            <span className="inline-flex items-center gap-2 rounded-full bg-accent/20 px-3.5 py-1.5 text-xs font-medium uppercase tracking-wider text-accent ring-1 ring-accent/30 backdrop-blur-xs">
              <Sprout className="h-3.5 w-3.5" /> Trusted by 50,000+ Indian farmers
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] sm:text-5xl md:text-6xl lg:text-7xl">
              Innovative Agricultural Solutions for{" "}
              <span className="text-[#a8d672]">Sustainable Farming</span>
            </h1>
            <p className="mt-6 max-w-xl text-base sm:text-lg text-white/85 leading-relaxed">
              Research-grade seeds, fertilizers, bio-chemicals and crop protection — developed at our
              Vijayapura center, field-validated across 12+ states.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-8 py-3.5 text-sm font-semibold text-accent-foreground shadow-md transition-all hover:bg-accent/90"
              >
                Explore Products <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur-xs transition-all hover:bg-white/20"
              >
                <Phone className="h-4 w-4" /> Contact Us
              </Link>
            </div>

            <div className="mt-12 grid max-w-xl grid-cols-3 gap-6 border-t border-white/15 pt-8 text-white">
              <div>
                <div className="font-display text-3xl font-bold text-[#a8d672] sm:text-4xl">50K+</div>
                <div className="mt-1 text-xs uppercase tracking-wider text-white/70">Farmers</div>
              </div>
              <div>
                <div className="font-display text-3xl font-bold text-[#a8d672] sm:text-4xl">12+</div>
                <div className="mt-1 text-xs uppercase tracking-wider text-white/70">States</div>
              </div>
              <div>
                <div className="font-display text-3xl font-bold text-[#a8d672] sm:text-4xl">30+</div>
                <div className="mt-1 text-xs uppercase tracking-wider text-white/70">Products</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Our Company Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <div className="mb-10 flex flex-col items-start gap-3 md:mb-14">
          <span className="rounded-full bg-accent px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
            Our Company
          </span>
          <h2 className="max-w-3xl font-display text-3xl font-bold leading-tight text-primary md:text-4xl">
            Plant Health Solutions — engineered for the Indian farm
          </h2>
        </div>

        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              From our Horticulture Research &amp; Extension Center in Vijayapura, Karnataka, we
              manufacture and distribute agricultural inputs that work with the realities of the
              Indian smallholder.
            </p>
            <p>
              Our agronomy team formulates every product against local agro-climatic conditions and
              validates it across multi-location field trials before release.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-3">
              <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-3.5 shadow-xs">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-accent text-accent-foreground">
                  <FlaskConical className="h-5 w-5" />
                </span>
                <span className="text-sm font-semibold text-foreground">Research Driven</span>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-3.5 shadow-xs">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-accent text-accent-foreground">
                  <Award className="h-5 w-5" />
                </span>
                <span className="text-sm font-semibold text-foreground">Certified Quality</span>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-3.5 shadow-xs">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-accent text-accent-foreground">
                  <Tractor className="h-5 w-5" />
                </span>
                <span className="text-sm font-semibold text-foreground">Farmer Focused</span>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-3.5 shadow-xs">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-accent text-accent-foreground">
                  <Leaf className="h-5 w-5" />
                </span>
                <span className="text-sm font-semibold text-foreground">Sustainable</span>
              </div>
            </div>
          </div>

          <div className="relative aspect-[5/4] overflow-hidden rounded-2xl border border-border shadow-md">
            <img
              alt="Field research"
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
              src="https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=1200&q=80"
            />
          </div>
        </div>
      </section>

      {/* 3. Browse Product Categories Section */}
      <div className="bg-muted/40 border-y border-border/60">
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4 md:mb-14">
            <div>
              <span className="rounded-full bg-accent px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                Product Categories
              </span>
              <h2 className="mt-3 font-display text-3xl font-bold leading-tight text-primary md:text-4xl">
                Browse our research-backed range
              </h2>
              <p className="mt-1 max-w-2xl text-base text-muted-foreground">
                Bio fertilizers, organic manures, water soluble nutrients, and crop protection formulations.
              </p>
            </div>
            <Link
              href="/categories"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-secondary hover:text-primary transition-colors underline"
            >
              All Categories ({state.categories.length}) <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-4">
            {state.categories.slice(0, 8).map((c) => {
              const count = state.products.filter((p) => p.category.toLowerCase() === c.name.toLowerCase()).length;
              return (
                <Link
                  key={c.id || c.name}
                  href={`/products?category=${encodeURIComponent(c.name)}`}
                  className="group overflow-hidden rounded-2xl border border-border bg-card shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="relative aspect-video overflow-hidden bg-muted">
                    <img
                      alt={c.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      src={c.image || "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=800&q=80"}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <span className="absolute bottom-2 left-3 rounded-full bg-black/40 px-2.5 py-0.5 text-[11px] font-medium text-white backdrop-blur-xs">
                      {count} Products
                    </span>
                  </div>
                  <div className="p-4">
                    <div className="font-display font-bold text-foreground group-hover:text-primary transition-colors text-base">
                      {c.name}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-1">{c.description}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </div>

      {/* 4. Featured Products Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <div className="mb-8 flex flex-col items-start gap-3 md:mb-10">
          <span className="rounded-full bg-accent px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
            Catalogue Showcase
          </span>
          <h2 className="max-w-3xl font-display text-3xl font-bold leading-tight text-primary md:text-4xl">
            Top-rated products this farming season
          </h2>
          <p className="max-w-2xl text-sm sm:text-base text-muted-foreground">
            Tested in soil science laboratories, proven on field acreage across Karnataka, Maharashtra &amp; nationwide.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="mb-8 flex flex-wrap gap-2 border-b border-border/80 pb-4">
          <button
            onClick={() => setSelectedCat("All")}
            className={`rounded-full px-5 py-2 text-xs sm:text-sm font-bold transition-all ${
              selectedCat === "All"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "border border-border bg-card text-foreground hover:bg-muted"
            }`}
          >
            All Products ({state.products.length})
          </button>
          {state.categories.slice(0, 6).map((cat) => {
            const active = selectedCat.toLowerCase() === cat.name.toLowerCase();
            return (
              <button
                key={cat.id || cat.name}
                onClick={() => setSelectedCat(cat.name)}
                className={`rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition-all ${
                  active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "border border-border bg-card text-foreground hover:bg-muted"
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="rounded-3xl border border-border bg-card p-12 text-center">
            <p className="text-base font-bold text-foreground">No products found in this category.</p>
            <Link
              href="/products"
              className="mt-3 inline-block rounded-full bg-primary px-6 py-2 text-xs font-bold text-primary-foreground"
            >
              Browse Full Catalogue
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
            {filteredProducts.map((product) => {
              const isWishlisted = state.wishlist.includes(product.id);
              const off =
                product.oldPrice > product.price
                  ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
                  : 0;

              return (
                <div
                  key={product.id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                >
                  {/* Product Image & Badges */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    <Link href={`/products/${product.id}`} className="block h-full w-full">
                      <img
                        alt={product.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        src={product.image}
                      />
                    </Link>

                    <span className="absolute left-3 top-3 inline-flex items-center rounded-md bg-accent px-2.5 py-0.5 text-xs font-semibold text-accent-foreground shadow-xs">
                      {product.category}
                    </span>

                    {off > 0 && (
                      <span className="absolute left-3 bottom-3 inline-flex items-center rounded-md bg-destructive px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
                        {off}% OFF
                      </span>
                    )}

                    <button
                      onClick={() => toggleWishlist(product.id)}
                      aria-label="Toggle wishlist"
                      className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-background/90 text-foreground/70 backdrop-blur-xs transition-colors hover:text-destructive hover:bg-background shadow-xs"
                    >
                      <Heart
                        className={`h-4 w-4 ${isWishlisted ? "fill-destructive text-destructive" : ""}`}
                      />
                    </button>
                  </div>

                  {/* Product Info */}
                  <div className="flex flex-1 flex-col p-4">
                    <Link
                      href={`/products/${product.id}`}
                      className="line-clamp-2 font-display text-base font-semibold text-foreground hover:text-secondary transition-colors"
                    >
                      {product.name}
                    </Link>

                    <div className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Star className="h-3.5 w-3.5 fill-secondary text-secondary" />
                      <span className="font-semibold text-foreground">{product.rating}</span>
                      <span>({product.reviews} reviews)</span>
                      <span className="ml-auto font-mono text-[11px] text-muted-foreground">{product.unit}</span>
                    </div>

                    <div className="mt-3 flex items-baseline gap-2">
                      <span className="font-display text-lg font-bold text-primary">
                        {inr(product.price)}
                      </span>
                      {product.oldPrice > product.price && (
                        <span className="text-xs text-muted-foreground line-through">
                          {inr(product.oldPrice)}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        addToCart(product.id);
                        toast.success(`${product.name} added to cart`);
                      }}
                      className="mt-4 w-full rounded-xl bg-secondary py-2.5 text-xs sm:text-sm font-bold text-secondary-foreground shadow-xs transition hover:bg-secondary/90 active:scale-[0.98]"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-8 py-3 text-sm font-semibold text-foreground shadow-xs transition hover:bg-muted"
          >
            View all {state.products.length} products <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* 5. Why Choose Us Section */}
      <div className="bg-[#18361e] text-white">
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
          <div className="mb-10 flex flex-col items-start gap-3 md:mb-14">
            <span className="rounded-full bg-accent px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
              Why Choose Us
            </span>
            <h2 className="max-w-3xl font-display text-3xl font-bold leading-tight text-white md:text-4xl">
              A partner, not just a supplier
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur-xs">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-accent text-accent-foreground">
                <FlaskConical className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-display text-lg font-bold">Research Driven</h3>
              <p className="mt-2 text-sm text-white/75 leading-relaxed">
                In-house R&amp;D and multi-location trials before any product release.
              </p>
            </div>

            <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur-xs">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-accent text-accent-foreground">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-display text-lg font-bold">High Quality</h3>
              <p className="mt-2 text-sm text-white/75 leading-relaxed">
                CIB&amp;RC registered, ISO-certified manufacturing standards.
              </p>
            </div>

            <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur-xs">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-accent text-accent-foreground">
                <Tractor className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-display text-lg font-bold">Farmer Focused</h3>
              <p className="mt-2 text-sm text-white/75 leading-relaxed">
                On-call agronomy support and free soil testing.
              </p>
            </div>

            <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur-xs">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-accent text-accent-foreground">
                <Sprout className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-display text-lg font-bold">Innovation Based</h3>
              <p className="mt-2 text-sm text-white/75 leading-relaxed">
                Bio-chemicals and growth promoters that reduce chemical load.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* 6. Research & Innovation (The Vijayapura Research Center) */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <div className="mb-10 flex flex-col items-start gap-3 md:mb-14">
          <span className="rounded-full bg-accent px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
            Research &amp; Innovation
          </span>
          <h2 className="max-w-3xl font-display text-3xl font-bold leading-tight text-primary md:text-4xl">
            The Vijayapura Research Center
          </h2>
          <p className="max-w-2xl text-base text-muted-foreground">
            Where every product begins — soil chambers, growth labs, and 40 acres of trial plots.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div className="aspect-[5/4] overflow-hidden rounded-2xl border border-border shadow-md">
            <img
              alt="Research lab"
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
              src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=80"
            />
          </div>

          <div className="space-y-4 leading-relaxed">
            <p className="text-muted-foreground">
              Our Horticulture Research &amp; Extension Center on NH-52 houses formulation labs, a
              tissue-culture facility, and demonstration plots for cotton, sugarcane, grapes and
              vegetables.
            </p>
            <ul className="space-y-3 text-sm text-foreground">
              <li className="flex items-center gap-2.5">
                <span className="h-2 w-2 rounded-full bg-secondary" />
                Soil &amp; water testing laboratory
              </li>
              <li className="flex items-center gap-2.5">
                <span className="h-2 w-2 rounded-full bg-secondary" />
                Tissue-culture &amp; micropropagation unit
              </li>
              <li className="flex items-center gap-2.5">
                <span className="h-2 w-2 rounded-full bg-secondary" />
                Bio-pesticide fermentation chambers
              </li>
              <li className="flex items-center gap-2.5">
                <span className="h-2 w-2 rounded-full bg-secondary" />
                40 acres of multi-crop trial plots
              </li>
            </ul>

            <div className="pt-2">
              <Link
                href="/about"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-6 py-2.5 text-sm font-semibold text-primary transition hover:bg-muted"
              >
                Learn more about us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Testimonials Section */}
      <div className="bg-accent/25 border-y border-border/60">
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
          <div className="mb-10 flex flex-col items-start gap-3 md:mb-14">
            <span className="rounded-full bg-accent px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
              Testimonials
            </span>
            <h2 className="max-w-3xl font-display text-3xl font-bold leading-tight text-primary md:text-4xl">
              From farmers who trust us
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {/* Testimonial 1 */}
            <div className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-xs">
              <Quote className="h-7 w-7 text-secondary" />
              <p className="mt-3 flex-1 text-sm text-foreground leading-relaxed">
                &ldquo;BioShield Trichoderma saved my crop from wilt. My yield increased by 35% this
                season.&rdquo;
              </p>
              <div className="mt-5 flex items-center gap-3 border-t border-border/60 pt-4">
                <img
                  alt="Ramesh Patil"
                  loading="lazy"
                  className="h-11 w-11 rounded-full object-cover"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
                />
                <div>
                  <div className="text-sm font-bold text-foreground">Ramesh Patil</div>
                  <div className="text-xs text-muted-foreground">
                    Vijayapura, Karnataka · Cotton
                  </div>
                </div>
                <div className="ml-auto flex text-secondary">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-xs">
              <Quote className="h-7 w-7 text-secondary" />
              <p className="mt-3 flex-1 text-sm text-foreground leading-relaxed">
                &ldquo;The Sugarcane Setts gave exceptional tillering. I have been farming for 25
                years and this is the best variety I have grown.&rdquo;
              </p>
              <div className="mt-5 flex items-center gap-3 border-t border-border/60 pt-4">
                <img
                  alt="Sunita Deshmukh"
                  loading="lazy"
                  className="h-11 w-11 rounded-full object-cover"
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80"
                />
                <div>
                  <div className="text-sm font-bold text-foreground">Sunita Deshmukh</div>
                  <div className="text-xs text-muted-foreground">
                    Solapur, Maharashtra · Sugarcane
                  </div>
                </div>
                <div className="ml-auto flex text-secondary">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-xs">
              <Quote className="h-7 w-7 text-secondary" />
              <p className="mt-3 flex-1 text-sm text-foreground leading-relaxed">
                &ldquo;Their micronutrient mix corrected my chlorosis issue within two sprays.
                Excellent product support also.&rdquo;
              </p>
              <div className="mt-5 flex items-center gap-3 border-t border-border/60 pt-4">
                <img
                  alt="Vikram Hegde"
                  loading="lazy"
                  className="h-11 w-11 rounded-full object-cover"
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80"
                />
                <div>
                  <div className="text-sm font-bold text-foreground">Vikram Hegde</div>
                  <div className="text-xs text-muted-foreground">
                    Belgaum, Karnataka · Pomegranate
                  </div>
                </div>
                <div className="ml-auto flex text-secondary">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* 8. Latest Insights (From our agronomy desk) */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <div className="mb-10 flex flex-col items-start gap-3 md:mb-14">
          <span className="rounded-full bg-accent px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
            Latest Insights
          </span>
          <h2 className="max-w-3xl font-display text-3xl font-bold leading-tight text-primary md:text-4xl">
            From our agronomy desk
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {state.blogs.slice(0, 3).map((blog) => (
            <Link
              key={blog.id}
              href={`/blog/${blog.id}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="aspect-[16/10] overflow-hidden bg-muted">
                <img
                  alt={blog.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  src={blog.image}
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <span className="text-xs font-semibold uppercase tracking-wider text-secondary">
                  {blog.category}
                </span>
                <h3 className="mt-2 line-clamp-2 font-display text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                  {blog.title}
                </h3>
                <div className="mt-auto pt-4 text-xs text-muted-foreground">
                  {blog.author} · {blog.date}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 9. Bottom CTA: Need agronomy advice? */}
      <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-[#17381e] via-[#234f2e] to-[#3a752b] p-8 sm:p-12 md:p-16 text-white shadow-lg">
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h2 className="font-display text-3xl font-bold md:text-4xl">
                Need agronomy advice? Talk to our team.
              </h2>
              <p className="mt-3 max-w-2xl text-base text-white/85">
                Call, WhatsApp or email — we&apos;ll connect you with a field agronomist in your
                region.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href={`tel:${(state.settings.phone || COMPANY.phone).replace(/[^0-9+]/g, "")}`}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-8 py-3.5 text-sm font-semibold text-accent-foreground shadow-sm transition hover:bg-accent/90"
              >
                <Phone className="h-4 w-4" /> Call Now
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-transparent px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Contact Form
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
