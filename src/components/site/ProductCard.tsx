import { Link } from "@tanstack/react-router";
import { Eye, Heart, ShoppingCart, Star } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/lib/data";
import { inr, useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export function Stars({ rating, className }: { rating: number; className?: string }) {
  return (
    <span className={cn("flex items-center gap-0.5", className)}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn(
            "h-3.5 w-3.5",
            i <= Math.round(rating) ? "fill-[#e0a82e] text-[#e0a82e]" : "text-muted-foreground/40",
          )}
        />
      ))}
    </span>
  );
}

export function ProductCard({
  product,
  view = "grid",
  onQuickView,
}: {
  product: Product;
  view?: "grid" | "list";
  onQuickView?: (p: Product) => void;
}) {
  const { state, addToCart, toggleWishlist } = useApp();
  const wished = state.wishlist.includes(product.id);
  const off = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);

  return (
    <div
      className={cn(
        "group relative flex overflow-hidden rounded-xl border border-border bg-card shadow-sm transition hover:shadow-md",
        view === "grid" ? "flex-col" : "flex-col sm:flex-row",
      )}
    >
      <div className={cn("relative overflow-hidden bg-muted", view === "grid" ? "h-48" : "h-48 sm:h-auto sm:w-56 sm:shrink-0")}>
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute left-2 top-2 flex flex-wrap gap-1">
          {product.badges.map((b) => (
            <span key={b} className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold uppercase text-secondary-foreground">
              {b}
            </span>
          ))}
          {off > 0 && (
            <span className="rounded-full bg-destructive px-2 py-0.5 text-[10px] font-semibold text-destructive-foreground">
              {off}% OFF
            </span>
          )}
        </div>
        <div className="absolute right-2 top-2 flex flex-col gap-1">
          <button
            aria-label="Wishlist"
            onClick={() => {
              toggleWishlist(product.id);
              toast.success(wished ? "Removed from wishlist" : "Added to wishlist");
            }}
            className="rounded-full bg-card p-2 shadow"
          >
            <Heart className={cn("h-4 w-4", wished ? "fill-destructive text-destructive" : "text-primary")} />
          </button>
          {onQuickView && (
            <button aria-label="Quick view" onClick={() => onQuickView(product)} className="rounded-full bg-card p-2 shadow">
              <Eye className="h-4 w-4 text-primary" />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-secondary">{product.category}</span>
        <Link
          to="/products/$id"
          params={{ id: product.id }}
          className="mt-1 font-display text-base font-semibold leading-snug text-foreground hover:text-primary"
        >
          {product.name}
        </Link>
        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
          <Stars rating={product.rating} />
          <span>
            {product.rating} ({product.reviews})
          </span>
        </div>
        {view === "list" && <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{product.description}</p>}
        <div className="mt-3 flex items-end gap-2">
          <span className="font-display text-xl font-bold text-primary">{inr(product.price)}</span>
          <span className="text-sm text-muted-foreground line-through">{inr(product.oldPrice)}</span>
          <span className="ml-auto text-xs text-muted-foreground">/ {product.unit}</span>
        </div>
        <p className={cn("mt-1 text-xs font-medium", product.stock > 0 ? "text-secondary" : "text-destructive")}>
          {product.stock > 0 ? `In stock (${product.stock} units)` : "Out of stock"}
        </p>
        <button
          disabled={product.stock === 0}
          onClick={() => {
            addToCart(product.id);
            toast.success(`${product.name} added to cart`);
          }}
          className="mt-3 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-secondary disabled:opacity-50"
        >
          <ShoppingCart className="h-4 w-4" /> Add to Cart
        </button>
      </div>
    </div>
  );
}
