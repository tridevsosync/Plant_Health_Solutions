"use client";

import * as React from "react";
import { Eye, Trash2, Printer } from "lucide-react";
import { toast } from "sonner";
import { inr, useApp } from "@/lib/store";
import type { Order } from "@/lib/data";
import { AdminPage, Btn, Modal, StatusBadge, TableWrap, inputCls, td, th } from "@/components/site/AdminUI";

const STATUSES: Order["status"][] = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

export default function AdminOrdersPage() {
  const { state, updateOrderStatus, deleteOrder } = useApp();
  const [filter, setFilter] = React.useState("All");
  const [q, setQ] = React.useState("");
  const [view, setView] = React.useState<Order | null>(null);
  const [confirmId, setConfirmId] = React.useState<string | null>(null);

  const list = state.orders.filter(
    (o) =>
      (filter === "All" || o.status === filter) &&
      (o.id.toLowerCase().includes(q.toLowerCase()) ||
        o.customer.toLowerCase().includes(q.toLowerCase()) ||
        o.email.toLowerCase().includes(q.toLowerCase()))
  );

  const setStatus = async (id: string, status: Order["status"]) => {
    const ok = await updateOrderStatus(id, status);
    if (ok) {
      toast.success(`Order ${id} updated to ${status} in MongoDB`);
    } else {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async () => {
    if (!confirmId) return;
    const ok = await deleteOrder(confirmId);
    if (ok) {
      toast.success("Order deleted successfully");
      setConfirmId(null);
    }
  };

  return (
    <AdminPage title="Orders Management" subtitle={`${state.orders.length} total orders stored in MongoDB.`}>
      <div className="flex flex-wrap gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by order ID, customer or email…"
          className={`${inputCls} max-w-xs`}
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className={`${inputCls} max-w-xs`}
        >
          <option>All</option>
          {STATUSES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      <TableWrap>
        <thead className="border-b border-border bg-muted/50">
          <tr>
            <th className={th}>Order ID</th>
            <th className={th}>Customer</th>
            <th className={th}>Date</th>
            <th className={th}>Items</th>
            <th className={th}>Total</th>
            <th className={th}>Status</th>
            <th className={th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {list.map((o) => (
            <tr key={o.id} className="border-b border-border last:border-0 hover:bg-muted/20">
              <td className={`${td} font-mono font-bold text-foreground`}>{o.id}</td>
              <td className={td}>
                <div className="font-semibold text-foreground">{o.customer}</div>
                <div className="text-xs text-muted-foreground">{o.email} · {o.phone}</div>
              </td>
              <td className={td}>{o.date}</td>
              <td className={td}>
                <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold">
                  {o.items.reduce((s, i) => s + i.qty, 0)} units
                </span>
              </td>
              <td className={`${td} font-bold text-primary`}>{inr(o.total)}</td>
              <td className={td}>
                <select
                  value={o.status}
                  onChange={(e) => setStatus(o.id, e.target.value as Order["status"])}
                  className={`rounded-lg border px-2.5 py-1 text-xs font-semibold ${
                    o.status === "Delivered"
                      ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                      : o.status === "Shipped"
                      ? "border-blue-300 bg-blue-50 text-blue-800"
                      : o.status === "Cancelled"
                      ? "border-red-300 bg-red-50 text-red-800"
                      : "border-amber-300 bg-amber-50 text-amber-800"
                  }`}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </td>
              <td className={td}>
                <div className="flex gap-2">
                  <button
                    onClick={() => setView(o)}
                    className="rounded-lg border border-border p-2 hover:bg-muted"
                    title="View Full Invoice"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setConfirmId(o.id)}
                    className="rounded-lg border border-border p-2 text-destructive hover:bg-destructive/10"
                    title="Delete Order"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </TableWrap>

      <Modal open={!!view} onClose={() => setView(null)} title={`Tax Invoice · ${view?.id ?? ""}`} wide>
        {view && (
          <div className="space-y-5 text-sm">
            <div className="flex flex-wrap justify-between gap-4 border-b border-border pb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <img src="/logo.png" alt="PHS" className="h-8 w-8 object-contain" />
                  <p className="font-display text-lg font-bold text-primary">{state.settings.name}</p>
                </div>
                <p className="max-w-xs text-xs text-muted-foreground">{state.settings.address}</p>
                <p className="text-xs text-muted-foreground mt-1">Phone: {state.settings.phone}</p>
              </div>
              <div className="text-right">
                <StatusBadge status={view.status} />
                <p className="mt-2 text-xs font-semibold text-foreground">Date: {view.date}</p>
                <p className="text-xs text-muted-foreground">Payment Mode: {view.payment}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-muted/20 p-4">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Billed & Shipped To:</span>
              <p className="font-bold text-base text-foreground mt-1">{view.customer}</p>
              <p className="text-xs text-muted-foreground">{view.email} · {view.phone}</p>
              <p className="text-xs text-foreground mt-1 font-medium">{view.address}</p>
            </div>

            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-muted/30">
                <tr>
                  <th className={th}>Product Item</th>
                  <th className={th}>Qty</th>
                  <th className={th}>Price</th>
                  <th className={th}>Total Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {view.items.map((i, idx) => (
                  <tr key={idx}>
                    <td className={`${td} font-medium`}>{i.name}</td>
                    <td className={td}>{i.qty}</td>
                    <td className={td}>{inr(i.price)}</td>
                    <td className={`${td} font-bold`}>{inr(i.price * i.qty)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="ml-auto grid max-w-xs gap-1.5 rounded-2xl bg-muted/30 p-4 text-sm border border-border">
              <Row label="Subtotal" value={inr(view.subtotal)} />
              {view.discount > 0 && <Row label="Discount" value={`- ${inr(view.discount)}`} />}
              <Row label="Shipping Charge" value={view.shipping === 0 ? "FREE" : inr(view.shipping)} />
              <Row label="Applicable GST (5%)" value={inr(view.tax)} />
              <div className="mt-2 flex justify-between border-t border-border pt-2 font-display text-base font-extrabold text-primary">
                <span>Grand Total</span>
                <span>{inr(view.total)}</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted"
              >
                <Printer className="h-4 w-4" /> Print Invoice
              </button>
              <Btn variant="ghost" onClick={() => setView(null)}>
                Close
              </Btn>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={!!confirmId} onClose={() => setConfirmId(null)} title="Delete order record?">
        <p className="text-sm text-muted-foreground">
          Are you sure you want to delete order <strong>{confirmId}</strong> from the database?
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Btn variant="ghost" onClick={() => setConfirmId(null)}>
            Cancel
          </Btn>
          <Btn variant="danger" onClick={handleDelete}>
            Delete Order
          </Btn>
        </div>
      </Modal>
    </AdminPage>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-xs text-muted-foreground">
      <span>{label}</span>
      <span className="font-semibold text-foreground">{value}</span>
    </div>
  );
}
