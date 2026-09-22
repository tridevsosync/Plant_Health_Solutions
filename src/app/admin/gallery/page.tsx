"use client";

import * as React from "react";
import {
  Image as ImageIcon,
  Video,
  Film,
  Plus,
  Pencil,
  Trash2,
  Play,
  Eye,
  Star,
  Layers,
  Sparkles,
  ExternalLink,
  Search,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/lib/store";
import { galleryItems as seedGallery, type GalleryItem } from "@/lib/data";
import { AdminPage, Btn, Field, Modal, TableWrap, inputCls, td, th } from "@/components/site/AdminUI";
import { MediaUploader } from "@/components/site/MediaUploader";
import { getVideoInfo } from "@/lib/videoUtils";

const CATEGORIES = [
  "Field Trials",
  "Manufacturing Unit",
  "Bio-Inputs",
  "Farmer Stories",
  "Research & Lab",
  "Events & Workshops",
  "General",
];

const blankItem: GalleryItem = {
  id: "",
  title: "",
  description: "",
  type: "photo",
  mediaUrl: "",
  thumbnailUrl: "",
  videoLink: "",
  category: "Field Trials",
  featured: false,
  status: "Active",
  order: 0,
  date: new Date().toISOString().slice(0, 10),
};

export default function AdminGalleryPage() {
  const { state, saveGalleryItem, deleteGalleryItem } = useApp();
  const [editing, setEditing] = React.useState<GalleryItem | null>(null);
  const [isNew, setIsNew] = React.useState(false);
  const [confirmId, setConfirmId] = React.useState<string | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);

  // Filters & Search
  const [search, setSearch] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState<"all" | "photo" | "video">("all");
  const [categoryFilter, setCategoryFilter] = React.useState<string>("All");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");

  // Preview Modal
  const [previewItem, setPreviewItem] = React.useState<GalleryItem | null>(null);

  // Video Mode in Modal: "link" or "upload"
  const [videoMode, setVideoMode] = React.useState<"link" | "upload">("link");

  const rawGallery = state.gallery && state.gallery.length > 0 ? state.gallery : seedGallery;

  const filteredItems = rawGallery.filter((item) => {
    const matchesSearch =
      !search ||
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(search.toLowerCase())) ||
      (item.category && item.category.toLowerCase().includes(search.toLowerCase()));

    const matchesType = typeFilter === "all" || item.type === typeFilter;
    const matchesCategory = categoryFilter === "All" || item.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || (item.status || "Active").toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesType && matchesCategory && matchesStatus;
  });

  const photoCount = rawGallery.filter((i) => i.type === "photo").length;
  const videoCount = rawGallery.filter((i) => i.type === "video").length;
  const activeCount = rawGallery.filter((i) => (i.status || "Active") === "Active").length;

  const handleOpenEdit = (item: GalleryItem) => {
    setIsNew(false);
    setEditing({ ...item });
    setVideoMode(item.videoLink ? "link" : "upload");
  };

  const handleOpenNew = () => {
    setIsNew(true);
    setEditing({ ...blankItem, id: `g_${Date.now()}` });
    setVideoMode("link");
  };

  const handleSave = async () => {
    if (!editing) return;
    if (!editing.title.trim()) {
      toast.error("Name / Title is required");
      return;
    }

    if (editing.type === "photo" && !editing.mediaUrl && !editing.thumbnailUrl) {
      toast.error("Please upload or provide a photo image URL");
      return;
    }

    if (editing.type === "video" && !editing.videoLink && !editing.mediaUrl) {
      toast.error("Please provide a video link or upload a video file");
      return;
    }

    // Auto set thumbnail for YouTube if not explicitly set
    const finalItem = { ...editing };
    if (finalItem.type === "video" && finalItem.videoLink && !finalItem.thumbnailUrl) {
      const info = getVideoInfo(finalItem.videoLink);
      if (info.thumbnailUrl) {
        finalItem.thumbnailUrl = info.thumbnailUrl;
      }
    }

    setSaving(true);
    const ok = await saveGalleryItem(finalItem, isNew);
    setSaving(false);
    if (ok) {
      toast.success(isNew ? "Gallery media added successfully!" : "Gallery item updated successfully!");
      setEditing(null);
    } else {
      toast.error("Failed to save gallery item");
    }
  };

  const handleDelete = async () => {
    if (!confirmId) return;
    setDeleting(true);
    const ok = await deleteGalleryItem(confirmId);
    setDeleting(false);
    if (ok) {
      toast.success("Gallery item deleted");
      setConfirmId(null);
    } else {
      toast.error("Failed to delete gallery item");
    }
  };

  return (
    <AdminPage
      title="Photo & Video Gallery"
      subtitle="Manage visual media, factory tours, field trials, and product demonstration videos."
      action={
        <Btn onClick={handleOpenNew}>
          <span className="inline-flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add Media
          </span>
        </Btn>
      }
    >
      {/* Top Stats Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Media</span>
            <Layers className="h-4 w-4 text-primary" />
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-foreground">{(state.gallery || []).length}</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Photos</span>
            <ImageIcon className="h-4 w-4 text-blue-600" />
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-blue-600">{photoCount}</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Videos</span>
            <Video className="h-4 w-4 text-amber-600" />
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-amber-600">{videoCount}</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Active</span>
            <Sparkles className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-emerald-600">{activeCount}</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-2xs md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, description or category..."
            className="w-full rounded-xl border border-border bg-background py-2 pl-9.5 pr-4 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Type Filter */}
          <div className="flex rounded-xl border border-border bg-muted/40 p-1">
            <button
              onClick={() => setTypeFilter("all")}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                typeFilter === "all" ? "bg-card text-foreground shadow-2xs" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setTypeFilter("photo")}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                typeFilter === "photo" ? "bg-card text-foreground shadow-2xs" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Photos
            </button>
            <button
              onClick={() => setTypeFilter("video")}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                typeFilter === "video" ? "bg-card text-foreground shadow-2xs" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Videos
            </button>
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground outline-none"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground outline-none"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Gallery Table */}
      <TableWrap>
        <thead className="border-b border-border bg-muted/50">
          <tr>
            <th className={th}>Media</th>
            <th className={th}>Type</th>
            <th className={th}>Category</th>
            <th className={th}>Status</th>
            <th className={th}>Featured</th>
            <th className={th}>Date</th>
            <th className={th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.length === 0 ? (
            <tr>
              <td colSpan={7} className="p-8 text-center text-muted-foreground text-sm">
                No gallery media found. Click &quot;Add Media&quot; to upload your first photo or video.
              </td>
            </tr>
          ) : (
            filteredItems.map((item) => {
              const displayThumb = item.thumbnailUrl || item.mediaUrl || (item.videoLink ? getVideoInfo(item.videoLink).thumbnailUrl : "");
              const isVid = item.type === "video";

              return (
                <tr key={item.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                  <td className={`${td} max-w-xs font-semibold`}>
                    <div className="flex items-center gap-3">
                      <div
                        onClick={() => setPreviewItem(item)}
                        className="relative h-12 w-16 shrink-0 cursor-pointer overflow-hidden rounded-lg border border-border bg-muted/30 group"
                      >
                        {displayThumb ? (
                          <img
                            src={displayThumb}
                            alt={item.title}
                            className="h-full w-full object-cover transition-transform group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                            {isVid ? <Video className="h-5 w-5" /> : <ImageIcon className="h-5 w-5" />}
                          </div>
                        )}
                        {isVid && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                            <Play className="h-4 w-4 fill-white text-white drop-shadow-sm" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p
                          onClick={() => setPreviewItem(item)}
                          className="font-bold text-foreground line-clamp-1 cursor-pointer hover:text-primary transition-colors"
                        >
                          {item.title}
                        </p>
                        {item.description && (
                          <p className="text-xs text-muted-foreground line-clamp-1">{item.description}</p>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className={td}>
                    {isVid ? (
                      <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-700 dark:text-amber-400">
                        <Video className="h-3 w-3" /> Video
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-md bg-blue-500/10 px-2 py-0.5 text-xs font-semibold text-blue-700 dark:text-blue-400">
                        <ImageIcon className="h-3 w-3" /> Photo
                      </span>
                    )}
                  </td>

                  <td className={td}>
                    <span className="rounded-md bg-secondary/10 px-2 py-0.5 text-xs font-semibold text-secondary">
                      {item.category || "General"}
                    </span>
                  </td>

                  <td className={td}>
                    <button
                      onClick={() =>
                        saveGalleryItem(
                          { ...item, status: item.status === "Draft" ? "Active" : "Draft" },
                          false
                        )
                      }
                      className={`rounded-full px-2.5 py-0.5 text-xs font-bold transition-all ${
                        item.status === "Draft"
                          ? "bg-muted text-muted-foreground hover:bg-muted/80"
                          : "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/25"
                      }`}
                    >
                      {item.status || "Active"}
                    </button>
                  </td>

                  <td className={td}>
                    <button
                      onClick={() => saveGalleryItem({ ...item, featured: !item.featured }, false)}
                      className={`rounded-lg border border-border p-1.5 transition-colors ${
                        item.featured ? "text-amber-500 bg-amber-50 dark:bg-amber-950/40" : "text-muted-foreground hover:text-foreground"
                      }`}
                      title="Toggle Featured"
                    >
                      <Star className={`h-4 w-4 ${item.featured ? "fill-amber-500" : ""}`} />
                    </button>
                  </td>

                  <td className={td}>{item.date || "—"}</td>

                  <td className={td}>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setPreviewItem(item)}
                        className="rounded-lg border border-border p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                        title="View / Play"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="rounded-lg border border-border p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                        title="Edit Item"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setConfirmId(item.id)}
                        className="rounded-lg border border-destructive/30 p-1.5 text-destructive hover:bg-destructive/10 transition-colors"
                        title="Delete Item"
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

      {/* Add / Edit Media Modal */}
      {editing && (
        <Modal
          open={Boolean(editing)}
          onClose={() => setEditing(null)}
          title={isNew ? "Add Media to Gallery" : "Edit Gallery Media"}
          wide
        >
          <div className="space-y-4 max-h-[75vh] overflow-y-auto p-4 sm:p-6">
            {/* Title / Name */}
            <Field label="Name / Title *">
              <input
                type="text"
                value={editing.title}
                onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                placeholder="e.g., Bio NPK Field Trials in Solapur or Factory Tour Video"
                className={inputCls}
              />
            </Field>

            {/* Media Type Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Media Type *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setEditing({ ...editing, type: "photo" })}
                  className={`flex items-center justify-center gap-2 rounded-xl border p-3 font-semibold transition-all ${
                    editing.type === "photo"
                      ? "border-primary bg-primary/10 text-primary shadow-xs font-bold"
                      : "border-border bg-card text-muted-foreground hover:bg-muted/30"
                  }`}
                >
                  <ImageIcon className="h-4 w-4" /> Photo / Image
                </button>
                <button
                  type="button"
                  onClick={() => setEditing({ ...editing, type: "video" })}
                  className={`flex items-center justify-center gap-2 rounded-xl border p-3 font-semibold transition-all ${
                    editing.type === "video"
                      ? "border-amber-600 bg-amber-500/10 text-amber-700 dark:text-amber-400 shadow-xs font-bold"
                      : "border-border bg-card text-muted-foreground hover:bg-muted/30"
                  }`}
                >
                  <Video className="h-4 w-4" /> Video Player
                </button>
              </div>
            </div>

            {/* If Type === Photo */}
            {editing.type === "photo" && (
              <div className="space-y-3 rounded-2xl border border-border bg-muted/10 p-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Upload Photo</h4>
                <MediaUploader
                  value={editing.mediaUrl || ""}
                  onChange={(url) => setEditing({ ...editing, mediaUrl: url, thumbnailUrl: url })}
                  accept="image"
                  label="Upload Photo File"
                  placeholder="Click or drag to upload photo (PNG, JPG, WEBP)"
                />
                <Field label="Or Direct Photo URL">
                  <input
                    type="text"
                    value={editing.mediaUrl || ""}
                    onChange={(e) => setEditing({ ...editing, mediaUrl: e.target.value, thumbnailUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className={inputCls}
                  />
                </Field>
              </div>
            )}

            {/* If Type === Video */}
            {editing.type === "video" && (
              <div className="space-y-4 rounded-2xl border border-border bg-muted/10 p-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Video Source</h4>
                  <div className="flex rounded-lg border border-border bg-card p-0.5">
                    <button
                      type="button"
                      onClick={() => setVideoMode("link")}
                      className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${
                        videoMode === "link" ? "bg-primary text-white shadow-2xs" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Video Link (YouTube / Vimeo / URL)
                    </button>
                    <button
                      type="button"
                      onClick={() => setVideoMode("upload")}
                      className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${
                        videoMode === "upload" ? "bg-primary text-white shadow-2xs" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Upload Video File
                    </button>
                  </div>
                </div>

                {videoMode === "link" ? (
                  <div className="space-y-3">
                    <Field label="Video Link (YouTube, Vimeo, or MP4 URL) *">
                      <input
                        type="text"
                        value={editing.videoLink || ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          const info = getVideoInfo(val);
                          setEditing({
                            ...editing,
                            videoLink: val,
                            thumbnailUrl: editing.thumbnailUrl || info.thumbnailUrl,
                          });
                        }}
                        placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                        className={inputCls}
                      />
                    </Field>
                    <p className="text-[11px] text-muted-foreground">
                      Paste YouTube, Vimeo, or direct MP4 link. YouTube thumbnails will be detected automatically.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <MediaUploader
                      value={editing.mediaUrl || ""}
                      onChange={(url) => setEditing({ ...editing, mediaUrl: url, videoLink: url })}
                      accept="video"
                      label="Upload Video File (MP4, WebM)"
                      placeholder="Click or drag to upload video file"
                    />
                    <Field label="Or Direct Video File URL">
                      <input
                        type="text"
                        value={editing.mediaUrl || ""}
                        onChange={(e) => setEditing({ ...editing, mediaUrl: e.target.value, videoLink: e.target.value })}
                        placeholder="https://res.cloudinary.com/.../video.mp4"
                        className={inputCls}
                      />
                    </Field>
                  </div>
                )}

                {/* Custom Thumbnail for Video */}
                <div className="pt-2 border-t border-border/60">
                  <Field label="Custom Video Cover / Thumbnail (Optional)">
                    <MediaUploader
                      value={editing.thumbnailUrl || ""}
                      onChange={(url) => setEditing({ ...editing, thumbnailUrl: url })}
                      accept="image"
                      label="Thumbnail Image"
                      placeholder="Upload custom cover photo for this video"
                    />
                  </Field>
                </div>
              </div>
            )}

            {/* Category & Date */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Category">
                <select
                  value={editing.category || "General"}
                  onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                  className={inputCls}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Date">
                <input
                  type="date"
                  value={editing.date || new Date().toISOString().slice(0, 10)}
                  onChange={(e) => setEditing({ ...editing, date: e.target.value })}
                  className={inputCls}
                />
              </Field>
            </div>

            {/* Description */}
            <Field label="Description">
              <textarea
                value={editing.description || ""}
                onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                rows={3}
                placeholder="Detailed description of what is shown in this photo or video..."
                className={inputCls}
              />
            </Field>

            {/* Status & Featured */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border p-3.5 bg-muted/20">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={editing.featured || false}
                  onChange={(e) => setEditing({ ...editing, featured: e.target.checked })}
                  className="h-4 w-4 rounded text-primary focus:ring-primary"
                />
                <span className="text-xs font-bold text-foreground">Featured on Homepage / Highlights</span>
              </label>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-muted-foreground">Status:</span>
                <select
                  value={editing.status || "Active"}
                  onChange={(e) => setEditing({ ...editing, status: e.target.value as "Active" | "Draft" })}
                  className="rounded-lg border border-border bg-card px-2.5 py-1 text-xs font-bold text-foreground outline-none"
                >
                  <option value="Active">Active</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                Cancel
              </button>
              <Btn onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : isNew ? "Add Media" : "Save Changes"}
              </Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* Media Preview & Play Modal */}
      {previewItem && (
        <Modal
          open={Boolean(previewItem)}
          onClose={() => setPreviewItem(null)}
          title={previewItem.title}
          wide
        >
          <div className="space-y-4 p-4 sm:p-6">
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black flex items-center justify-center">
              {previewItem.type === "video" ? (
                (() => {
                  const targetVideo = previewItem.videoLink || previewItem.mediaUrl || "";
                  const info = getVideoInfo(targetVideo);

                  if (info.type === "youtube" || info.type === "vimeo") {
                    return (
                      <iframe
                        src={info.embedUrl}
                        title={previewItem.title}
                        className="h-full w-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    );
                  }

                  return (
                    <video
                      src={info.embedUrl}
                      controls
                      autoPlay
                      className="h-full w-full object-contain"
                    />
                  );
                })()
              ) : (
                <img
                  src={previewItem.mediaUrl || previewItem.thumbnailUrl}
                  alt={previewItem.title}
                  className="h-full w-full object-contain"
                />
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                  {previewItem.category || "General"}
                </span>
                <span className="text-xs text-muted-foreground">{previewItem.date}</span>
              </div>
              <h3 className="font-display text-lg font-bold text-foreground">{previewItem.title}</h3>
              {previewItem.description && (
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {previewItem.description}
                </p>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
              <button
                onClick={() => {
                  const target = previewItem;
                  setPreviewItem(null);
                  handleOpenEdit(target);
                }}
                className="rounded-xl border border-border px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors inline-flex items-center gap-1.5"
              >
                <Pencil className="h-3.5 w-3.5" /> Edit
              </button>
              <button
                onClick={() => setPreviewItem(null)}
                className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary/90 transition-colors"
              >
                Close Preview
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {confirmId && (
        <Modal
          open={Boolean(confirmId)}
          onClose={() => setConfirmId(null)}
          title="Delete Gallery Media"
        >
          <div className="space-y-4 p-4 sm:p-6">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete this media from the gallery? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmId(null)}
                className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-xl bg-destructive px-4 py-2 text-xs font-semibold text-white hover:bg-destructive/90 transition-colors"
              >
                {deleting ? "Deleting..." : "Delete Media"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </AdminPage>
  );
}
