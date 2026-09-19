"use client";

import * as React from "react";
import { Pencil, Plus, Star, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/lib/store";
import type { Blog } from "@/lib/data";
import { AdminPage, Btn, Field, Modal, TableWrap, inputCls, td, th } from "@/components/site/AdminUI";
import { ImageUploader } from "@/components/site/ImageUploader";

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
  const { state, saveBlog, deleteBlog } = useApp();
  const [editing, setEditing] = React.useState<Blog | null>(null);
  const [isNew, setIsNew] = React.useState(false);
  const [confirmId, setConfirmId] = React.useState<string | null>(null);
  const [saving, setSaving] = React.useState(false);

  const save = async () => {
    if (!editing) return;
    if (!editing.title.trim()) {
      toast.error("Title is required");
      return;
    }
    setSaving(true);
    const ok = await saveBlog(editing, isNew);
    setSaving(false);
    if (ok) {
      toast.success(isNew ? "Article published to MongoDB" : "Article updated in MongoDB");
      setEditing(null);
    } else {
      toast.error("Failed to save article");
    }
  };

  const handleDelete = async () => {
    if (!confirmId) return;
    const ok = await deleteBlog(confirmId);
    if (ok) {
      toast.success("Article deleted");
      setConfirmId(null);
    }
  };

  return (
    <AdminPage
      title="Blogs & Agronomy Articles"
      subtitle={`${state.blogs.length} agronomy articles stored in MongoDB.`}
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
            <th className={th}>Article</th>
            <th className={th}>Category</th>
            <th className={th}>Author</th>
            <th className={th}>Date</th>
            <th className={th}>Featured</th>
            <th className={th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {state.blogs.map((b) => (
            <tr key={b.id} className="border-b border-border last:border-0 hover:bg-muted/20">
              <td className={`${td} max-w-sm font-semibold`}>
                <div className="flex items-center gap-3">
                  <img src={b.image} alt={b.title} className="h-10 w-14 rounded-lg object-cover border border-border" />
                  <div>
                    <p className="font-bold text-foreground line-clamp-1">{b.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">{b.excerpt}</p>
                  </div>
                </div>
              </td>
              <td className={td}>
                <span className="rounded-md bg-secondary/10 px-2 py-0.5 text-xs font-semibold text-secondary">
                  {b.category}
                </span>
              </td>
              <td className={td}>{b.author}</td>
              <td className={td}>{b.date}</td>
              <td className={td}>
                <button
                  onClick={() => saveBlog({ ...b, featured: !b.featured }, false)}
                  className={`rounded-lg border border-border p-2 ${b.featured ? "text-amber-500 bg-amber-50" : "text-muted-foreground"}`}
                  title="Toggle Featured"
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
                    className="rounded-lg border border-border p-2 hover:bg-muted"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setConfirmId(b.id)}
                    className="rounded-lg border border-border p-2 text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </TableWrap>

      <Modal open={!!editing} onClose={() => setEditing(null)} title={isNew ? "Write New Article" : "Edit Article"} wide>
        {editing && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Field label="Article Title">
                <input
                  className={inputCls}
                  value={editing.title}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  placeholder="e.g. Maximizing Sugarcane Yield with Microbial Bio-inoculants"
                />
              </Field>
            </div>
            <Field label="Category / Topic">
              <input
                className={inputCls}
                value={editing.category}
                onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                placeholder="Soil Health / Crop Protection"
              />
            </Field>
            <Field label="Author Name">
              <input
                className={inputCls}
                value={editing.author}
                onChange={(e) => setEditing({ ...editing, author: e.target.value })}
              />
            </Field>
            <Field label="Publication Date">
              <input
                type="date"
                className={inputCls}
                value={editing.date}
                onChange={(e) => setEditing({ ...editing, date: e.target.value })}
              />
            </Field>
            <Field label="Read Time (Minutes)">
              <input
                type="number"
                className={inputCls}
                value={editing.readTime}
                onChange={(e) => setEditing({ ...editing, readTime: Number(e.target.value) })}
              />
            </Field>

            <div className="sm:col-span-2">
              <ImageUploader
                label="Cover Image (Cloudinary)"
                value={editing.image}
                onChange={(url) => setEditing({ ...editing, image: url })}
                folder="plant_health_solutions/blogs"
              />
            </div>

            <div className="sm:col-span-2">
              <Field label="Short Excerpt">
                <textarea
                  rows={2}
                  className={inputCls}
                  value={editing.excerpt}
                  onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })}
                  placeholder="A concise synopsis displayed on article cards..."
                />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Field label="Body Content (one paragraph per line)">
                <textarea
                  rows={8}
                  className={inputCls}
                  value={editing.body?.join("\n\n") || ""}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      body: e.target.value.split("\n\n").map((p) => p.trim()).filter(Boolean),
                    })
                  }
                  placeholder="Full article content formatted in paragraphs..."
                />
              </Field>
            </div>

            <label className="flex items-center gap-2 text-sm font-semibold sm:col-span-2 cursor-pointer">
              <input
                type="checkbox"
                checked={editing.featured}
                onChange={(e) => setEditing({ ...editing, featured: e.target.checked })}
                className="rounded border-border text-primary focus:ring-primary h-4 w-4"
              />
              Mark as Featured Article (Highlight on Home and Blog header)
            </label>

            <div className="flex justify-end gap-2 sm:col-span-2 pt-3 border-t border-border">
              <Btn variant="ghost" onClick={() => setEditing(null)}>
                Cancel
              </Btn>
              <Btn onClick={save} disabled={saving}>
                {saving ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                  </span>
                ) : (
                  "Save Article"
                )}
              </Btn>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={!!confirmId} onClose={() => setConfirmId(null)} title="Delete article?">
        <p className="text-sm text-muted-foreground">
          Are you sure you want to permanently remove this agronomy article from MongoDB?
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Btn variant="ghost" onClick={() => setConfirmId(null)}>
            Cancel
          </Btn>
          <Btn variant="danger" onClick={handleDelete}>
            Delete Article
          </Btn>
        </div>
      </Modal>
    </AdminPage>
  );
}
