"use client";

import * as React from "react";
import Link from "next/link";
import {
  Megaphone,
  Save,
  RotateCcw,
  Loader2,
  Sparkles,
  ExternalLink,
  Eye,
  CheckCircle2,
  X,
  ArrowRight,
  ImageIcon,
} from "lucide-react";
import { toast } from "sonner";
import { useApp, type Settings } from "@/lib/store";
import { AdminPage, Btn, Field, Panel, inputCls } from "@/components/site/AdminUI";
import { ImageUploader } from "@/components/site/ImageUploader";

export default function AdminAdsPage() {
  const { state, saveSettings, refreshData } = useApp();
  const [form, setForm] = React.useState<Settings>(state.settings);
  const [saving, setSaving] = React.useState(false);
  const [previewPopupOpen, setPreviewPopupOpen] = React.useState(false);

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
        toast.success("Pop-up & Ad Section updated successfully!");
        await refreshData();
      } else {
        toast.error("Failed to save settings. Please try again.");
      }
    } catch {
      toast.error("An error occurred while saving.");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setForm(state.settings);
    toast.info("Form reset to current saved database settings.");
  };

  return (
    <AdminPage
      title="Homepage Pop-up & Ad Section"
      subtitle="Manage the homepage welcome pop-up with its corner cross button and the homepage Ad Section with simple image upload."
      action={
        <div className="flex flex-wrap items-center gap-2">
          <Btn variant="ghost" onClick={handleReset} disabled={saving}>
            <RotateCcw className="h-4 w-4 mr-1.5" /> Discard
          </Btn>
          <Btn
            variant="ghost"
            onClick={() => setPreviewPopupOpen(true)}
            disabled={saving}
          >
            <Eye className="h-4 w-4 mr-1.5 text-primary" /> Test Pop-up
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
      <div className="grid gap-8 lg:grid-cols-2">
        {/* ======================================================== */}
        {/* 1. HOMEPAGE POP-UP MANAGEMENT CARD */}
        {/* ======================================================== */}
        <Panel className="space-y-6">
          <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                <Sparkles className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-display text-lg font-bold text-foreground">
                  1. Homepage Welcome Pop-up
                </h2>
                <p className="text-xs text-muted-foreground">
                  Appears when visitors open the homepage. Includes a corner close (X) button.
                </p>
              </div>
            </div>

            <label className="relative inline-flex cursor-pointer items-center shrink-0">
              <input
                type="checkbox"
                checked={form.showHomePopup !== false}
                onChange={(e) => setForm({ ...form, showHomePopup: e.target.checked })}
                className="peer sr-only"
              />
              <div className="peer h-6 w-11 rounded-full bg-muted peer-checked:bg-primary peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full"></div>
            </label>
          </div>

          {/* Status Alert */}
          <div
            className={`rounded-xl p-3 text-xs flex items-center justify-between border ${
              form.showHomePopup !== false
                ? "bg-primary/10 border-primary/20 text-primary"
                : "bg-muted border-border text-muted-foreground"
            }`}
          >
            <span className="font-semibold">
              Status: {form.showHomePopup !== false ? "Active & Visible on Homepage" : "Disabled"}
            </span>
            <button
              type="button"
              onClick={() => setPreviewPopupOpen(true)}
              className="font-bold underline hover:opacity-80 transition-opacity"
            >
              Open Live Preview
            </button>
          </div>

          {/* Image Uploader for Pop-up */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Pop-up Image / Banner (Admin Upload)
            </label>
            <p className="text-xs text-muted-foreground">
              Upload your promotional flyer, discount poster, or seasonal campaign image.
            </p>
            <ImageUploader
              value={form.homePopupImage || ""}
              onChange={(url) => setForm({ ...form, homePopupImage: url })}
              label="Pop-up Image"
              folder="plant_health_solutions/popups"
            />
          </div>

          {/* Link URL */}
          <Field label="Target Redirect URL (Optional)">
            <input
              type="text"
              value={form.homePopupLink || ""}
              onChange={(e) => setForm({ ...form, homePopupLink: e.target.value })}
              placeholder="/products or https://..."
              className={inputCls}
            />
            <span className="text-[11px] text-muted-foreground">
              Clicking the pop-up image or CTA button will navigate the visitor here.
            </span>
          </Field>

          {/* Optional Text Details */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Pop-up Headline (Optional)">
              <input
                type="text"
                value={form.homePopupTitle || ""}
                onChange={(e) => setForm({ ...form, homePopupTitle: e.target.value })}
                placeholder="e.g. Special Seasonal Farmer Offer!"
                className={inputCls}
              />
            </Field>

            <Field label="Button Text (Optional)">
              <input
                type="text"
                value={form.homePopupButtonText || ""}
                onChange={(e) => setForm({ ...form, homePopupButtonText: e.target.value })}
                placeholder="e.g. Explore Offers"
                className={inputCls}
              />
            </Field>
          </div>

          <Field label="Subtitle / Offer Details (Optional)">
            <textarea
              rows={2}
              value={form.homePopupSubtitle || ""}
              onChange={(e) => setForm({ ...form, homePopupSubtitle: e.target.value })}
              placeholder="e.g. Get up to 25% off on bio-fertilizers and micronutrients."
              className={inputCls}
            />
          </Field>

          {/* Preview snippet of corner cross button */}
          <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
              <span className="font-bold text-foreground">Pop-up Corner Close Button Preview</span>
              <span className="text-[11px] bg-background px-2 py-0.5 rounded border border-border">Corner Cross Included</span>
            </div>
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-card border border-border shadow-xs flex items-center justify-center">
              {form.homePopupImage ? (
                <img
                  src={form.homePopupImage}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <p className="text-xs text-muted-foreground">No image uploaded yet</p>
              )}
              {/* Corner cross button in preview */}
              <div
                title="Cross button in corner"
                className="absolute top-2.5 right-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white shadow-md border border-white/30"
              >
                <X className="h-4 w-4 stroke-[2.5]" />
              </div>
            </div>
          </div>
        </Panel>

        {/* ======================================================== */}
        {/* 2. AD SECTION MANAGEMENT CARD */}
        {/* ======================================================== */}
        <Panel className="space-y-6">
          <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-secondary/15 text-secondary">
                <ImageIcon className="h-5 w-5" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-display text-lg font-bold text-foreground">
                    2. Homepage Ad Section
                  </h2>
                  <span className="rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-bold text-accent-foreground">
                    Image Only
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Promotional advertisement banner displayed directly on the homepage. Admin will upload image only.
                </p>
              </div>
            </div>

            <label className="relative inline-flex cursor-pointer items-center shrink-0">
              <input
                type="checkbox"
                checked={form.showAdSection !== false}
                onChange={(e) => setForm({ ...form, showAdSection: e.target.checked })}
                className="peer sr-only"
              />
              <div className="peer h-6 w-11 rounded-full bg-muted peer-checked:bg-secondary peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full"></div>
            </label>
          </div>

          {/* Status Alert */}
          <div
            className={`rounded-xl p-3 text-xs flex items-center justify-between border ${
              form.showAdSection !== false
                ? "bg-secondary/10 border-secondary/20 text-secondary"
                : "bg-muted border-border text-muted-foreground"
            }`}
          >
            <span className="font-semibold">
              Status: {form.showAdSection !== false ? "Visible on Homepage" : "Hidden"}
            </span>
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1 font-bold underline hover:opacity-80 transition-opacity"
            >
              View on Website <ExternalLink className="h-3 w-3" />
            </Link>
          </div>

          {/* Ad Section Image Upload */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Upload Ad Image (Image Only)
              </label>
              <span className="text-[11px] font-mono text-muted-foreground">
                Recommended: 1200x400 or 1600x500
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Upload your advertisement creative banner here. It will be showcased full-width in the homepage Ad section.
            </p>
            <ImageUploader
              value={form.adSectionImage || ""}
              onChange={(url) => setForm({ ...form, adSectionImage: url })}
              label="Ad Banner Image"
              folder="plant_health_solutions/ads"
            />
          </div>

          {/* Optional Redirect Link */}
          <Field label="Ad Click Redirect Link (Optional)">
            <input
              type="text"
              value={form.adSectionLink || ""}
              onChange={(e) => setForm({ ...form, adSectionLink: e.target.value })}
              placeholder="/products or /categories or custom link"
              className={inputCls}
            />
            <span className="text-[11px] text-muted-foreground">
              When farmers click this advertisement banner on the homepage, they will be redirected to this URL.
            </span>
          </Field>

          {/* Optional Alt/Title for Accessibility */}
          <Field label="Ad Label / Title (Accessibility & SEO)">
            <input
              type="text"
              value={form.adSectionTitle || ""}
              onChange={(e) => setForm({ ...form, adSectionTitle: e.target.value })}
              placeholder="e.g. Featured Seasonal Agriculture Offer"
              className={inputCls}
            />
          </Field>

          {/* Live Ad Section Preview */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Homepage Ad Section Live Preview
            </span>
            <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-xs group">
              {form.adSectionImage ? (
                <img
                  src={form.adSectionImage}
                  alt={form.adSectionTitle || "Ad preview"}
                  className="w-full h-auto max-h-[220px] object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex aspect-[16/6] w-full items-center justify-center bg-muted/40 text-xs text-muted-foreground">
                  Upload an image above to see the homepage banner preview
                </div>
              )}
            </div>
          </div>
        </Panel>
      </div>

      {/* Save Floating Bar or Footer */}
      <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="text-xs text-muted-foreground">
          Changes are synced with MongoDB Atlas and take effect immediately on the homepage.
        </div>
        <Btn onClick={() => handleSave()} disabled={saving}>
          {saving ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" /> Saving...
            </span>
          ) : (
            <span className="inline-flex items-center gap-2">
              <Save className="h-4 w-4" /> Save Pop-up & Ad Settings
            </span>
          )}
        </Btn>
      </div>

      {/* Live Pop-up Modal Test / Preview */}
      {previewPopupOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setPreviewPopupOpen(false)}
        >
          <div
            className="relative w-full max-w-lg md:max-w-xl overflow-hidden rounded-3xl border border-white/20 bg-card text-card-foreground shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cross Button in Corner */}
            <button
              type="button"
              onClick={() => setPreviewPopupOpen(false)}
              aria-label="Close pop-up"
              className="absolute top-3 right-3 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-black/65 text-white hover:bg-black/90 backdrop-blur-md shadow-lg border border-white/30 transition-all hover:scale-110 active:scale-95 cursor-pointer"
            >
              <X className="h-5 w-5 stroke-[2.5]" />
            </button>

            {form.homePopupImage && (
              <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden bg-muted">
                <img
                  src={form.homePopupImage}
                  alt={form.homePopupTitle || "Preview"}
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            <div className="p-5 sm:p-6">
              {form.homePopupTitle && (
                <h3 className="font-display text-xl sm:text-2xl font-bold text-foreground">
                  {form.homePopupTitle}
                </h3>
              )}
              {form.homePopupSubtitle && (
                <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {form.homePopupSubtitle}
                </p>
              )}

              <div className="mt-5 flex items-center justify-between pt-2 border-t border-border/60">
                <span className="text-[11px] text-muted-foreground italic">
                  Preview Mode: Click (X) in corner to close
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPreviewPopupOpen(false)}
                    className="rounded-full px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground"
                  >
                    Close
                  </button>
                  {form.homePopupLink && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2 text-xs font-bold text-primary-foreground shadow-xs">
                      {form.homePopupButtonText || "Explore"} <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminPage>
  );
}
