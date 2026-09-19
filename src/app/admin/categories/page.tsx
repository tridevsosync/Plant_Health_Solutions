"use client";

import * as React from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/lib/store";
import type { Category } from "@/lib/data";
import { AdminPage, Btn, Field, Modal, TableWrap, inputCls, td, th } from "@/components/site/AdminUI";

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export default function AdminCategoriesPage() {
  const { state, set } = useApp();
  const [editing, setEditing] = React.useState<Category | null>(null);
  const [isNew, setIsNew] = React.useState(false);
  const [confirmId, setConfirmId] = React.useState<string | null>(null);

  const save = () => {
    if (!editing) return;
    if (!editing.name.trim()) {
      toast.error("Category name is required");
      return;
    }
    const next = { ...editing, slug: editing.slug || slugify(editing.name) };
    set((s) => ({
      ...s,
      categories: isNew ? [...s.categories, { ...next, id: `c${Date.now()}` }] : s.categories.map((c) => (c.id === next.id ? next : c)),
    }));
    toast.success(isNew ? "Category added" : "Category updated");
    setEditing(null);
  };

  return (
    <AdminPage
      title="Categories"
      subtitle={`${state.categories.length} product categories.`}
      action={
        <Btn
          onClick={() => {
            setIsNew(true);
            setEditing({ id: "", name: "", slug: "", description: "", icon: "Sprout", image: "" });
          }}
        >
          <span className="inline-flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add Category
          </span>
        </Btn>
      }
    >
      <TableWrap>
        <thead className="border-b border-border bg-muted/50">
          <tr>
            <th className={th}>Name</th>
            <th className={th}>Slug</th>
            <th className={th}>Description</th>
            <th className={th}>Products</th>
            <th className={th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {state.categories.map((c) => (
            <tr key={c.id} className="border-b border-border last:border-0">
              <td className={`${td} font-semibold`}>{c.name}</td>
              <td className={td}>{c.slug}</td>
              <td className={`${td} max-w-sm text-xs text-muted-foreground`}>{c.description}</td>
              <td className={td}>{state.products.filter((p) => p.category === c.name).length}</td>
              <td className={td}>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setIsNew(false);
                      setEditing(c);
                    }}
                    className="rounded-lg border border-border p-2"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => setConfirmId(c.id)} className="rounded-lg border border-border p-2 text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </TableWrap>

      <Modal open={!!editing} onClose={() => setEditing(null)} title={isNew ? "Add Category" : "Edit Category"}>
        {editing && (
          <div className="grid gap-3">
            <Field label="Name">
              <input className={inputCls} value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
            </Field>
            <Field label="Slug">
              <input className={inputCls} value={editing.slug} placeholder={slugify(editing.name)} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} />
            </Field>
            <Field label="Description">
              <textarea rows={3} className={inputCls} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
            </Field>
            <Field label="Image URL">
              <input className={inputCls} value={editing.image} onChange={(e) => setEditing({ ...editing, image: e.target.value })} />
            </Field>
            <div className="flex justify-end gap-2">
              <Btn variant="ghost" onClick={() => setEditing(null)}>
                Cancel
              </Btn>
              <Btn onClick={save}>Save Category</Btn>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={!!confirmId} onClose={() => setConfirmId(null)} title="Delete category?">
        <p className="text-sm text-muted-foreground">Products in this category stay in the catalogue but lose their filter group.</p>
        <div className="mt-5 flex justify-end gap-2">
          <Btn variant="ghost" onClick={() => setConfirmId(null)}>
            Cancel
          </Btn>
          <Btn
            variant="danger"
            onClick={() => {
              set((s) => ({ ...s, categories: s.categories.filter((c) => c.id !== confirmId) }));
              setConfirmId(null);
              toast.success("Category deleted");
            }}
          >
            Delete
          </Btn>
        </div>
      </Modal>
    </AdminPage>
  );
}
