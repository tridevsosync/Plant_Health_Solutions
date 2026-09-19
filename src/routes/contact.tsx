import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { toast } from "sonner";
import { PageHero } from "@/components/site/Section";
import { COMPANY } from "@/lib/data";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — Plant Health Solutions" },
      { name: "description", content: "Reach our Tidagundi research center by phone, email or WhatsApp for agronomy support." },
      { property: "og:title", content: "Contact Us — Plant Health Solutions" },
      { property: "og:description", content: "Reach our Tidagundi research center by phone, email or WhatsApp for agronomy support." },
    ],
  }),
  component: Contact,
});

const faqs = [
  ["Do you deliver across India?", "Yes, we dispatch pan-India. Orders above Rs. 2,000 ship free; others carry a flat Rs. 90 charge."],
  ["Can I get a free crop schedule?", "Yes. Share your soil report and acreage on WhatsApp and our agronomist will prepare a season plan."],
  ["Are your products organic certified?", "Our biological range is approved for organic input use; certificates are available on request."],
  ["Do you offer dealership?", "We appoint taluk-level dealers. Use the enquiry form and select Dealership as the subject."],
];

function Contact() {
  const { state, set } = useApp();
  const [form, setForm] = React.useState({ name: "", phone: "", email: "", subject: "Product Enquiry", message: "" });
  const [open, setOpen] = React.useState<number | null>(0);

  return (
    <div>
      <PageHero title="Contact Us" subtitle="Talk to the Plant Health Solutions research and extension team." />
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 lg:grid-cols-[1fr_380px]">
        <form
          className="rounded-2xl border border-border bg-card p-6 shadow-sm"
          onSubmit={(e) => {
            e.preventDefault();
            if (!form.name || !form.phone || !form.message) {
              toast.error("Please fill name, phone and message");
              return;
            }
            set((s) => ({
              ...s,
              enquiries: [
                { id: `E${Date.now()}`, ...form, date: new Date().toISOString().slice(0, 10), status: "New" as const },
                ...s.enquiries,
              ],
            }));
            setForm({ name: "", phone: "", email: "", subject: "Product Enquiry", message: "" });
            toast.success("Enquiry submitted — our team will contact you");
          }}
        >
          <h2 className="font-display text-2xl font-bold text-primary">Send an Enquiry</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" className="rounded-lg border border-border bg-background px-3 py-2 text-sm" />
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone" className="rounded-lg border border-border bg-background px-3 py-2 text-sm" />
            <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" className="rounded-lg border border-border bg-background px-3 py-2 text-sm" />
            <select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="rounded-lg border border-border bg-background px-3 py-2 text-sm">
              {["Product Enquiry", "Dealership", "Agronomy Advice", "Bulk Order", "Complaint"].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={5} placeholder="Your message" className="sm:col-span-2 rounded-lg border border-border bg-background px-3 py-2 text-sm" />
          </div>
          <button className="mt-4 rounded-full bg-primary px-7 py-2.5 text-sm font-semibold text-primary-foreground">Submit Enquiry</button>
        </form>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="font-display text-lg font-semibold text-primary">Research Center</h3>
            <p className="mt-3 flex gap-2 text-sm text-muted-foreground"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />{state.settings.address}</p>
            <p className="mt-2 flex gap-2 text-sm text-muted-foreground"><Phone className="h-4 w-4 text-secondary" />{state.settings.phone}</p>
            <p className="mt-2 flex gap-2 text-sm text-muted-foreground"><Mail className="h-4 w-4 text-secondary" />{state.settings.email1}</p>
            <p className="mt-2 flex gap-2 text-sm text-muted-foreground"><Mail className="h-4 w-4 text-secondary" />{state.settings.email2}</p>
            <p className="mt-2 flex gap-2 text-sm text-muted-foreground"><Clock className="h-4 w-4 text-secondary" />Mon - Sat, 9:00 AM to 6:30 PM</p>
            <a
              href={`https://wa.me/${COMPANY.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="mt-4 flex items-center justify-center gap-2 rounded-full bg-secondary py-2.5 text-sm font-semibold text-secondary-foreground"
            >
              <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
            </a>
          </div>
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="relative h-56 bg-muted">
              <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=70" alt="Map" className="h-full w-full object-cover opacity-80" />
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-primary/40 text-center text-white">
                <MapPin className="h-7 w-7" />
                <p className="mt-1 text-sm font-semibold">Tidagundi, Vijayapura</p>
                <p className="text-xs">NH-52, Vijayapur - Solapur Road</p>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <div className="mx-auto max-w-3xl px-4 pb-16">
        <h2 className="font-display text-2xl font-bold text-primary">Frequently Asked Questions</h2>
        <div className="mt-4 space-y-2">
          {faqs.map(([q, a], i) => (
            <div key={q} className="rounded-xl border border-border bg-card">
              <button onClick={() => setOpen(open === i ? null : i)} className="flex w-full justify-between px-5 py-4 text-left text-sm font-semibold">
                {q}<span>{open === i ? "-" : "+"}</span>
              </button>
              {open === i && <p className="px-5 pb-4 text-sm text-muted-foreground">{a}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
