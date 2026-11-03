"use client";

import * as React from "react";
import Link from "next/link";
import {
  PhoneCall,
  Save,
  RotateCcw,
  Loader2,
  ExternalLink,
  MessageCircle,
  Phone,
  Eye,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { useApp, type Settings } from "@/lib/store";
import { AdminPage, Btn, Field, Panel, inputCls } from "@/components/site/AdminUI";

export default function AdminFloatingButtonsPage() {
  const { state, saveSettings, refreshData } = useApp();
  const [form, setForm] = React.useState<Settings>(state.settings);
  const [saving, setSaving] = React.useState(false);
  const [savedAt, setSavedAt] = React.useState<Date | null>(null);

  React.useEffect(() => {
    setForm(state.settings);
  }, [state.settings]);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      const ok = await saveSettings(form);
      if (ok) {
        setSavedAt(new Date());
        toast.success("Floating buttons settings saved & updated across the website!");
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
    toast.info("Form reset to saved settings.");
  };

  const isEnabled = form.showFloatingActions !== false;

  return (
    <AdminPage
      title="Floating Corner Buttons (Call, Insta, WhatsApp, YouTube)"
      subtitle="Manage the persistent quick-action contact buttons displayed in the right-side corner of the website."
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
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Settings Form */}
        <div className="space-y-6 lg:col-span-2">
          {/* Master Switch Panel */}
          <Panel>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
                  <PhoneCall className="h-5 w-5 text-primary" />
                  Right-Corner Floating Widget
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Enable or disable all floating quick contact buttons on the customer-facing website.
                </p>
              </div>

              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={isEnabled}
                  onChange={(e) =>
                    setForm({ ...form, showFloatingActions: e.target.checked })
                  }
                  className="peer sr-only"
                />
                <div className="peer h-6 w-11 rounded-full bg-muted peer-checked:bg-primary peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full"></div>
                <span className="ml-2.5 text-xs font-semibold text-foreground">
                  {isEnabled ? "Widget Active" : "Widget Disabled"}
                </span>
              </label>
            </div>

            {isEnabled && (
              <div className="mt-5 border-t border-border pt-4">
                <Field label="Widget Screen Position">
                  <select
                    className={inputCls}
                    value={form.floatingPosition || "bottom-right"}
                    onChange={(e) =>
                      setForm({ ...form, floatingPosition: e.target.value })
                    }
                  >
                    <option value="bottom-right">Bottom-Right Corner (Default & Recommended)</option>
                    <option value="right-center">Right-Center (Middle of the right edge)</option>
                  </select>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Where the buttons will appear on desktop and mobile screens.
                  </p>
                </Field>
              </div>
            )}
          </Panel>

          {/* 1. Call Button */}
          <Panel>
            <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0284c7] text-white shadow-sm">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-display text-sm font-bold text-foreground">
                    1. Call Helpline Button
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Direct phone dialer link (`tel:`) for immediate customer assistance.
                  </p>
                </div>
              </div>

              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={form.floatingCallEnabled !== false}
                  onChange={(e) =>
                    setForm({ ...form, floatingCallEnabled: e.target.checked })
                  }
                  className="peer sr-only"
                />
                <div className="peer h-6 w-11 rounded-full bg-muted peer-checked:bg-[#0284c7] peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full"></div>
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Helpline Phone Number">
                <input
                  type="text"
                  className={inputCls}
                  value={form.floatingCallNumber ?? form.phone ?? "+91 91759 55009"}
                  onChange={(e) =>
                    setForm({ ...form, floatingCallNumber: e.target.value })
                  }
                  placeholder="+91 91759 55009"
                />
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Farmers tapping this button will immediately dial this number.
                </p>
              </Field>

              <Field label="Button Hover Tooltip / Label">
                <input
                  type="text"
                  className={inputCls}
                  value={form.floatingCallLabel ?? "Call Helpline"}
                  onChange={(e) =>
                    setForm({ ...form, floatingCallLabel: e.target.value })
                  }
                  placeholder="e.g. Call Helpline / Agronomist Support"
                />
              </Field>
            </div>
          </Panel>

          {/* 2. WhatsApp Button */}
          <Panel>
            <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366] text-white shadow-sm">
                  <svg className="h-5 w-5 fill-white" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-display text-sm font-bold text-foreground">
                    2. WhatsApp Chat Button
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Opens WhatsApp chat with pre-filled enquiry message.
                  </p>
                </div>
              </div>

              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={form.floatingWhatsappEnabled !== false}
                  onChange={(e) =>
                    setForm({ ...form, floatingWhatsappEnabled: e.target.checked })
                  }
                  className="peer sr-only"
                />
                <div className="peer h-6 w-11 rounded-full bg-muted peer-checked:bg-[#25D366] peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full"></div>
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="WhatsApp Number">
                <input
                  type="text"
                  className={inputCls}
                  value={form.floatingWhatsappNumber ?? form.whatsapp ?? "+91 91759 55009"}
                  onChange={(e) =>
                    setForm({ ...form, floatingWhatsappNumber: e.target.value })
                  }
                  placeholder="+91 91759 55009"
                />
              </Field>

              <Field label="Button Hover Tooltip / Label">
                <input
                  type="text"
                  className={inputCls}
                  value={form.floatingWhatsappLabel ?? "Chat on WhatsApp"}
                  onChange={(e) =>
                    setForm({ ...form, floatingWhatsappLabel: e.target.value })
                  }
                  placeholder="Chat on WhatsApp"
                />
              </Field>

              <div className="sm:col-span-2">
                <Field label="Pre-filled WhatsApp Message">
                  <textarea
                    rows={2}
                    className={inputCls}
                    value={
                      form.floatingWhatsappMessage ??
                      "Hello Plant Health Solutions, I would like to inquire about your products and crop solutions."
                    }
                    onChange={(e) =>
                      setForm({ ...form, floatingWhatsappMessage: e.target.value })
                    }
                    placeholder="Hello Plant Health Solutions, I would like to inquire..."
                  />
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Message automatically populated in the farmer&apos;s WhatsApp input box when clicking this button.
                  </p>
                </Field>
              </div>
            </div>
          </Panel>

          {/* 3. Instagram Button */}
          <Panel>
            <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white shadow-sm">
                  <svg className="h-5 w-5 fill-white" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-display text-sm font-bold text-foreground">
                    3. Instagram Button
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Direct link to your official Instagram page and crop photo updates.
                  </p>
                </div>
              </div>

              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={form.floatingInstagramEnabled !== false}
                  onChange={(e) =>
                    setForm({ ...form, floatingInstagramEnabled: e.target.checked })
                  }
                  className="peer sr-only"
                />
                <div className="peer h-6 w-11 rounded-full bg-muted peer-checked:bg-[#dc2743] peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full"></div>
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Instagram Profile URL">
                <input
                  type="url"
                  className={inputCls}
                  value={form.floatingInstagramUrl ?? form.instagram ?? "https://instagram.com"}
                  onChange={(e) =>
                    setForm({ ...form, floatingInstagramUrl: e.target.value })
                  }
                  placeholder="https://instagram.com/your_handle"
                />
              </Field>

              <Field label="Button Hover Tooltip / Label">
                <input
                  type="text"
                  className={inputCls}
                  value={form.floatingInstagramLabel ?? "Follow on Instagram"}
                  onChange={(e) =>
                    setForm({ ...form, floatingInstagramLabel: e.target.value })
                  }
                  placeholder="Follow on Instagram"
                />
              </Field>
            </div>
          </Panel>

          {/* 4. YouTube Button */}
          <Panel>
            <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FF0000] text-white shadow-sm">
                  <svg className="h-5 w-5 fill-white" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-display text-sm font-bold text-foreground">
                    4. YouTube Button
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Direct link to your farming tips, product trials, and field guidance videos.
                  </p>
                </div>
              </div>

              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={form.floatingYoutubeEnabled !== false}
                  onChange={(e) =>
                    setForm({ ...form, floatingYoutubeEnabled: e.target.checked })
                  }
                  className="peer sr-only"
                />
                <div className="peer h-6 w-11 rounded-full bg-muted peer-checked:bg-[#FF0000] peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full"></div>
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="YouTube Channel URL">
                <input
                  type="url"
                  className={inputCls}
                  value={form.floatingYoutubeUrl ?? form.youtube ?? "https://youtube.com"}
                  onChange={(e) =>
                    setForm({ ...form, floatingYoutubeUrl: e.target.value })
                  }
                  placeholder="https://youtube.com/@channel"
                />
              </Field>

              <Field label="Button Hover Tooltip / Label">
                <input
                  type="text"
                  className={inputCls}
                  value={form.floatingYoutubeLabel ?? "Watch on YouTube"}
                  onChange={(e) =>
                    setForm({ ...form, floatingYoutubeLabel: e.target.value })
                  }
                  placeholder="Watch on YouTube"
                />
              </Field>
            </div>
          </Panel>

          {/* Action Bar */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-muted-foreground">
              {savedAt && (
                <span className="inline-flex items-center gap-1.5 text-emerald-600 font-medium">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Saved at {savedAt.toLocaleTimeString()}
                </span>
              )}
            </span>
            <Btn onClick={() => handleSave()} disabled={saving} className="px-6 py-2.5">
              {saving ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Saving Changes...
                </span>
              ) : (
                <span className="inline-flex items-center gap-2">
                  <Save className="h-4 w-4" /> Save Floating Buttons
                </span>
              )}
            </Btn>
          </div>
        </div>

        {/* Live Website Preview Panel */}
        <div className="space-y-4">
          <div className="sticky top-6 rounded-2xl border border-border bg-card p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-primary" />
                <h4 className="font-display text-sm font-bold text-foreground">
                  Live Corner Preview
                </h4>
              </div>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                Real-time
              </span>
            </div>

            <p className="text-xs text-muted-foreground">
              Below is how the floating buttons appear on the right side corner of your website for visitors.
            </p>

            {/* Mock website view */}
            <div className="relative h-96 w-full rounded-xl border border-border/80 bg-linear-to-b from-muted/50 to-muted/20 p-4 overflow-hidden flex flex-col justify-between">
              {/* Mock website content */}
              <div className="space-y-2 opacity-50 pointer-events-none">
                <div className="h-3 w-1/3 rounded-sm bg-muted-foreground/30" />
                <div className="h-2 w-2/3 rounded-sm bg-muted-foreground/20" />
                <div className="h-2 w-1/2 rounded-sm bg-muted-foreground/20" />
              </div>

              {/* Floating Buttons Mock rendered in preview */}
              {isEnabled ? (
                <div className="self-end flex flex-col items-end gap-2.5">
                  {/* YouTube */}
                  {form.floatingYoutubeEnabled !== false && (
                    <div
                      className="group relative flex h-10 w-10 items-center justify-center rounded-full bg-[#FF0000] text-white shadow-md shadow-[#FF0000]/30 transition-transform hover:scale-110 cursor-pointer"
                      title={form.floatingYoutubeLabel || "Watch on YouTube"}
                    >
                      <svg className="h-5 w-5 fill-white" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                      </svg>
                      <span className="pointer-events-none absolute right-full mr-2 hidden whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-[11px] font-medium text-white shadow-sm group-hover:block">
                        {form.floatingYoutubeLabel || "Watch on YouTube"}
                      </span>
                    </div>
                  )}

                  {/* Instagram */}
                  {form.floatingInstagramEnabled !== false && (
                    <div
                      className="group relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white shadow-md shadow-[#dc2743]/30 transition-transform hover:scale-110 cursor-pointer"
                      title={form.floatingInstagramLabel || "Follow on Instagram"}
                    >
                      <svg className="h-5 w-5 fill-white" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                      <span className="pointer-events-none absolute right-full mr-2 hidden whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-[11px] font-medium text-white shadow-sm group-hover:block">
                        {form.floatingInstagramLabel || "Follow on Instagram"}
                      </span>
                    </div>
                  )}

                  {/* Call */}
                  {form.floatingCallEnabled !== false && (
                    <div
                      className="group relative flex h-10 w-10 items-center justify-center rounded-full bg-[#0284c7] text-white shadow-md shadow-[#0284c7]/30 transition-transform hover:scale-110 cursor-pointer"
                      title={form.floatingCallLabel || "Call Helpline"}
                    >
                      <Phone className="h-4 w-4" />
                      <span className="pointer-events-none absolute right-full mr-2 hidden whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-[11px] font-medium text-white shadow-sm group-hover:block">
                        {form.floatingCallLabel || "Call Helpline"}
                      </span>
                    </div>
                  )}

                  {/* WhatsApp */}
                  {form.floatingWhatsappEnabled !== false && (
                    <div
                      className="group relative flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/35 transition-transform hover:scale-110 cursor-pointer"
                      title={form.floatingWhatsappLabel || "Chat on WhatsApp"}
                    >
                      <span className="absolute -inset-1 -z-10 animate-ping rounded-full bg-[#25D366]/30 opacity-75" />
                      <svg className="h-6 w-6 fill-white" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      <span className="pointer-events-none absolute right-full mr-2 hidden whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-[11px] font-medium text-white shadow-sm group-hover:block">
                        {form.floatingWhatsappLabel || "Chat on WhatsApp"}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex h-full items-center justify-center text-center p-4">
                  <p className="text-xs text-muted-foreground italic">
                    Widget currently disabled. Turn on the switch above to display buttons.
                  </p>
                </div>
              )}
            </div>

            <div className="rounded-xl bg-muted/40 p-3 text-[11px] text-muted-foreground space-y-1.5">
              <div className="flex items-center gap-1.5 font-semibold text-foreground">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                Quick Tips:
              </div>
              <p>• Clicking Call on mobile phones opens the native dialer.</p>
              <p>• WhatsApp opens directly on WhatsApp app or web with your pre-filled inquiry.</p>
              <p>• Instagram and YouTube open in new browser tabs.</p>
            </div>

            <div className="pt-2">
              <Link
                href="/"
                target="_blank"
                className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
              >
                View Live Website
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AdminPage>
  );
}
