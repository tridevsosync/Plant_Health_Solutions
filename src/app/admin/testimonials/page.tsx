"use client";

import * as React from "react";
import { Pencil, Plus, Trash2, Star, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/lib/store";
import type { Testimonial } from "@/lib/data";
import { AdminPage, Btn, Field, Modal, TableWrap, inputCls, td, th } from "@/components/site/AdminUI";

const blank: Testimonial = {
  id: "",
  name: "",
  place: "Vijayapura, Karnataka",
  crop: "Sugarcane",
  rating: 5,
  quote: "",
};

export default function AdminTestimonialsPage() {
  const { state, saveTestimonial, deleteTestimonial } = useApp();
  const [editing, setEditing] = React.useState<Testimonial | null>(null);
  const [isNew, setIsNew] = React.useState(false);
  const [confirmId, setConfirmId] = React.useState<string | null>(null);
  const [saving, setSaving] = React.useState(false);

  const save = async () => {
    if (!editing) return;
    if (!editing.name.trim() || !editing.quote.trim()) {
      toast.error("Farmer name and quote are required");
      return;
    }

    setSaving(true);
    const ok = await saveTestimonial(editing, isNew);
    setSaving(false);
    if (ok) {
      toast.success(isNew ? "Testimonial saved to MongoDB" : "Testimonial updated");
      setEditing(null);
    } else {
      toast.error("Failed to save testimonial");
    }
  };

  const handleDelete = async () => {
    if (!confirmId) return;
    const ok = await deleteTestimonial(confirmId);
    if (ok) {
      toast.success("Testimonial deleted");
      setConfirmId(null);
    }
  };

  return (
    <AdminPage
      title="Farmer Testimonials"
      subtitle={`${state.testimonials.length} farmer stories stored in MongoDB.`}
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
            <th className={th}>Farmer Name</th>
            <th className={th}>Location</th>
            <th className={th}>Crop</th>
            <th className={th}>Rating</th>
            <th className={th}>Quote / Feedback</th>
            <th className={th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {state.testimonials.map((t) => (
            <tr key={t.id} className="border-b border-border last:border-0 hover:bg-muted/20">
              <td className={`${td} font-bold text-foreground`}>{t.name}</td>
              <td className={td}>{t.place}</td>
              <td className={td}>
                <span className="rounded-md bg-secondary/10 px-2 py-0.5 text-xs font-semibold text-secondary">
                  {t.crop}
                </span>
              </td>
              <td className={td}>
                <div className="flex items-center gap-1 text-amber-500 font-bold">
                  <span>{t.rating}</span>
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
                </div>
              </td>
              <td className={`${td} max-w-md text-xs text-muted-foreground line-clamp-2`}>
                &ldquo;{t.quote}&rdquo;
              </td>
              <td className={td}>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setIsNew(false);
                      setEditing(t);
                    }}
                    className="rounded-lg border border-border p-2 hover:bg-muted"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setConfirmId(t.id)}
                    className="rounded-lg border border-border p-2 text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </TableWrap>

      <Modal open={!!editing} onClose={() => setEditing(null)} title={isNew ? "Add Farmer Testimonial" : "Edit Testimonial"}>
        {editing && (
          <div className="grid gap-4">
            <Field label="Farmer Name">
              <input
                className={inputCls}
                value={editing.name}
                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                placeholder="e.g. Suresh Patil"
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Village / District">
                <input
                  className={inputCls}
                  value={editing.place}
                  onChange={(e) => setEditing({ ...editing, place: e.target.value })}
                  placeholder="Vijayapura, Karnataka"
                />
              </Field>
              <Field label="Crop Grown">
                <input
                  className={inputCls}
                  value={editing.crop}
                  onChange={(e) => setEditing({ ...editing, crop: e.target.value })}
                  placeholder="Sugarcane / Cotton"
                />
              </Field>
            </div>
            <Field label="Rating (1 to 5 Stars)">
              <input
                type="number"
                min={1}
                max={5}
                className={inputCls}
                value={editing.rating}
                onChange={(e) => setEditing({ ...editing, rating: Number(e.target.value) })}
              />
            </Field>
            <Field label="Farmer Quote / Review">
              <textarea
                rows={4}
                className={inputCls}
                value={editing.quote}
                onChange={(e) => setEditing({ ...editing, quote: e.target.value })}
                placeholder="PHS bio fertilizers boosted sugarcane cane girth and saved 30% on chemical urea..."
              />
            </Field>
            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <Btn variant="ghost" onClick={() => setEditing(null)}>
                Cancel
              </Btn>
              <Btn onClick={save} disabled={saving}>
                {saving ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                  </span>
                ) : (
                  "Save Testimonial"
                )}
              </Btn>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={!!confirmId} onClose={() => setConfirmId(null)} title="Delete testimonial?">
        <p className="text-sm text-muted-foreground">
          Are you sure you want to remove this testimonial from MongoDB and the website?
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Btn variant="ghost" onClick={() => setConfirmId(null)}>
            Cancel
          </Btn>
          <Btn variant="danger" onClick={handleDelete}>
            Delete
          </Btn>
        </div>
      </Modal>
    </AdminPage>
  );
}
