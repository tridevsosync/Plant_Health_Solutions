"use client";

import * as React from "react";
import { Pencil, Plus, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { inr, useApp } from "@/lib/store";
import type { Product } from "@/lib/data";
import { AdminPage, Btn, Field, Modal, TableWrap, inputCls, td, th } from "@/components/site/AdminUI";
import { ImageUploader } from "@/components/site/ImageUploader";
import { Pagination } from "@/components/site/Pagination";

const blank = (category: string): Product => ({
  id: "",
  name: "",
  category,
  price: 0,
  oldPrice: 0,
  rating: 4.8,
  reviews: 0,
  stock: 100,
  unit: "1 L",
  image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=70",
  description: "",
  benefits: [],
  usage: "",
  ingredients: "",
  badges: [],
});

const BADGES = ["featured", "trending", "best seller"];

export default function AdminProductsPage() {
  const { state, saveProduct, deleteProduct } = useApp();
  const [q, setQ] = React.useState("");
  const [cat, setCat] = React.useState("All");
  const [editing, setEditing] = React.useState<Product | null>(null);
  const [isNew, setIsNew] = React.useState(false);
  const [confirmId, setConfirmId] = React.useState<string | null>(null);
  const [deleting, setDeleting] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  const list = state.products.filter(
    (p) =>
      (cat === "All" || p.category === cat) &&
      (p.name.toLowerCase().includes(q.toLowerCase()) || p.category.toLowerCase().includes(q.toLowerCase()))
  );

  const totalPages = Math.max(1, Math.ceil(list.length / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, list.length);
  const paginatedList = list.slice(startIndex, endIndex);

  const save = async () => {
    if (!editing) return;
    if (!editing.name.trim()) {
      toast.error("Product name is required");
      return;
    }
    setSaving(true);
    const ok = await saveProduct(editing, isNew);
    setSaving(false);
    if (ok) {
      toast.success(isNew ? "Product created in MongoDB" : "Product updated in MongoDB");
      setEditing(null);
    } else {
      toast.error("Failed to save product");
    }
  };

  const handleDelete = async () => {
    if (!confirmId) return;
    setDeleting(true);
    const ok = await deleteProduct(confirmId);
    setDeleting(false);
    if (ok) {
      toast.success("Product deleted successfully");
      setConfirmId(null);
    } else {
      toast.error("Failed to delete product");
    }
  };

  return (
    <AdminPage
      title="Products Catalogue"
      subtitle={`${state.products.length} products stored in MongoDB.`}
      action={
        <Btn
          onClick={() => {
            setIsNew(true);
            setEditing(blank(state.categories[0]?.name ?? "Bio Fertilizers"));
          }}
        >
          <span className="inline-flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add Product
          </span>
        </Btn>
      }
    >
      <div className="flex flex-wrap gap-3">
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(1);
          }}
          placeholder="Search products…"
          className={`${inputCls} max-w-xs`}
        />
        <select
          value={cat}
          onChange={(e) => {
            setCat(e.target.value);
            setPage(1);
          }}
          className={`${inputCls} max-w-xs`}
        >
          <option>All</option>
          {state.categories.map((c) => (
            <option key={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <TableWrap>
        <thead className="border-b border-border bg-muted/50">
          <tr>
            <th className={th}>Product</th>
            <th className={th}>Category</th>
            <th className={th}>Price</th>
            <th className={th}>Stock</th>
            <th className={th}>Badges</th>
            <th className={th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {list.length === 0 ? (
            <tr>
              <td colSpan={6} className="py-12 text-center text-sm text-muted-foreground">
                No products found in catalogue. Click <strong>Add Product</strong> above to create one.
              </td>
            </tr>
          ) : (
            paginatedList.map((p) => (
              <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                <td className={`${td} font-semibold`}>
                  <div className="flex items-center gap-3">
                    {p.image ? (
                      <img src={p.image} alt={p.name} className="h-10 w-10 rounded-lg object-cover border border-border" />
                    ) : (
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {p.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-foreground">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.unit}</p>
                    </div>
                  </div>
                </td>
                <td className={td}>
                  <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                    {p.category}
                  </span>
                </td>
                <td className={td}>
                  <span className="font-bold text-foreground">{inr(p.price)}</span>
                  {p.oldPrice > p.price && (
                    <span className="ml-1 text-xs text-muted-foreground line-through">{inr(p.oldPrice)}</span>
                  )}
                </td>
                <td className={td}>{p.stock}</td>
                <td className={`${td} text-xs capitalize text-muted-foreground`}>
                  {p.badges?.join(", ") || "—"}
                </td>
                <td className={td}>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setIsNew(false);
                        setEditing(p);
                      }}
                      className="rounded-lg border border-border p-2 hover:bg-muted"
                      title="Edit Product"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setConfirmId(p.id)}
                      className="rounded-lg border border-border p-2 text-destructive hover:bg-destructive/10"
                      title="Delete Product"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </TableWrap>

      {list.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={list.length}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={(sz) => {
            setPageSize(sz);
            setPage(1);
          }}
          pageSizeOptions={[10, 20, 50]}
        />
      )}


      <Modal open={!!editing} onClose={() => setEditing(null)} title={isNew ? "Add New Product" : "Edit Product"} wide>
        {editing && (
          <div className="grid gap-4 sm:grid-cols-2 min-w-0 w-full">
            <Field label="Product Name">
              <input
                className={inputCls}
                value={editing.name}
                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                placeholder="e.g. Bio NPK Premium"
              />
            </Field>
            <Field label="Category">
              <select
                className={inputCls}
                value={editing.category}
                onChange={(e) => setEditing({ ...editing, category: e.target.value })}
              >
                {state.categories.map((c) => (
                  <option key={c.id}>{c.name}</option>
                ))}
              </select>
            </Field>
            <Field label="Price (₹)">
              <input
                type="number"
                className={inputCls}
                value={editing.price}
                onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })}
              />
            </Field>
            <Field label="Old Price / MRP (₹)">
              <input
                type="number"
                className={inputCls}
                value={editing.oldPrice}
                onChange={(e) => setEditing({ ...editing, oldPrice: Number(e.target.value) })}
              />
            </Field>
            <Field label="Stock Quantity">
              <input
                type="number"
                className={inputCls}
                value={editing.stock}
                onChange={(e) => setEditing({ ...editing, stock: Number(e.target.value) })}
              />
            </Field>
            <Field label="Pack Size / Unit">
              <input
                className={inputCls}
                value={editing.unit}
                onChange={(e) => setEditing({ ...editing, unit: e.target.value })}
                placeholder="1 L / 500 ml / 25 kg"
              />
            </Field>

            <div className="sm:col-span-2">
              <ImageUploader
                label="Product Image (Cloudinary)"
                value={editing.image}
                onChange={(url) => setEditing({ ...editing, image: url })}
                folder="plant_health_solutions/products"
              />
            </div>

            <div className="sm:col-span-2">
              <Field label="Description">
                <textarea
                  rows={3}
                  className={inputCls}
                  value={editing.description}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  placeholder="Comprehensive description of product efficacy and advantages..."
                />
              </Field>
            </div>

            <div className="sm:col-span-2">
              <Field label="Benefits (one per line)">
                <textarea
                  rows={4}
                  className={inputCls}
                  value={editing.benefits?.join("\n") || ""}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      benefits: e.target.value.split("\n").filter(Boolean),
                    })
                  }
                  placeholder="Fixes atmospheric nitrogen&#10;Improves root elongation&#10;Reduces chemical fertilizer need by 25%"
                />
              </Field>
            </div>

            <div className="sm:col-span-2">
              <Field label="Usage & Application Dosage">
                <textarea
                  rows={2}
                  className={inputCls}
                  value={editing.usage}
                  onChange={(e) => setEditing({ ...editing, usage: e.target.value })}
                  placeholder="Drip: 2 L/acre. Foliar: 3-5 ml per liter of water."
                />
              </Field>
            </div>

            <div className="sm:col-span-2">
              <Field label="Key Ingredients / Active Formula">
                <input
                  className={inputCls}
                  value={editing.ingredients}
                  onChange={(e) => setEditing({ ...editing, ingredients: e.target.value })}
                  placeholder="Azotobacter, PSB, KMB CFU 1x10^9"
                />
              </Field>
            </div>

            <div className="sm:col-span-2">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Badges</p>
              <div className="flex flex-wrap gap-2">
                {BADGES.map((b) => {
                  const on = editing.badges?.includes(b);
                  return (
                    <button
                      key={b}
                      type="button"
                      onClick={() =>
                        setEditing({
                          ...editing,
                          badges: on
                            ? editing.badges.filter((x) => x !== b)
                            : [...(editing.badges || []), b],
                        })
                      }
                      className={`rounded-full px-3 py-1 text-xs font-semibold capitalize transition-all ${
                        on ? "bg-primary text-primary-foreground" : "border border-border text-foreground hover:bg-muted"
                      }`}
                    >
                      {b}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end gap-2 sm:col-span-2 pt-4 border-t border-border">
              <Btn variant="ghost" onClick={() => setEditing(null)}>
                Cancel
              </Btn>
              <Btn onClick={save} disabled={saving}>
                {saving ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                  </span>
                ) : (
                  "Save Product"
                )}
              </Btn>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={!!confirmId} onClose={() => setConfirmId(null)} title="Delete product?">
        <p className="text-sm text-muted-foreground">
          This permanently removes the product from the MongoDB database and storefront catalogue.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Btn variant="ghost" onClick={() => setConfirmId(null)} disabled={deleting}>
            Cancel
          </Btn>
          <Btn variant="danger" onClick={handleDelete} disabled={deleting}>
            {deleting ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Deleting...
              </span>
            ) : (
              "Delete from Database"
            )}
          </Btn>
        </div>
      </Modal>

    </AdminPage>
  );
}
