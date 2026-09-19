"use client";

import * as React from "react";
import { Pencil, Plus, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/lib/store";
import type { Category } from "@/lib/data";
import { AdminPage, Btn, Field, Modal, TableWrap, inputCls, td, th } from "@/components/site/AdminUI";
import { ImageUploader } from "@/components/site/ImageUploader";

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export default function AdminCategoriesPage() {
  const { state, saveCategory, deleteCategory } = useApp();
  const [editing, setEditing] = React.useState<Category | null>(null);
  const [isNew, setIsNew] = React.useState(false);
  const [confirmId, setConfirmId] = React.useState<string | null>(null);
  const [saving, setSaving] = React.useState(false);

  const save = async () => {
    if (!editing) return;
    if (!editing.name.trim()) {
      toast.error("Category name is required");
      return;
    }
    const next = { ...editing, slug: editing.slug || slugify(editing.name) };
    setSaving(true);
    const ok = await saveCategory(next, isNew);
    setSaving(false);
    if (ok) {
      toast.success(isNew ? "Category created in MongoDB" : "Category updated in MongoDB");
      setEditing(null);
    } else {
      toast.error("Failed to save category");
    }
  };

  const handleDelete = async () => {
    if (!confirmId) return;
    const ok = await deleteCategory(confirmId);
    if (ok) {
      toast.success("Category deleted");
      setConfirmId(null);
    }
  };

  return (
    <AdminPage
      title="Product Categories"
      subtitle={`${state.categories.length} product categories stored in MongoDB.`}
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
            <th className={th}>Category</th>
            <th className={th}>Slug</th>
            <th className={th}>Description</th>
            <th className={th}>Products</th>
            <th className={th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {state.categories.map((c) => (
            <tr key={c.id} className="border-b border-border last:border-0 hover:bg-muted/20">
              <td className={`${td} font-semibold`}>
                <div className="flex items-center gap-3">
                  {c.image ? (
                    <img src={c.image} alt={c.name} className="h-10 w-10 rounded-lg object-cover border border-border" />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold">
                      {c.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="font-bold text-foreground">{c.name}</p>
                    <p className="text-xs text-muted-foreground">Icon: {c.icon || "Sprout"}</p>
                  </div>
                </div>
              </td>
              <td className={td}><code className="text-xs font-mono bg-muted px-2 py-1 rounded">{c.slug}</code></td>
              <td className={`${td} max-w-sm text-xs text-muted-foreground`}>{c.description}</td>
              <td className={td}>
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                  {state.products.filter((p) => p.category === c.name).length} items
                </span>
              </td>
              <td className={td}>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setIsNew(false);
                      setEditing(c);
                    }}
                    className="rounded-lg border border-border p-2 hover:bg-muted"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setConfirmId(c.id)}
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

      <Modal open={!!editing} onClose={() => setEditing(null)} title={isNew ? "Add Category" : "Edit Category"}>
        {editing && (
          <div className="grid gap-4">
            <Field label="Category Name">
              <input
                className={inputCls}
                value={editing.name}
                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                placeholder="e.g. Bio Fertilizers"
              />
            </Field>
            <Field label="URL Slug">
              <input
                className={inputCls}
                value={editing.slug}
                placeholder={slugify(editing.name)}
                onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
              />
            </Field>
            <Field label="Description">
              <textarea
                rows={3}
                className={inputCls}
                value={editing.description}
                onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                placeholder="Overview of this category's crop health solutions..."
              />
            </Field>

            <ImageUploader
              label="Category Banner / Image (Cloudinary)"
              value={editing.image}
              onChange={(url) => setEditing({ ...editing, image: url })}
              folder="plant_health_solutions/categories"
            />

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
                  "Save Category"
                )}
              </Btn>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={!!confirmId} onClose={() => setConfirmId(null)} title="Delete category?">
        <p className="text-sm text-muted-foreground">
          This removes the category from the database. Products in this category stay in the catalogue.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Btn variant="ghost" onClick={() => setConfirmId(null)}>
            Cancel
          </Btn>
          <Btn variant="danger" onClick={handleDelete}>
            Delete Category
          </Btn>
        </div>
      </Modal>
    </AdminPage>
  );
}
