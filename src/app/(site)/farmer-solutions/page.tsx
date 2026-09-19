"use client";

import * as React from "react";
import { Bug, CalendarDays, Download, Leaf, MessageCircle, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { PageHero } from "@/components/site/Section";
import { ProductCard } from "@/components/site/ProductCard";
import { COMPANY, crops } from "@/lib/data";
import { useApp } from "@/lib/store";

export default function FarmerSolutionsPage() {
  const { state } = useApp();
  const [active, setActive] = React.useState(crops[0]?.slug ?? "cotton");
  const crop = crops.find((c) => c.slug === active) ?? crops[0];
  if (!crop) return null;

  return (
    <div>
      <PageHero
        title="Farmer Solutions"
        subtitle="Crop-wise disease, pest, nutrition and season guidance from the PHS agronomy team."
        image="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1920&q=70"
      />

      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="flex flex-wrap gap-2">
          {crops.map((c) => (
            <button
              key={c.slug}
              onClick={() => setActive(c.slug)}
              className={`rounded-full px-5 py-2 text-sm font-semibold ${active === c.slug ? "bg-primary text-primary-foreground" : "border border-border bg-card hover:bg-muted"}`}
            >
              {c.name}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h2 className="font-display text-2xl font-bold text-primary">{crop.name} Advisory</h2>
              <p className="mt-2 text-sm text-muted-foreground">{crop.summary}</p>
            </div>

            <Panel icon={ShieldAlert} title="Disease Identification & Control">
              {crop.diseases.map((d) => (
                <div key={d.name} className="rounded-xl border border-border p-4">
                  <p className="font-semibold text-foreground">{d.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{d.symptom}</p>
                  <p className="mt-1 text-sm text-secondary">Control: {d.control}</p>
                </div>
              ))}
            </Panel>

            <Panel icon={Bug} title="Pest Identification & Control">
              {crop.pests.map((d) => (
                <div key={d.name} className="rounded-xl border border-border p-4">
                  <p className="font-semibold text-foreground">{d.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{d.symptom}</p>
                  <p className="mt-1 text-sm text-secondary">Control: {d.control}</p>
                </div>
              ))}
            </Panel>

            <Panel icon={Leaf} title="Nutrition Management Schedule">
              {crop.nutrition.map((n) => (
                <div key={n.stage} className="rounded-xl border border-border p-4">
                  <p className="font-semibold text-foreground">{n.stage}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{n.schedule}</p>
                </div>
              ))}
            </Panel>

            <Panel icon={CalendarDays} title="Season Calendar">
              {crop.calendar.map((n) => (
                <div key={n.month} className="rounded-xl border border-border p-4">
                  <p className="font-semibold text-foreground">{n.month}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{n.activity}</p>
                </div>
              ))}
            </Panel>

            <div>
              <h3 className="font-display text-xl font-bold text-primary">Recommended PHS Products</h3>
              <div className="mt-4 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {crop.products.map((id) => {
                  const p = state.products.find((x) => x.id === id);
                  return p ? <ProductCard key={id} product={p} /> : null;
                })}
              </div>
            </div>
          </div>

          <aside className="h-fit space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="font-display text-lg font-semibold">Need a custom schedule?</h3>
            <p className="text-sm text-muted-foreground">
              Share your soil report and acreage with our agronomists for a free crop plan.
            </p>
            <a
              href={`https://wa.me/${COMPANY.whatsapp}?text=${encodeURIComponent(`Hello PHS, I need advisory for my ${crop.name} crop.`)}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 rounded-full bg-secondary py-2.5 text-sm font-semibold text-secondary-foreground"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp Agronomist
            </a>
            <button
              onClick={() => {
                const text = [
                  `${crop.name} Advisory — Plant Health Solutions Pvt. Ltd.`,
                  crop.summary,
                  "",
                  "Diseases:",
                  ...crop.diseases.map((d) => `- ${d.name}: ${d.control}`),
                  "",
                  "Pests:",
                  ...crop.pests.map((d) => `- ${d.name}: ${d.control}`),
                  "",
                  "Nutrition:",
                  ...crop.nutrition.map((n) => `- ${n.stage}: ${n.schedule}`),
                  "",
                  `Contact: ${COMPANY.phone} | ${COMPANY.email1}`,
                ].join("\n");
                const url = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
                const a = document.createElement("a");
                a.href = url;
                a.download = `${crop.slug}-advisory.txt`;
                a.click();
                URL.revokeObjectURL(url);
                toast.success("Advisory downloaded");
              }}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-border py-2.5 text-sm font-semibold"
            >
              <Download className="h-4 w-4" /> Download Advisory
            </button>
            <p className="text-xs text-muted-foreground">Helpline: {state.settings.phone}</p>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Panel({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <h3 className="flex items-center gap-2 font-display text-xl font-semibold text-primary">
        <Icon className="h-5 w-5 text-secondary" /> {title}
      </h3>
      <div className="mt-4 grid gap-3 md:grid-cols-2">{children}</div>
    </div>
  );
}
