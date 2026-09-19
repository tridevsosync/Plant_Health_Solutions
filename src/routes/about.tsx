import { createFileRoute, Link } from "@tanstack/react-router";
import { Award, CheckCircle2, FlaskConical, Leaf, Recycle, Target, Users } from "lucide-react";
import { PageHero, Section } from "@/components/site/Section";
import { stats } from "@/lib/data";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Plant Health Solutions Pvt. Ltd." },
      {
        name: "description",
        content:
          "The story of Plant Health Solutions, led by Dr. R. M. Kulkarni, and our horticulture research and manufacturing center at Tidagundi, Vijayapura.",
      },
      { property: "og:title", content: "About Plant Health Solutions Pvt. Ltd." },
      { property: "og:description", content: "Research, manufacturing and farmer extension since 2008." },
    ],
  }),
  component: About,
});

const timeline = [
  ["Problem Identification", "Field surveys and farmer interviews across Karnataka and Maharashtra identify the constraint."],
  ["Laboratory Formulation", "Strain selection, compatibility testing and shelf-life studies in our QC laboratory."],
  ["Green House Screening", "Pot culture trials measure germination, root biomass and nutrient uptake."],
  ["Multi-Location Field Trials", "Replicated demonstrations for three seasons across soil types."],
  ["Commercial Manufacturing", "Batch production with CFU and purity verification for every lot."],
  ["Farmer Extension", "Field officers convert products into crop-wise schedules and monitor results."],
];

const values = [
  { icon: Leaf, title: "Sustainability", text: "Biological first — reduce chemical load without compromising yield." },
  { icon: Target, title: "Farmer Outcome", text: "We measure success in quintals per acre and rupees saved." },
  { icon: FlaskConical, title: "Scientific Rigour", text: "No claim leaves our office without replicated trial data behind it." },
  { icon: Users, title: "Accessibility", text: "Advisory is free, in the local language, and delivered on the farm." },
];

function About() {
  const { state } = useApp();
  const s = state.settings;

  return (
    <div>
      <PageHero
        title="About Plant Health Solutions"
        subtitle={`${s.name} — research, manufacturing and extension for sustainable Indian agriculture.`}
        image="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1920&q=70"
      />

      <Section>
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">Our Story</span>
            <h2 className="mt-2 font-display text-3xl font-bold text-primary">Built on the Black Soils of Vijayapura</h2>
            <p className="mt-4 text-muted-foreground">
              {s.name} began as a small soil testing and advisory unit serving farmers around Tidagundi. Repeated
              observations of micronutrient deficiency, declining organic carbon and rising input cost pushed the team
              to start manufacturing biological inputs in-house rather than only recommending them.
            </p>
            <p className="mt-4 text-muted-foreground">
              Today the Horticulture Research and Extension Center on NH-52 houses a microbiology laboratory, a
              fermentation and blending plant, a packaging line and demonstration plots for cotton, sugarcane, paddy,
              pulses, vegetables and orchard crops.
            </p>
            <p className="mt-4 text-muted-foreground">{s.description}</p>
          </div>
          <img
            src="https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=1200&q=70"
            alt="Research center field"
            className="h-96 w-full rounded-2xl object-cover shadow"
          />
        </div>
      </Section>

      <Section muted>
        <div className="grid items-center gap-10 rounded-2xl bg-card p-8 shadow-sm lg:grid-cols-3">
          <img
            src="https://images.unsplash.com/photo-1582560475093-ba66accbc424?w=800&q=70"
            alt="Leadership"
            className="h-64 w-full rounded-xl object-cover"
          />
          <div className="lg:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">Leadership</span>
            <h2 className="mt-2 font-display text-3xl font-bold text-primary">{s.owner}</h2>
            <p className="mt-1 text-sm font-medium text-secondary">Founder & Managing Director</p>
            <p className="mt-4 text-muted-foreground">
              {s.owner} has spent close to two decades in horticulture research and farmer extension in North
              Karnataka. He leads product development at the Tidagundi center, personally reviews every trial data set
              and conducts monthly farmer training camps on soil health, integrated nutrient management and residue
              free production.
            </p>
            <p className="mt-4 text-muted-foreground">
              Under his direction the company has grown into a full-range manufacturer of bio fertilizers,
              biostimulants, bio control agents, organic manures, water soluble fertilizers and micronutrients.
            </p>
          </div>
        </div>
      </Section>

      <Section title="Research Center & Manufacturing" kicker="Tidagundi, Vijayapura">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            ["Microbiology Laboratory", "Strain isolation, CFU counting, contamination checks and shelf life studies."],
            ["Fermentation & Blending", "Liquid and carrier based bio fertilizer production with controlled batches."],
            ["Quality Control", "Every lot tested for purity, pH, moisture, nutrient content and heavy metals."],
            ["Demonstration Plots", "Live crop plots showcasing PHS schedules against farmer practice."],
            ["Soil & Water Testing", "Free soil report interpretation for farmers visiting the center."],
            ["Training Hall", "Monthly extension programmes during Kharif and Rabi seasons."],
          ].map(([t, d]) => (
            <div key={t} className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <CheckCircle2 className="h-5 w-5 text-secondary" />
              <h3 className="mt-3 font-display text-lg font-semibold">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Our Research Process" kicker="From Lab to Land" muted>
        <ol className="relative mx-auto max-w-3xl border-l-2 border-accent pl-6">
          {timeline.map(([t, d], i) => (
            <li key={t} className="mb-8">
              <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {i + 1}
              </span>
              <h3 className="font-display text-lg font-semibold text-primary">{t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{d}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section title="Sustainability Commitment" kicker="Green by Design">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            ["Soil Carbon Restoration", "Organic manure and microbial programmes that rebuild organic carbon."],
            ["Reduced Chemical Load", "Bio control agents and botanicals for residue free, export ready produce."],
            ["Water Use Efficiency", "Drip-compatible soluble grades that cut both water and fertilizer waste."],
          ].map(([t, d]) => (
            <div key={t} className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <Recycle className="h-5 w-5 text-secondary" />
              <h3 className="mt-3 font-display text-lg font-semibold">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Our Values" kicker="What Guides Us" muted>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => (
            <div key={v.title} className="rounded-xl border border-border bg-card p-6 text-center shadow-sm">
              <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-accent/40 text-primary">
                <v.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-3 font-display text-lg font-semibold">{v.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{v.text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Certifications & Recognition" kicker="Quality Credentials">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {["ISO 9001:2015 Manufacturing", "Fertilizer Control Order Licence", "Organic Input Approval", "State Agriculture Dept. Registered"].map(
            (c) => (
              <div key={c} className="flex items-center gap-3 rounded-xl border border-border bg-card p-5 shadow-sm">
                <Award className="h-6 w-6 shrink-0 text-secondary" />
                <p className="text-sm font-medium">{c}</p>
              </div>
            ),
          )}
        </div>
        <div className="mt-10 grid gap-4 rounded-2xl bg-primary p-8 text-primary-foreground sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((st) => (
            <div key={st.label} className="text-center">
              <p className="font-display text-3xl font-bold text-accent">{st.value}</p>
              <p className="mt-1 text-sm text-primary-foreground/80">{st.label}</p>
            </div>
          ))}
        </div>
      </Section>

      <section className="pb-16">
        <div className="mx-auto max-w-5xl rounded-2xl bg-secondary px-8 py-12 text-center text-secondary-foreground">
          <h2 className="font-display text-3xl font-bold">Talk to our agronomists</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-white/90">
            Share your soil report and cropping plan — we will build a season-long nutrition and protection schedule
            for your farm free of cost.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/contact" className="rounded-full bg-white px-7 py-3 text-sm font-semibold text-primary">
              Contact Us
            </Link>
            <Link
              to="/products"
              search={{ q: "", category: "" }}
              className="rounded-full border border-white px-7 py-3 text-sm font-semibold text-white"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
