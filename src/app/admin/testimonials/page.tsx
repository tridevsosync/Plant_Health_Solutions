"use client";

import * as React from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/lib/store";
import type { Testimonial } from "@/lib/data";
import { AdminPage, Btn, Field, Modal, TableWrap, inputCls, td, th } from "@/components/site/AdminUI";

const blank: Testimonial = { id: "", name: "", place: "", crop: "", rating: 5, quote: "" };

export default function AdminTestimonialsPage() {
  const { state, set } = useApp();
  const [editing, setEditing] = React.useState<Testimonial | null>(null);
  const [isNew, setIsNew] = React.useState(false);
  const [confirmId, setConfirmId] = React.useState<string | null>(null);

  const save = () => {
    if (!editing) return;
    if (!editing.name.trim() || !editing.quote.trim()) {
      toast.error("Name and quote are required");
      return;
    }
    set((s) => ({
      ...s,
      testimonials: isNew
        ? [{ ...editing, id: `t${Date.now()}` }, ...s.testimonials]
        : s.testimonials.map((t) => (t.id === editing.id ? editing : t)),
    }));
    toast.success(isNew ? "Testimonial added" : "Testimonial updated");
    setEditing(null);
  };

  return (
    <AdminPage
      title="Testimonials"
      subtitle={`${state.testimonials.length} farmer testimonials.`}
      action={
        <Btn
          onClick={() => {
            setIsNew(true);
            setEditing(blank);
          }}
        >
          <span className="inline-flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add Testimonial
          </span>
        </Btn>
      }
    >
      <TableWrap>
        <thead className="border-b border-border bg-muted/50">
          <tr>
            <th className={th}>Farmer</th>
            <th className={th}>Place</th>
            <th className={th}>Crop</th>
            <th className={th}>Rating</th>
            <th className={th}>Quote</th>
            <th className={th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {state.testimonials.map((t) => (
            <tr key={t.id} className="border-b border-border last:border-0">
              <td className={`${td} font-semibold`}>{t.name}</td>
              <td className={td}>{t.place}</td>
              <td className={td}>{t.crop}</td>
              <td className={td}>{t.rating} ★</td>
              <td className={`${td} max-w-sm text-xs text-muted-foreground`}>{t.quote}</td>
              <td className={td}>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setIsNew(false);
                      setEditing(t);
                    }}
                    className="rounded-lg border border-border p-2"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => setConfirmId(t.id)} className="rounded-lg border border-border p-2 text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </TableWrap>

      <Modal open={!!editing} onClose={() => setEditing(null)} title={isNew ? "Add Testimonial" : "Edit Testimonial"}>
        {editing && (
          <div className="grid gap-3">
            <Field label="Farmer name">
              <input className={inputCls} value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
            </Field>
            <Field label="Place">
              <input className={inputCls} value={editing.place} onChange={(e) => setEditing({ ...editing, place: e.target.value })} />
            </Field>
            <Field label="Crop">
              <input className={inputCls} value={editing.crop} onChange={(e) => setEditing({ ...editing, crop: e.target.value })} />
            </Field>
            <Field label="Rating (1-5)">
              <input type="number" min={1} max={5} className={inputCls} value={editing.rating} onChange={(e) => setEditing({ ...editing, rating: Number(e.target.value) })} />
            </Field>
            <Field label="Quote">
              <textarea rows={4} className={inputCls} value={editing.quote} onChange={(e) => setEditing({ ...editing, quote: e.target.value })} />
            </Field>
            <div className="flex justify-end gap-2">
              <Btn variant="ghost" onClick={() => setEditing(null)}>
                Cancel
              </Btn>
              <Btn onClick={save}>Save</Btn>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={!!confirmId} onClose={() => setConfirmId(null)} title="Delete testimonial?">
        <div className="mt-2 flex justify-end gap-2">
          <Btn variant="ghost" onClick={() => setConfirmId(null)}>
            Cancel
          </Btn>
          <Btn
            variant="danger"
            onClick={() => {
              set((s) => ({ ...s, testimonials: s.testimonials.filter((t) => t.id !== confirmId) }));
              setConfirmId(null);
              toast.success("Testimonial deleted");
            }}
          >
            Delete
          </Btn>
        </div>
      </Modal>
    </AdminPage>
  );
}
