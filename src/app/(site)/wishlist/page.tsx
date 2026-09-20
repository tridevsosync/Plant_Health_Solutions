"use client";

import * as React from "react";
import Link from "next/link";
import { Heart, ShoppingCart, Trash2, ArrowRight, Package, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { inr, useApp } from "@/lib/store";
import { PageHero } from "@/components/site/Section";
import { Stars } from "@/components/site/ProductCard";

export default function WishlistPage() {
  const { state, addToCart, toggleWishlist } = useApp();

  // Find wishlisted product objects
  const wishlistedProducts = state.products.filter((p) => state.wishlist.includes(p.id));

  const handleAddToCart = (productId: string, productName: string) => {
    addToCart(productId, 1);
    toast.success(`${productName} added to your cart!`);
  };

  const handleRemove = (productId: string, productName: string) => {
    toggleWishlist(productId);
    toast.info(`${productName} removed from wishlist`);
  };

  const handleAddAllToCart = () => {
    if (wishlistedProducts.length === 0) return;
    wishlistedProducts.forEach((p) => {
      if (p.stock > 0) addToCart(p.id, 1);
    });
    toast.success(`Added ${wishlistedProducts.length} items to your cart!`);
  };

  return (
    <div>
      <PageHero
        title="Your Saved Wishlist"
        subtitle="Saved bio fertilizers, organic formulations, and crop care essentials for your farm."
        image="https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=1920&q=80"
      />

      <div className="mx-auto max-w-7xl px-4 py-12">
        {wishlistedProducts.length === 0 ? (
          <div className="mx-auto max-w-2xl rounded-3xl border border-border bg-card p-10 sm:p-16 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-500">
              <Heart className="h-8 w-8" />
            </div>
            <h2 className="font-display text-2xl font-bold text-foreground">Your wishlist is currently empty</h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
              Save your favorite fertilizers, micronutrients, and crop protectors here to review and purchase whenever you&apos;re ready.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-bold text-primary-foreground shadow-md hover:bg-secondary transition-all"
              >
                <Package className="h-4 w-4" /> Explore Products
              </Link>
              <Link
                href="/cart"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-7 py-3 text-sm font-bold text-foreground hover:bg-muted transition-all"
              >
                <ShoppingCart className="h-4 w-4" /> View Cart ({state.cart.length})
              </Link>
            </div>
          </div>
        ) : (
          <div>
            {/* Header action bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
              <div>
                <h2 className="font-display text-2xl font-bold text-primary flex items-center gap-2.5">
                  <Heart className="h-6 w-6 text-rose-500 fill-rose-500" />
                  Wishlist Items ({wishlistedProducts.length})
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                  Items remain saved in your browser session. You can add them to cart anytime.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleAddAllToCart}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground shadow-sm hover:bg-secondary transition-all"
                >
                  <ShoppingCart className="h-4 w-4" /> Add All to Cart
                </button>
                <Link
                  href="/cart"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-2.5 text-xs font-bold text-foreground hover:bg-muted transition-all"
                >
                  Go to Cart <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Grid of Wishlist Products */}
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {wishlistedProducts.map((product) => {
                const inCart = state.cart.some((c) => c.id === product.id);
                const off = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);

                return (
                  <div
                    key={product.id}
                    className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xs transition hover:shadow-md"
                  >
                    {/* Image Area */}
                    <div className="relative h-52 overflow-hidden bg-muted">
                      <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />

                      {/* Badges */}
                      <div className="absolute left-2.5 top-2.5 flex flex-wrap gap-1">
                        {product.badges.map((b) => (
                          <span
                            key={b}
                            className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold uppercase text-secondary-foreground"
                          >
                            {b}
                          </span>
                        ))}
                        {off > 0 && (
                          <span className="rounded-full bg-destructive px-2 py-0.5 text-[10px] font-semibold text-destructive-foreground">
                            {off}% OFF
                          </span>
                        )}
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemove(product.id, product.name)}
                        aria-label="Remove from wishlist"
                        className="absolute right-2.5 top-2.5 rounded-full bg-card/90 p-2 text-rose-500 shadow-md backdrop-blur-xs hover:bg-card transition-colors"
                        title="Remove from wishlist"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="flex flex-1 flex-col p-4">
                      <span className="text-[11px] font-semibold uppercase tracking-wide text-secondary">
                        {product.category}
                      </span>
                      <Link
                        href={`/products/${product.id}`}
                        className="mt-1 font-display text-base font-semibold leading-snug text-foreground hover:text-primary line-clamp-1"
                      >
                        {product.name}
                      </Link>

                      <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                        <Stars rating={product.rating} />
                        <span>({product.reviews})</span>
                      </div>

                      <div className="mt-3 flex items-end gap-2">
                        <span className="font-display text-lg font-bold text-primary">{inr(product.price)}</span>
                        <span className="text-xs text-muted-foreground line-through">{inr(product.oldPrice)}</span>
                        <span className="ml-auto text-xs text-muted-foreground">/ {product.unit}</span>
                      </div>

                      <p className={`mt-1 text-xs font-medium ${product.stock > 0 ? "text-secondary" : "text-destructive"}`}>
                        {product.stock > 0 ? `In stock (${product.stock} units)` : "Out of stock"}
                      </p>

                      {/* Actions */}
                      <div className="mt-4 flex items-center gap-2 pt-2 border-t border-border/60">
                        <button
                          disabled={product.stock === 0}
                          onClick={() => handleAddToCart(product.id, product.name)}
                          className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-full py-2 px-3 text-xs font-bold transition-all disabled:opacity-50 ${
                            inCart
                              ? "bg-secondary text-secondary-foreground hover:opacity-90"
                              : "bg-primary text-primary-foreground hover:bg-secondary"
                          }`}
                        >
                          <ShoppingCart className="h-3.5 w-3.5" />
                          {inCart ? "Add Another" : "Add to Cart"}
                        </button>
                        <Link
                          href={`/products/${product.id}`}
                          className="rounded-full border border-border bg-background p-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                          title="View product details"
                        >
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom prompt */}
            <div className="mt-12 rounded-2xl bg-primary/10 border border-primary/20 p-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-foreground">Ready to order your crop inputs?</h4>
                  <p className="text-xs text-muted-foreground">
                    Add your wishlisted products to cart and proceed to our fast, secure checkout.
                  </p>
                </div>
              </div>
              <Link
                href="/cart"
                className="rounded-full bg-primary px-6 py-2.5 text-xs font-bold text-primary-foreground shadow-sm hover:bg-secondary transition-all"
              >
                Go to Cart &amp; Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
