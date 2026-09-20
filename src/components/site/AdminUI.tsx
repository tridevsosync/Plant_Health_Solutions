"use client";

import * as React from "react";
import { X } from "lucide-react";

export function AdminPage({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6 min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">{title}</h1>
          {subtitle && <p className="mt-1 text-xs sm:text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      {children}
    </div>
  );
}

export function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-border bg-card p-4 shadow-xs sm:p-5 min-w-0 ${className}`}>
      {children}
    </div>
  );
}

export function TableWrap({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-border bg-card shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm divide-y divide-border">{children}</table>
      </div>
    </div>
  );
}

export const th = "px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground bg-muted/40";
export const td = "px-4 py-3.5 align-middle text-sm text-foreground";

export const inputCls =
  "w-full min-w-0 rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50";

export function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`flex flex-col gap-1.5 text-sm min-w-0 w-full ${className}`}>
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

export function Modal({
  open,
  onClose,
  title,
  children,
  wide,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 backdrop-blur-xs p-3.5 sm:p-6 animate-in fade-in duration-200">
      <div
        className={`relative w-full ${
          wide ? "max-w-2xl lg:max-w-3xl" : "max-w-md sm:max-w-lg"
        } my-auto flex max-h-[90vh] flex-col rounded-3xl border border-border bg-card shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4 sm:px-6">
          <h3 className="font-display text-lg sm:text-xl font-bold text-foreground truncate pr-2">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            title="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-5 sm:p-6 min-w-0 flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}

export function Btn({
  children,
  onClick,
  variant = "primary",
  type = "button",
  disabled = false,
  className = "",
}: {
  children: React.ReactNode;
  onClick?: (() => void) | (() => Promise<void>);
  variant?: "primary" | "ghost" | "danger" | "secondary";
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
}) {
  const styles =
    variant === "primary"
      ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs active:scale-[0.98]"
      : variant === "danger"
        ? "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-xs active:scale-[0.98]"
        : variant === "secondary"
          ? "bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-xs active:scale-[0.98]"
          : "border border-border bg-background text-foreground hover:bg-muted active:scale-[0.98]";
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${styles} ${className}`}
    >
      {children}
    </button>
  );
}

const statusTone: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-800 border-amber-200",
  Processing: "bg-blue-100 text-blue-800 border-blue-200",
  Shipped: "bg-indigo-100 text-indigo-800 border-indigo-200",
  Delivered: "bg-emerald-100 text-emerald-800 border-emerald-200",
  Cancelled: "bg-rose-100 text-rose-800 border-rose-200",
  New: "bg-amber-100 text-amber-800 border-amber-200",
  Answered: "bg-emerald-100 text-emerald-800 border-emerald-200",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
        statusTone[status] ?? "bg-muted text-foreground border-border"
      }`}
    >
      {status}
    </span>
  );
}
