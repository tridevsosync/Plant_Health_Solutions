import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { inr, useApp } from "@/lib/store";
import { AdminPage, TableWrap, inputCls, td, th } from "@/components/site/AdminUI";

export const Route = createFileRoute("/admin/customers")({
  head: () => ({
    meta: [
      { title: "Customers — PHS Admin" },
      { name: "description", content: "Farmer and dealer directory with orders and account status." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Customers — PHS Admin" },
      { property: "og:description", content: "Customer directory." },
    ],
  }),
  component: AdminCustomers,
});

function AdminCustomers() {
  const { state, set } = useApp();
  const [q, setQ] = React.useState("");
  const list = state.customers.filter((c) =>
    [c.name, c.email, c.phone, c.city].join(" ").toLowerCase().includes(q.toLowerCase()),
  );

  const spend = (email: string) =>
    state.orders.filter((o) => o.email === email && o.status !== "Cancelled").reduce((s, o) => s + o.total, 0);

  return (
    <AdminPage title="Customers" subtitle={`${state.customers.length} registered customers.`}>
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search customers…" className={`${inputCls} max-w-xs`} />
      <TableWrap>
        <thead className="border-b border-border bg-muted/50">
          <tr>
            <th className={th}>Name</th>
            <th className={th}>Contact</th>
            <th className={th}>City</th>
            <th className={th}>Orders</th>
            <th className={th}>Lifetime value</th>
            <th className={th}>Status</th>
          </tr>
        </thead>
        <tbody>
          {list.map((c) => (
            <tr key={c.id} className="border-b border-border last:border-0">
              <td className={`${td} font-semibold`}>{c.name}</td>
              <td className={td}>
                <div className="text-xs">{c.email}</div>
                <div className="text-xs text-muted-foreground">{c.phone}</div>
              </td>
              <td className={td}>{c.city}</td>
              <td className={td}>{c.orders}</td>
              <td className={td}>{inr(spend(c.email))}</td>
              <td className={td}>
                <button
                  onClick={() => {
                    set((s) => ({
                      ...s,
                      customers: s.customers.map((x) => (x.id === c.id ? { ...x, active: !x.active } : x)),
                    }));
                    toast.success(`${c.name} marked ${c.active ? "inactive" : "active"}`);
                  }}
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${c.active ? "bg-emerald-100 text-emerald-800" : "bg-muted text-muted-foreground"}`}
                >
                  {c.active ? "Active" : "Inactive"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </TableWrap>
    </AdminPage>
  );
}
