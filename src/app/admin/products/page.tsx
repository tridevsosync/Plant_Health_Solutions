"use client";

import * as React from "react";
import {
  Pencil,
  Plus,
  Trash2,
  Loader2,
  Image as ImageIcon,
  Layers,
  Sparkles,
  CheckCircle2,
  Package,
} from "lucide-react";
import { toast } from "sonner";
import { inr, useApp } from "@/lib/store";
import type { Product, ProductVariant } from "@/lib/data";
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
  image2: "",
  images: ["https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=70"],
  description: "",
  benefits: [],
  usage: "",
  ingredients: "",
  badges: [],
  variants: [
    {
      id: "v_1",
      packSize: "1 L",
      price: 0,
      oldPrice: 0,
      quantity: 100,
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=70",
    },
  ],
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

  // Initialize variants for product if not present when editing opens
  const openEdit = (p: Product, isNewProd = false) => {
    setIsNew(isNewProd);
    let normalizedVariants: ProductVariant[] = [];
    if (p.variants && p.variants.length > 0) {
      normalizedVariants = p.variants.map((v, i) => ({
        id: v.id || `v_${Date.now()}_${i}`,
        packSize: v.packSize || p.unit || "1 L",
        price: v.price ?? p.price ?? 0,
        oldPrice: v.oldPrice ?? p.oldPrice ?? 0,
        quantity: v.quantity ?? p.stock ?? 100,
        image: v.image || p.image || "",
      }));
    } else {
      normalizedVariants = [
        {
          id: `v_${Date.now()}_0`,
          packSize: p.unit || "1 L",
          price: p.price || 0,
          oldPrice: p.oldPrice || 0,
          quantity: p.stock || 100,
          image: p.image || "",
        },
      ];
    }

    setEditing({
      ...p,
      variants: normalizedVariants,
    });
  };

  // Add new variant option inside editing product
  const handleAddVariant = () => {
    if (!editing) return;
    const currentVariants = editing.variants || [];
    const newVar: ProductVariant = {
      id: `v_${Date.now()}_${currentVariants.length}`,
      packSize: currentVariants.length === 0 ? "1 L" : currentVariants.length === 1 ? "500 ml" : "5 L",
      price: currentVariants[0]?.price || 0,
      oldPrice: currentVariants[0]?.oldPrice || 0,
      quantity: 100,
      image: currentVariants[0]?.image || editing.image || "",
    };
    setEditing({
      ...editing,
      variants: [...currentVariants, newVar],
    });
  };

  // Update specific variant field
  const handleUpdateVariant = (index: number, field: keyof ProductVariant, val: string | number) => {
    if (!editing || !editing.variants) return;
    const updated = [...editing.variants];
    updated[index] = {
      ...updated[index],
      [field]: val,
    };
    setEditing({
      ...editing,
      variants: updated,
    });
  };

  // Remove a variant option
  const handleRemoveVariant = (index: number) => {
    if (!editing || !editing.variants) return;
    if (editing.variants.length <= 1) {
      toast.error("At least one pack size option is required");
      return;
    }
    const updated = editing.variants.filter((_, i) => i !== index);
    setEditing({
      ...editing,
      variants: updated,
    });
  };

  const save = async () => {
    if (!editing) return;
    if (!editing.name.trim()) {
      toast.error("Product name is required");
      return;
    }

    const currentVariants = editing.variants && editing.variants.length > 0
      ? editing.variants
      : [
          {
            id: `v_${Date.now()}`,
            packSize: editing.unit || "1 L",
            price: editing.price || 0,
            oldPrice: editing.oldPrice || 0,
            quantity: editing.stock || 100,
            image: editing.image || "",
          },
        ];

    // Primary variant is the first one
    const primary = currentVariants[0];

    const productImages = [
      primary.image || editing.image,
      editing.image2,
      ...currentVariants.map((v) => v.image).filter(Boolean),
    ].filter((img): img is string => Boolean(img) && typeof img === "string")
      .filter((img, i, arr) => arr.indexOf(img) === i)
      .slice(0, 4);

    const totalStock = currentVariants.reduce((sum, v) => sum + (Number(v.quantity) || 0), 0);

    const finalProduct: Product = {
      ...editing,
      unit: primary.packSize || editing.unit || "1 L",
      price: Number(primary.price) || 0,
      oldPrice: Number(primary.oldPrice) || 0,
      stock: totalStock > 0 ? totalStock : Number(primary.quantity) || 100,
      image: primary.image || editing.image || productImages[0] || "",
      image2: editing.image2 || (productImages[1] ?? ""),
      images: productImages,
      variants: currentVariants,
    };

    setSaving(true);
    const ok = await saveProduct(finalProduct, isNew);
    setSaving(false);
    if (ok) {
      toast.success(isNew ? "Product created with variants in MongoDB" : "Product updated in MongoDB");
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
            openEdit(blank(state.categories[0]?.name ?? "Bio Fertilizers"), true);
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
            <th className={th}>Pack Sizes &amp; Prices</th>
            <th className={th}>Total Stock</th>
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
            paginatedList.map((p) => {
              const hasMultipleVariants = p.variants && p.variants.length > 1;
              return (
                <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                  <td className={`${td} font-semibold`}>
                    <div className="flex items-center gap-3">
                      {p.image ? (
                        <img
                          src={p.image}
                          alt={p.name}
                          className="h-10 w-10 rounded-lg object-cover border border-border shrink-0"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
                          {p.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-foreground">{p.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {hasMultipleVariants ? (
                            <span className="inline-flex items-center gap-1 text-primary font-medium">
                              <Layers className="h-3 w-3" /> {p.variants?.length} pack sizes
                            </span>
                          ) : (
                            p.unit
                          )}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className={td}>
                    <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                      {p.category}
                    </span>
                  </td>
                  <td className={td}>
                    {hasMultipleVariants ? (
                      <div className="space-y-0.5">
                        <div className="font-bold text-foreground text-xs sm:text-sm">
                          {inr(Math.min(...(p.variants?.map((v) => v.price) || [p.price])))} –{" "}
                          {inr(Math.max(...(p.variants?.map((v) => v.price) || [p.price])))}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {p.variants?.slice(0, 3).map((v, i) => (
                            <span
                              key={i}
                              className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground"
                            >
                              {v.packSize}: {inr(v.price)}
                            </span>
                          ))}
                          {(p.variants?.length || 0) > 3 && (
                            <span className="text-[10px] text-muted-foreground">
                              +{(p.variants?.length || 0) - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <span className="font-bold text-foreground">{inr(p.price)}</span>
                        {p.oldPrice > p.price && (
                          <span className="ml-1 text-xs text-muted-foreground line-through">
                            {inr(p.oldPrice)}
                          </span>
                        )}
                        <span className="ml-1.5 text-xs text-muted-foreground">({p.unit})</span>
                      </div>
                    )}
                  </td>
                  <td className={td}>
                    <span
                      className={`font-semibold ${
                        p.stock > 0 ? "text-foreground" : "text-destructive"
                      }`}
                    >
                      {p.stock > 0 ? `${p.stock} units` : "Out of stock"}
                    </span>
                  </td>
                  <td className={`${td} text-xs capitalize text-muted-foreground`}>
                    {p.badges?.join(", ") || "—"}
                  </td>
                  <td className={td}>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(p, false)}
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
              );
            })
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

      {/* Product Creation / Edit Modal */}
      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={isNew ? "Add New Product" : `Edit Product: ${editing?.name || ""}`}
        wide
      >
        {editing && (
          <div className="space-y-6 min-w-0 w-full">
            {/* Step 1: Product Name & Category */}
            <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-border/70 pb-3">
                <Package className="h-5 w-5 text-primary" />
                <h3 className="font-display text-base font-bold text-foreground">
                  1. Product Basic Information
                </h3>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Product Name *">
                  <input
                    className={inputCls}
                    value={editing.name}
                    onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                    placeholder="e.g. Bio NPK Premium Fertilizer"
                    required
                  />
                </Field>

                <Field label="Category *">
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
              </div>
            </div>

            {/* Step 2: Product Pack Sizes / Variants (Price, Old Price, Qty, Pack size, Image) */}
            <div className="rounded-2xl border-2 border-primary/20 bg-primary/[0.02] p-4 sm:p-5 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-primary/10 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Layers className="h-5 w-5 text-primary" />
                    <h3 className="font-display text-base font-bold text-foreground">
                      2. Pack Sizes &amp; Pricing (Multi-Product Options)
                    </h3>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Add multiple pack sizes (e.g. 500 ml, 1 L, 5 L) with different prices, old prices, stock quantities &amp; images in this one product.
                  </p>
                </div>

                {/* Prominent "+ Add Product Option" Button */}
                <Btn type="button" onClick={handleAddVariant} className="shrink-0">
                  <Plus className="h-4 w-4 mr-1.5" />
                  Add Pack Size / Product Option
                </Btn>
              </div>

              {/* List of Pack Sizes */}
              <div className="space-y-4">
                {(editing.variants || []).map((v, idx) => {
                  const isPrimary = idx === 0;
                  return (
                    <div
                      key={v.id || idx}
                      className="rounded-xl border border-border bg-card p-4 shadow-xs space-y-4 relative transition-all hover:border-primary/40"
                    >
                      <div className="flex items-center justify-between border-b border-border/70 pb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                            {idx + 1}
                          </span>
                          <span className="font-bold text-sm text-foreground">
                            {v.packSize ? `Pack: ${v.packSize}` : `Option #${idx + 1}`}
                          </span>
                          {isPrimary && (
                            <span className="rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 text-[10px] font-bold">
                              Default Main Pack
                            </span>
                          )}
                        </div>

                        {(editing.variants?.length || 0) > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveVariant(idx)}
                            className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs text-destructive hover:bg-destructive/10 transition-colors"
                            title="Remove this pack size"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Remove
                          </button>
                        )}
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {/* Pack Size / Unit */}
                        <Field label="Pack Size / Unit *">
                          <input
                            className={inputCls}
                            value={v.packSize}
                            onChange={(e) => handleUpdateVariant(idx, "packSize", e.target.value)}
                            placeholder="e.g. 500 ml, 1 L, 5 L, 25 kg"
                            required
                          />
                        </Field>

                        {/* Price */}
                        <Field label="Selling Price (₹) *">
                          <input
                            type="number"
                            min="0"
                            className={inputCls}
                            value={v.price}
                            onChange={(e) => handleUpdateVariant(idx, "price", Number(e.target.value) || 0)}
                            placeholder="500"
                            required
                          />
                        </Field>

                        {/* Old Price / MRP */}
                        <Field label="Old Price / MRP (₹)">
                          <input
                            type="number"
                            min="0"
                            className={inputCls}
                            value={v.oldPrice ?? 0}
                            onChange={(e) => handleUpdateVariant(idx, "oldPrice", Number(e.target.value) || 0)}
                            placeholder="650"
                          />
                        </Field>

                        {/* Quantity / Stock */}
                        <Field label="Available Quantity (Stock) *">
                          <input
                            type="number"
                            min="0"
                            className={inputCls}
                            value={v.quantity ?? 100}
                            onChange={(e) => handleUpdateVariant(idx, "quantity", Number(e.target.value) || 0)}
                            placeholder="100"
                            required
                          />
                        </Field>
                      </div>

                      {/* Image for this pack size */}
                      <div className="pt-2 border-t border-border/50">
                        <ImageUploader
                          label={`Photo for ${v.packSize || `Option #${idx + 1}`}`}
                          value={v.image || ""}
                          onChange={(url) => handleUpdateVariant(idx, "image", url)}
                          folder="plant_health_solutions/products"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

                {/* Secondary button to append more options */}
                <button
                  type="button"
                  onClick={handleAddVariant}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-primary/40 bg-primary/5 py-3 text-xs font-bold text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                >
                  <Plus className="h-4 w-4" /> Add Another Pack Size / Product Option
                </button>
            </div>

            {/* Step 3: Product Description & Agronomy Specifications */}
            <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-xs space-y-4">
              <h3 className="font-display text-base font-bold text-foreground border-b border-border/70 pb-3">
                3. Product Specifications &amp; Agronomy Details
              </h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Field label="Product Description">
                    <textarea
                      rows={3}
                      className={inputCls}
                      value={editing.description}
                      onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                      placeholder="Comprehensive description of product efficacy, micro-organism strains and advantages..."
                    />
                  </Field>
                </div>

                <div className="sm:col-span-2">
                  <Field label="Benefits (one per line)">
                    <textarea
                      rows={3}
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
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Badges
                  </p>
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
                            on
                              ? "bg-primary text-primary-foreground"
                              : "border border-border text-foreground hover:bg-muted"
                          }`}
                        >
                          {b}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="flex justify-end gap-2 pt-4 border-t border-border">
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

      {/* Delete Confirmation Modal */}
      <Modal open={!!confirmId} onClose={() => setConfirmId(null)} title="Delete product?">
        <p className="text-sm text-muted-foreground">
          This permanently removes the product and all its pack size options from the MongoDB database and storefront catalogue.
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
