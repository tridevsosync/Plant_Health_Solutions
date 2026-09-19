"use client";

import Link from "next/link";
import { IndianRupee, Package, ShoppingCart, Users } from "lucide-react";
import { inr, useApp } from "@/lib/store";
import { AdminPage, Panel, TableWrap, td, th } from "@/components/site/AdminUI";
import type { Order } from "@/lib/data";

const STATUSES: Order["status"][] = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

export default function AdminDashboardPage() {
  const { state, set } = useApp();
  const orders = state.orders;
  const revenue = orders.filter((o) => o.status !== "Cancelled").reduce((s, o) => s + o.total, 0);
  const activeProducts = state.products.filter((p) => p.stock > 0).length;

  const byStatus = STATUSES.map((s) => ({ status: s, count: orders.filter((o) => o.status === s).length }));
  const maxStatus = Math.max(1, ...byStatus.map((b) => b.count));

  const monthly = orders.reduce<Record<string, number>>((acc, o) => {
    const m = o.date.slice(0, 7);
    acc[m] = (acc[m] ?? 0) + o.total;
    return acc;
  }, {});
  const months = Object.entries(monthly).sort(([a], [b]) => a.localeCompare(b)).slice(-6);
  const maxMonth = Math.max(1, ...months.map(([, v]) => v));

  const cards = [
    { label: "Total Revenue", value: inr(revenue), icon: IndianRupee },
    { label: "Total Orders", value: String(orders.length), icon: ShoppingCart },
    { label: "Active Products", value: String(activeProducts), icon: Package },
    { label: "Customers", value: String(state.customers.length), icon: Users },
  ];

  return (
    <AdminPage title="Dashboard" subtitle="Live snapshot of store performance.">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <Panel key={c.label}>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{c.label}</p>
              <c.icon className="h-5 w-5 text-secondary" />
            </div>
            <p className="mt-2 font-display text-2xl font-bold text-foreground">{c.value}</p>
          </Panel>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel>
          <p className="font-display text-lg font-bold text-foreground">Revenue by month</p>
          <div className="mt-5 flex h-48 items-end gap-3">
            {months.map(([m, v]) => (
              <div key={m} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-[10px] text-muted-foreground">{inr(v)}</span>
                <div className="w-full rounded-t-md bg-secondary" style={{ height: `${(v / maxMonth) * 140}px` }} />
                <span className="text-[10px] text-muted-foreground">{m}</span>
              </div>
            ))}
          </div>
        </Panel>
        <Panel>
          <p className="font-display text-lg font-bold text-foreground">Orders by status</p>
          <div className="mt-5 grid gap-3">
            {byStatus.map((b) => (
              <div key={b.status} className="grid grid-cols-[110px_1fr_36px] items-center gap-3 text-sm">
                <span className="text-muted-foreground">{b.status}</span>
                <div className="h-2.5 rounded-full bg-muted">
                  <div className="h-2.5 rounded-full bg-primary" style={{ width: `${(b.count / maxStatus) * 100}%` }} />
                </div>
                <span className="text-right font-semibold">{b.count}</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-foreground">Recent orders</h2>
          <Link href="/admin/orders" className="text-sm font-semibold text-secondary">
            View all
          </Link>
        </div>
        <TableWrap>
          <thead className="border-b border-border bg-muted/50">
            <tr>
              <th className={th}>Order</th>
              <th className={th}>Customer</th>
              <th className={th}>Date</th>
              <th className={th}>Total</th>
              <th className={th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.slice(0, 8).map((o) => (
              <tr key={o.id} className="border-b border-border last:border-0">
                <td className={`${td} font-semibold`}>{o.id}</td>
                <td className={td}>{o.customer}</td>
                <td className={td}>{o.date}</td>
                <td className={td}>{inr(o.total)}</td>
                <td className={td}>
                  <select
                    value={o.status}
                    onChange={(e) =>
                      set((s) => ({
                        ...s,
                        orders: s.orders.map((x) =>
                          x.id === o.id ? { ...x, status: e.target.value as Order["status"] } : x,
                        ),
                      }))
                    }
                    className="rounded-lg border border-border bg-background px-2 py-1 text-xs"
                  >
                    {STATUSES.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      </div>
    </AdminPage>
  );
}
