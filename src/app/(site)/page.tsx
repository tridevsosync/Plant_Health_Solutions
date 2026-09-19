"use client";

import Link from "next/link";
import {
  Award,
  BookOpen,
  FlaskConical,
  Leaf,
  Microscope,
  Quote,
  ShieldCheck,
  Sprout,
  Truck,
  Users,
} from "lucide-react";
import { ProductCard, Stars } from "@/components/site/ProductCard";
import { Section } from "@/components/site/Section";
import { crops, stats } from "@/lib/data";
import { useApp } from "@/lib/store";

const why = [
  { icon: Microscope, title: "Research Driven", text: "Every formulation is validated through multi-location replicated field trials." },
  { icon: FlaskConical, title: "In-House Manufacturing", text: "Modern blending, fermentation and QC laboratory at Tidagundi." },
  { icon: ShieldCheck, title: "Quality Assured", text: "Batch-wise testing for CFU count, purity and heavy metal safety." },
  { icon: Users, title: "Field Extension", text: "Agronomists visit farms and build crop-specific schedules free of cost." },
  { icon: Truck, title: "Pan-India Dispatch", text: "Fast delivery with free shipping on orders above ₹2,000." },
  { icon: Award, title: "Proven Results", text: "42,000+ farmers report better yield and lower input cost." },
];

export default function HomePage() {
  const { state } = useApp();
  const best = state.products.filter((p) => p.badges.includes("best seller")).slice(0, 4);
  const trending = state.products.filter((p) => p.badges.includes("trending")).slice(0, 4);
  const latest = state.blogs.slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=70"
          alt="Green farm field"
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#122b18f2] via-[#234f2ecc] to-[#4f8a3c66]" />
        <div className="mx-auto max-w-7xl px-4 py-24 md:py-32">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-accent">
            <Leaf className="h-3.5 w-3.5" /> Agriculture Research & Manufacturing
          </span>
          <h1 className="mt-5 max-w-3xl font-display text-4xl font-bold leading-tight text-white md:text-6xl">
            Innovative Agricultural Solutions for Sustainable Farming
          </h1>
          <p className="mt-5 max-w-2xl text-base text-white/85 md:text-lg">{state.settings.description}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/products"
              className="rounded-full bg-accent px-7 py-3 text-sm font-semibold text-accent-foreground transition hover:bg-white"
            >
              Explore Products
            </Link>
            <Link
              href="/farmer-solutions"
              className="rounded-full border border-white/50 px-7 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Farmer Solutions
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto -mt-10 max-w-7xl px-4">
        <div className="grid gap-4 rounded-2xl bg-card p-6 shadow-lg sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-display text-3xl font-bold text-primary">{s.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Overview */}
      <Section title="Rooted in Research, Grown with Farmers" kicker="Company Overview">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <img
            src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1200&q=70"
            alt="Research laboratory"
            className="h-80 w-full rounded-2xl object-cover shadow"
          />
          <div>
            <p className="text-muted-foreground">
              {state.settings.name}, led by {state.settings.owner}, operates the Horticulture Research and Extension
              Center at Tidagundi on the Vijayapur–Solapur highway. We research, manufacture and field-validate a
              complete basket of biological and nutritional inputs for Indian cropping systems.
            </p>
            <p className="mt-4 text-muted-foreground">
              From nitrogen fixing consortia and mycorrhiza to fully water soluble NPK grades and bio control agents,
              every product leaves our plant only after CFU counts, purity and stability checks. Our extension team
              then converts those products into crop-wise schedules with farmers on their own fields.
            </p>
            <Link href="/about" className="mt-6 inline-block rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-secondary">
              Read our story
            </Link>
          </div>
        </div>
      </Section>

      {/* Why choose */}
      <Section title="Why Farmers Choose PHS" kicker="Our Strengths" muted>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {why.map((w) => (
            <div key={w.title} className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent/40 text-primary">
                <w.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold">{w.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{w.text}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Categories */}
      <Section title="Featured Categories" kicker="Product Range">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {state.categories.map((c) => (
            <Link
              key={c.id}
              href={`/products?category=${encodeURIComponent(c.name)}`}
              className="group overflow-hidden rounded-xl border border-border bg-card shadow-sm transition hover:shadow-md"
            >
              <img src={c.image} alt={c.name} className="h-36 w-full object-cover transition group-hover:scale-105" />
              <div className="p-4">
                <h3 className="font-display text-base font-semibold text-primary">{c.name}</h3>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{c.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      <Section title="Best Sellers" kicker="Trusted on the Field" muted>
        <Grid products={best} />
      </Section>

      <Section title="Trending This Season" kicker="Farmer Favourites">
        <Grid products={trending} />
      </Section>

      {/* Testimonials */}
      <Section title="Voices from the Field" kicker="Farmer Testimonials" muted>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {state.testimonials.slice(0, 6).map((t) => (
            <div key={t.id} className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <Quote className="h-6 w-6 text-accent" />
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">"{t.quote}"</p>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-primary">{t.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {t.crop} · {t.place}
                  </p>
                </div>
                <Stars rating={t.rating} />
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Crops */}
      <Section title="Crop Solutions" kicker="Farmer Advisory">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {crops.map((c) => (
            <Link
              key={c.slug}
              href="/farmer-solutions"
              className="group relative overflow-hidden rounded-xl shadow-sm"
            >
              <img src={c.image} alt={c.name} className="h-40 w-full object-cover transition group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent" />
              <div className="absolute bottom-0 p-4">
                <Sprout className="h-5 w-5 text-accent" />
                <p className="mt-1 font-display text-lg font-semibold text-white">{c.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* Blogs */}
      <Section title="Latest Research & Agronomy" kicker="From Our Desk" muted>
        <div className="grid gap-5 md:grid-cols-3">
          {latest.map((b) => (
            <Link key={b.id} href={`/blog/${b.id}`} className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
              <img src={b.image} alt={b.title} className="h-44 w-full object-cover" />
              <div className="p-5">
                <span className="text-xs font-semibold uppercase tracking-wide text-secondary">{b.category}</span>
                <h3 className="mt-2 font-display text-lg font-semibold leading-snug">{b.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{b.excerpt}</p>
                <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <BookOpen className="h-3.5 w-3.5" /> {b.readTime} min read · {b.author}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Section>
    </div>
  );
}

function Grid({ products }: { products: { id: string }[] }) {
  const { state } = useApp();
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((p) => {
        const full = state.products.find((x) => x.id === p.id);
        return full ? <ProductCard key={full.id} product={full} /> : null;
      })}
    </div>
  );
}
