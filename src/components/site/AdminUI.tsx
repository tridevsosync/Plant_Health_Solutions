"use client";

import * as React from "react";

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
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

export function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-border bg-card p-4 shadow-sm md:p-5 ${className}`}>{children}</div>
  );
}

export function TableWrap({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
      <table className="w-full min-w-[720px] text-left text-sm">{children}</table>
    </div>
  );
}

export const th = "px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground";
export const td = "px-4 py-3 align-middle";

export const inputCls =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary";

export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-1.5 text-sm">
      <span className="font-medium text-foreground">{label}</span>
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
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-foreground/50 p-4 py-10">
      <div className={`w-full ${wide ? "max-w-3xl" : "max-w-lg"} rounded-2xl border border-border bg-card p-5 shadow-xl`}>
        <div className="mb-4 flex items-center justify-between gap-4">
          <h3 className="font-display text-lg font-bold text-foreground">{title}</h3>
          <button onClick={onClose} className="rounded-full border border-border px-3 py-1 text-sm">
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Btn({
  children,
  onClick,
  variant = "primary",
  type = "button",
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "danger";
  type?: "button" | "submit";
  className?: string;
}) {
  const styles =
    variant === "primary"
      ? "bg-primary text-primary-foreground hover:bg-secondary"
      : variant === "danger"
        ? "bg-destructive text-destructive-foreground hover:opacity-90"
        : "border border-border bg-background text-foreground hover:bg-muted";
  return (
    <button type={type} onClick={onClick} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${styles} ${className}`}>
      {children}
    </button>
  );
}

const statusTone: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-800",
  Processing: "bg-blue-100 text-blue-800",
  Shipped: "bg-indigo-100 text-indigo-800",
  Delivered: "bg-emerald-100 text-emerald-800",
  Cancelled: "bg-rose-100 text-rose-800",
  New: "bg-amber-100 text-amber-800",
  Answered: "bg-emerald-100 text-emerald-800",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${statusTone[status] ?? "bg-muted text-foreground"}`}>
      {status}
    </span>
  );
}
