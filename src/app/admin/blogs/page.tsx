"use client";

import * as React from "react";
import { Pencil, Plus, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/lib/store";
import type { Blog } from "@/lib/data";
import { AdminPage, Btn, Field, Modal, TableWrap, inputCls, td, th } from "@/components/site/AdminUI";

const blank: Blog = {
  id: "",
  title: "",
  author: "Dr. R. M. Kulkarni",
  date: new Date().toISOString().slice(0, 10),
  category: "Soil Health",
  image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=70",
  excerpt: "",
  readTime: 5,
  featured: false,
  body: [],
};

export default function AdminBlogsPage() {
  const { state, set } = useApp();
  const [editing, setEditing] = React.useState<Blog | null>(null);
  const [isNew, setIsNew] = React.useState(false);
  const [confirmId, setConfirmId] = React.useState<string | null>(null);

  const save = () => {
    if (!editing) return;
    if (!editing.title.trim()) {
      toast.error("Title is required");
      return;
    }
    set((s) => ({
      ...s,
      blogs: isNew ? [{ ...editing, id: `b${Date.now()}` }, ...s.blogs] : s.blogs.map((b) => (b.id === editing.id ? editing : b)),
    }));
    toast.success(isNew ? "Article published" : "Article updated");
    setEditing(null);
  };

  return (
    <AdminPage
      title="Blogs"
      subtitle={`${state.blogs.length} agronomy articles.`}
      action={
        <Btn
          onClick={() => {
            setIsNew(true);
            setEditing(blank);
          }}
        >
          <span className="inline-flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add Article
          </span>
        </Btn>
      }
    >
      <TableWrap>
        <thead className="border-b border-border bg-muted/50">
          <tr>
            <th className={th}>Title</th>
            <th className={th}>Category</th>
            <th className={th}>Author</th>
            <th className={th}>Date</th>
            <th className={th}>Featured</th>
            <th className={th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {state.blogs.map((b) => (
            <tr key={b.id} className="border-b border-border last:border-0">
              <td className={`${td} max-w-sm font-semibold`}>{b.title}</td>
              <td className={td}>{b.category}</td>
              <td className={td}>{b.author}</td>
              <td className={td}>{b.date}</td>
              <td className={td}>
                <button
                  onClick={() =>
                    set((s) => ({ ...s, blogs: s.blogs.map((x) => (x.id === b.id ? { ...x, featured: !x.featured } : x)) }))
                  }
                  className={`rounded-lg border border-border p-2 ${b.featured ? "text-amber-500" : "text-muted-foreground"}`}
                >
                  <Star className={`h-4 w-4 ${b.featured ? "fill-amber-400" : ""}`} />
                </button>
              </td>
              <td className={td}>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setIsNew(false);
                      setEditing(b);
                    }}
                    className="rounded-lg border border-border p-2"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => setConfirmId(b.id)} className="rounded-lg border border-border p-2 text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </TableWrap>

      <Modal open={!!editing} onClose={() => setEditing(null)} title={isNew ? "Add Article" : "Edit Article"} wide>
        {editing && (
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Field label="Title">
                <input className={inputCls} value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
              </Field>
            </div>
            <Field label="Category">
              <input className={inputCls} value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} />
            </Field>
            <Field label="Author">
              <input className={inputCls} value={editing.author} onChange={(e) => setEditing({ ...editing, author: e.target.value })} />
            </Field>
            <Field label="Date">
              <input type="date" className={inputCls} value={editing.date} onChange={(e) => setEditing({ ...editing, date: e.target.value })} />
            </Field>
            <Field label="Read time (min)">
              <input type="number" className={inputCls} value={editing.readTime} onChange={(e) => setEditing({ ...editing, readTime: Number(e.target.value) })} />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Cover image URL">
                <input className={inputCls} value={editing.image} onChange={(e) => setEditing({ ...editing, image: e.target.value })} />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Field label="Excerpt">
                <textarea rows={2} className={inputCls} value={editing.excerpt} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Field label="Body (one paragraph per line)">
                <textarea
                  rows={7}
                  className={inputCls}
                  value={editing.body.join("\n")}
                  onChange={(e) => setEditing({ ...editing, body: e.target.value.split("\n").filter(Boolean) })}
                />
              </Field>
            </div>
            <label className="flex items-center gap-2 text-sm sm:col-span-2">
              <input type="checkbox" checked={editing.featured} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} />
              Featured article
            </label>
            <div className="flex justify-end gap-2 sm:col-span-2">
              <Btn variant="ghost" onClick={() => setEditing(null)}>
                Cancel
              </Btn>
              <Btn onClick={save}>Save Article</Btn>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={!!confirmId} onClose={() => setConfirmId(null)} title="Delete article?">
        <p className="text-sm text-muted-foreground">This removes the article from the blog.</p>
        <div className="mt-5 flex justify-end gap-2">
          <Btn variant="ghost" onClick={() => setConfirmId(null)}>
            Cancel
          </Btn>
          <Btn
            variant="danger"
            onClick={() => {
              set((s) => ({ ...s, blogs: s.blogs.filter((b) => b.id !== confirmId) }));
              setConfirmId(null);
              toast.success("Article deleted");
            }}
          >
            Delete
          </Btn>
        </div>
      </Modal>
    </AdminPage>
  );
}
