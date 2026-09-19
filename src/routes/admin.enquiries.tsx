import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { useApp } from "@/lib/store";
import { AdminPage, StatusBadge, TableWrap, inputCls, td, th } from "@/components/site/AdminUI";

export const Route = createFileRoute("/admin/enquiries")({
  head: () => ({
    meta: [
      { title: "Enquiries — PHS Admin" },
      { name: "description", content: "Farmer contact form submissions and WhatsApp agronomist leads." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Enquiries — PHS Admin" },
      { property: "og:description", content: "Lead inbox." },
    ],
  }),
  component: AdminEnquiries,
});

function AdminEnquiries() {
  const { state, set } = useApp();
  const [filter, setFilter] = React.useState("All");
  const list = state.enquiries.filter((e) => filter === "All" || e.status === filter);

  return (
    <AdminPage title="Enquiries" subtitle={`${state.enquiries.filter((e) => e.status === "New").length} new enquiries.`}>
      <select value={filter} onChange={(e) => setFilter(e.target.value)} className={`${inputCls} max-w-xs`}>
        <option>All</option>
        <option>New</option>
        <option>Answered</option>
      </select>
      <TableWrap>
        <thead className="border-b border-border bg-muted/50">
          <tr>
            <th className={th}>Name</th>
            <th className={th}>Contact</th>
            <th className={th}>Subject</th>
            <th className={th}>Message</th>
            <th className={th}>Date</th>
            <th className={th}>Status</th>
          </tr>
        </thead>
        <tbody>
          {list.map((e) => (
            <tr key={e.id} className="border-b border-border last:border-0">
              <td className={`${td} font-semibold`}>{e.name}</td>
              <td className={td}>
                <div className="text-xs">{e.email}</div>
                <div className="text-xs text-muted-foreground">{e.phone}</div>
              </td>
              <td className={td}>{e.subject}</td>
              <td className={`${td} max-w-sm text-xs text-muted-foreground`}>{e.message}</td>
              <td className={td}>{e.date}</td>
              <td className={td}>
                <button
                  onClick={() => {
                    const next = e.status === "New" ? "Answered" : "New";
                    set((s) => ({
                      ...s,
                      enquiries: s.enquiries.map((x) => (x.id === e.id ? { ...x, status: next } : x)),
                    }));
                    toast.success(`Marked ${next}`);
                  }}
                >
                  <StatusBadge status={e.status} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </TableWrap>
    </AdminPage>
  );
}
