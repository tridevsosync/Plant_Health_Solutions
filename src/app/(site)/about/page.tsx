"use client";

import * as React from "react";
import Link from "next/link";
import { Award, Eye, Target, Users } from "lucide-react";

export default function AboutPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative isolate overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1920&q=80"
          alt="Agriculture Research Field"
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#122b17]/95 via-[#183a1f]/90 to-[#285724]/80 backdrop-blur-[0.5px]" />
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
          <h1 className="max-w-3xl font-display text-4xl font-bold md:text-5xl leading-tight text-white">
            Rooted in research. Built for the Indian farm.
          </h1>
          <p className="mt-4 max-w-2xl text-base text-white/85 md:text-lg">
            For over two decades, Plant Health Solutions has worked alongside Indian farmers to
            deliver inputs that perform in the field.
          </p>
        </div>
      </section>

      {/* Company History */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <div className="mb-10 flex flex-col items-start gap-3 md:mb-14">
          <span className="rounded-full bg-accent px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
            Company History
          </span>
          <h2 className="max-w-3xl font-display text-3xl font-bold leading-tight text-primary md:text-4xl">
            From a small lab in Vijayapura to 12 states
          </h2>
        </div>

        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              Founded in 2003 with a single fermentation chamber, Plant Health Solutions began with
              the simple ambition of putting bio-pesticide tools in the hands of cotton farmers in
              North Karnataka.
            </p>
            <p>
              Today, our Horticulture Research &amp; Extension Center on NH-52 spans 40 acres and
              houses formulation labs, a tissue-culture unit and demonstration plots covering
              cotton, sugarcane, grapes, pomegranate and vegetables.
            </p>
            <p>
              Our products reach over 50,000 farmers through a 300+ strong dealer network across
              Karnataka, Maharashtra, Andhra Pradesh, Telangana, Madhya Pradesh and beyond.
            </p>
          </div>

          <div className="aspect-[5/4] overflow-hidden rounded-2xl border border-border shadow-md">
            <img
              alt="Company history and research field"
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
              src="https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=1200&q=80"
            />
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <div className="bg-muted/40 border-y border-border/60">
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Mission */}
            <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-accent text-accent-foreground">
                <Target className="h-6 w-6" />
              </span>
              <h3 className="mt-4 font-display text-2xl font-bold text-primary">Our Mission</h3>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                To empower the Indian farmer with research-validated agricultural inputs that increase
                yield while reducing chemical load on soil and water.
              </p>
            </div>

            {/* Vision */}
            <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-accent text-accent-foreground">
                <Eye className="h-6 w-6" />
              </span>
              <h3 className="mt-4 font-display text-2xl font-bold text-primary">Our Vision</h3>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                To be India&apos;s most trusted partner for sustainable, science-led crop nutrition
                and protection by 2030.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Meet Our Team (Placed right under Mission & Vision) */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <div className="mb-10 flex flex-col items-start gap-3 md:mb-14">
          <span className="rounded-full bg-accent px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
            Leadership &amp; Experts
          </span>
          <h2 className="max-w-3xl font-display text-3xl font-bold leading-tight text-primary md:text-4xl">
            Meet our team
          </h2>
          <p className="max-w-2xl text-sm sm:text-base text-muted-foreground">
            Led by senior agronomists, biochemists, and farm operation specialists dedicated to advancing sustainable agriculture.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Member 1 */}
          <div className="group overflow-hidden rounded-3xl border border-border bg-card shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="relative aspect-[4/4.5] w-full overflow-hidden bg-muted">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80"
                alt="Dr. R. M. Kulkarni"
                className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
            <div className="p-5">
              <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">
                Founder
              </span>
              <h3 className="mt-2 font-display text-lg font-bold text-foreground">
                Dr. R. M. Kulkarni
              </h3>
              <p className="text-xs font-semibold text-muted-foreground">
                Chief Agronomist
              </p>
              <p className="mt-2 text-xs text-muted-foreground/90 leading-relaxed line-clamp-2">
                Ph.D. in Soil Microbiology with over 25 years of field research in crop nutrition.
              </p>
            </div>
          </div>

          {/* Member 2 */}
          <div className="group overflow-hidden rounded-3xl border border-border bg-card shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="relative aspect-[4/4.5] w-full overflow-hidden bg-muted">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80"
                alt="Mrs. S. Patil"
                className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
            <div className="p-5">
              <span className="rounded-md bg-secondary/10 px-2 py-0.5 text-[11px] font-bold text-secondary">
                Executive
              </span>
              <h3 className="mt-2 font-display text-lg font-bold text-foreground">
                Mrs. S. Patil
              </h3>
              <p className="text-xs font-semibold text-muted-foreground">
                Managing Director
              </p>
              <p className="mt-2 text-xs text-muted-foreground/90 leading-relaxed line-clamp-2">
                Spearheading nationwide supply chain, dealer relationships, and company growth.
              </p>
            </div>
          </div>

          {/* Member 3 */}
          <div className="group overflow-hidden rounded-3xl border border-border bg-card shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="relative aspect-[4/4.5] w-full overflow-hidden bg-muted">
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80"
                alt="Dr. M. Hegde"
                className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
            <div className="p-5">
              <span className="rounded-md bg-accent/20 px-2 py-0.5 text-[11px] font-bold text-primary">
                R&amp;D
              </span>
              <h3 className="mt-2 font-display text-lg font-bold text-foreground">
                Dr. M. Hegde
              </h3>
              <p className="text-xs font-semibold text-muted-foreground">
                Head of Plant Research
              </p>
              <p className="mt-2 text-xs text-muted-foreground/90 leading-relaxed line-clamp-2">
                Specialist in microbial formulation, strain development, and biological crop protection.
              </p>
            </div>
          </div>

          {/* Member 4 */}
          <div className="group overflow-hidden rounded-3xl border border-border bg-card shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="relative aspect-[4/4.5] w-full overflow-hidden bg-muted">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80"
                alt="Mr. A. Deshmukh"
                className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
            <div className="p-5">
              <span className="rounded-md bg-amber-500/10 px-2 py-0.5 text-[11px] font-bold text-amber-700 dark:text-amber-400">
                Operations
              </span>
              <h3 className="mt-2 font-display text-lg font-bold text-foreground">
                Mr. A. Deshmukh
              </h3>
              <p className="text-xs font-semibold text-muted-foreground">
                VP Operations &amp; QC
              </p>
              <p className="mt-2 text-xs text-muted-foreground/90 leading-relaxed line-clamp-2">
                Overseeing automated packaging, quality inspection, and ISO compliance across facilities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Manufacturing & Research Facilities */}
      <div className="bg-muted/40 border-y border-border/60">
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
          <div className="mb-10 flex flex-col items-start gap-3 md:mb-14">
            <span className="rounded-full bg-accent px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
              Manufacturing &amp; Research
            </span>
            <h2 className="max-w-3xl font-display text-3xl font-bold leading-tight text-primary md:text-4xl">
              State-of-the-art facilities
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Facility 1 */}
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
              <img
                alt="Manufacturing Facility"
                loading="lazy"
                className="aspect-[4/3] w-full object-cover"
                src="https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=1200&q=80"
              />
              <div className="p-6">
                <h3 className="font-display text-xl font-bold text-primary">
                  Manufacturing Facility
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  ISO 9001:2015 certified plant with dedicated lines for liquid, granular and
                  seed-treatment formulations. Annual capacity 12,000 MT.
                </p>
              </div>
            </div>

            {/* Facility 2 */}
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
              <img
                alt="Research Center"
                loading="lazy"
                className="aspect-[4/3] w-full object-cover"
                src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=80"
              />
              <div className="p-6">
                <h3 className="font-display text-xl font-bold text-primary">Research Center</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Soil &amp; water laboratory, tissue-culture unit, fermentation chambers and 40 acres
                  of multi-crop trial plots.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Certifications */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <div className="mb-10 flex flex-col items-start gap-3 md:mb-14">
          <span className="rounded-full bg-accent px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
            Certifications
          </span>
          <h2 className="max-w-3xl font-display text-3xl font-bold leading-tight text-primary md:text-4xl">
            Trusted, audited, certified
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-border bg-card p-6 text-center shadow-xs">
            <Award className="mx-auto h-8 w-8 text-secondary" />
            <div className="mt-3 text-sm font-semibold text-foreground">ISO 9001:2015</div>
          </div>
          <div className="rounded-xl border border-border bg-card p-6 text-center shadow-xs">
            <Award className="mx-auto h-8 w-8 text-secondary" />
            <div className="mt-3 text-sm font-semibold text-foreground">CIB&amp;RC Registered</div>
          </div>
          <div className="rounded-xl border border-border bg-card p-6 text-center shadow-xs">
            <Award className="mx-auto h-8 w-8 text-secondary" />
            <div className="mt-3 text-sm font-semibold text-foreground">FCO Licensed</div>
          </div>
          <div className="rounded-xl border border-border bg-card p-6 text-center shadow-xs">
            <Award className="mx-auto h-8 w-8 text-secondary" />
            <div className="mt-3 text-sm font-semibold text-foreground">NPOP Organic</div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="pb-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-3xl bg-secondary px-8 py-12 text-center text-white shadow-lg">
          <h2 className="font-display text-3xl font-bold">Talk to our agronomists</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-white/90 leading-relaxed">
            Share your soil report and cropping plan — we will build a season-long nutrition and
            protection schedule for your farm free of cost.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/contact"
              className="rounded-full bg-white px-7 py-3 text-sm font-semibold text-primary transition hover:bg-white/90"
            >
              Contact Us
            </Link>
            <Link
              href="/products"
              className="rounded-full border border-white/60 px-7 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
