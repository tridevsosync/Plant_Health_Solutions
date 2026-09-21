"use client";

import * as React from "react";
import Link from "next/link";
import {
  Building2,
  Phone,
  Truck,
  Globe,
  Save,
  RotateCcw,
  Loader2,
  CheckCircle2,
  Sparkles,
  Mail,
  MapPin,
  FileText,
  ShieldCheck,
  ExternalLink,
  MessageCircle,
  FlaskConical,
  Clock,
  LayoutTemplate,
  Send,
  Image as ImageIcon,
  Compass,
} from "lucide-react";
import { toast } from "sonner";
import { inr, useApp, type Settings } from "@/lib/store";
import { AdminPage, Btn, Field, Panel, inputCls } from "@/components/site/AdminUI";

type TabKey = "general" | "contact" | "contactPage" | "store" | "social";

export default function AdminSettingsPage() {
  const { state, saveSettings, refreshData } = useApp();
  const [form, setForm] = React.useState<Settings>(state.settings);
  const [activeTab, setActiveTab] = React.useState<TabKey>("general");
  const [saving, setSaving] = React.useState(false);
  const [lastSaved, setLastSaved] = React.useState<Date | null>(null);

  // Synchronize form with store settings
  React.useEffect(() => {
    setForm(state.settings);
  }, [state.settings]);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      const ok = await saveSettings(form);
      if (ok) {
        setLastSaved(new Date());
        toast.success("Settings saved to MongoDB Atlas & updated across website!");
        await refreshData();
      } else {
        toast.error("Failed to save settings. Please try again.");
      }
    } catch {
      toast.error("An error occurred while saving settings.");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setForm(state.settings);
    toast.info("Reset form to current saved database settings.");
  };

  const tabs: { id: TabKey; label: string; icon: React.ElementType }[] = [
    { id: "general", label: "Company Profile", icon: Building2 },
    { id: "contact", label: "Contact & Helplines", icon: Phone },
    { id: "contactPage", label: "Contact Page Customizer", icon: LayoutTemplate },
    { id: "store", label: "Store & Shipping", icon: Truck },
    { id: "social", label: "Social Links", icon: Globe },
  ];

  return (
    <AdminPage
      title="Company & Website Settings"
      subtitle="Configure company identity, contact numbers, Contact Us page details, announcement banners, shipping thresholds, and social links saved in MongoDB Atlas."
      action={
        <div className="flex items-center gap-2">
          <Btn variant="ghost" onClick={handleReset} disabled={saving}>
            <RotateCcw className="h-4 w-4 mr-1.5" /> Discard
          </Btn>
          <Btn onClick={() => handleSave()} disabled={saving}>
            {saving ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Saving...
              </span>
            ) : (
              <span className="inline-flex items-center gap-2">
                <Save className="h-4 w-4" /> Save Changes
              </span>
            )}
          </Btn>
        </div>
      }
    >
      {/* Database Status Banner */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-primary/10 border border-primary/20 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-foreground">MongoDB Atlas Synced: `company_settings`</p>
            <p className="text-[11px] text-muted-foreground">
              {lastSaved
                ? `Last updated: ${lastSaved.toLocaleTimeString()}`
                : "Live configuration active across client, Contact page, checkout, invoice headers & footers."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <Link
            href="/contact"
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1 font-semibold text-primary hover:bg-muted transition-colors shadow-2xs"
          >
            <ExternalLink className="h-3.5 w-3.5" /> View Live /contact
          </Link>
          <div className="flex items-center gap-1.5 text-secondary font-semibold">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Website Connected
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* Left: Settings Form Tabs & Fields */}
        <div className="space-y-6">
          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2 border-b border-border pb-3">
            {tabs.map((t) => {
              const Icon = t.icon;
              const active = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveTab(t.id)}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition-all ${
                    active
                      ? "bg-primary text-primary-foreground shadow-sm font-bold"
                      : "border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {t.label}
                </button>
              );
            })}
          </div>

          <Panel>
            {/* Tab 1: General & Company Profile */}
            {activeTab === "general" && (
              <div className="space-y-5">
                <div>
                  <h3 className="font-display text-base font-bold text-foreground">Company Identity</h3>
                  <p className="text-xs text-muted-foreground">
                    Legal business name, ownership details, and tax identification.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Company Legal Name">
                    <input
                      className={inputCls}
                      value={form.name || ""}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Plant Health Solutions Pvt. Ltd."
                    />
                  </Field>

                  <Field label="Managing Director / Owner">
                    <input
                      className={inputCls}
                      value={form.owner || ""}
                      onChange={(e) => setForm({ ...form, owner: e.target.value })}
                      placeholder="e.g. Dr. R. M. Kulkarni"
                    />
                  </Field>

                  <Field label="GSTIN / Tax Identification Number">
                    <input
                      className={inputCls}
                      value={form.gst || ""}
                      onChange={(e) => setForm({ ...form, gst: e.target.value.toUpperCase() })}
                      placeholder="e.g. 29AAGCP1234F1Z5"
                    />
                  </Field>

                  <div className="sm:col-span-2">
                    <Field label="Company About / Mission Statement">
                      <textarea
                        rows={4}
                        className={inputCls}
                        value={form.description || ""}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        placeholder="Comprehensive description of agricultural inputs and research mission..."
                      />
                    </Field>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Contact & Helplines */}
            {activeTab === "contact" && (
              <div className="space-y-5">
                <div>
                  <h3 className="font-display text-base font-bold text-foreground">Communication Channels & Timings</h3>
                  <p className="text-xs text-muted-foreground">
                    Public phone numbers, WhatsApp assistance, email addresses, and general office timings.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Primary Helpline Phone">
                    <input
                      className={inputCls}
                      value={form.phone || ""}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+91 91759 55009"
                    />
                  </Field>

                  <Field label="WhatsApp Support Number">
                    <input
                      className={inputCls}
                      value={form.whatsapp || ""}
                      onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                      placeholder="+91 91759 55009 or 919175955009"
                    />
                  </Field>

                  <Field label="Primary Official Email (Orders & Inquiries)">
                    <input
                      type="email"
                      className={inputCls}
                      value={form.email1 || ""}
                      onChange={(e) => setForm({ ...form, email1: e.target.value })}
                      placeholder="planthealthsol@gmail.com"
                    />
                  </Field>

                  <Field label="Secondary / Technical Support Email">
                    <input
                      type="email"
                      className={inputCls}
                      value={form.email2 || ""}
                      onChange={(e) => setForm({ ...form, email2: e.target.value })}
                      placeholder="dr_prashant84@yahoo.com"
                    />
                  </Field>

                  <Field label="Working / Operating Hours">
                    <input
                      className={inputCls}
                      value={form.workingHours || ""}
                      onChange={(e) => setForm({ ...form, workingHours: e.target.value })}
                      placeholder="e.g. Mon – Sat: 9:00 AM – 6:30 PM"
                    />
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      Displayed on the Contact page, Helpline cards, and customer invoices.
                    </p>
                  </Field>

                  <div className="sm:col-span-2">
                    <Field label="Research Center & Head Office Postal Address">
                      <textarea
                        rows={3}
                        className={inputCls}
                        value={form.address || ""}
                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                        placeholder="Complete postal address for orders and invoices..."
                      />
                    </Field>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Contact Page Customizer */}
            {activeTab === "contactPage" && (
              <div className="space-y-8">
                {/* Section 1: Hero Header */}
                <div className="space-y-4 rounded-2xl border border-border bg-muted/20 p-4 sm:p-5">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/15 text-primary">
                      <Sparkles className="h-4 w-4" />
                    </span>
                    <div>
                      <h3 className="font-display text-sm font-bold text-foreground">
                        1. Contact Hero Header &amp; Banner
                      </h3>
                      <p className="text-[11px] text-muted-foreground">
                        Main top banner badge, heading, description, and cover image on `/contact`.
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Hero Badge Text">
                      <input
                        className={inputCls}
                        value={form.contactHeroBadge || ""}
                        onChange={(e) => setForm({ ...form, contactHeroBadge: e.target.value })}
                        placeholder="e.g. Direct Farmer & Dealer Support"
                      />
                    </Field>

                    <Field label="Hero Main Heading">
                      <input
                        className={inputCls}
                        value={form.contactHeroTitle || ""}
                        onChange={(e) => setForm({ ...form, contactHeroTitle: e.target.value })}
                        placeholder="e.g. Get in Touch with Our Agronomists"
                      />
                    </Field>

                    <div className="sm:col-span-2">
                      <Field label="Hero Subtitle / Description">
                        <textarea
                          rows={2}
                          className={inputCls}
                          value={form.contactHeroSubtitle || ""}
                          onChange={(e) => setForm({ ...form, contactHeroSubtitle: e.target.value })}
                          placeholder="e.g. Whether you need crop advice, soil test recommendations, dealership inquiries..."
                        />
                      </Field>
                    </div>

                    <div className="sm:col-span-2">
                      <Field label="Hero Background Image URL">
                        <input
                          type="url"
                          className={inputCls}
                          value={form.contactHeroImage || ""}
                          onChange={(e) => setForm({ ...form, contactHeroImage: e.target.value })}
                          placeholder="https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=1920&q=80"
                        />
                      </Field>
                    </div>
                  </div>
                </div>

                {/* Section 2: Facility & Location Card */}
                <div className="space-y-4 rounded-2xl border border-border bg-muted/20 p-4 sm:p-5">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/15 text-primary">
                      <MapPin className="h-4 w-4" />
                    </span>
                    <div>
                      <h3 className="font-display text-sm font-bold text-foreground">
                        2. Research Center &amp; Google Maps
                      </h3>
                      <p className="text-[11px] text-muted-foreground">
                        Facility title, description, photo preview, and Google Maps direction link on the right column.
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Facility / Center Name">
                      <input
                        className={inputCls}
                        value={form.facilityName || ""}
                        onChange={(e) => setForm({ ...form, facilityName: e.target.value })}
                        placeholder="e.g. Horticulture Research & Extension Center"
                      />
                    </Field>

                    <Field label="Facility Location Title / Caption">
                      <input
                        className={inputCls}
                        value={form.facilityLocationTitle || ""}
                        onChange={(e) => setForm({ ...form, facilityLocationTitle: e.target.value })}
                        placeholder="e.g. Tidagundi, Vijayapura (NH-52)"
                      />
                    </Field>

                    <div className="sm:col-span-2">
                      <Field label="Facility Description / Facilities Offered">
                        <textarea
                          rows={2}
                          className={inputCls}
                          value={form.facilityDescription || ""}
                          onChange={(e) => setForm({ ...form, facilityDescription: e.target.value })}
                          placeholder="e.g. Our 40-acre center on National Highway 52 houses state-of-the-art microbiology testing..."
                        />
                      </Field>
                    </div>

                    <Field label="Facility Photo Image URL">
                      <input
                        type="url"
                        className={inputCls}
                        value={form.facilityImage || ""}
                        onChange={(e) => setForm({ ...form, facilityImage: e.target.value })}
                        placeholder="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80"
                      />
                    </Field>

                    <Field label="Google Maps Directions URL">
                      <input
                        type="url"
                        className={inputCls}
                        value={form.googleMapsUrl || ""}
                        onChange={(e) => setForm({ ...form, googleMapsUrl: e.target.value })}
                        placeholder="https://maps.google.com/?q=Plant+Health+Solutions+Tidagundi+Vijayapura"
                      />
                    </Field>
                  </div>
                </div>

                {/* Section 3: Enquiry Form Details */}
                <div className="space-y-4 rounded-2xl border border-border bg-muted/20 p-4 sm:p-5">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/15 text-primary">
                      <Send className="h-4 w-4" />
                    </span>
                    <div>
                      <h3 className="font-display text-sm font-bold text-foreground">
                        3. Enquiry Form Headings
                      </h3>
                      <p className="text-[11px] text-muted-foreground">
                        Headings displayed above the farmer query submission form.
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Enquiry Form Title">
                      <input
                        className={inputCls}
                        value={form.enquiryFormTitle || ""}
                        onChange={(e) => setForm({ ...form, enquiryFormTitle: e.target.value })}
                        placeholder="e.g. Send an Enquiry"
                      />
                    </Field>

                    <div className="sm:col-span-2">
                      <Field label="Enquiry Form Subtitle / Instructions">
                        <textarea
                          rows={2}
                          className={inputCls}
                          value={form.enquiryFormSubtitle || ""}
                          onChange={(e) => setForm({ ...form, enquiryFormSubtitle: e.target.value })}
                          placeholder="e.g. Fill out the form below and our agronomy extension team will review your query..."
                        />
                      </Field>
                    </div>
                  </div>
                </div>

                {/* Section 4: Promotional Banners */}
                <div className="space-y-5 rounded-2xl border border-border bg-muted/20 p-4 sm:p-5">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/15 text-primary">
                      <Building2 className="h-4 w-4" />
                    </span>
                    <div>
                      <h3 className="font-display text-sm font-bold text-foreground">
                        4. Dealership &amp; Soil Testing Feature Cards
                      </h3>
                      <p className="text-[11px] text-muted-foreground">
                        Bottom promotional cards offering distribution partnerships and laboratory soil testing.
                      </p>
                    </div>
                  </div>

                  {/* Dealership Card Sub-section */}
                  <div className="rounded-xl border border-border bg-card p-4 space-y-3">
                    <h4 className="text-xs font-bold text-primary flex items-center gap-1.5">
                      <Building2 className="h-3.5 w-3.5" /> Card 1: Dealership Distribution Network
                    </h4>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field label="Badge Text">
                        <input
                          className={inputCls}
                          value={form.dealerBadge || ""}
                          onChange={(e) => setForm({ ...form, dealerBadge: e.target.value })}
                          placeholder="Distribution Network"
                        />
                      </Field>

                      <Field label="Card Title">
                        <input
                          className={inputCls}
                          value={form.dealerTitle || ""}
                          onChange={(e) => setForm({ ...form, dealerTitle: e.target.value })}
                          placeholder="Become an Authorized Dealer"
                        />
                      </Field>

                      <div className="sm:col-span-2">
                        <Field label="Card Description">
                          <textarea
                            rows={2}
                            className={inputCls}
                            value={form.dealerDesc || ""}
                            onChange={(e) => setForm({ ...form, dealerDesc: e.target.value })}
                            placeholder="Join our 300+ strong dealer network..."
                          />
                        </Field>
                      </div>

                      <Field label="Button Text">
                        <input
                          className={inputCls}
                          value={form.dealerButtonText || ""}
                          onChange={(e) => setForm({ ...form, dealerButtonText: e.target.value })}
                          placeholder="Inquire for Dealership →"
                        />
                      </Field>

                      <Field label="Pre-filled WhatsApp Message">
                        <input
                          className={inputCls}
                          value={form.dealerWhatsappText || ""}
                          onChange={(e) => setForm({ ...form, dealerWhatsappText: e.target.value })}
                          placeholder="Hello, I am interested in dealership registration with Plant Health Solutions."
                        />
                      </Field>
                    </div>
                  </div>

                  {/* Free Soil Testing Sub-section */}
                  <div className="rounded-xl border border-border bg-card p-4 space-y-3">
                    <h4 className="text-xs font-bold text-primary flex items-center gap-1.5">
                      <FlaskConical className="h-3.5 w-3.5" /> Card 2: Free Soil &amp; Water Testing
                    </h4>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field label="Badge Text">
                        <input
                          className={inputCls}
                          value={form.soilTestingBadge || ""}
                          onChange={(e) => setForm({ ...form, soilTestingBadge: e.target.value })}
                          placeholder="Soil Health"
                        />
                      </Field>

                      <Field label="Card Title">
                        <input
                          className={inputCls}
                          value={form.soilTestingTitle || ""}
                          onChange={(e) => setForm({ ...form, soilTestingTitle: e.target.value })}
                          placeholder="Free Soil & Water Testing"
                        />
                      </Field>

                      <div className="sm:col-span-2">
                        <Field label="Card Description">
                          <textarea
                            rows={2}
                            className={inputCls}
                            value={form.soilTestingDesc || ""}
                            onChange={(e) => setForm({ ...form, soilTestingDesc: e.target.value })}
                            placeholder="Bring or courier your soil and water sample to our Tidagundi lab..."
                          />
                        </Field>
                      </div>

                      <Field label="Button Text">
                        <input
                          className={inputCls}
                          value={form.soilTestingButtonText || ""}
                          onChange={(e) => setForm({ ...form, soilTestingButtonText: e.target.value })}
                          placeholder="Explore Crop Solutions →"
                        />
                      </Field>

                      <Field label="Button Redirect Link URL">
                        <input
                          className={inputCls}
                          value={form.soilTestingLinkUrl || ""}
                          onChange={(e) => setForm({ ...form, soilTestingLinkUrl: e.target.value })}
                          placeholder="/farmer-solutions"
                        />
                      </Field>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Store & Shipping */}
            {activeTab === "store" && (
              <div className="space-y-5">
                <div>
                  <h3 className="font-display text-base font-bold text-foreground">Store Policies & Announcements</h3>
                  <p className="text-xs text-muted-foreground">
                    Top banner announcements and automated checkout shipping rate calculations.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Field label="Top Announcement Banner Text">
                      <input
                        className={inputCls}
                        value={form.announcement || ""}
                        onChange={(e) => setForm({ ...form, announcement: e.target.value })}
                        placeholder="e.g. Free soil testing on orders above ₹5,000"
                      />
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        Shown at the very top bar of every page on the live website.
                      </p>
                    </Field>
                  </div>

                  <Field label="Free Shipping Minimum Order Amount (₹)">
                    <input
                      type="number"
                      className={inputCls}
                      value={form.freeShippingThreshold ?? 2000}
                      onChange={(e) =>
                        setForm({ ...form, freeShippingThreshold: Number(e.target.value) || 0 })
                      }
                      placeholder="2000"
                    />
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      Orders reaching this cart subtotal receive ₹0 shipping automatically.
                    </p>
                  </Field>

                  <Field label="Standard Flat Shipping Fee (₹)">
                    <input
                      type="number"
                      className={inputCls}
                      value={form.shippingFee ?? 90}
                      onChange={(e) =>
                        setForm({ ...form, shippingFee: Number(e.target.value) || 0 })
                      }
                      placeholder="90"
                    />
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      Applied when subtotal is below the free shipping threshold.
                    </p>
                  </Field>
                </div>
              </div>
            )}

            {/* Tab 5: Social Links */}
            {activeTab === "social" && (
              <div className="space-y-5">
                <div>
                  <h3 className="font-display text-base font-bold text-foreground">Social Networks & Community</h3>
                  <p className="text-xs text-muted-foreground">
                    Connect your agricultural community channels displayed in the footer and contact pages.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Facebook Page URL">
                    <input
                      type="url"
                      className={inputCls}
                      value={form.facebook || ""}
                      onChange={(e) => setForm({ ...form, facebook: e.target.value })}
                      placeholder="https://facebook.com/planthealthsolutions"
                    />
                  </Field>

                  <Field label="Instagram Profile URL">
                    <input
                      type="url"
                      className={inputCls}
                      value={form.instagram || ""}
                      onChange={(e) => setForm({ ...form, instagram: e.target.value })}
                      placeholder="https://instagram.com/planthealthsolutions"
                    />
                  </Field>

                  <Field label="YouTube Channel URL">
                    <input
                      type="url"
                      className={inputCls}
                      value={form.youtube || ""}
                      onChange={(e) => setForm({ ...form, youtube: e.target.value })}
                      placeholder="https://youtube.com/@planthealthsolutions"
                    />
                  </Field>

                  <Field label="Twitter / X Profile URL">
                    <input
                      type="url"
                      className={inputCls}
                      value={form.twitter || ""}
                      onChange={(e) => setForm({ ...form, twitter: e.target.value })}
                      placeholder="https://twitter.com/planthealthsol"
                    />
                  </Field>
                </div>
              </div>
            )}

            {/* Action Bar inside Panel */}
            <div className="mt-8 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-border">
              <span className="text-xs text-muted-foreground">
                Click <strong>Save Changes</strong> to broadcast updates immediately across the website.
              </span>
              <div className="flex gap-2">
                <Btn variant="ghost" onClick={handleReset} disabled={saving}>
                  <RotateCcw className="h-4 w-4 mr-1.5" /> Discard
                </Btn>
                <Btn onClick={() => handleSave()} disabled={saving}>
                  {saving ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2">
                      <Save className="h-4 w-4" /> Save Changes
                    </span>
                  )}
                </Btn>
              </div>
            </div>
          </Panel>
        </div>

        {/* Right: Live Preview Panel */}
        <aside className="space-y-5">
          <div className="rounded-3xl border border-border bg-card p-5 shadow-sm space-y-4">
            <h3 className="font-display text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" /> Live Store Preview
            </h3>

            {/* Contact Page Live Card Preview */}
            <div>
              <p className="text-[11px] font-semibold text-muted-foreground mb-1">
                Contact Page Facility Card:
              </p>
              <div className="rounded-2xl border border-border bg-card p-3.5 text-xs space-y-2.5 shadow-2xs">
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-secondary shrink-0" />
                  <p className="font-bold text-primary line-clamp-1">
                    {form.facilityName || "Horticulture Research & Extension Center"}
                  </p>
                </div>

                <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                  {form.facilityDescription ||
                    "Our 40-acre center on National Highway 52 houses state-of-the-art microbiology testing..."}
                </p>

                <div className="space-y-1.5 pt-2 border-t border-border/70 text-[11px] text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Phone className="h-3 w-3 text-secondary shrink-0" />
                    <span className="text-foreground font-medium">{form.phone || "+91 91759 55009"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-3 w-3 text-secondary shrink-0" />
                    <span className="truncate">{form.email1 || "planthealthsol@gmail.com"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3 text-secondary shrink-0" />
                    <span>{form.workingHours || "Mon – Sat: 9:00 AM – 6:30 PM"}</span>
                  </div>
                </div>

                {form.googleMapsUrl && (
                  <div className="pt-1">
                    <span className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-border bg-muted/40 py-1.5 text-[11px] font-semibold text-primary">
                      <ExternalLink className="h-3 w-3" /> Open in Google Maps
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Top Bar Preview */}
            <div>
              <p className="text-[11px] font-semibold text-muted-foreground mb-1">Header Top Bar:</p>
              <div className="rounded-xl bg-[#18361e] p-2.5 text-[#f4efe4] text-[11px] space-y-1 border border-[#234b2b]">
                <div className="flex items-center gap-1 text-[#a8d672] font-medium">
                  <Sparkles className="h-3 w-3 shrink-0" />
                  <span className="truncate">{form.announcement || "Free soil testing on orders above ₹5,000"}</span>
                </div>
                <div className="flex items-center gap-1 text-[#f4efe4]/80 text-[10px]">
                  <Phone className="h-3 w-3 text-[#a8d672]" />
                  <span>{form.phone || "+91 91759 55009"}</span>
                </div>
              </div>
            </div>

            {/* Footer / Invoice Branding Preview */}
            <div>
              <p className="text-[11px] font-semibold text-muted-foreground mb-1">Invoice &amp; Footer Branding:</p>
              <div className="rounded-xl border border-border bg-muted/50 p-3 text-xs space-y-1.5">
                <p className="font-bold text-foreground text-sm">{form.name || "Plant Health Solutions Pvt. Ltd."}</p>
                <p className="text-[11px] text-muted-foreground line-clamp-2">{form.address || "Tidagundi, Vijayapura"}</p>
                <div className="pt-1 border-t border-border/70 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                  <span>
                    <strong>GSTIN:</strong> {form.gst || "29AAGCP1234F1Z5"}
                  </span>
                  <span>
                    <strong>Director:</strong> {form.owner || "Dr. R. M. Kulkarni"}
                  </span>
                </div>
              </div>
            </div>

            {/* Shipping Policy Preview */}
            <div>
              <p className="text-[11px] font-semibold text-muted-foreground mb-1">Shipping Engine:</p>
              <div className="rounded-xl border border-border bg-muted/50 p-3 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Free Shipping Above:</span>
                  <span className="font-bold text-secondary">{inr(form.freeShippingThreshold ?? 2000)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Flat Delivery Fee:</span>
                  <span className="font-bold text-foreground">{inr(form.shippingFee ?? 90)}</span>
                </div>
              </div>
            </div>

            {/* Quick action helper links */}
            <div className="pt-2 border-t border-border space-y-1.5">
              <Link
                href="/contact"
                target="_blank"
                className="flex items-center justify-between rounded-xl p-2 text-xs font-semibold text-primary hover:bg-primary/10 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <LayoutTemplate className="h-3.5 w-3.5" /> Open /contact Page
                </span>
                <ExternalLink className="h-3.5 w-3.5 opacity-60" />
              </Link>
              {form.phone && (
                <a
                  href={`tel:${form.phone.replace(/[^0-9+]/g, "")}`}
                  className="flex items-center justify-between rounded-xl p-2 text-xs font-semibold text-primary hover:bg-primary/10 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5" /> Test Dial Helpline
                  </span>
                  <ExternalLink className="h-3.5 w-3.5 opacity-60" />
                </a>
              )}
              {form.whatsapp && (
                <a
                  href={`https://wa.me/${form.whatsapp.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between rounded-xl p-2 text-xs font-semibold text-emerald-600 hover:bg-emerald-500/10 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <MessageCircle className="h-3.5 w-3.5" /> Test WhatsApp Chat
                  </span>
                  <ExternalLink className="h-3.5 w-3.5 opacity-60" />
                </a>
              )}
            </div>
          </div>
        </aside>
      </div>
    </AdminPage>
  );
}
