"use client";

import * as React from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { inr, useApp } from "@/lib/store";
import type { Coupon } from "@/lib/data";
import { AdminPage, Btn, Field, Modal, TableWrap, inputCls, td, th } from "@/components/site/AdminUI";

export default function AdminCouponsPage() {
  const { state, set } = useApp();
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState<Coupon>({ code: "", discount: 10, minOrder: 1000, description: "" });

  const add = () => {
    const code = form.code.trim().toUpperCase();
    if (!code) {
      toast.error("Coupon code is required");
      return;
    }
    if (state.coupons.some((c) => c.code === code)) {
      toast.error("That coupon code already exists");
      return;
    }
    set((s) => ({ ...s, coupons: [...s.coupons, { ...form, code }] }));
    toast.success("Coupon created");
    setOpen(false);
    setForm({ code: "", discount: 10, minOrder: 1000, description: "" });
  };

  return (
    <AdminPage
      title="Coupons"
      subtitle={`${state.coupons.length} active promotional codes.`}
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
            <th className={th}>Code</th>
            <th className={th}>Discount</th>
            <th className={th}>Minimum order</th>
            <th className={th}>Description</th>
            <th className={th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {state.coupons.map((c) => (
            <tr key={c.code} className="border-b border-border last:border-0">
              <td className={`${td} font-display font-bold text-primary`}>{c.code}</td>
              <td className={td}>{c.discount}%</td>
              <td className={td}>{inr(c.minOrder)}</td>
              <td className={`${td} text-xs text-muted-foreground`}>{c.description}</td>
              <td className={td}>
                <button
                  onClick={() => {
                    set((s) => ({ ...s, coupons: s.coupons.filter((x) => x.code !== c.code) }));
                    toast.success("Coupon removed");
                  }}
                  className="rounded-lg border border-border p-2 text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </TableWrap>

      <Modal open={open} onClose={() => setOpen(false)} title="Add Coupon">
        <div className="grid gap-3">
          <Field label="Code">
            <input className={inputCls} value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} />
          </Field>
          <Field label="Discount (%)">
            <input type="number" className={inputCls} value={form.discount} onChange={(e) => setForm({ ...form, discount: Number(e.target.value) })} />
          </Field>
          <Field label="Minimum order (₹)">
            <input type="number" className={inputCls} value={form.minOrder} onChange={(e) => setForm({ ...form, minOrder: Number(e.target.value) })} />
          </Field>
          <Field label="Description">
            <input className={inputCls} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </Field>
          <div className="flex justify-end gap-2">
            <Btn variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Btn>
            <Btn onClick={add}>Create Coupon</Btn>
          </div>
        </div>
      </Modal>
    </AdminPage>
  );
}
