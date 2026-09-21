"use client";

import * as React from "react";
import { Trash2, UserCheck, UserX, Plus, Pencil, Loader2, Users, AlertTriangle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { inr, useApp } from "@/lib/store";
import type { Customer } from "@/lib/data";
import { AdminPage, Btn, Field, Modal, TableWrap, inputCls, td, th } from "@/components/site/AdminUI";

const blankCustomer: Customer = {
  id: "",
  name: "",
  email: "",
  phone: "",
  city: "Karnataka",
  orders: 0,
  active: true,
};

export default function AdminCustomersPage() {
  const { state, saveCustomer, deleteCustomer, deleteAllCustomers, refreshData } = useApp();
  const [q, setQ] = React.useState("");
  const [openModal, setOpenModal] = React.useState(false);
  const [editingCust, setEditingCust] = React.useState<Customer | null>(null);
  const [form, setForm] = React.useState<Customer>(blankCustomer);
  const [confirmCust, setConfirmCust] = React.useState<{ id: string; name: string; email: string } | null>(null);
  const [confirmClearAll, setConfirmClearAll] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);
  const [clearingAll, setClearingAll] = React.useState(false);
  const [syncing, setSyncing] = React.useState(false);

  // Auto-sync customers on page mount to ensure all registered live users are retrieved
  React.useEffect(() => {
    refreshData();
  }, [refreshData]);

  const handleSyncLive = async () => {
    setSyncing(true);
    await refreshData();
    setSyncing(false);
    toast.success("Live customer directory synchronized with MongoDB users & orders!");
  };

  const list = state.customers.filter((c) =>
    [c.name, c.email, c.phone, c.city].join(" ").toLowerCase().includes(q.toLowerCase())
  );

  const spend = (email: string) =>
    state.orders
      .filter((o) => o.email?.toLowerCase() === email.toLowerCase() && o.status !== "Cancelled")
      .reduce((s, o) => s + o.total, 0);

  const openCreate = () => {
    setEditingCust(null);
    setForm({
      ...blankCustomer,
      id: `c_${Date.now()}`,
    });
    setOpenModal(true);
  };

  const openEdit = (c: Customer) => {
    setEditingCust(c);
    setForm({ ...c });
    setOpenModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Customer name is required");
      return;
    }
    if (!form.email.trim()) {
      toast.error("Customer email is required");
      return;
    }

    const cleanEmail = form.email.trim().toLowerCase();
    const isNew = !editingCust;

    // If new, check duplicate
    if (isNew && state.customers.some((c) => c.email.toLowerCase() === cleanEmail)) {
      toast.error("A customer with this email already exists");
      return;
    }

    setSaving(true);
    const ok = await saveCustomer({ ...form, email: cleanEmail }, isNew);
    setSaving(false);

    if (ok) {
      toast.success(isNew ? `Customer ${form.name} created in MongoDB` : `Customer ${form.name} updated`);
      setOpenModal(false);
      setEditingCust(null);
      setForm(blankCustomer);
    } else {
      toast.error("Failed to save customer");
    }
  };

  const toggleStatus = async (c: typeof state.customers[0]) => {
    const updated = { ...c, active: !c.active };
    const ok = await saveCustomer(updated, false);
    if (ok) {
      toast.success(`${c.name} is now ${updated.active ? "Active" : "Inactive"}`);
    }
  };

  const handleDelete = async () => {
    if (!confirmCust) return;
    setDeleting(true);
    const targetId = confirmCust.id || confirmCust.email;
    const ok = await deleteCustomer(targetId);
    setDeleting(false);
    if (ok) {
      toast.success(`Customer ${confirmCust.name} deleted from MongoDB`);
      setConfirmCust(null);
    } else {
      toast.error("Failed to delete customer");
    }
  };

  const handleClearAll = async () => {
    setClearingAll(true);
    const ok = await deleteAllCustomers();
    setClearingAll(false);
    if (ok) {
      toast.success("All customer accounts deleted from MongoDB");
      setConfirmClearAll(false);
    } else {
      toast.error("Failed to delete all customers");
    }
  };

  return (
    <AdminPage
      title="Customers & Farmers Directory"
      subtitle={`${state.customers.length} registered farmers and buyers in live database.`}
      action={
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleSyncLive}
            disabled={syncing}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-xs font-bold text-foreground hover:bg-muted transition-all shadow-xs disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${syncing ? "animate-spin text-primary" : ""}`} />
            {syncing ? "Syncing..." : "Sync Live Users"}
          </button>
          {state.customers.length > 0 && (
            <button
              type="button"
              onClick={() => setConfirmClearAll(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-2 text-xs font-bold text-destructive hover:bg-destructive/20 transition-all shadow-sm"
            >
              <Trash2 className="h-4 w-4" /> Delete All
            </button>
          )}
          <Btn onClick={openCreate}>
            <span className="inline-flex items-center gap-2">
              <Plus className="h-4 w-4" /> Add Farmer
            </span>
          </Btn>
        </div>
      }
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
          {list.length === 0 ? (
            <tr>
              <td colSpan={7} className="p-12 text-center text-muted-foreground text-sm">
                <Users className="mx-auto h-12 w-12 text-muted-foreground/40 mb-3" />
                <p className="font-semibold text-foreground">No customer records in MongoDB.</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Click &quot;Add Farmer&quot; to create a new customer record.
                </p>
              </td>
            </tr>
          ) : (
            list.map((c) => (
              <tr key={c.id || c.email} className="border-b border-border last:border-0 hover:bg-muted/20">
                <td className={`${td} font-semibold text-foreground`}>
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {c.name ? c.name.charAt(0).toUpperCase() : "U"}
                    </div>
                    <div>
                      <span>{c.name}</span>
                      <p className="text-[11px] font-mono text-muted-foreground">{c.id || "Direct User"}</p>
                    </div>
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
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEdit(c)}
                      className="rounded-lg border border-border p-2 text-foreground hover:bg-muted"
                      title="Edit Customer Details"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setConfirmCust({ id: c.id || c.email, name: c.name, email: c.email })}
                      className="rounded-lg border border-border p-2 text-destructive hover:bg-destructive/10"
                      title="Delete Customer Record"
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

      {/* Create / Edit Customer Modal */}
      <Modal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setEditingCust(null);
        }}
        title={editingCust ? `Edit Customer: ${editingCust.name}` : "Add Farmer / Customer"}
      >
        <form onSubmit={handleSave} className="space-y-4 min-w-0 w-full">
          <Field label="Farmer / Customer Full Name *">
            <input
              required
              className={inputCls}
              value={form.name}
              placeholder="e.g. Ramesh Patil"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </Field>
          <Field label="Email Address *">
            <input
              required
              type="email"
              className={inputCls}
              value={form.email}
              disabled={!!editingCust}
              placeholder="farmer@example.com"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </Field>
          <Field label="Phone Number">
            <input
              type="tel"
              className={inputCls}
              value={form.phone}
              placeholder="+91 98450 12345"
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </Field>
          <Field label="City / Region">
            <input
              className={inputCls}
              value={form.city}
              placeholder="Vijayapura, Karnataka"
              onChange={(e) => setForm({ ...form, city: e.target.value })}
            />
          </Field>
          <div className="flex justify-end gap-2 pt-3 border-t border-border">
            <Btn
              variant="ghost"
              onClick={() => {
                setOpenModal(false);
                setEditingCust(null);
              }}
            >
              Cancel
            </Btn>
            <Btn type="submit" disabled={saving}>
              {saving ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                </span>
              ) : editingCust ? (
                "Update Customer"
              ) : (
                "Save Customer"
              )}
            </Btn>
          </div>
        </form>
      </Modal>

      {/* Delete Single Customer Modal */}
      <Modal open={!!confirmCust} onClose={() => setConfirmCust(null)} title="Delete customer record?">
        <p className="text-sm text-muted-foreground">
          Are you sure you want to delete customer <strong>{confirmCust?.name}</strong> ({confirmCust?.email}) from MongoDB?
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Btn variant="ghost" onClick={() => setConfirmCust(null)} disabled={deleting}>
            Cancel
          </Btn>
          <Btn variant="danger" onClick={handleDelete} disabled={deleting}>
            {deleting ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Deleting...
              </span>
            ) : (
              "Delete Customer"
            )}
          </Btn>
        </div>
      </Modal>

      {/* Clear All Customers Modal */}
      <Modal open={confirmClearAll} onClose={() => setConfirmClearAll(false)} title="Delete All Customers?">
        <div className="flex items-start gap-3 text-sm text-muted-foreground">
          <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
          <p>
            Are you sure you want to permanently delete all <strong>{state.customers.length}</strong> customer records from MongoDB?
            This will remove their directory entries and customer accounts.
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
              "Yes, Delete All Customers"
            )}
          </Btn>
        </div>
      </Modal>
    </AdminPage>
  );
}
