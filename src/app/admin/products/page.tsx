"use client";

import * as React from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { inr, useApp } from "@/lib/store";
import type { Product } from "@/lib/data";
import { AdminPage, Btn, Field, Modal, TableWrap, inputCls, td, th } from "@/components/site/AdminUI";

const blank = (category: string): Product => ({
  id: "",
  name: "",
  category,
  price: 0,
  oldPrice: 0,
  rating: 4.5,
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
  const { state, set } = useApp();
  const [q, setQ] = React.useState("");
  const [cat, setCat] = React.useState("All");
  const [editing, setEditing] = React.useState<Product | null>(null);
  const [isNew, setIsNew] = React.useState(false);
  const [confirmId, setConfirmId] = React.useState<string | null>(null);

  const list = state.products.filter(
    (p) =>
      (cat === "All" || p.category === cat) &&
      (p.name.toLowerCase().includes(q.toLowerCase()) || p.category.toLowerCase().includes(q.toLowerCase())),
  );

  const save = () => {
    if (!editing) return;
    if (!editing.name.trim()) {
      toast.error("Product name is required");
      return;
    }
    set((s) => ({
      ...s,
      products: isNew
        ? [{ ...editing, id: `p${Date.now()}` }, ...s.products]
        : s.products.map((p) => (p.id === editing.id ? editing : p)),
    }));
    toast.success(isNew ? "Product added" : "Product updated");
    setEditing(null);
  };

  return (
    <AdminPage
      title="Products"
      subtitle={`${state.products.length} products in the catalogue.`}
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
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products…" className={`${inputCls} max-w-xs`} />
        <select value={cat} onChange={(e) => setCat(e.target.value)} className={`${inputCls} max-w-xs`}>
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
          {list.map((p) => (
            <tr key={p.id} className="border-b border-border last:border-0">
              <td className={`${td} font-semibold`}>{p.name}</td>
              <td className={td}>{p.category}</td>
              <td className={td}>{inr(p.price)}</td>
              <td className={td}>{p.stock}</td>
              <td className={`${td} text-xs capitalize text-muted-foreground`}>{p.badges.join(", ") || "—"}</td>
              <td className={td}>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setIsNew(false);
                      setEditing(p);
                    }}
                    className="rounded-lg border border-border p-2"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => setConfirmId(p.id)} className="rounded-lg border border-border p-2 text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </TableWrap>

      <Modal open={!!editing} onClose={() => setEditing(null)} title={isNew ? "Add Product" : "Edit Product"} wide>
        {editing && (
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Name">
              <input className={inputCls} value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
            </Field>
            <Field label="Category">
              <select className={inputCls} value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })}>
                {state.categories.map((c) => (
                  <option key={c.id}>{c.name}</option>
                ))}
              </select>
            </Field>
            <Field label="Price (₹)">
              <input type="number" className={inputCls} value={editing.price} onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })} />
            </Field>
            <Field label="Old Price (₹)">
              <input type="number" className={inputCls} value={editing.oldPrice} onChange={(e) => setEditing({ ...editing, oldPrice: Number(e.target.value) })} />
            </Field>
            <Field label="Stock">
              <input type="number" className={inputCls} value={editing.stock} onChange={(e) => setEditing({ ...editing, stock: Number(e.target.value) })} />
            </Field>
            <Field label="Pack size">
              <input className={inputCls} value={editing.unit} onChange={(e) => setEditing({ ...editing, unit: e.target.value })} />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Image URL">
                <input className={inputCls} value={editing.image} onChange={(e) => setEditing({ ...editing, image: e.target.value })} />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Field label="Description">
                <textarea rows={3} className={inputCls} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Field label="Benefits (one per line)">
                <textarea
                  rows={4}
                  className={inputCls}
                  value={editing.benefits.join("\n")}
                  onChange={(e) => setEditing({ ...editing, benefits: e.target.value.split("\n").filter(Boolean) })}
                />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Field label="Usage / dosage">
                <textarea rows={2} className={inputCls} value={editing.usage} onChange={(e) => setEditing({ ...editing, usage: e.target.value })} />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Field label="Ingredients">
                <input className={inputCls} value={editing.ingredients} onChange={(e) => setEditing({ ...editing, ingredients: e.target.value })} />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <p className="mb-2 text-sm font-medium">Badges</p>
              <div className="flex flex-wrap gap-2">
                {BADGES.map((b) => {
                  const on = editing.badges.includes(b);
                  return (
                    <button
                      key={b}
                      onClick={() =>
                        setEditing({ ...editing, badges: on ? editing.badges.filter((x) => x !== b) : [...editing.badges, b] })
                      }
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${on ? "bg-primary text-primary-foreground" : "border border-border"}`}
                    >
                      {b}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex justify-end gap-2 sm:col-span-2">
              <Btn variant="ghost" onClick={() => setEditing(null)}>
                Cancel
              </Btn>
              <Btn onClick={save}>Save Product</Btn>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={!!confirmId} onClose={() => setConfirmId(null)} title="Delete product?">
        <p className="text-sm text-muted-foreground">This removes the product from the catalogue and storefront.</p>
        <div className="mt-5 flex justify-end gap-2">
          <Btn variant="ghost" onClick={() => setConfirmId(null)}>
            Cancel
          </Btn>
          <Btn
            variant="danger"
            onClick={() => {
              set((s) => ({ ...s, products: s.products.filter((p) => p.id !== confirmId) }));
              setConfirmId(null);
              toast.success("Product deleted");
            }}
          >
            Delete
          </Btn>
        </div>
      </Modal>
    </AdminPage>
  );
}
