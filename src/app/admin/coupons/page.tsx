"use client";

import * as React from "react";
import { Plus, Trash2, Loader2, Tag } from "lucide-react";
import { toast } from "sonner";
import { inr, useApp } from "@/lib/store";
import type { Coupon } from "@/lib/data";
import { AdminPage, Btn, Field, Modal, TableWrap, inputCls, td, th } from "@/components/site/AdminUI";

export default function AdminCouponsPage() {
  const { state, saveCoupon, deleteCoupon } = useApp();
  const [open, setOpen] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [form, setForm] = React.useState<Coupon>({
    code: "",
    discount: 10,
    minOrder: 1000,
    description: "",
  });

  const add = async () => {
    const code = form.code.trim().toUpperCase();
    if (!code) {
      toast.error("Coupon code is required");
      return;
    }
    if (state.coupons.some((c) => c.code === code)) {
      toast.error("That coupon code already exists in the system");
      return;
    }

    setSaving(true);
    const ok = await saveCoupon({ ...form, code }, true);
    setSaving(false);
    if (ok) {
      toast.success(`Coupon ${code} created in MongoDB`);
      setOpen(false);
      setForm({ code: "", discount: 10, minOrder: 1000, description: "" });
    } else {
      toast.error("Failed to save coupon");
    }
  };

  const handleDelete = async (code: string) => {
    const ok = await deleteCoupon(code);
    if (ok) {
      toast.success(`Coupon ${code} removed`);
    }
  };

  return (
    <AdminPage
      title="Coupons & Discount Codes"
      subtitle={`${state.coupons.length} active promotional codes stored in MongoDB.`}
      action={
        <Btn onClick={() => setOpen(true)}>
          <span className="inline-flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add Coupon
          </span>
        </Btn>
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
          {state.coupons.map((c) => (
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
                <button
                  onClick={() => handleDelete(c.code)}
                  className="rounded-lg border border-border p-2 text-destructive hover:bg-destructive/10"
                  title="Delete Coupon"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </TableWrap>

      <Modal open={open} onClose={() => setOpen(false)} title="Create New Coupon">
        <div className="grid gap-4">
          <Field label="Coupon Code">
            <input
              className={inputCls}
              value={form.code}
              placeholder="e.g. KISAN20"
              onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
            />
          </Field>
          <Field label="Discount Percentage (%)">
            <input
              type="number"
              className={inputCls}
              value={form.discount}
              onChange={(e) => setForm({ ...form, discount: Number(e.target.value) })}
            />
          </Field>
          <Field label="Minimum Order Value (₹)">
            <input
              type="number"
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
          <div className="flex justify-end gap-2 pt-2 border-t border-border">
            <Btn variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Btn>
            <Btn onClick={add} disabled={saving}>
              {saving ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Creating...
                </span>
              ) : (
                "Create Coupon"
              )}
            </Btn>
          </div>
        </div>
      </Modal>
    </AdminPage>
  );
}
