"use client";

import * as React from "react";
import {
  Ticket,
  Plus,
  Search,
  Percent,
  CheckCircle2,
  Trash2,
  Edit2,
  Copy,
  Calendar,
  AlertCircle,
  Tag,
  Coins,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { inr, useApp, type Coupon } from "@/lib/store";
import { AdminPage, Btn, Field, Modal, Panel, TableWrap, inputCls, td, th } from "@/components/site/AdminUI";

const emptyCoupon: Coupon = {
  code: "",
  discount: 10,
  discountType: "percentage",
  minOrder: 1000,
  maxDiscount: 0,
  description: "",
  isActive: true,
  expiryDate: "",
};

export default function AdminCouponsPage() {
  const { state, saveCoupon, deleteCoupon } = useApp();
  const [search, setSearch] = React.useState("");
  const [filterType, setFilterType] = React.useState<"all" | "active" | "inactive">("all");
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editingCode, setEditingCode] = React.useState<string | null>(null);
  const [form, setForm] = React.useState<Coupon>(emptyCoupon);
  const [saving, setSaving] = React.useState(false);
  const [deleteConfirmCode, setDeleteConfirmCode] = React.useState<string | null>(null);

  const coupons = state.coupons || [];

  // Filtered coupons
  const filtered = React.useMemo(() => {
    return coupons.filter((c) => {
      const matchSearch =
        c.code.toLowerCase().includes(search.toLowerCase()) ||
        c.description?.toLowerCase().includes(search.toLowerCase());

      if (!matchSearch) return false;
      if (filterType === "active") return c.isActive !== false;
      if (filterType === "inactive") return c.isActive === false;
      return true;
    });
  }, [coupons, search, filterType]);

  // Quick stats
  const activeCount = coupons.filter((c) => c.isActive !== false).length;
  const percentageCount = coupons.filter((c) => c.discountType !== "fixed" && c.discount <= 100).length;
  const fixedCount = coupons.filter((c) => c.discountType === "fixed" || c.discount > 100).length;

  const handleOpenCreate = () => {
    setEditingCode(null);
    setForm({
      ...emptyCoupon,
      code: "",
      discount: 10,
      discountType: "percentage",
      minOrder: 1000,
      maxDiscount: 500,
      description: "",
      isActive: true,
      expiryDate: "",
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (c: Coupon) => {
    setEditingCode(c.code);
    setForm({
      ...c,
      discountType: c.discountType || (c.discount > 100 ? "fixed" : "percentage"),
      minOrder: c.minOrder || 0,
      maxDiscount: c.maxDiscount || 0,
      isActive: c.isActive !== false,
      expiryDate: c.expiryDate || "",
    });
    setModalOpen(true);
  };

  const handleToggleActive = async (c: Coupon) => {
    const updated = { ...c, isActive: c.isActive === false };
    const ok = await saveCoupon(updated, false);
    if (ok) {
      toast.success(`Coupon ${c.code} is now ${updated.isActive ? "active" : "inactive"}`);
    } else {
      toast.error("Failed to update coupon status");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = form.code.trim().toUpperCase();
    if (!cleanCode) {
      toast.error("Please enter a coupon code");
      return;
    }
    if (!form.discount || Number(form.discount) <= 0) {
      toast.error("Please enter a valid positive discount amount");
      return;
    }
    if (form.discountType === "percentage" && Number(form.discount) > 90) {
      toast.error("Percentage discount cannot exceed 90%");
      return;
    }

    setSaving(true);
    try {
      const isNew = editingCode === null;
      const payload: Coupon = {
        ...form,
        code: cleanCode,
        discount: Number(form.discount),
        discountType: form.discountType || "percentage",
        minOrder: Number(form.minOrder || 0),
        maxDiscount: Number(form.maxDiscount || 0),
        description: form.description?.trim() || "",
        isActive: form.isActive !== false,
        expiryDate: form.expiryDate || "",
      };

      const ok = await saveCoupon(payload, isNew);
      if (ok) {
        toast.success(
          isNew
            ? `Coupon "${cleanCode}" created successfully!`
            : `Coupon "${cleanCode}" updated successfully!`
        );
        setModalOpen(false);
      } else {
        toast.error("Failed to save coupon in MongoDB Atlas.");
      }
    } catch {
      toast.error("An error occurred while saving the coupon.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (code: string) => {
    const ok = await deleteCoupon(code);
    if (ok) {
      toast.success(`Coupon ${code} deleted successfully`);
      setDeleteConfirmCode(null);
    } else {
      toast.error("Failed to delete coupon");
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`Coupon code "${code}" copied to clipboard!`);
  };

  return (
    <AdminPage
      title="Discount Coupons & Offers"
      subtitle="Create promotional coupon codes that farmers and customers can apply to their orders at purchasing time."
      action={
        <Btn onClick={handleOpenCreate}>
          <Plus className="h-4 w-4 mr-1.5" /> Create Coupon
        </Btn>
      }
    >
      {/* Metric Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Panel className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Ticket className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Coupons</p>
            <p className="font-display text-2xl font-bold text-foreground">{coupons.length}</p>
          </div>
        </Panel>

        <Panel className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Active Coupons</p>
            <p className="font-display text-2xl font-bold text-foreground">{activeCount}</p>
          </div>
        </Panel>

        <Panel className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600">
            <Percent className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Percentage (%) Offers</p>
            <p className="font-display text-2xl font-bold text-foreground">{percentageCount}</p>
          </div>
        </Panel>

        <Panel className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600">
            <Coins className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Flat (₹) Savings</p>
            <p className="font-display text-2xl font-bold text-foreground">{fixedCount}</p>
          </div>
        </Panel>
      </div>

      {/* Search and Filters */}
      <Panel className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by coupon code or description..."
            className={`${inputCls} pl-10`}
          />
        </div>

        <div className="flex items-center gap-2">
          {(["all", "active", "inactive"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setFilterType(t)}
              className={`rounded-full px-4 py-1.5 text-xs font-bold capitalize transition-all ${
                filterType === t
                  ? "bg-primary text-primary-foreground shadow-2xs"
                  : "border border-border bg-card text-muted-foreground hover:bg-muted"
              }`}
            >
              {t} ({t === "all" ? coupons.length : t === "active" ? activeCount : coupons.length - activeCount})
            </button>
          ))}
        </div>
      </Panel>

      {/* Coupons Table */}
      <TableWrap>
        <thead>
          <tr>
            <th className={th}>Coupon Code</th>
            <th className={th}>Discount Value</th>
            <th className={th}>Min Order Req.</th>
            <th className={th}>Offer Details</th>
            <th className={th}>Status</th>
            <th className={`${th} text-right`}>Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {filtered.length === 0 ? (
            <tr>
              <td colSpan={6} className="py-12 text-center text-sm text-muted-foreground">
                <Ticket className="mx-auto h-8 w-8 text-muted-foreground/40 mb-2" />
                <p className="font-semibold text-foreground">No coupons found</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {coupons.length === 0
                    ? "Click 'Create Coupon' to add your first promotional discount."
                    : "No coupons matched your search or filter."}
                </p>
              </td>
            </tr>
          ) : (
            filtered.map((c) => {
              const isFixed = c.discountType === "fixed" || (!c.discountType && c.discount > 100);
              const isActive = c.isActive !== false;
              const isExpired = c.expiryDate && new Date(c.expiryDate) < new Date();

              return (
                <tr key={c.code} className="hover:bg-muted/30 transition-colors">
                  <td className={td}>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/10 px-2.5 py-1 font-mono text-xs font-bold text-primary">
                        <Tag className="h-3 w-3" /> {c.code}
                      </span>
                      <button
                        type="button"
                        onClick={() => copyCode(c.code)}
                        title="Copy coupon code"
                        className="text-muted-foreground hover:text-foreground p-1 transition-colors"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>

                  <td className={td}>
                    <span className="font-display font-bold text-base text-foreground">
                      {isFixed ? inr(c.discount) : `${c.discount}%`} OFF
                    </span>
                    {!isFixed && c.maxDiscount ? (
                      <span className="block text-[11px] text-muted-foreground">
                        Up to {inr(c.maxDiscount)}
                      </span>
                    ) : null}
                  </td>

                  <td className={td}>
                    {c.minOrder ? (
                      <span className="text-xs font-semibold text-foreground">
                        {inr(c.minOrder)}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground italic">No minimum</span>
                    )}
                  </td>

                  <td className={td}>
                    <p className="max-w-xs text-xs text-foreground line-clamp-2">
                      {c.description || "Applicable on all farm products and fertilizer inputs."}
                    </p>
                    {c.expiryDate && (
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] mt-1 ${
                          isExpired ? "text-destructive font-semibold" : "text-muted-foreground"
                        }`}
                      >
                        <Calendar className="h-3 w-3" />
                        {isExpired ? `Expired (${c.expiryDate})` : `Expires: ${c.expiryDate}`}
                      </span>
                    )}
                  </td>

                  <td className={td}>
                    <button
                      type="button"
                      onClick={() => handleToggleActive(c)}
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-all ${
                        isActive
                          ? "bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          isActive ? "bg-emerald-500" : "bg-muted-foreground"
                        }`}
                      />
                      {isActive ? "Active" : "Inactive"}
                    </button>
                  </td>

                  <td className={`${td} text-right`}>
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(c)}
                        title="Edit coupon"
                        className="rounded-lg border border-border bg-card p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors shadow-2xs"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmCode(c.code)}
                        title="Delete coupon"
                        className="rounded-lg border border-destructive/20 bg-destructive/10 p-1.5 text-destructive hover:bg-destructive/20 transition-colors shadow-2xs"
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

      {/* Delete Confirmation Dialog */}
      {deleteConfirmCode && (
        <Modal
          open={Boolean(deleteConfirmCode)}
          onClose={() => setDeleteConfirmCode(null)}
          title="Delete Coupon"
        >
          <div className="p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-foreground">
                  Are you sure you want to delete coupon &quot;{deleteConfirmCode}&quot;?
                </h4>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  Farmers will no longer be able to apply this discount code during purchase.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-border">
              <Btn variant="ghost" onClick={() => setDeleteConfirmCode(null)}>
                Cancel
              </Btn>
              <Btn variant="danger" onClick={() => handleDelete(deleteConfirmCode)}>
                Confirm Delete
              </Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* Create / Edit Coupon Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCode ? `Edit Coupon: ${editingCode}` : "Create New Discount Coupon"}
        wide
      >
        <form onSubmit={handleSave} className="p-5 sm:p-6 space-y-5">
          {/* Coupon Code */}
          <Field label="Coupon Code *">
            <input
              required
              type="text"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase().trim() })}
              placeholder="e.g. KISAN25, HARVEST500"
              className={`${inputCls} font-mono font-bold tracking-wider`}
            />
            <span className="text-[11px] text-muted-foreground">
              Code will be entered by farmers during checkout. Letters and numbers only (auto-uppercased).
            </span>
          </Field>

          {/* Discount Type */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Discount Type *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setForm({ ...form, discountType: "percentage" })}
                className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-xs font-bold transition-all ${
                  form.discountType === "percentage"
                    ? "border-primary bg-primary/10 text-primary shadow-xs"
                    : "border-border bg-card text-muted-foreground hover:bg-muted"
                }`}
              >
                <Percent className="h-4 w-4" /> Percentage (%) Off
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, discountType: "fixed" })}
                className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-xs font-bold transition-all ${
                  form.discountType === "fixed"
                    ? "border-primary bg-primary/10 text-primary shadow-xs"
                    : "border-border bg-card text-muted-foreground hover:bg-muted"
                }`}
              >
                <Coins className="h-4 w-4" /> Flat Amount (₹) Off
              </button>
            </div>
          </div>

          {/* Values Grid */}
          <div className="grid gap-4 sm:grid-cols-3">
            <Field
              label={
                form.discountType === "fixed"
                  ? "Flat Discount Amount (₹) *"
                  : "Discount Percentage (%) *"
              }
            >
              <input
                required
                type="number"
                min={1}
                max={form.discountType === "percentage" ? 90 : 100000}
                value={form.discount}
                onChange={(e) => setForm({ ...form, discount: Number(e.target.value) })}
                className={inputCls}
                placeholder={form.discountType === "fixed" ? "500" : "15"}
              />
            </Field>

            <Field label="Minimum Order Value (₹)">
              <input
                type="number"
                min={0}
                value={form.minOrder}
                onChange={(e) => setForm({ ...form, minOrder: Number(e.target.value) })}
                className={inputCls}
                placeholder="0 for no minimum"
              />
              <span className="text-[11px] text-muted-foreground">
                Minimum cart total needed to use code.
              </span>
            </Field>

            {form.discountType === "percentage" ? (
              <Field label="Max Discount Cap (₹)">
                <input
                  type="number"
                  min={0}
                  value={form.maxDiscount || 0}
                  onChange={(e) => setForm({ ...form, maxDiscount: Number(e.target.value) })}
                  className={inputCls}
                  placeholder="0 for no limit"
                />
                <span className="text-[11px] text-muted-foreground">
                  Upper ceiling for % discount.
                </span>
              </Field>
            ) : (
              <Field label="Expiry Date (Optional)">
                <input
                  type="date"
                  value={form.expiryDate || ""}
                  onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
                  className={inputCls}
                />
              </Field>
            )}
          </div>

          {form.discountType === "percentage" && (
            <Field label="Expiry Date (Optional)">
              <input
                type="date"
                value={form.expiryDate || ""}
                onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
                className={inputCls}
              />
            </Field>
          )}

          {/* Description */}
          <Field label="Offer Description / Customer Notice">
            <textarea
              rows={2}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="e.g. 15% discount on all organic fertilizers for orders above ₹2,000"
              className={inputCls}
            />
          </Field>

          {/* Active Status */}
          <div className="flex items-center justify-between rounded-xl border border-border bg-muted/20 p-3">
            <div>
              <p className="text-xs font-bold text-foreground">Coupon Status</p>
              <p className="text-[11px] text-muted-foreground">
                When active, customers can enter this code in cart or checkout.
              </p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center shrink-0">
              <input
                type="checkbox"
                checked={form.isActive !== false}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                className="peer sr-only"
              />
              <div className="peer h-6 w-11 rounded-full bg-muted peer-checked:bg-primary peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full"></div>
            </label>
          </div>

          {/* Modal Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t border-border">
            <Btn variant="ghost" onClick={() => setModalOpen(false)} disabled={saving}>
              Cancel
            </Btn>
            <Btn type="submit" disabled={saving}>
              {saving ? "Saving..." : editingCode ? "Update Coupon" : "Create Coupon"}
            </Btn>
          </div>
        </form>
      </Modal>
    </AdminPage>
  );
}
