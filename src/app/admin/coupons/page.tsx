"use client";

import * as React from "react";
import { Plus, Trash2, Loader2, Tag, Pencil, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { inr, useApp } from "@/lib/store";
import type { Coupon } from "@/lib/data";
import { AdminPage, Btn, Field, Modal, TableWrap, inputCls, td, th } from "@/components/site/AdminUI";

const blankCoupon: Coupon = {
  code: "",
  discount: 10,
  minOrder: 1000,
  description: "",
};

export default function AdminCouponsPage() {
  const { state, saveCoupon, deleteCoupon, deleteAllCoupons } = useApp();
  const [open, setOpen] = React.useState(false);
  const [editingCoupon, setEditingCoupon] = React.useState<Coupon | null>(null);
  const [confirmCode, setConfirmCode] = React.useState<string | null>(null);
  const [confirmClearAll, setConfirmClearAll] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);
  const [clearingAll, setClearingAll] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [form, setForm] = React.useState<Coupon>(blankCoupon);

  const openCreate = () => {
    setEditingCoupon(null);
    setForm(blankCoupon);
    setOpen(true);
  };

  const openEdit = (c: Coupon) => {
    setEditingCoupon(c);
    setForm({ ...c });
    setOpen(true);
  };

  const handleSave = async () => {
    const code = form.code.trim().toUpperCase();
    if (!code) {
      toast.error("Coupon code is required");
      return;
    }
    if (!form.discount || form.discount <= 0 || form.discount > 100) {
      toast.error("Please enter a valid discount percentage between 1% and 100%");
      return;
    }

    // If creating new, check duplicate
    if (!editingCoupon && state.coupons.some((c) => c.code.toUpperCase() === code)) {
      toast.error("That coupon code already exists in MongoDB");
      return;
    }

    setSaving(true);
    const isNew = !editingCoupon;
    const ok = await saveCoupon({ ...form, code }, isNew);
    setSaving(false);
    if (ok) {
      toast.success(isNew ? `Coupon ${code} created in MongoDB` : `Coupon ${code} updated`);
      setOpen(false);
      setForm(blankCoupon);
      setEditingCoupon(null);
    } else {
      toast.error("Failed to save coupon");
    }
  };

  const handleDelete = async () => {
    if (!confirmCode) return;
    setDeleting(true);
    const ok = await deleteCoupon(confirmCode);
    setDeleting(false);
    if (ok) {
      toast.success(`Coupon ${confirmCode} removed from MongoDB`);
      setConfirmCode(null);
    } else {
      toast.error("Failed to delete coupon");
    }
  };

  const handleClearAll = async () => {
    setClearingAll(true);
    const ok = await deleteAllCoupons();
    setClearingAll(false);
    if (ok) {
      toast.success("All promotional coupons deleted from MongoDB");
      setConfirmClearAll(false);
    } else {
      toast.error("Failed to delete all coupons");
    }
  };

  return (
    <AdminPage
      title="Coupons & Discount Codes"
      subtitle={`${state.coupons.length} active promotional codes stored in MongoDB.`}
      action={
        <div className="flex flex-wrap items-center gap-2">
          {state.coupons.length > 0 && (
            <button
              type="button"
              onClick={() => setConfirmClearAll(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-2 text-xs font-bold text-destructive hover:bg-destructive/20 transition-all shadow-sm"
            >
              <Trash2 className="h-4 w-4" /> Delete All Coupons
            </button>
          )}
          <Btn onClick={openCreate}>
            <span className="inline-flex items-center gap-2">
              <Plus className="h-4 w-4" /> Add Coupon
            </span>
          </Btn>
        </div>
      }
    >
      <TableWrap>
        <thead className="border-b border-border bg-muted/50">
          <tr>
            <th className={th}>Coupon Code</th>
            <th className={th}>Discount</th>
            <th className={th}>Minimum Order</th>
            <th className={th}>Description</th>
            <th className={th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {state.coupons.length === 0 ? (
            <tr>
              <td colSpan={5} className="p-12 text-center text-muted-foreground text-sm">
                <Tag className="mx-auto h-12 w-12 text-muted-foreground/40 mb-3" />
                <p className="font-semibold text-foreground">No coupons currently active in MongoDB.</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Click &quot;Add Coupon&quot; to create a new promotional discount.
                </p>
              </td>
            </tr>
          ) : (
            state.coupons.map((c) => (
              <tr key={c.code} className="border-b border-border last:border-0 hover:bg-muted/20">
                <td className={`${td} font-display font-bold text-primary`}>
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-mono font-bold text-primary">
                    <Tag className="h-3 w-3" /> {c.code}
                  </span>
                </td>
                <td className={`${td} font-bold text-foreground`}>{c.discount}% OFF</td>
                <td className={td}>{inr(c.minOrder)}</td>
                <td className={`${td} text-xs text-muted-foreground`}>{c.description || "—"}</td>
                <td className={td}>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEdit(c)}
                      className="rounded-lg border border-border p-2 text-foreground hover:bg-muted"
                      title="Edit Coupon"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setConfirmCode(c.code)}
                      className="rounded-lg border border-border p-2 text-destructive hover:bg-destructive/10"
                      title="Delete Coupon"
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

      {/* Create / Edit Modal */}
      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
          setEditingCoupon(null);
        }}
        title={editingCoupon ? `Edit Coupon: ${editingCoupon.code}` : "Create New Coupon"}
      >
        <div className="space-y-4 min-w-0 w-full">
          <Field label="Coupon Code">
            <input
              className={inputCls}
              value={form.code}
              placeholder="e.g. KISAN20"
              disabled={!!editingCoupon}
              onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
            />
          </Field>
          <Field label="Discount Percentage (%)">
            <input
              type="number"
              min="1"
              max="100"
              className={inputCls}
              value={form.discount}
              onChange={(e) => setForm({ ...form, discount: Number(e.target.value) })}
            />
          </Field>
          <Field label="Minimum Order Value (₹)">
            <input
              type="number"
              min="0"
              className={inputCls}
              value={form.minOrder}
              onChange={(e) => setForm({ ...form, minOrder: Number(e.target.value) })}
            />
          </Field>
          <Field label="Description / Offer Terms">
            <input
              className={inputCls}
              value={form.description}
              placeholder="Special 20% discount on orders above ₹2,000"
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </Field>
          <div className="flex justify-end gap-2 pt-3 border-t border-border">
            <Btn
              variant="ghost"
              onClick={() => {
                setOpen(false);
                setEditingCoupon(null);
              }}
            >
              Cancel
            </Btn>
            <Btn onClick={handleSave} disabled={saving}>
              {saving ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                </span>
              ) : editingCoupon ? (
                "Update Coupon"
              ) : (
                "Create Coupon"
              )}
            </Btn>
          </div>
        </div>
      </Modal>

      {/* Delete Single Coupon Modal */}
      <Modal open={!!confirmCode} onClose={() => setConfirmCode(null)} title="Delete coupon?">
        <p className="text-sm text-muted-foreground">
          Are you sure you want to delete coupon code <strong>{confirmCode}</strong> from MongoDB?
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Btn variant="ghost" onClick={() => setConfirmCode(null)} disabled={deleting}>
            Cancel
          </Btn>
          <Btn variant="danger" onClick={handleDelete} disabled={deleting}>
            {deleting ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Deleting...
              </span>
            ) : (
              "Delete Coupon"
            )}
          </Btn>
        </div>
      </Modal>

      {/* Clear / Delete All Coupons Confirmation Modal */}
      <Modal open={confirmClearAll} onClose={() => setConfirmClearAll(false)} title="Delete All Coupons?">
        <div className="flex items-start gap-3 text-sm text-muted-foreground">
          <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
          <p>
            Are you sure you want to permanently delete all <strong>{state.coupons.length}</strong> coupons from MongoDB?
            Farmers won&apos;t be able to apply these promotional discount codes until you create new ones.
          </p>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Btn variant="ghost" onClick={() => setConfirmClearAll(false)} disabled={clearingAll}>
            Cancel
          </Btn>
          <Btn variant="danger" onClick={handleClearAll} disabled={clearingAll}>
            {clearingAll ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Deleting All...
              </span>
            ) : (
              "Yes, Delete All Coupons"
            )}
          </Btn>
        </div>
      </Modal>
    </AdminPage>
  );
}
