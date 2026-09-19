import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Eye } from "lucide-react";
import { toast } from "sonner";
import { inr, useApp } from "@/lib/store";
import type { Order } from "@/lib/data";
import { AdminPage, Btn, Modal, StatusBadge, TableWrap, inputCls, td, th } from "@/components/site/AdminUI";

export const Route = createFileRoute("/admin/orders")({
  head: () => ({
    meta: [
      { title: "Orders — PHS Admin" },
      { name: "description", content: "Track, filter and update customer orders for Plant Health Solutions." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Orders — PHS Admin" },
      { property: "og:description", content: "Order management." },
    ],
  }),
  component: AdminOrders,
});

const STATUSES: Order["status"][] = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

function AdminOrders() {
  const { state, set } = useApp();
  const [filter, setFilter] = React.useState("All");
  const [q, setQ] = React.useState("");
  const [view, setView] = React.useState<Order | null>(null);

  const list = state.orders.filter(
    (o) =>
      (filter === "All" || o.status === filter) &&
      (o.id.toLowerCase().includes(q.toLowerCase()) || o.customer.toLowerCase().includes(q.toLowerCase())),
  );

  const setStatus = (id: string, status: Order["status"]) => {
    set((s) => ({ ...s, orders: s.orders.map((o) => (o.id === id ? { ...o, status } : o)) }));
    toast.success(`Order ${id} marked ${status}`);
  };

  return (
    <AdminPage title="Orders" subtitle={`${state.orders.length} total orders.`}>
      <div className="flex flex-wrap gap-3">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by order id or customer…" className={`${inputCls} max-w-xs`} />
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className={`${inputCls} max-w-xs`}>
          <option>All</option>
          {STATUSES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      <TableWrap>
        <thead className="border-b border-border bg-muted/50">
          <tr>
            <th className={th}>Order</th>
            <th className={th}>Customer</th>
            <th className={th}>Date</th>
            <th className={th}>Items</th>
            <th className={th}>Total</th>
            <th className={th}>Status</th>
            <th className={th}>Invoice</th>
          </tr>
        </thead>
        <tbody>
          {list.map((o) => (
            <tr key={o.id} className="border-b border-border last:border-0">
              <td className={`${td} font-semibold`}>{o.id}</td>
              <td className={td}>
                <div>{o.customer}</div>
                <div className="text-xs text-muted-foreground">{o.phone}</div>
              </td>
              <td className={td}>{o.date}</td>
              <td className={td}>{o.items.reduce((s, i) => s + i.qty, 0)}</td>
              <td className={td}>{inr(o.total)}</td>
              <td className={td}>
                <select
                  value={o.status}
                  onChange={(e) => setStatus(o.id, e.target.value as Order["status"])}
                  className="rounded-lg border border-border bg-background px-2 py-1 text-xs"
                >
                  {STATUSES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </td>
              <td className={td}>
                <button onClick={() => setView(o)} className="rounded-lg border border-border p-2">
                  <Eye className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </TableWrap>

      <Modal open={!!view} onClose={() => setView(null)} title={`Invoice ${view?.id ?? ""}`} wide>
        {view && (
          <div className="space-y-4 text-sm">
            <div className="flex flex-wrap justify-between gap-3">
              <div>
                <p className="font-display text-lg font-bold text-primary">{state.settings.name}</p>
                <p className="max-w-xs text-xs text-muted-foreground">{state.settings.address}</p>
              </div>
              <div className="text-right">
                <StatusBadge status={view.status} />
                <p className="mt-1 text-xs text-muted-foreground">{view.date}</p>
                <p className="text-xs text-muted-foreground">Payment: {view.payment}</p>
              </div>
            </div>
            <div className="rounded-xl border border-border p-3">
              <p className="font-semibold">{view.customer}</p>
              <p className="text-xs text-muted-foreground">{view.email} · {view.phone}</p>
              <p className="text-xs text-muted-foreground">{view.address}</p>
            </div>
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border">
                <tr>
                  <th className={th}>Item</th>
                  <th className={th}>Qty</th>
                  <th className={th}>Price</th>
                  <th className={th}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {view.items.map((i, idx) => (
                  <tr key={idx} className="border-b border-border last:border-0">
                    <td className={td}>{i.name}</td>
                    <td className={td}>{i.qty}</td>
                    <td className={td}>{inr(i.price)}</td>
                    <td className={td}>{inr(i.price * i.qty)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="ml-auto grid max-w-xs gap-1 text-sm">
              <Row label="Subtotal" value={inr(view.subtotal)} />
              <Row label="Discount" value={`- ${inr(view.discount)}`} />
              <Row label="Shipping" value={inr(view.shipping)} />
              <Row label="GST" value={inr(view.tax)} />
              <div className="mt-1 flex justify-between border-t border-border pt-2 font-display text-base font-bold">
                <span>Total</span>
                <span>{inr(view.total)}</span>
              </div>
            </div>
            <div className="flex justify-end">
              <Btn variant="ghost" onClick={() => setView(null)}>
                Close
              </Btn>
            </div>
          </div>
        )}
      </Modal>
    </AdminPage>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-muted-foreground">
      <span>{label}</span>
      <span className="text-foreground">{value}</span>
    </div>
  );
}
