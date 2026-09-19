"use client";

import * as React from "react";
import { Loader2, Save, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { useApp, type Settings } from "@/lib/store";
import { AdminPage, Btn, Field, Panel, inputCls } from "@/components/site/AdminUI";

export default function AdminSettingsPage() {
  const { state, saveSettings } = useApp();
  const [form, setForm] = React.useState<Settings>(state.settings);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => setForm(state.settings), [state.settings]);

  const handleSave = async () => {
    setSaving(true);
    const ok = await saveSettings(form);
    setSaving(false);
    if (ok) {
      toast.success("Company settings updated in MongoDB & live website");
    } else {
      toast.error("Failed to save settings");
    }
  };

  return (
    <AdminPage
      title="Company & Website Settings"
      subtitle="Corporate information stored in MongoDB and rendered in Navbar, Footer, and contact points."
    >
      <Panel className="max-w-4xl">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Company Name">
            <input
              className={inputCls}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </Field>
          <Field label="Owner / Managing Director">
            <input
              className={inputCls}
              value={form.owner}
              onChange={(e) => setForm({ ...form, owner: e.target.value })}
            />
          </Field>
          <Field label="Helpline Phone / WhatsApp">
            <input
              className={inputCls}
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </Field>
          <Field label="Primary Official Email">
            <input
              className={inputCls}
              value={form.email1}
              onChange={(e) => setForm({ ...form, email1: e.target.value })}
            />
          </Field>
          <Field label="Secondary / Technical Email">
            <input
              className={inputCls}
              value={form.email2}
              onChange={(e) => setForm({ ...form, email2: e.target.value })}
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Head Office / Research Center Address">
              <textarea
                rows={3}
                className={inputCls}
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="Company Mission & Description">
              <textarea
                rows={4}
                className={inputCls}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </Field>
          </div>
          <div className="flex justify-end gap-3 sm:col-span-2 pt-3 border-t border-border">
            <Btn
              variant="ghost"
              onClick={() => {
                setForm(state.settings);
                toast.info("Reset to saved settings");
              }}
            >
              <RotateCcw className="h-4 w-4 mr-1.5" /> Reset
            </Btn>
            <Btn onClick={handleSave} disabled={saving}>
              {saving ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                </span>
              ) : (
                <span className="inline-flex items-center gap-2">
                  <Save className="h-4 w-4" /> Save Settings
                </span>
              )}
            </Btn>
          </div>
        </div>
      </Panel>
    </AdminPage>
  );
}
