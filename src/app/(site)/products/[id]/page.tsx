"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Check, Minus, Plus, ShieldCheck, Truck, ArrowLeft, Heart, ShoppingCart, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ProductCard, Stars } from "@/components/site/ProductCard";
import { inr, useApp, useUser } from "@/lib/store";

export default function ProductDetailPage() {
  const params = useParams();
  const id = (params?.id as string) ?? "";
  const router = useRouter();
  const { state, set, addToCart, toggleWishlist, submitProductReview } = useApp();
  const user = useUser();
  const product = state.products.find((p) => p.id === id);
  const [qty, setQty] = React.useState(1);
  const [tab, setTab] = React.useState("description");
  const [submittingReview, setSubmittingReview] = React.useState(false);
  const [form, setForm] = React.useState({ name: "", rating: 5, comment: "" });
  const [activeImage, setActiveImage] = React.useState(product?.image || "");

  React.useEffect(() => {
    if (product?.image) {
      setActiveImage(product.image);
    }
  }, [product?.id, product?.image]);

  React.useEffect(() => {
    if (user?.name && !form.name) {
      setForm((f) => ({ ...f, name: user.name }));
    }
  }, [user, form.name]);

  if (!product) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-display text-2xl font-bold text-foreground">Product not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">The product may have been moved or removed from our catalogue.</p>
        <Link
          href="/products"
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground shadow"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Products
        </Link>
      </div>
    );
  }

  const isWished = state.wishlist.includes(product.id);
  const reviews = (state.reviews || []).filter(
    (r) => r.productId === product.id && (r.status === "Approved" || !r.status)
  );
  const related = state.products
    .filter((p) => p.category.toLowerCase() === product.category.toLowerCase() && p.id !== product.id)
    .slice(0, 4);
  const off = product.oldPrice > product.price
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  const galleryImages: string[] = [product.image, product.image2, ...(product.images || [])]
    .filter((img): img is string => Boolean(img) && typeof img === "string")
    .filter((img, idx, arr) => arr.indexOf(img) === idx)
    .slice(0, 2);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in first to submit your crop review.");
      router.push(`/login?redirect=/products/${encodeURIComponent(product.id)}`);
      return;
    }
    if (!form.name.trim() || !form.comment.trim()) {
      toast.error("Please enter your name and feedback.");
      return;
    }

    try {
      setSubmittingReview(true);
      const res = await submitProductReview({
        productId: product.id,
        name: form.name.trim(),
        rating: Number(form.rating),
        comment: form.comment.trim(),
        status: "Pending",
      });

      if (res.success) {
        setForm({ name: user?.name || "", rating: 5, comment: "" });
        toast.success(
          res.message || "Thank you! Your feedback has been submitted for admin approval."
        );
      } else {
        toast.error(res.error || "Failed to post review");
      }
    } catch {
      toast.error("Error while submitting review");
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-xs text-muted-foreground font-medium">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-primary transition-colors">Products</Link>
        <span>/</span>
        <Link
          href={`/products?category=${encodeURIComponent(product.category)}`}
          className="hover:text-primary transition-colors"
        >
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-foreground font-semibold truncate max-w-[200px] sm:max-w-xs">{product.name}</span>
      </nav>

      {/* Main product showcase */}
      <div className="grid gap-10 lg:grid-cols-2">
        {/* Left: Image gallery */}
        <div>
          <div className="relative aspect-square sm:aspect-[4/3] w-full overflow-hidden rounded-3xl border border-border bg-card shadow-sm group">
            <img
              src={activeImage || product.image}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {off > 0 && (
              <span className="absolute left-4 top-4 rounded-full bg-destructive px-3 py-1 text-xs font-bold text-white shadow-md">
                {off}% OFF
              </span>
            )}
            {galleryImages.length > 1 && (
              <span className="absolute left-4 bottom-4 rounded-full bg-black/60 backdrop-blur-xs px-2.5 py-1 text-[11px] font-semibold text-white">
                View {Math.max(1, galleryImages.indexOf(activeImage || product.image) + 1)} of {galleryImages.length}
              </span>
            )}
            <button
              onClick={() => {
                toggleWishlist(product.id);
                toast.success(isWished ? "Removed from wishlist" : "Saved to wishlist");
              }}
              className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-background/90 text-foreground backdrop-blur-xs shadow-md hover:text-destructive transition-colors"
            >
              <Heart className={`h-5 w-5 ${isWished ? "fill-destructive text-destructive" : ""}`} />
            </button>
          </div>

          {/* Interactive Thumbnails (Only shown if 2 images exist) */}
          {galleryImages.length > 1 && (
            <div className="mt-3.5 grid grid-cols-2 gap-3.5 max-w-xs">
              {galleryImages.map((img, i) => {
                const isSelected = (activeImage || product.image) === img;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveImage(img)}
                    className={`relative aspect-square overflow-hidden rounded-2xl border-2 transition-all duration-200 cursor-pointer text-left bg-card shadow-2xs ${
                      isSelected
                        ? "border-primary ring-2 ring-primary/30 scale-[1.02]"
                        : "border-border/80 opacity-70 hover:opacity-100 hover:border-primary/50"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} View ${i + 1}`}
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute bottom-1.5 left-1.5 rounded-md bg-black/70 px-1.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-2xs">
                      {i === 0 ? "Main View" : "Angle 2"}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Product information */}
        <div className="flex flex-col justify-between">
          <div>
            <Link
              href={`/products?category=${encodeURIComponent(product.category)}`}
              className="inline-block rounded-md bg-secondary/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-secondary hover:bg-secondary/20 transition-colors"
            >
              {product.category}
            </Link>
            <h1 className="mt-2 font-display text-3xl font-extrabold text-primary sm:text-4xl">
              {product.name}
            </h1>

            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <Stars rating={product.rating} />
              <span className="font-bold text-foreground">{product.rating}</span>
              <span>· {product.reviews || reviews.length} farmer reviews</span>
            </div>

            <div className="mt-5 flex items-baseline gap-3">
              <span className="font-display text-4xl font-black text-primary">
                {inr(product.price)}
              </span>
              {product.oldPrice > product.price && (
                <span className="text-lg text-muted-foreground line-through">
                  {inr(product.oldPrice)}
                </span>
              )}
            </div>

            <p className="mt-1 text-xs font-medium text-muted-foreground">
              Pack Size: <span className="font-bold text-foreground">{product.unit}</span> · Inclusive of GST &amp; taxes
            </p>

            <div className="mt-3">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                  product.stock > 0
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {product.stock > 0 ? `✓ In stock (${product.stock} units available)` : "✕ Currently out of stock"}
              </span>
            </div>

            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            {/* Quantity and Actions */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <div className="flex items-center rounded-full border border-border bg-background p-1 shadow-xs">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="rounded-full p-2 hover:bg-muted text-foreground transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center text-sm font-bold text-foreground">{qty}</span>
                <button
                  type="button"
                  onClick={() => setQty((q) => q + 1)}
                  className="rounded-full p-2 hover:bg-muted text-foreground transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <button
                disabled={product.stock === 0}
                onClick={() => {
                  addToCart(product.id, qty);
                  toast.success(`${qty}x ${product.name} added to cart`);
                }}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 text-sm font-bold text-primary-foreground shadow-md hover:bg-secondary disabled:opacity-50 transition-all active:scale-95"
              >
                <ShoppingCart className="h-4 w-4" /> Add to Cart
              </button>

              <button
                disabled={product.stock === 0}
                onClick={() => {
                  addToCart(product.id, qty);
                  if (!user) {
                    toast.info("Please sign in to proceed with your order");
                    router.push("/login?redirect=/checkout");
                  } else {
                    router.push("/checkout");
                  }
                }}
                className="rounded-full bg-accent px-8 py-3 text-sm font-bold text-accent-foreground shadow-md hover:opacity-95 disabled:opacity-50 transition-all active:scale-95"
              >
                Buy Now
              </button>
            </div>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 border-t border-border pt-6">
            <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium">
              <Truck className="h-5 w-5 text-secondary shrink-0" />
              <span>
                Free doorstep delivery on orders above {inr(state.settings.freeShippingThreshold ?? 2000)}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium">
              <ShieldCheck className="h-5 w-5 text-secondary shrink-0" />
              <span>
                Tested &amp; certified at{" "}
                {state.settings.facilityLocationTitle
                  ? state.settings.facilityLocationTitle.split(",")[0].trim()
                  : "Tidagundi"}{" "}
                Quality Control Lab
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-14 rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm">
        <div className="flex flex-wrap gap-2 border-b border-border pb-4">
          {[
            { id: "description", label: "Product Description" },
            { id: "benefits", label: "Agronomic Benefits" },
            { id: "usage", label: "Usage & Dosage" },
            { id: "ingredients", label: "Active Ingredients" },
            { id: "reviews", label: `Farmer Reviews (${reviews.length})` },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`rounded-full px-5 py-2 text-xs sm:text-sm font-bold transition-all ${
                tab === t.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "border border-border bg-card text-foreground hover:bg-muted"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="pt-6 text-sm leading-relaxed text-muted-foreground">
          {tab === "description" && (
            <div className="space-y-3">
              <p className="text-base text-foreground font-medium">{product.name}</p>
              <p>{product.description}</p>
              {product.badges?.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {product.badges.map((b) => (
                    <span key={b} className="rounded-full bg-secondary/10 px-3 py-1 text-xs font-bold text-secondary capitalize">
                      ✓ {b}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === "benefits" && (
            <ul className="space-y-3">
              {product.benefits && product.benefits.length > 0 ? (
                product.benefits.map((b, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-foreground">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                    <span>{b}</span>
                  </li>
                ))
              ) : (
                <p>Enhances root vigor, optimizes nutrient uptake, and boosts crop yield.</p>
              )}
            </ul>
          )}

          {tab === "usage" && (
            <div className="space-y-2">
              <p className="font-bold text-foreground">Recommended Dosage Schedule:</p>
              <p className="bg-muted/40 p-4 rounded-xl border border-border whitespace-pre-wrap">
                {product.usage || "Drip application: 2 Litres / Acre. Foliar spray: 3-5 ml per Litre of water during vegetative and flowering stage."}
              </p>
            </div>
          )}

          {tab === "ingredients" && (
            <div className="space-y-2">
              <p className="font-bold text-foreground">Active Formulations &amp; Microbial Consortium:</p>
              <p className="bg-muted/40 p-4 rounded-xl border border-border">
                {product.ingredients || "Azotobacter, Phosphate Solubilising Bacteria (PSB), Potash Mobilizing Bacteria (KMB) with minimum 1x10^9 CFU/ml."}
              </p>
            </div>
          )}

          {tab === "reviews" && (
            <div className="space-y-8">
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-border p-8 text-center text-muted-foreground">
                    <p className="font-medium text-foreground">No approved reviews yet.</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Be the first registered farmer to share field results with this product!
                    </p>
                  </div>
                ) : (
                  reviews.map((r) => (
                    <div key={r.id} className="rounded-2xl border border-border bg-background p-5 shadow-xs">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-foreground">{r.name}</p>
                        <Stars rating={r.rating} />
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">{r.date}</p>
                      <p className="mt-2 text-foreground font-medium">&ldquo;{r.comment}&rdquo;</p>
                    </div>
                  ))
                )}
              </div>

              {/* Conditional: Sign-in CTA for guests vs Review Form for logged in users */}
              {!user ? (
                <div className="rounded-3xl border border-border bg-gradient-to-br from-primary/5 via-card to-secondary/5 p-6 sm:p-8 text-center shadow-xs">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-3">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <h4 className="font-display text-lg font-bold text-foreground">
                    Sign In to Share Your Crop Review
                  </h4>
                  <p className="mx-auto mt-1 max-w-md text-xs sm:text-sm text-muted-foreground">
                    Only verified registered farmers can submit crop ratings and feedback. All submitted reviews are moderated by our admin team before being published live.
                  </p>
                  <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                    <Link
                      href={`/login?redirect=/products/${encodeURIComponent(product.id)}`}
                      className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-xs sm:text-sm font-bold text-primary-foreground shadow hover:opacity-95 transition-all"
                    >
                      Sign In to Write a Review &rarr;
                    </Link>
                    <Link
                      href="/register"
                      className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-2.5 text-xs sm:text-sm font-semibold text-foreground hover:bg-muted transition-all"
                    >
                      Create New Account
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-border bg-muted/30 p-6">
                  <div className="mb-4">
                    <h4 className="font-display text-base font-bold text-foreground">Share Your Crop Result</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Signed in as <span className="font-semibold text-foreground">{user.name || user.email}</span> · Your feedback will be reviewed by admin before appearing live.
                    </p>
                  </div>
                  <form onSubmit={handleReviewSubmit} className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-semibold uppercase text-muted-foreground mb-1 block">Your Name</label>
                      <input
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="e.g. Ramesh Patil"
                        className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold uppercase text-muted-foreground mb-1 block">Rating</label>
                      <select
                        value={form.rating}
                        onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
                        className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                      >
                        <option value={5}>5 Stars - Excellent Result</option>
                        <option value={4}>4 Stars - Very Good</option>
                        <option value={3}>3 Stars - Good</option>
                        <option value={2}>2 Stars - Average</option>
                        <option value={1}>1 Star - Poor</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-xs font-semibold uppercase text-muted-foreground mb-1 block">Your Review / Field Observations</label>
                      <textarea
                        required
                        rows={3}
                        value={form.comment}
                        onChange={(e) => setForm({ ...form, comment: e.target.value })}
                        placeholder="Describe which crop you applied this on, application timing, and observed yield / vigor improvement..."
                        className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <button
                        type="submit"
                        disabled={submittingReview}
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-2.5 text-xs font-bold text-primary-foreground shadow hover:opacity-90 disabled:opacity-50 transition-all"
                      >
                        {submittingReview ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" /> Submitting for Review...
                          </>
                        ) : (
                          "Submit Review (Pending Admin Approval)"
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-secondary">More Recommendations</span>
              <h2 className="font-display text-2xl font-bold text-primary">Related {product.category}</h2>
            </div>
            <Link
              href={`/products?category=${encodeURIComponent(product.category)}`}
              className="text-xs font-bold text-secondary hover:text-primary underline"
            >
              View all in {product.category}
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
