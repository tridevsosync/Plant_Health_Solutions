"use client";

import * as React from "react";
import { Eye, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { inr, useApp } from "@/lib/store";
import type { Order } from "@/lib/data";
import { AdminPage, Btn, Modal, StatusBadge, TableWrap, inputCls, td, th } from "@/components/site/AdminUI";
import { Pagination } from "@/components/site/Pagination";
import { TaxInvoice } from "@/components/site/TaxInvoice";

const STATUSES: Order["status"][] = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

export default function AdminOrdersPage() {
  const { state, updateOrderStatus, deleteOrder } = useApp();
  const [filter, setFilter] = React.useState("All");
  const [q, setQ] = React.useState("");
  const [view, setView] = React.useState<Order | null>(null);
  const [confirmId, setConfirmId] = React.useState<string | null>(null);
  const [deleting, setDeleting] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  const list = state.orders.filter(
    (o) =>
      (filter === "All" || o.status === filter) &&
      (o.id.toLowerCase().includes(q.toLowerCase()) ||
        o.customer.toLowerCase().includes(q.toLowerCase()) ||
        o.email.toLowerCase().includes(q.toLowerCase()))
  );

  const totalPages = Math.max(1, Math.ceil(list.length / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, list.length);
  const paginatedList = list.slice(startIndex, endIndex);

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
    setDeleting(true);
    const ok = await deleteOrder(confirmId);
    setDeleting(false);
    if (ok) {
      toast.success("Order deleted successfully");
      setConfirmId(null);
    } else {
      toast.error("Failed to delete order");
    }
  };

  return (
    <AdminPage title="Orders Management" subtitle={`${state.orders.length} total orders stored in MongoDB.`}>
      <div className="flex flex-wrap gap-3">
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(1);
          }}
          placeholder="Search by order ID, customer or email…"
          className={`${inputCls} max-w-xs`}
        />
        <select
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setPage(1);
          }}
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
          {list.length === 0 ? (
            <tr>
              <td colSpan={7} className="p-8 text-center text-muted-foreground text-sm">
                No orders found matching your search.
              </td>
            </tr>
          ) : (
            paginatedList.map((o) => (
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
            ))
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

      <Modal open={!!view} onClose={() => setView(null)} title={`GST Tax Invoice · #${view?.id ?? ""}`} wide>
        {view && (
          <div className="space-y-4">
            <TaxInvoice order={view} settings={state.settings} />
            <div className="flex justify-end pt-2 border-t border-border">
              <Btn variant="ghost" onClick={() => setView(null)}>
                Close Window
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
          <Btn variant="ghost" onClick={() => setConfirmId(null)} disabled={deleting}>
            Cancel
          </Btn>
          <Btn variant="danger" onClick={handleDelete} disabled={deleting}>
            {deleting ? "Deleting..." : "Delete Order"}
          </Btn>
        </div>
      </Modal>
    </AdminPage>
  );
}

