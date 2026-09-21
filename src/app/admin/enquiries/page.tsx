"use client";

import * as React from "react";
import { Mail, Phone, Trash2, CheckCircle, Clock, Eye, AlertTriangle, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/lib/store";
import type { Enquiry } from "@/lib/data";
import { AdminPage, TableWrap, inputCls, td, th } from "@/components/site/AdminUI";

export default function AdminEnquiriesPage() {
  const { state, updateEnquiryStatus, deleteEnquiry, deleteAllEnquiries } = useApp();
  const [filter, setFilter] = React.useState("All");
  const [q, setQ] = React.useState("");
  const [selectedEnquiry, setSelectedEnquiry] = React.useState<Enquiry | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = React.useState<string | null>(null);
  const [confirmClearAll, setConfirmClearAll] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);

  const list = (state.enquiries || []).filter(
    (e) =>
      (filter === "All" || e.status === filter) &&
      ((e.name || "").toLowerCase().includes(q.toLowerCase()) ||
        (e.email || "").toLowerCase().includes(q.toLowerCase()) ||
        (e.subject || "").toLowerCase().includes(q.toLowerCase()) ||
        (e.message || "").toLowerCase().includes(q.toLowerCase()))
  );

  const toggleStatus = async (e: Enquiry) => {
    const next = e.status === "New" ? "Answered" : "New";
    const targetId = e.id || (e as unknown as { _id?: string })._id;
    if (!targetId) return;
    const ok = await updateEnquiryStatus(targetId, next);
    if (ok) {
      toast.success(`Enquiry marked as ${next}`);
    }
  };

  const getTargetEnquiry = (id: string | null) => {
    if (!id) return null;
    return (
      (state.enquiries || []).find(
        (e) => e.id === id || (e as unknown as { _id?: string })._id === id
      ) || null
    );
  };

  const handleDelete = async () => {
    if (!confirmDeleteId) return;
    setDeleting(true);
    try {
      const ok = await deleteEnquiry(confirmDeleteId);
      if (ok) {
        toast.success("Enquiry permanently deleted");
        setConfirmDeleteId(null);
      } else {
        toast.error("Failed to delete enquiry");
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Error deleting enquiry");
    } finally {
      setDeleting(false);
    }
  };

  const handleClearAll = async () => {
    setDeleting(true);
    try {
      const ok = await deleteAllEnquiries();
      if (ok) {
        toast.success("All enquiries cleared successfully");
        setConfirmClearAll(false);
      } else {
        toast.error("Failed to clear enquiries");
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Error clearing enquiries");
    } finally {
      setDeleting(false);
    }
  };

  const enquiryToDelete = getTargetEnquiry(confirmDeleteId);

  return (
    <AdminPage
      title="Farmer & Customer Enquiries"
      subtitle={`${(state.enquiries || []).filter((e) => e.status === "New").length} new farmer queries awaiting response.`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search enquiries by farmer, email, or topic…"
            className={`${inputCls} max-w-sm`}
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className={`${inputCls} max-w-xs`}
          >
            <option value="All">All Inquiries ({state.enquiries?.length || 0})</option>
            <option value="New">
              New / Pending ({(state.enquiries || []).filter((e) => e.status === "New").length})
            </option>
            <option value="Answered">
              Answered / Resolved ({(state.enquiries || []).filter((e) => e.status === "Answered").length})
            </option>
          </select>
        </div>

        {state.enquiries && state.enquiries.length > 0 && (
          <button
            type="button"
            onClick={() => setConfirmClearAll(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-destructive/30 bg-destructive/5 px-3.5 py-2 text-xs font-semibold text-destructive transition-colors hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" /> Clear All ({state.enquiries.length})
          </button>
        )}
      </div>

      <TableWrap>
        <thead className="border-b border-border bg-muted/50">
          <tr>
            <th className={th}>Farmer Name</th>
            <th className={th}>Contact</th>
            <th className={th}>Subject</th>
            <th className={th}>Message / Question</th>
            <th className={th}>Received Date</th>
            <th className={th}>Status</th>
            <th className={th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {list.length === 0 ? (
            <tr>
              <td colSpan={7} className="p-8 text-center text-muted-foreground text-sm">
                No farmer enquiries found.
              </td>
            </tr>
          ) : (
            list.map((e, index) => {
              const targetId = e.id || (e as unknown as { _id?: string })._id || `enq-${index}`;
              return (
                <tr key={targetId} className="border-b border-border last:border-0 hover:bg-muted/20">
                  <td className={`${td} font-bold text-foreground`}>{e.name}</td>
                  <td className={td}>
                    <div className="flex items-center gap-1.5 text-xs text-foreground font-medium">
                      <Mail className="h-3 w-3 text-muted-foreground shrink-0" />
                      <a href={`mailto:${e.email}`} className="hover:text-primary underline-offset-2 hover:underline truncate max-w-[180px]">
                        {e.email}
                      </a>
                    </div>
                    {e.phone && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                        <Phone className="h-3 w-3 shrink-0" />
                        <a href={`tel:${e.phone}`} className="hover:text-primary">
                          {e.phone}
                        </a>
                      </div>
                    )}
                  </td>
                  <td className={`${td} font-semibold text-primary max-w-[160px] truncate`}>
                    {e.subject}
                  </td>
                  <td className={`${td} max-w-md text-xs text-muted-foreground line-clamp-2`}>
                    {e.message}
                  </td>
                  <td className={`${td} whitespace-nowrap text-xs`}>{e.date}</td>
                  <td className={td}>
                    <button
                      onClick={() => toggleStatus(e)}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition-all ${
                        e.status === "Answered"
                          ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300"
                          : "bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-950/50 dark:text-amber-300"
                      }`}
                      title="Click to toggle status"
                    >
                      {e.status === "Answered" ? (
                        <>
                          <CheckCircle className="h-3.5 w-3.5" /> Answered
                        </>
                      ) : (
                        <>
                          <Clock className="h-3.5 w-3.5" /> New
                        </>
                      )}
                    </button>
                  </td>
                  <td className={td}>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setSelectedEnquiry(e)}
                        className="rounded-lg border border-border p-2 text-foreground hover:bg-muted transition-colors"
                        title="View Full Enquiry"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(targetId)}
                        className="rounded-lg border border-destructive/20 p-2 text-destructive hover:bg-destructive/10 transition-colors"
                        title="Delete Enquiry"
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

      {/* View Enquiry Details Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <h3 className="font-display text-lg font-bold text-foreground">Farmer Enquiry</h3>
              </div>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                  selectedEnquiry.status === "Answered"
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {selectedEnquiry.status}
              </span>
            </div>

            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3 rounded-xl bg-muted/40 p-3">
                <div>
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase">Farmer Name</p>
                  <p className="font-bold text-foreground">{selectedEnquiry.name}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase">Date Received</p>
                  <p className="font-medium text-foreground">{selectedEnquiry.date}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase">Email</p>
                  <a href={`mailto:${selectedEnquiry.email}`} className="text-xs text-primary font-medium hover:underline">
                    {selectedEnquiry.email}
                  </a>
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase">Phone</p>
                  <a href={`tel:${selectedEnquiry.phone}`} className="text-xs text-primary font-medium hover:underline">
                    {selectedEnquiry.phone || "Not provided"}
                  </a>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Subject</p>
                <p className="font-bold text-foreground mt-0.5">{selectedEnquiry.subject}</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Message / Question</p>
                <div className="mt-1 rounded-xl border border-border bg-background p-3 text-xs leading-relaxed text-foreground whitespace-pre-wrap max-h-48 overflow-y-auto">
                  {selectedEnquiry.message}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-border pt-4">
              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${selectedEnquiry.email}?subject=Re: ${encodeURIComponent(selectedEnquiry.subject)}`}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  <Mail className="h-3.5 w-3.5" /> Reply Email
                </a>
                {selectedEnquiry.phone && (
                  <a
                    href={`tel:${selectedEnquiry.phone}`}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-xs font-bold text-foreground hover:bg-muted transition-colors"
                  >
                    <Phone className="h-3.5 w-3.5 text-primary" /> Call
                  </a>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    toggleStatus(selectedEnquiry);
                    setSelectedEnquiry((prev) =>
                      prev ? { ...prev, status: prev.status === "New" ? "Answered" : "New" } : null
                    );
                  }}
                  className="rounded-xl border border-border px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
                >
                  Toggle Status
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedEnquiry(null)}
                  className="rounded-xl bg-muted px-4 py-2 text-xs font-bold text-foreground hover:bg-muted/80 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Single Enquiry Confirmation Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-destructive">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10">
                <Trash2 className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg font-bold text-foreground">Delete enquiry?</h3>
            </div>

            <p className="mt-3 text-sm text-muted-foreground">
              Are you sure you want to permanently delete this enquiry
              {enquiryToDelete?.name ? (
                <> from <strong className="text-foreground">{enquiryToDelete.name}</strong></>
              ) : ""}? This action cannot be undone.
            </p>

            {enquiryToDelete && (
              <div className="mt-3 rounded-xl bg-muted/40 p-3 text-xs text-muted-foreground">
                <p className="font-semibold text-foreground">{enquiryToDelete.subject}</p>
                <p className="truncate mt-0.5">{enquiryToDelete.message}</p>
              </div>
            )}

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="rounded-xl bg-destructive px-4 py-2 text-xs font-bold text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50"
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete Enquiry"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear All Enquiries Confirmation Modal */}
      {confirmClearAll && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl border border-destructive/30 bg-card p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-destructive">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg font-bold text-foreground">Clear all enquiries?</h3>
            </div>

            <p className="mt-3 text-sm text-muted-foreground">
              Are you sure you want to permanently delete all{" "}
              <strong className="text-foreground">{state.enquiries?.length || 0}</strong> enquiries from the database? This action cannot be undone.
            </p>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setConfirmClearAll(false)}
                className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                onClick={handleClearAll}
                className="rounded-xl bg-destructive px-4 py-2 text-xs font-bold text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50"
                disabled={deleting}
              >
                {deleting ? "Clearing All..." : "Delete All Enquiries"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminPage>
  );
}
