"use client";

import * as React from "react";
import { UploadCloud, Image as ImageIcon, Video, Loader2, X, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface MediaUploaderProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
  accept?: "image" | "video" | "both";
  placeholder?: string;
}

export function MediaUploader({
  value,
  onChange,
  folder = "plant_health_solutions/gallery",
  label = "Upload Media",
  accept = "both",
  placeholder = "Drag & drop file here or click to browse",
}: MediaUploaderProps) {
  const [uploading, setUploading] = React.useState(false);
  const [dragOver, setDragOver] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const isVideo =
    value?.match(/\.(mp4|webm|ogg|mov)$/i) ||
    value?.includes("/video/upload/") ||
    value?.includes("video");

  const acceptedTypes =
    accept === "image"
      ? "image/*"
      : accept === "video"
      ? "video/*"
      : "image/*,video/*";

  const handleUpload = async (file: File) => {
    if (accept === "image" && !file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file (PNG, JPG, WEBP, etc.)");
      return;
    }
    if (accept === "video" && !file.type.startsWith("video/")) {
      toast.error("Please upload a valid video file (MP4, WEBM, MOV, etc.)");
      return;
    }
    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      toast.error("Please upload a valid image or video file");
      return;
    }

    // Max 50MB for video, 15MB for images
    const maxSize = file.type.startsWith("video/") ? 50 * 1024 * 1024 : 15 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error(`File size exceeds limit (${file.type.startsWith("video/") ? "50MB" : "15MB"})`);
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to upload to Cloudinary");
      }

      onChange(data.url);
      toast.success(file.type.startsWith("video/") ? "Video uploaded successfully!" : "Image uploaded successfully!");
    } catch (err: unknown) {
      console.error("Upload error:", err);
      const msg = err instanceof Error ? err.message : "Media upload failed";
      toast.error(msg);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleUpload(file);
  };

  return (
    <div className="space-y-2 w-full min-w-0">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </label>
        {value && (
          <span className="inline-flex items-center gap-1 text-xs text-primary font-medium">
            <CheckCircle2 className="h-3.5 w-3.5" /> Uploaded
          </span>
        )}
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-4 transition-all duration-200 min-w-0 w-full overflow-hidden ${
          dragOver
            ? "border-primary bg-primary/5"
            : "border-border bg-muted/20 hover:border-primary/50 hover:bg-muted/30"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes}
          onChange={handleFileChange}
          className="hidden"
          disabled={uploading}
        />

        {value ? (
          <div className="relative group w-full flex flex-col items-center">
            <div className="relative w-full max-h-56 rounded-xl overflow-hidden border border-border bg-black/5 flex items-center justify-center">
              {isVideo ? (
                <video src={value} controls className="max-h-56 w-full rounded-xl object-contain" />
              ) : (
                <img
                  src={value}
                  alt="Uploaded preview"
                  className="max-h-56 w-full object-contain rounded-xl"
                />
              )}
            </div>

            <div className="mt-2.5 flex items-center justify-between w-full px-1">
              <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                {value}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="rounded-lg bg-muted px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-muted/80 transition-colors"
                >
                  Change
                </button>
                <button
                  type="button"
                  onClick={() => onChange("")}
                  className="rounded-lg bg-destructive/10 p-1 text-destructive hover:bg-destructive/20 transition-colors"
                  title="Remove"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center cursor-pointer py-4 text-center px-4 w-full"
          >
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              {uploading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : accept === "video" ? (
                <Video className="h-6 w-6" />
              ) : accept === "image" ? (
                <ImageIcon className="h-6 w-6" />
              ) : (
                <UploadCloud className="h-6 w-6" />
              )}
            </div>
            <p className="text-xs font-semibold text-foreground">
              {uploading ? "Uploading to Cloudinary..." : placeholder}
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              {accept === "video"
                ? "MP4, WebM, MOV up to 50MB"
                : accept === "image"
                ? "PNG, JPG, WebP, SVG up to 15MB"
                : "Images (JPG, PNG, WebP) or Videos (MP4, WebM)"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
