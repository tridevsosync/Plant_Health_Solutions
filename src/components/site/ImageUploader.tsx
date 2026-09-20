"use client";

import * as React from "react";
import { UploadCloud, Image as ImageIcon, Loader2, X, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
}

export function ImageUploader({
  value,
  onChange,
  folder = "plant_health_solutions",
  label = "Image",
}: ImageUploaderProps) {
  const [uploading, setUploading] = React.useState(false);
  const [dragOver, setDragOver] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file (PNG, JPG, WEBP, etc.)");
      return;
    }

    // Limit to 10MB
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image file size should be less than 10MB");
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
      toast.success("Image uploaded to Cloudinary successfully!");
    } catch (err: unknown) {
      console.error("Upload error:", err);
      const msg = err instanceof Error ? err.message : "Image upload failed";
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
            : "border-border/80 bg-muted/20 hover:border-primary/50"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {value ? (
          <div className="relative group w-full flex flex-col sm:flex-row items-center gap-3 sm:gap-4 min-w-0">
            <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-xl border border-border bg-card shadow-xs">
              <img
                src={value}
                alt="Uploaded preview"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0 w-full text-center sm:text-left">
              <p className="truncate text-xs font-mono text-muted-foreground bg-muted/50 p-1.5 rounded-lg border border-border/50 select-all">
                {value}
              </p>
              <div className="mt-2.5 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors"
                >
                  Change Image
                </button>
                <button
                  type="button"
                  onClick={() => onChange("")}
                  className="rounded-lg bg-destructive/10 px-3 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/20 transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center py-4 cursor-pointer text-center w-full min-w-0"
          >
            {uploading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-xs font-medium text-muted-foreground">
                  Uploading to Cloudinary...
                </p>
              </div>
            ) : (
              <>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary mb-2">
                  <UploadCloud className="h-5 w-5" />
                </div>
                <p className="text-sm font-semibold text-foreground">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  PNG, JPG, WEBP or GIF (max 10MB) to Cloudinary
                </p>
              </>
            )}
          </div>
        )}
      </div>

      <div className="pt-0.5 w-full min-w-0">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Or paste external image URL..."
          className="w-full min-w-0 rounded-xl border border-border bg-background px-3.5 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
        />
      </div>
    </div>
  );
}
