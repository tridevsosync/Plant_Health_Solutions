"use client";

import * as React from "react";
import { Mail, Phone, Trash2, CheckCircle, Clock } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/lib/store";
import { AdminPage, StatusBadge, TableWrap, inputCls, td, th } from "@/components/site/AdminUI";

export default function AdminEnquiriesPage() {
  const { state, updateEnquiryStatus, deleteEnquiry } = useApp();
  const [filter, setFilter] = React.useState("All");
  const [q, setQ] = React.useState("");

  const list = state.enquiries.filter(
    (e) =>
      (filter === "All" || e.status === filter) &&
      (e.name.toLowerCase().includes(q.toLowerCase()) ||
        e.email.toLowerCase().includes(q.toLowerCase()) ||
        e.subject.toLowerCase().includes(q.toLowerCase()) ||
        e.message.toLowerCase().includes(q.toLowerCase()))
  );

  const toggleStatus = async (e: typeof state.enquiries[0]) => {
    const next = e.status === "New" ? "Answered" : "New";
    const ok = await updateEnquiryStatus(e.id, next);
    if (ok) {
      toast.success(`Enquiry marked as ${next} in MongoDB`);
    }
  };

  const handleDelete = async (id: string) => {
    const ok = await deleteEnquiry(id);
    if (ok) {
      toast.success("Enquiry deleted");
    }
  };

  return (
    <AdminPage
      title="Farmer & Customer Enquiries"
      subtitle={`${state.enquiries.filter((e) => e.status === "New").length} new farmer queries awaiting response.`}
    >
      <div className="flex flex-wrap gap-3">
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
          <option value="All">All Inquiries</option>
          <option value="New">New (Pending)</option>
          <option value="Answered">Answered / Resolved</option>
        </select>
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
          {list.map((e) => (
            <tr key={e.id} className="border-b border-border last:border-0 hover:bg-muted/20">
              <td className={`${td} font-bold text-foreground`}>{e.name}</td>
              <td className={td}>
                <div className="flex items-center gap-1.5 text-xs text-foreground font-medium">
                  <Mail className="h-3 w-3 text-muted-foreground" /> {e.email}
                </div>
                {e.phone && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                    <Phone className="h-3 w-3" /> {e.phone}
                  </div>
                )}
              </td>
              <td className={`${td} font-semibold text-primary`}>{e.subject}</td>
              <td className={`${td} max-w-md text-xs text-muted-foreground whitespace-pre-wrap`}>
                {e.message}
              </td>
              <td className={td}>{e.date}</td>
              <td className={td}>
                <button
                  onClick={() => toggleStatus(e)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition-all ${
                    e.status === "Answered"
                      ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                      : "bg-amber-100 text-amber-800 hover:bg-amber-200"
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
                <button
                  onClick={() => handleDelete(e.id)}
                  className="rounded-lg border border-border p-2 text-destructive hover:bg-destructive/10"
                  title="Delete Enquiry"
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
