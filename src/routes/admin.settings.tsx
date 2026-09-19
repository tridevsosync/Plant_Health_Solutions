import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { useApp, type Settings } from "@/lib/store";
import { AdminPage, Btn, Field, Panel, inputCls } from "@/components/site/AdminUI";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({
    meta: [
      { title: "Website Settings — PHS Admin" },
      { name: "description", content: "Edit company details, contact numbers, emails and address shown on the website." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Website Settings — PHS Admin" },
      { property: "og:description", content: "Company profile settings." },
    ],
  }),
  component: AdminSettings,
});

function AdminSettings() {
  const { state, set } = useApp();
  const [form, setForm] = React.useState<Settings>(state.settings);

  React.useEffect(() => setForm(state.settings), [state.settings]);

  return (
    <AdminPage title="Website Settings" subtitle="Company details saved to local storage and used across the site.">
      <Panel className="max-w-3xl">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Company name">
            <input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Field>
          <Field label="Owner">
            <input className={inputCls} value={form.owner} onChange={(e) => setForm({ ...form, owner: e.target.value })} />
          </Field>
          <Field label="Phone">
            <input className={inputCls} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </Field>
          <Field label="Primary email">
            <input className={inputCls} value={form.email1} onChange={(e) => setForm({ ...form, email1: e.target.value })} />
          </Field>
          <Field label="Secondary email">
            <input className={inputCls} value={form.email2} onChange={(e) => setForm({ ...form, email2: e.target.value })} />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Address">
              <textarea rows={3} className={inputCls} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="Company description">
              <textarea rows={4} className={inputCls} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </Field>
          </div>
          <div className="flex justify-end gap-2 sm:col-span-2">
            <Btn variant="ghost" onClick={() => setForm(state.settings)}>
              Reset
            </Btn>
            <Btn
              onClick={() => {
                set((s) => ({ ...s, settings: form }));
                toast.success("Settings saved");
              }}
            >
              Save Settings
            </Btn>
          </div>
        </div>
      </Panel>
    </AdminPage>
  );
}
