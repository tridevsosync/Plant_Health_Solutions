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
  MessageSquareQuote,
  Plus,
  Loader2,
  Sparkles,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { COMPANY } from "@/lib/data";
import { inr, useApp, useUser } from "@/lib/store";

export default function HomePage() {
  const { state, addToCart, toggleWishlist, submitTestimonialFeedback } = useApp();
  const user = useUser();
  const [selectedCat, setSelectedCat] = React.useState("All");
  const [showFeedbackModal, setShowFeedbackModal] = React.useState(false);
  const [submittingFeedback, setSubmittingFeedback] = React.useState(false);
  const [feedbackForm, setFeedbackForm] = React.useState({
    name: "",
    place: "Vijayapura, Karnataka",
    crop: "Sugarcane",
    rating: 5,
    productId: "",
    quote: "",
  });

  React.useEffect(() => {
    if (user?.name && !feedbackForm.name) {
      setFeedbackForm((f) => ({ ...f, name: user.name }));
    }
  }, [user, feedbackForm.name]);

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in first to share your farm story.");
      return;
    }
    if (!feedbackForm.name.trim() || !feedbackForm.quote.trim()) {
      toast.error("Please enter your name and feedback message.");
      return;
    }

    const selProd = state.products.find((p) => p.id === feedbackForm.productId);

    setSubmittingFeedback(true);
    const res = await submitTestimonialFeedback({
      name: feedbackForm.name.trim(),
      place: feedbackForm.place.trim(),
      crop: feedbackForm.crop.trim(),
      rating: Number(feedbackForm.rating),
      productId: feedbackForm.productId,
      productName: selProd?.name || "",
      quote: feedbackForm.quote.trim(),
      status: "Pending",
    });
    setSubmittingFeedback(false);

    if (res.success) {
      toast.success(
        res.message || "Thank you! Your feedback has been submitted for admin approval."
      );
      setShowFeedbackModal(false);
      setFeedbackForm({
        name: user?.name || "",
        place: "Vijayapura, Karnataka",
        crop: "Sugarcane",
        rating: 5,
        productId: "",
        quote: "",
      });
    } else {
      toast.error(res.error || "Failed to submit feedback");
    }
  };

  // Top rated / featured products based on selected tab
  const filteredProducts = React.useMemo(() => {
    if (selectedCat === "All") {
      return state.products.slice(0, 16);
    }
    return state.products
      .filter((p) => {
        const pCat = p.category.toLowerCase().trim();
        const sCat = selectedCat.toLowerCase().trim();
        return pCat === sCat || pCat.includes(sCat) || sCat.includes(pCat);
      })
      .slice(0, 16);
  }, [state.products, selectedCat]);

  const approvedTestimonials = React.useMemo(() => {
    const list = state.testimonials.filter((t) => t.status === "Approved" || !t.status);
    return list.length > 0 ? list : [];
  }, [state.testimonials]);

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

          {state.categories.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
              No categories listed yet.
            </div>
          ) : (
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
          )}
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
          <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 md:mb-14">
            <div>
              <span className="rounded-full bg-accent px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                Farmer Testimonials &amp; Verified Results
              </span>
              <h2 className="mt-2 max-w-3xl font-display text-3xl font-bold leading-tight text-primary md:text-4xl">
                From farmers who trust us across India
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                Real crop observations from farmers using certified Plant Health Solutions inputs.
              </p>
            </div>

            <button
              onClick={() => setShowFeedbackModal(true)}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-xs sm:text-sm font-bold text-primary-foreground shadow-md hover:bg-secondary transition-all active:scale-95 shrink-0"
            >
              <MessageSquareQuote className="h-4 w-4" /> Share Your Farm Story
            </button>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {approvedTestimonials.length === 0 ? (
              <div className="col-span-full rounded-2xl border border-dashed border-border bg-card/60 p-8 text-center text-muted-foreground">
                <MessageSquareQuote className="mx-auto h-10 w-10 text-muted-foreground/40 mb-2" />
                <p className="text-sm font-semibold text-foreground">No approved testimonials yet.</p>
                <p className="text-xs text-muted-foreground mt-0.5">Be the first farmer to submit feedback on our bio inputs!</p>
              </div>
            ) : (
              approvedTestimonials.map((t) => (
                <div key={t.id} className="flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-xs transition-all hover:shadow-md">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <Quote className="h-7 w-7 text-secondary" />
                      <div className="flex text-amber-500">
                        {[...Array(t.rating || 5)].map((_, i) => (
                          <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
                        ))}
                      </div>
                    </div>
                    {t.productName && (
                      <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary mb-2">
                        <Sparkles className="h-3 w-3" /> {t.productName}
                      </span>
                    )}
                    <p className="text-sm text-foreground leading-relaxed italic">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                  </div>

                  <div className="mt-5 flex items-center gap-3 border-t border-border/60 pt-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {t.name ? t.name.charAt(0).toUpperCase() : "F"}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-foreground">{t.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {t.place} · <span className="font-semibold text-secondary">{t.crop}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      {/* Public Feedback Submission Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
              <div>
                <h3 className="font-display text-xl font-bold text-foreground">Share Your Farm Feedback</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Your feedback helps fellow farmers and our agronomy research team.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowFeedbackModal(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-muted/40 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {!user ? (
              <div className="py-6 text-center space-y-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <ShieldCheck className="h-7 w-7" />
                </div>
                <h4 className="font-display text-lg font-bold text-foreground">
                  Sign In to Share Your Story
                </h4>
                <p className="mx-auto max-w-sm text-xs sm:text-sm text-muted-foreground">
                  Only registered and logged-in farmers can submit field results and product feedback.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <Link
                    href="/login?redirect=/"
                    onClick={() => setShowFeedbackModal(false)}
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-xs sm:text-sm font-bold text-primary-foreground shadow hover:opacity-95 transition-all"
                  >
                    Sign In to Submit Feedback &rarr;
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setShowFeedbackModal(false)}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-2.5 text-xs sm:text-sm font-semibold text-foreground hover:bg-muted transition-all"
                  >
                    Register New Account
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">
                    Farmer / Customer Name *
                  </label>
                  <input
                    required
                    value={feedbackForm.name}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, name: e.target.value })}
                    placeholder="e.g. Ramesh Patil"
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">
                      Village / District *
                    </label>
                    <input
                      required
                      value={feedbackForm.place}
                      onChange={(e) => setFeedbackForm({ ...feedbackForm, place: e.target.value })}
                      placeholder="Vijayapura, Karnataka"
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">
                      Crop Grown *
                    </label>
                    <input
                      required
                      value={feedbackForm.crop}
                      onChange={(e) => setFeedbackForm({ ...feedbackForm, crop: e.target.value })}
                      placeholder="Sugarcane / Cotton / Grapes"
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">
                      Rating (1 to 5 Stars) *
                    </label>
                    <select
                      value={feedbackForm.rating}
                      onChange={(e) => setFeedbackForm({ ...feedbackForm, rating: Number(e.target.value) })}
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                    >
                      <option value={5}>5 Stars - Excellent Result</option>
                      <option value={4}>4 Stars - Very Good</option>
                      <option value={3}>3 Stars - Good</option>
                      <option value={2}>2 Stars - Average</option>
                      <option value={1}>1 Star - Poor</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">
                      Product Used (Optional)
                    </label>
                    <select
                      value={feedbackForm.productId}
                      onChange={(e) => setFeedbackForm({ ...feedbackForm, productId: e.target.value })}
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                    >
                      <option value="">General Farm Solution</option>
                      {state.products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">
                    Your Crop Result &amp; Experience *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={feedbackForm.quote}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, quote: e.target.value })}
                    placeholder="Share details on application schedule, crop vigor, pest/disease recovery, or yield improvement..."
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="rounded-xl bg-amber-500/10 p-3 text-xs text-amber-800 border border-amber-500/20">
                  <span className="font-bold">Moderation Notice:</span> Your feedback will be reviewed by our agronomy admin team before appearing publicly on the website.
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setShowFeedbackModal(false)}
                    className="rounded-full border border-border px-5 py-2 text-xs font-semibold text-foreground hover:bg-muted"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingFeedback}
                    className="rounded-full bg-primary px-7 py-2 text-xs font-bold text-primary-foreground shadow-sm hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-2"
                  >
                    {submittingFeedback ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Submitting for Review...
                      </>
                    ) : (
                      "Submit Feedback (Pending Approval)"
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

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
