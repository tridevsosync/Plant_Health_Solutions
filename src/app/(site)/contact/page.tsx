"use client";

import * as React from "react";
import Link from "next/link";
import {
  Building2,
  Clock,
  ExternalLink,
  FlaskConical,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { COMPANY } from "@/lib/data";
import { useApp } from "@/lib/store";

export default function ContactPage() {
  const { state, createEnquiry } = useApp();
  const [form, setForm] = React.useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Please fill in your name, email, and message.");
      return;
    }

    setIsSubmitting(true);
    const result = await createEnquiry({
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      subject: form.subject.trim() || "General Farming Enquiry",
      message: form.message.trim(),
    });

    setIsSubmitting(false);
    if (result.success) {
      setForm({ name: "", phone: "", email: "", subject: "", message: "" });
      toast.success("Enquiry submitted successfully! Our agronomist will contact you soon.");
    } else {
      toast.error(result.error || "Failed to submit enquiry. Please try again.");
    }
  };

  const s = state.settings;

  return (
    <div>
      {/* Hero Banner */}
      <section className="relative isolate overflow-hidden">
        <img
          src={
            s.contactHeroImage ||
            "https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=1920&q=80"
          }
          alt={s.contactHeroTitle || "Contact Plant Health Solutions"}
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#122b17]/95 via-[#183a1f]/90 to-[#285724]/80 backdrop-blur-[0.5px]" />
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
            <Sparkles className="h-3.5 w-3.5" /> {s.contactHeroBadge || "Direct Farmer & Dealer Support"}
          </span>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold md:text-5xl leading-tight text-white">
            {s.contactHeroTitle || "Get in Touch with Our Agronomists"}
          </h1>
          <p className="mt-3 max-w-2xl text-base text-white/85 md:text-lg leading-relaxed">
            {s.contactHeroSubtitle ||
              "Whether you need crop advice, soil test recommendations, dealership inquiries, or bulk orders, our research and extension team is here to help."}
          </p>
        </div>
      </section>

      {/* Quick Contact Info Cards */}
      <section className="mx-auto -mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card 1: Phone */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/40 text-primary">
              <Phone className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-display text-base font-bold text-primary">Call Helpline</h3>
            <p className="mt-1 text-xs text-muted-foreground">{s.workingHours || "Mon – Sat, 9:00 AM – 6:30 PM"}</p>
            <a
              href={`tel:${(s.phone || COMPANY.phone).replace(/[^0-9+]/g, "")}`}
              className="mt-3 block text-sm font-semibold text-secondary hover:text-primary transition-colors"
            >
              {s.phone || COMPANY.phone}
            </a>
          </div>

          {/* Card 2: WhatsApp */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#25D366]/20 text-[#128C7E]">
              <MessageCircle className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-display text-base font-bold text-primary">WhatsApp Advisory</h3>
            <p className="mt-1 text-xs text-muted-foreground">Quick crop solutions &amp; photos</p>
            <a
              href={`https://wa.me/${(s.whatsapp || s.phone || COMPANY.whatsapp || COMPANY.phone).replace(/[^0-9]/g, "")}?text=${encodeURIComponent("Hello PHS, I would like to get advice on crop solutions.")}`}
              target="_blank"
              rel="noreferrer"
              className="mt-3 block text-sm font-semibold text-[#128C7E] hover:underline"
            >
              Chat on WhatsApp &rarr;
            </a>
          </div>

          {/* Card 3: Email */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/40 text-primary">
              <Mail className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-display text-base font-bold text-primary">Email Support</h3>
            <p className="mt-1 text-xs text-muted-foreground">Response within 24 business hours</p>
            <a
              href={`mailto:${s.email1 || COMPANY.email1 || "planthealthsol@gmail.com"}`}
              className="mt-3 block text-sm font-semibold text-secondary hover:text-primary transition-colors truncate"
            >
              {s.email1 || COMPANY.email1 || "planthealthsol@gmail.com"}
            </a>
          </div>

          {/* Card 4: Research Center */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/40 text-primary">
              <MapPin className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-display text-base font-bold text-primary">Research Center</h3>
            <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
              {s.facilityLocationTitle || "NH-52, Tidagundi, Vijayapura"}
            </p>
            <span className="mt-3 block text-xs font-semibold text-muted-foreground line-clamp-1">
              {s.address ? s.address.split(",").slice(-2).join(",").trim() : "Karnataka 586119"}
            </span>
          </div>
        </div>
      </section>

      {/* Main Interaction Section: Form + Center Details */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-20 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          {/* Left: Redesigned Enquiry Form */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary/15 text-secondary">
                <Send className="h-4 w-4" />
              </span>
              <h2 className="font-display text-2xl font-bold text-primary">
                {s.enquiryFormTitle || "Send an Enquiry"}
              </h2>
            </div>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              {s.enquiryFormSubtitle ||
                "Fill out the form below and our agronomy extension team will review your query and get back to you promptly."}
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Full Name <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Enter your full name"
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none transition-all focus:border-secondary focus:ring-1 focus:ring-secondary"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Phone Number <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none transition-all focus:border-secondary focus:ring-1 focus:ring-secondary"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Email Address <span className="text-muted-foreground">(Optional)</span>
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="yourname@gmail.com"
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none transition-all focus:border-secondary focus:ring-1 focus:ring-secondary"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Subject / Topic
                  </label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="e.g. Dealership, Crop Advice, Order"
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none transition-all focus:border-secondary focus:ring-1 focus:ring-secondary"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Your Message or Problem Description <span className="text-destructive">*</span>
                </label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Describe your crop, acreage, disease symptoms, or inquiry details..."
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none transition-all focus:border-secondary focus:ring-1 focus:ring-secondary leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-secondary disabled:opacity-70 sm:w-auto sm:px-8"
              >
                <Send className="h-4 w-4" />
                {isSubmitting ? "Submitting..." : "Submit Enquiry"}
              </button>

              <div className="pt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground border-t border-border/60">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-secondary" /> Free Agronomy Advisory
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-secondary" /> Fast 24-hour Response
                </span>
              </div>
            </form>
          </div>

          {/* Right: Facility Details & Location */}
          <div className="space-y-6">
            {/* Center Info Card */}
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-7">
              <h3 className="font-display text-xl font-bold text-primary">
                {s.facilityName || "Horticulture Research & Extension Center"}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {s.facilityDescription ||
                  "Our 40-acre center on National Highway 52 houses state-of-the-art microbiology testing, blending plants, and demonstration plots."}
              </p>

              <div className="mt-5 space-y-3.5 border-t border-border/60 pt-4 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                  <span className="text-muted-foreground leading-relaxed">
                    {s.address ||
                      COMPANY.address ||
                      "NH-52, Vijayapur - Solapur Road, Tidagundi, Vijayapura, Karnataka 586119"}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 shrink-0 text-secondary" />
                  <a
                    href={`tel:${(s.phone || COMPANY.phone).replace(/[^0-9+]/g, "")}`}
                    className="font-medium text-foreground hover:text-secondary transition-colors"
                  >
                    {s.phone || COMPANY.phone}
                  </a>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 shrink-0 text-secondary" />
                  <a
                    href={`mailto:${s.email1 || COMPANY.email1 || "hello@planthealthsolutions.com"}`}
                    className="font-medium text-foreground hover:text-secondary transition-colors truncate"
                  >
                    {s.email1 || COMPANY.email1 || "hello@planthealthsolutions.com"}
                  </a>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 shrink-0 text-secondary" />
                  <span className="text-muted-foreground">
                    {s.workingHours || "Mon – Sat: 9:00 AM – 6:30 PM"}
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border/60">
                <a
                  href={
                    s.googleMapsUrl ||
                    `https://maps.google.com/?q=${encodeURIComponent(s.address || "Plant Health Solutions Tidagundi Vijayapura")}`
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-background py-2.5 text-sm font-semibold text-primary transition hover:bg-muted"
                >
                  <ExternalLink className="h-4 w-4" /> Open in Google Maps
                </a>
              </div>
            </div>

            {/* Photo Map Preview */}
            <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
              <div className="relative h-48 w-full bg-muted">
                <img
                  src={
                    s.facilityImage ||
                    "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80"
                  }
                  alt={s.facilityLocationTitle || "PHS Tidagundi Research Center"}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end p-5">
                  <div className="text-white">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#a8d672]">
                      Facility Location
                    </p>
                    <p className="font-display text-lg font-bold">
                      {s.facilityLocationTitle || "Tidagundi, Vijayapura (NH-52)"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Action Banners: Dealership & Soil Testing */}
      <section className="pb-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl grid gap-6 md:grid-cols-2">
          {/* Banner 1: Dealership */}
          <div className="rounded-3xl border border-border bg-card p-8 shadow-sm flex flex-col justify-between">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/30 text-primary px-3 py-1 text-xs font-semibold uppercase tracking-wider">
                <Building2 className="h-3.5 w-3.5" /> {s.dealerBadge || "Distribution Network"}
              </span>
              <h3 className="mt-4 font-display text-2xl font-bold text-primary">
                {s.dealerTitle || "Become an Authorized Dealer"}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {s.dealerDesc ||
                  "Join our 300+ strong dealer network across Karnataka, Maharashtra, AP, Telangana, and MP. Benefit from high-demand research-backed formulations and marketing support."}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-border/60">
              <a
                href={`https://wa.me/${(s.whatsapp || s.phone || COMPANY.whatsapp).replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                  s.dealerWhatsappText || "Hello, I am interested in dealership registration with Plant Health Solutions."
                )}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-secondary hover:text-primary transition-colors"
              >
                {s.dealerButtonText || "Inquire for Dealership →"}
              </a>
            </div>
          </div>

          {/* Banner 2: Free Soil Testing */}
          <div className="rounded-3xl border border-border bg-card p-8 shadow-sm flex flex-col justify-between">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/30 text-primary px-3 py-1 text-xs font-semibold uppercase tracking-wider">
                <FlaskConical className="h-3.5 w-3.5" /> {s.soilTestingBadge || "Soil Health"}
              </span>
              <h3 className="mt-4 font-display text-2xl font-bold text-primary">
                {s.soilTestingTitle || "Free Soil & Water Testing"}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {s.soilTestingDesc ||
                  "Bring or courier your soil and water sample to our Tidagundi lab. Our chief agronomists will analyze pH, organic carbon, and micronutrient status free of cost."}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-border/60">
              <Link
                href={s.soilTestingLinkUrl || "/farmer-solutions"}
                className="inline-flex items-center gap-2 text-sm font-semibold text-secondary hover:text-primary transition-colors"
              >
                {s.soilTestingButtonText || "Explore Crop Solutions →"}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
