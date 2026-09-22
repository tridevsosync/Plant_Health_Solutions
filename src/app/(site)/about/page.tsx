"use client";

import * as React from "react";
import Link from "next/link";
import { Award, Eye, Target, Users, Sparkles, GraduationCap, Briefcase, Microscope, CheckCircle2 } from "lucide-react";
import { useApp } from "@/lib/store";
import { teamMembers as seedTeamMembers } from "@/lib/data";

export default function AboutPage() {
  const { state } = useApp();

  const isTeamSectionVisible = state.settings.showTeamSection !== false;
  const rawTeam = state.team && state.team.length > 0 ? state.team : seedTeamMembers;
  const activeTeam = rawTeam.filter((m) => (m.status || "Active") === "Active");

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

      {/* Founders & Executive Leadership Section (Placed directly ABOVE the Team section) */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <div className="mb-12 flex flex-col items-start gap-3 md:mb-16">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
            <Sparkles className="h-3.5 w-3.5" /> Executive Leadership
          </span>
          <h2 className="max-w-3xl font-display text-3xl font-bold leading-tight text-primary md:text-4xl">
            Founder &amp; Co-Founder
          </h2>
          <p className="max-w-3xl text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
            Leading the transformation of sustainable Indian agriculture through scientific innovation,
            grassroots farmer empowerment, and entrepreneurial vision.
          </p>
        </div>

        <div className="space-y-12 lg:space-y-16">
          {/* Founder Profile: Dr. Rashmi Mallikarjun Hegde */}
          <div className="overflow-hidden rounded-3xl border border-border/80 bg-card shadow-md transition-all hover:shadow-xl">
            <div className="grid gap-8 lg:grid-cols-[380px_1fr] p-6 sm:p-8 lg:p-10">
              {/* Photo & Highlights */}
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-5">
                <div className="relative w-full max-w-xs sm:max-w-none aspect-[3/3.8] overflow-hidden rounded-2xl border-2 border-primary/20 shadow-sm bg-muted">
                  <img
                    src="/team/dr-rashmi-hegde.jpg"
                    alt="Dr. Rashmi Mallikarjun Hegde"
                    className="h-full w-full object-cover object-top transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/90 backdrop-blur-xs px-3 py-1 text-[11px] font-bold text-white shadow-xs">
                      Founder &amp; MD
                    </span>
                  </div>
                </div>

                <div className="w-full space-y-2.5">
                  <div className="inline-flex flex-wrap gap-2 justify-center sm:justify-start">
                    <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                      <GraduationCap className="h-3.5 w-3.5" /> Ph.D. Agri-Biotechnology
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-lg bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-800 dark:text-amber-300">
                      <Sparkles className="h-3.5 w-3.5" /> Goldman Sachs 10,000 Women
                    </span>
                  </div>
                  <div className="rounded-xl border border-border/60 bg-muted/30 p-3 text-xs text-gray-700 dark:text-gray-300 text-left">
                    <p className="font-semibold text-foreground">University of Horticultural Sciences, Bagalkot</p>
                    <p className="text-[11px] mt-0.5 text-gray-600 dark:text-gray-400">Crop Improvement &amp; Sustainable Soil Biology</p>
                  </div>
                </div>
              </div>

              {/* Bio Content */}
              <div className="flex flex-col justify-between space-y-4">
                <div>
                  <div className="border-b border-border/70 pb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-secondary">
                      Founder, Managing Director &amp; Lead Scientist
                    </span>
                    <h3 className="font-display text-2xl sm:text-3xl font-bold text-foreground mt-1">
                      Dr. Rashmi Mallikarjun Hegde
                    </h3>
                    <p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mt-1">
                      Agricultural Biotechnology Scientist, Entrepreneur &amp; Sustainability Advocate
                    </p>
                  </div>

                  <div className="mt-5 space-y-3.5 text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed text-justify sm:text-left">
                    <p>
                      Dr. Rashmi Mallikarjun Hegde is an agricultural biotechnology scientist, entrepreneur and
                      sustainability advocate with a Ph.D. in Agricultural Biotechnology and Crop Improvement from the
                      University of Horticultural Sciences, Bagalkot.
                    </p>
                    <p>
                      With over seven years of experience as an Assistant Professor in agricultural colleges across
                      Maharashtra and Goa, she has contributed to teaching, research, student mentoring and
                      agricultural extension.
                    </p>
                    <p>
                      Her expertise spans biological crop protection, beneficial microorganisms, biofertilizers,
                      biostimulants and sustainable plant health management. She has published research at national and
                      international levels, advancing knowledge in agricultural biotechnology.
                    </p>
                    <p>
                      As the Founder, Managing Director and Lead Scientist of Plant Health Solutions Pvt. Ltd., she
                      leads the development of science-driven, farmer-centric solutions that improve soil health,
                      crop productivity and agricultural sustainability.
                    </p>
                    <p>
                      A participant in the Goldman Sachs 10,000 Women programme, Dr. Hegde continues to combine
                      scientific innovation with entrepreneurial leadership to bridge the gap between research and
                      real-world farming. Her mission is to empower farmers through practical, sustainable and
                      effective biological agricultural solutions.
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border/60 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-700 dark:text-gray-300">
                  <div className="flex items-center gap-2">
                    <Microscope className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-foreground">Core Focus:</span> Microbial Formulation &amp; Crop Protection
                  </div>
                  <div className="text-xs text-secondary font-semibold">
                    Plant Health Solutions Pvt. Ltd.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Co-Founder Profile: Mr. Prashant Dhondiram Teli */}
          <div className="overflow-hidden rounded-3xl border border-border/80 bg-card shadow-md transition-all hover:shadow-xl">
            <div className="grid gap-8 lg:grid-cols-[380px_1fr] p-6 sm:p-8 lg:p-10">
              {/* Photo & Highlights */}
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-5">
                <div className="relative w-full max-w-xs sm:max-w-none aspect-[3/3.8] overflow-hidden rounded-2xl border-2 border-secondary/30 shadow-sm bg-muted">
                  <img
                    src="/team/mr-prashant-teli.jpg"
                    alt="Mr. Prashant Dhondiram Teli"
                    className="h-full w-full object-cover object-top transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-secondary/90 backdrop-blur-xs px-3 py-1 text-[11px] font-bold text-white shadow-xs">
                      Co-Founder &amp; CEO
                    </span>
                  </div>
                </div>

                <div className="w-full space-y-2.5">
                  <div className="inline-flex flex-wrap gap-2 justify-center sm:justify-start">
                    <span className="inline-flex items-center gap-1 rounded-lg bg-blue-500/10 px-2.5 py-1 text-xs font-semibold text-blue-800 dark:text-blue-300">
                      <Briefcase className="h-3.5 w-3.5" /> 17+ Years Corporate Exp.
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Agriculture &amp; MBA
                    </span>
                  </div>
                  <div className="rounded-xl border border-border/60 bg-muted/30 p-3 text-xs text-gray-700 dark:text-gray-300 text-left">
                    <p className="font-semibold text-foreground">Grassroots Farmer Engagement</p>
                    <p className="text-[11px] mt-0.5 text-gray-600 dark:text-gray-400">Market Development &amp; Strategic Partnerships</p>
                  </div>
                </div>
              </div>

              {/* Bio Content */}
              <div className="flex flex-col justify-between space-y-4">
                <div>
                  <div className="border-b border-border/70 pb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-secondary">
                      Co-Founder &amp; Chief Executive Officer (CEO)
                    </span>
                    <h3 className="font-display text-2xl sm:text-3xl font-bold text-foreground mt-1">
                      Mr. Prashant Dhondiram Teli
                    </h3>
                    <p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mt-1">
                      Agricultural Entrepreneur, Corporate Strategist &amp; Agribusiness Leader
                    </p>
                  </div>

                  <div className="mt-5 space-y-3.5 text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed text-justify sm:text-left">
                    <p>
                      Mr. Prashant Dhondiram Teli is an agricultural entrepreneur and the Co-Founder and Chief Executive
                      Officer of Plant Health Solutions Pvt. Ltd. With a background in Agriculture and an MBA, he brings
                      approximately 17 years of corporate experience, along with extensive practical experience working
                      directly with farmers and understanding their needs, challenges and aspirations.
                    </p>
                    <p>
                      Throughout his professional career, Mr. Teli has developed expertise in business strategy, market
                      development, customer relationship management, strategic partnerships and agricultural enterprise
                      development. His corporate experience has strengthened his ability to lead teams, build business
                      networks, identify market opportunities and support the growth of innovative agricultural solutions.
                    </p>
                    <p>
                      In addition to his corporate experience, his close engagement with farmers has provided him with
                      valuable insights into field-level agricultural practices, crop health challenges and the practical
                      requirements of farming communities. This combination of corporate knowledge and grassroots
                      experience enables him to connect scientific innovation with real-world farming needs.
                    </p>
                    <p>
                      At PHS, he contributes to business strategy, market development, customer relationships,
                      strategic partnerships and the expansion of the company&apos;s biological agricultural solutions.
                      His role focuses on making science-driven biological inputs and sustainable crop health solutions
                      more accessible, practical and beneficial for farmers.
                    </p>
                    <p>
                      Working alongside Dr. Rashmi Hegde, he supports the company&apos;s mission to promote sustainable
                      agriculture and develop effective solutions that contribute to healthier crops, improved farm
                      productivity and long-term value for the agricultural ecosystem.
                    </p>
                    <p>
                      As a leader at PHS, Mr. Teli is committed to strengthening the company&apos;s market presence,
                      developing meaningful industry and institutional relationships, supporting farmers through
                      practical solutions and building a sustainable, growth-oriented agricultural enterprise.
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border/60 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-700 dark:text-gray-300">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-secondary" />
                    <span className="font-semibold text-foreground">Core Focus:</span> Strategy, Market Access &amp; Farmer Connectivity
                  </div>
                  <div className="text-xs text-secondary font-semibold">
                    Plant Health Solutions Pvt. Ltd.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Meet Our Team Section (Admin-manageable & Toggleable, Placed right below Founders) */}
      {isTeamSectionVisible && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8 border-t border-border/70">
          <div className="mb-10 flex flex-col items-start gap-3 md:mb-14">
            <span className="rounded-full bg-accent px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
              {state.settings.teamSectionBadge || "Leadership & Experts"}
            </span>
            <h2 className="max-w-3xl font-display text-3xl font-bold leading-tight text-primary md:text-4xl">
              {state.settings.teamSectionTitle || "Meet our team"}
            </h2>
            <p className="max-w-2xl text-sm sm:text-base text-muted-foreground">
              {state.settings.teamSectionSubtitle ||
                "Led by senior agronomists, biochemists, and farm operation specialists dedicated to advancing sustainable agriculture."}
            </p>
          </div>

          {activeTeam.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-8 text-center text-muted-foreground text-sm">
              Team members will be displayed here soon.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {activeTeam.map((member) => (
                <div
                  key={member.id}
                  className="group overflow-hidden rounded-3xl border border-border bg-card shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative aspect-[4/4.5] w-full overflow-hidden bg-muted">
                    {member.image ? (
                      <img
                        src={member.image}
                        alt={member.name}
                        className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary font-bold text-2xl">
                        {member.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                  <div className="p-5">
                    {member.department && (
                      <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">
                        {member.department}
                      </span>
                    )}
                    <h3 className="mt-2 font-display text-lg font-bold text-foreground">
                      {member.name}
                    </h3>
                    <p className="text-xs font-semibold text-muted-foreground">
                      {member.role}
                    </p>
                    {member.bio && (
                      <p className="mt-2 text-xs text-muted-foreground/90 leading-relaxed line-clamp-2">
                        {member.bio}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

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
