"use client";

import * as React from "react";
import {
  Pencil,
  Plus,
  Trash2,
  Star,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  MessageSquareQuote,
  AlertTriangle,
  Sparkles,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/lib/store";
import type { Testimonial } from "@/lib/data";
import { AdminPage, Btn, Field, Modal, TableWrap, inputCls, td, th } from "@/components/site/AdminUI";

const blankTestimonial: Testimonial = {
  id: "",
  name: "",
  place: "Vijayapura, Karnataka",
  crop: "Sugarcane",
  rating: 5,
  quote: "",
  productId: "",
  productName: "",
  status: "Approved",
};

export default function AdminTestimonialsPage() {
  const { state, saveTestimonial, updateTestimonialStatus, deleteTestimonial, deleteAllTestimonials } = useApp();
  const [editing, setEditing] = React.useState<Testimonial | null>(null);
  const [isNew, setIsNew] = React.useState(false);
  const [confirmId, setConfirmId] = React.useState<string | null>(null);
  const [confirmClearAll, setConfirmClearAll] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);
  const [clearingAll, setClearingAll] = React.useState(false);
  const [tabFilter, setTabFilter] = React.useState<"all" | "Pending" | "Approved" | "Rejected">("all");
  const [searchQuery, setSearchQuery] = React.useState("");

  const pendingCount = state.testimonials.filter((t) => t.status === "Pending").length;
  const approvedCount = state.testimonials.filter((t) => t.status === "Approved" || !t.status).length;
  const rejectedCount = state.testimonials.filter((t) => t.status === "Rejected").length;

  const filteredList = state.testimonials.filter((t) => {
    const effectiveStatus = t.status || "Approved";
    if (tabFilter !== "all" && effectiveStatus !== tabFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        t.name?.toLowerCase().includes(q) ||
        t.place?.toLowerCase().includes(q) ||
        t.crop?.toLowerCase().includes(q) ||
        t.quote?.toLowerCase().includes(q) ||
        t.productName?.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const save = async () => {
    if (!editing) return;
    if (!editing.name.trim() || !editing.quote.trim()) {
      toast.error("Farmer name and testimonial feedback quote are required");
      return;
    }

    setSaving(true);
    const ok = await saveTestimonial(editing, isNew);
    setSaving(false);
    if (ok) {
      toast.success(isNew ? "Testimonial created and approved in MongoDB" : "Testimonial updated");
      setEditing(null);
    } else {
      toast.error("Failed to save testimonial");
    }
  };

  const handleApprove = async (id: string, name: string) => {
    const ok = await updateTestimonialStatus(id, "Approved");
    if (ok) {
      toast.success(`Approved feedback from ${name}. It is now live on the website!`);
    } else {
      toast.error("Failed to approve feedback");
    }
  };

  const handleReject = async (id: string, name: string) => {
    const ok = await updateTestimonialStatus(id, "Rejected");
    if (ok) {
      toast.info(`Marked feedback from ${name} as Rejected`);
    } else {
      toast.error("Failed to reject feedback");
    }
  };

  const handleDelete = async () => {
    if (!confirmId) return;
    setDeleting(true);
    const ok = await deleteTestimonial(confirmId);
    setDeleting(false);
    if (ok) {
      toast.success("Testimonial removed from MongoDB");
      setConfirmId(null);
    } else {
      toast.error("Failed to delete testimonial");
    }
  };

  const handleClearAll = async () => {
    setClearingAll(true);
    const ok = await deleteAllTestimonials();
    setClearingAll(false);
    if (ok) {
      toast.success("All farmer testimonials and feedbacks deleted from MongoDB");
      setConfirmClearAll(false);
    } else {
      toast.error("Failed to delete all testimonials");
    }
  };

  return (
    <AdminPage
      title="Farmer Testimonials & Feedback Moderation"
      subtitle={`${state.testimonials.length} farmer stories and submitted product reviews stored in MongoDB.`}
      action={
        <div className="flex flex-wrap items-center gap-2">
          {state.testimonials.length > 0 && (
            <button
              type="button"
              onClick={() => setConfirmClearAll(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-2 text-xs font-bold text-destructive hover:bg-destructive/20 transition-all shadow-sm"
            >
              <Trash2 className="h-4 w-4" /> Delete All Feedbacks
            </button>
          )}
          <Btn
            onClick={() => {
              setIsNew(true);
              setEditing(blankTestimonial);
            }}
          >
            <span className="inline-flex items-center gap-2">
              <Plus className="h-4 w-4" /> Add Testimonial
            </span>
          </Btn>
        </div>
      }
    >
      {/* Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase">Total Feedbacks</span>
            <MessageSquareQuote className="h-4 w-4 text-primary" />
          </div>
          <p className="mt-2 text-2xl font-bold text-foreground">{state.testimonials.length}</p>
        </div>

        <div
          onClick={() => setTabFilter("Pending")}
          className={`cursor-pointer rounded-2xl border p-5 shadow-xs transition-all ${
            tabFilter === "Pending" ? "border-amber-500 bg-amber-500/10" : "border-border bg-card hover:bg-muted/40"
          }`}
        >
          <div className="flex items-center justify-between text-amber-600">
            <span className="text-xs font-semibold uppercase">Pending Approval</span>
            <Clock className="h-4 w-4" />
          </div>
          <div className="mt-2 flex items-center justify-between">
            <p className="text-2xl font-bold text-amber-600">{pendingCount}</p>
            {pendingCount > 0 && (
              <span className="rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-white animate-pulse">
                Action Required
              </span>
            )}
          </div>
        </div>

        <div
          onClick={() => setTabFilter("Approved")}
          className={`cursor-pointer rounded-2xl border p-5 shadow-xs transition-all ${
            tabFilter === "Approved" ? "border-emerald-500 bg-emerald-500/10" : "border-border bg-card hover:bg-muted/40"
          }`}
        >
          <div className="flex items-center justify-between text-emerald-600">
            <span className="text-xs font-semibold uppercase">Approved &amp; Live</span>
            <CheckCircle2 className="h-4 w-4" />
          </div>
          <p className="mt-2 text-2xl font-bold text-emerald-600">{approvedCount}</p>
        </div>

        <div
          onClick={() => setTabFilter("Rejected")}
          className={`cursor-pointer rounded-2xl border p-5 shadow-xs transition-all ${
            tabFilter === "Rejected" ? "border-rose-500 bg-rose-500/10" : "border-border bg-card hover:bg-muted/40"
          }`}
        >
          <div className="flex items-center justify-between text-rose-600">
            <span className="text-xs font-semibold uppercase">Rejected / Hidden</span>
            <XCircle className="h-4 w-4" />
          </div>
          <p className="mt-2 text-2xl font-bold text-rose-600">{rejectedCount}</p>
        </div>
      </div>

      {/* Filter Tabs and Search */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: "all", label: `All (${state.testimonials.length})` },
            { id: "Pending", label: `Pending Approval (${pendingCount})` },
            { id: "Approved", label: `Approved (${approvedCount})` },
            { id: "Rejected", label: `Rejected (${rejectedCount})` },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTabFilter(t.id as typeof tabFilter)}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                tabFilter === t.id
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "border border-border bg-card text-foreground hover:bg-muted"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-72">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by farmer, crop or text…"
            className={inputCls}
          />
        </div>
      </div>

      {/* Testimonials Table */}
      <TableWrap>
        <thead className="border-b border-border bg-muted/50">
          <tr>
            <th className={th}>Farmer &amp; Product</th>
            <th className={th}>Location &amp; Crop</th>
            <th className={th}>Rating</th>
            <th className={th}>Feedback / Quote</th>
            <th className={th}>Status</th>
            <th className={th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredList.length === 0 ? (
            <tr>
              <td colSpan={6} className="p-12 text-center text-muted-foreground text-sm">
                <MessageSquareQuote className="mx-auto h-12 w-12 text-muted-foreground/40 mb-3" />
                <p className="font-semibold text-foreground">No testimonials match your filter.</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {tabFilter === "Pending"
                    ? "Great! All submitted feedbacks have been moderated."
                    : "Click 'Add Testimonial' to publish a new farmer story."}
                </p>
              </td>
            </tr>
          ) : (
            filteredList.map((t) => {
              const status = t.status || "Approved";
              return (
                <tr key={t.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                  <td className={`${td} font-bold text-foreground`}>
                    <div>
                      <span>{t.name}</span>
                      {t.productName && (
                        <p className="text-xs font-normal text-primary flex items-center gap-1 mt-0.5">
                          <Sparkles className="h-3 w-3" /> {t.productName}
                        </p>
                      )}
                      {t.date && <p className="text-[11px] text-muted-foreground">{t.date}</p>}
                    </div>
                  </td>
                  <td className={td}>
                    <div>
                      <p className="text-xs font-medium text-foreground">{t.place}</p>
                      <span className="inline-block mt-0.5 rounded-md bg-secondary/10 px-2 py-0.5 text-xs font-semibold text-secondary">
                        {t.crop}
                      </span>
                    </div>
                  </td>
                  <td className={td}>
                    <div className="flex items-center gap-1 text-amber-500 font-bold">
                      <span>{t.rating}</span>
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
                    </div>
                  </td>
                  <td className={`${td} max-w-md text-xs text-muted-foreground line-clamp-2`}>
                    &ldquo;{t.quote}&rdquo;
                  </td>
                  <td className={td}>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        status === "Approved"
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : status === "Rejected"
                          ? "bg-rose-100 text-rose-800 border border-rose-300"
                          : "bg-amber-100 text-amber-800 border border-amber-300 animate-pulse"
                      }`}
                    >
                      {status === "Approved" ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5" /> Approved
                        </>
                      ) : status === "Rejected" ? (
                        <>
                          <XCircle className="h-3.5 w-3.5" /> Rejected
                        </>
                      ) : (
                        <>
                          <Clock className="h-3.5 w-3.5" /> Pending Approval
                        </>
                      )}
                    </span>
                  </td>
                  <td className={td}>
                    <div className="flex items-center gap-1.5">
                      {status !== "Approved" && (
                        <button
                          onClick={() => handleApprove(t.id, t.name)}
                          className="rounded-lg border border-emerald-300 bg-emerald-50 p-2 text-emerald-700 hover:bg-emerald-100 transition-colors"
                          title="Approve & Publish to Site"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                        </button>
                      )}
                      {status !== "Rejected" && (
                        <button
                          onClick={() => handleReject(t.id, t.name)}
                          className="rounded-lg border border-rose-300 bg-rose-50 p-2 text-rose-700 hover:bg-rose-100 transition-colors"
                          title="Reject / Hide from Site"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setIsNew(false);
                          setEditing(t);
                        }}
                        className="rounded-lg border border-border p-2 hover:bg-muted text-foreground"
                        title="Edit Feedback"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setConfirmId(t.id)}
                        className="rounded-lg border border-border p-2 text-destructive hover:bg-destructive/10"
                        title="Delete Feedback"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </TableWrap>

      {/* Add / Edit Testimonial Modal */}
      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={isNew ? "Add Farmer Testimonial" : "Edit Testimonial"}
      >
        {editing && (
          <div className="space-y-4 min-w-0 w-full">
            <Field label="Farmer Name *">
              <input
                className={inputCls}
                value={editing.name}
                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                placeholder="e.g. Suresh Patil"
              />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 min-w-0">
              <Field label="Village / District">
                <input
                  className={inputCls}
                  value={editing.place}
                  onChange={(e) => setEditing({ ...editing, place: e.target.value })}
                  placeholder="Vijayapura, Karnataka"
                />
              </Field>
              <Field label="Crop Grown">
                <input
                  className={inputCls}
                  value={editing.crop}
                  onChange={(e) => setEditing({ ...editing, crop: e.target.value })}
                  placeholder="Sugarcane / Cotton"
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 min-w-0">
              <Field label="Rating (1 to 5 Stars)">
                <select
                  className={inputCls}
                  value={editing.rating}
                  onChange={(e) => setEditing({ ...editing, rating: Number(e.target.value) })}
                >
                  <option value={5}>5 Stars - Excellent</option>
                  <option value={4}>4 Stars - Very Good</option>
                  <option value={3}>3 Stars - Good</option>
                  <option value={2}>2 Stars - Average</option>
                  <option value={1}>1 Star - Poor</option>
                </select>
              </Field>

              <Field label="Approval Status">
                <select
                  className={inputCls}
                  value={editing.status || "Approved"}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      status: e.target.value as "Pending" | "Approved" | "Rejected",
                    })
                  }
                >
                  <option value="Approved">Approved (Publicly Visible)</option>
                  <option value="Pending">Pending (Awaiting Moderation)</option>
                  <option value="Rejected">Rejected (Hidden)</option>
                </select>
              </Field>
            </div>

            <Field label="Related Product (Optional)">
              <select
                className={inputCls}
                value={editing.productId || ""}
                onChange={(e) => {
                  const selProd = state.products.find((p) => p.id === e.target.value);
                  setEditing({
                    ...editing,
                    productId: e.target.value,
                    productName: selProd?.name || "",
                  });
                }}
              >
                <option value="">General Farm Solution / Experience</option>
                {state.products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.category})
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Farmer Feedback / Quote *">
              <textarea
                rows={4}
                className={inputCls}
                value={editing.quote}
                onChange={(e) => setEditing({ ...editing, quote: e.target.value })}
                placeholder="Describe crop yield increase, vegetative vigor, disease resistance observations..."
              />
            </Field>

            <div className="flex justify-end gap-2 pt-3 border-t border-border">
              <Btn variant="ghost" onClick={() => setEditing(null)}>
                Cancel
              </Btn>
              <Btn onClick={save} disabled={saving}>
                {saving ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                  </span>
                ) : (
                  "Save Testimonial"
                )}
              </Btn>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Single Testimonial Modal */}
      <Modal open={!!confirmId} onClose={() => setConfirmId(null)} title="Delete testimonial?">
        <p className="text-sm text-muted-foreground">
          Are you sure you want to remove this feedback from MongoDB and the website?
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Btn variant="ghost" onClick={() => setConfirmId(null)} disabled={deleting}>
            Cancel
          </Btn>
          <Btn variant="danger" onClick={handleDelete} disabled={deleting}>
            {deleting ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Deleting...
              </span>
            ) : (
              "Delete"
            )}
          </Btn>
        </div>
      </Modal>

      {/* Clear All Testimonials Modal */}
      <Modal open={confirmClearAll} onClose={() => setConfirmClearAll(false)} title="Delete All Testimonials?">
        <div className="flex items-start gap-3 text-sm text-muted-foreground">
          <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
          <p>
            Are you sure you want to permanently delete all <strong>{state.testimonials.length}</strong> farmer
            feedbacks from MongoDB? This action cannot be undone.
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
              "Yes, Delete All Testimonials"
            )}
          </Btn>
        </div>
      </Modal>
    </AdminPage>
  );
}
