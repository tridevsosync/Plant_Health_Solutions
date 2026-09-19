"use client";

import * as React from "react";
import { Trash2, UserCheck, UserX } from "lucide-react";
import { toast } from "sonner";
import { inr, useApp } from "@/lib/store";
import { AdminPage, TableWrap, inputCls, td, th } from "@/components/site/AdminUI";

export default function AdminCustomersPage() {
  const { state, saveCustomer, deleteCustomer } = useApp();
  const [q, setQ] = React.useState("");

  const list = state.customers.filter((c) =>
    [c.name, c.email, c.phone, c.city].join(" ").toLowerCase().includes(q.toLowerCase())
  );

  const spend = (email: string) =>
    state.orders
      .filter((o) => o.email?.toLowerCase() === email.toLowerCase() && o.status !== "Cancelled")
      .reduce((s, o) => s + o.total, 0);

  const toggleStatus = async (c: typeof state.customers[0]) => {
    const updated = { ...c, active: !c.active };
    const ok = await saveCustomer(updated, false);
    if (ok) {
      toast.success(`${c.name} is now ${updated.active ? "Active" : "Inactive"}`);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    const ok = await deleteCustomer(id);
    if (ok) {
      toast.success(`Customer ${name} removed`);
    }
  };

  return (
    <AdminPage
      title="Customers & Farmers Directory"
      subtitle={`${state.customers.length} registered farmers and dealers stored in MongoDB.`}
    >
      <div className="flex flex-wrap gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name, email, phone or city…"
          className={`${inputCls} max-w-sm`}
        />
      </div>

      <TableWrap>
        <thead className="border-b border-border bg-muted/50">
          <tr>
            <th className={th}>Farmer / Customer</th>
            <th className={th}>Contact Details</th>
            <th className={th}>Location</th>
            <th className={th}>Orders Placed</th>
            <th className={th}>Lifetime Value</th>
            <th className={th}>Account Status</th>
            <th className={th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {list.map((c) => (
            <tr key={c.id} className="border-b border-border last:border-0 hover:bg-muted/20">
              <td className={`${td} font-semibold text-foreground`}>
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {c.name.charAt(0)}
                  </div>
                  <span>{c.name}</span>
                </div>
              </td>
              <td className={td}>
                <div className="text-xs font-medium text-foreground">{c.email}</div>
                <div className="text-xs text-muted-foreground">{c.phone || "No phone added"}</div>
              </td>
              <td className={td}>{c.city || "Karnataka"}</td>
              <td className={td}>
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-bold text-foreground">
                  {c.orders || state.orders.filter((o) => o.email?.toLowerCase() === c.email?.toLowerCase()).length}
                </span>
              </td>
              <td className={`${td} font-bold text-primary`}>{inr(spend(c.email))}</td>
              <td className={td}>
                <button
                  onClick={() => toggleStatus(c)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition-all ${
                    c.active
                      ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {c.active ? (
                    <>
                      <UserCheck className="h-3.5 w-3.5" /> Active
                    </>
                  ) : (
                    <>
                      <UserX className="h-3.5 w-3.5" /> Inactive
                    </>
                  )}
                </button>
              </td>
              <td className={td}>
                <button
                  onClick={() => handleDelete(c.id, c.name)}
                  className="rounded-lg border border-border p-2 text-destructive hover:bg-destructive/10"
                  title="Remove Customer Record"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </TableWrap>
    </AdminPage>
  );
}
