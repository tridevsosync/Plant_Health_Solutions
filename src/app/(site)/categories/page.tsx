"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Sprout, Leaf, Droplets, FlaskConical, Beaker, ShieldCheck, Flower2, Wheat } from "lucide-react";
import { PageHero } from "@/components/site/Section";
import { useApp } from "@/lib/store";

const iconMap: Record<string, React.ReactNode> = {
  Sprout: <Sprout className="h-5 w-5" />,
  Leaf: <Leaf className="h-5 w-5" />,
  FlaskConical: <FlaskConical className="h-5 w-5" />,
  Droplets: <Droplets className="h-5 w-5" />,
  Beaker: <Beaker className="h-5 w-5" />,
  ShieldCheck: <ShieldCheck className="h-5 w-5" />,
  Flower2: <Flower2 className="h-5 w-5" />,
  Wheat: <Wheat className="h-5 w-5" />,
};

export default function CategoriesPage() {
  const { state } = useApp();

  return (
    <div className="bg-background min-h-screen">
      <PageHero
        title="Explore Product Categories"
        subtitle="Browse our comprehensive range of certified bio fertilizers, micronutrients, water soluble fertilizers, biostimulants and crop protection formulations."
        image="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1920&q=70"
      />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {state.categories.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Sprout className="h-7 w-7" />
            </div>
            <h3 className="mt-4 font-display text-xl font-bold text-foreground">No Categories Found</h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
              Categories have not been added yet or are currently being updated.
            </p>
            <div className="mt-6">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
              >
                Browse All Products
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {state.categories.map((c) => {
              const productCount = state.products.filter(
                (p) => p.category.toLowerCase() === c.name.toLowerCase()
              ).length;

              const iconEl = iconMap[c.icon] || <Sprout className="h-5 w-5" />;

              return (
                <div
                  key={c.id || c.name}
                  className="group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative h-52 w-full overflow-hidden bg-muted">
                    <img
                      src={c.image || "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=800&q=80"}
                      alt={c.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    
                    <div className="absolute top-4 left-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-white/90 text-primary shadow-md backdrop-blur-xs">
                      {iconEl}
                    </div>

                    <span className="absolute bottom-3 left-4 inline-flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1 text-xs font-bold text-white backdrop-blur-xs border border-white/10">
                      <Sparkles className="h-3 w-3 text-accent" />
                      {productCount} {productCount === 1 ? "Product" : "Products"} Available
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-display text-xl font-bold text-primary group-hover:text-secondary transition-colors">
                      {c.name}
                    </h3>
                    <p className="mt-2 flex-1 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                      {c.description || "High efficiency formulations tested at Vijayapura center for enhanced crop vigor."}
                    </p>

                    <div className="mt-6 pt-4 border-t border-border/70 flex items-center justify-between">
                      <Link
                        href={`/products?category=${encodeURIComponent(c.name)}`}
                        className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-secondary transition-colors"
                      >
                        Browse {c.name}
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
