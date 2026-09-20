"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  CheckCircle2,
  Printer,
  Truck,
  Package,
  Clock,
  ShieldCheck,
  Phone,
  MessageCircle,
  ArrowLeft,
  MapPin,
  Calendar,
  CreditCard,
  Building2,
  FileText,
  BadgeCheck,
} from "lucide-react";
import { inr, useApp } from "@/lib/store";
import { PageHero } from "@/components/site/Section";

const trackingStages = [
  {
    step: 1,
    title: "Order Confirmed",
    desc: "Payment verified & order logged",
    key: "Pending",
  },
  {
    step: 2,
    title: "Quality Check & Packing",
    desc: "Tested at Tidagundi research lab",
    key: "Processing",
  },
  {
    step: 3,
    title: "Dispatched & In Transit",
    desc: "Handed to courier logistics",
    key: "Shipped",
  },
  {
    step: 4,
    title: "Delivered to Farm",
    desc: "Safely received by farmer",
    key: "Delivered",
  },
];

export default function OrderInvoicePage() {
  const params = useParams();
  const id = (params?.id as string) ?? "";
  const { state } = useApp();
  const order = state.orders.find((o) => o.id === id);

  if (!order) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <Package className="mx-auto h-16 w-16 text-muted-foreground/50 mb-3" />
        <h1 className="font-display text-2xl font-bold text-primary">Order Not Found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          We could not locate order <strong>#{id}</strong> in the database.
        </p>
        <Link
          href="/account?tab=orders"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground hover:bg-secondary transition-all"
        >
          <ArrowLeft className="h-4 w-4" /> View My Orders
        </Link>
      </div>
    );
  }

  // Calculate tracking progress stage (1 to 4)
  const currentStage =
    order.status === "Delivered"
      ? 4
      : order.status === "Shipped"
      ? 3
      : order.status === "Processing"
      ? 2
      : 1;

  const cgst = Math.round(order.tax / 2);
  const sgst = order.tax - cgst;
  const isPaid = order.paymentStatus === "Paid" || !order.payment.toLowerCase().includes("cash");

  const supportMsg = `Hello Plant Health Solutions, I need help with my Order #${order.id} placed on ${order.date}.`;

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Hide hero on print */}
      <div className="print:hidden">
        <PageHero
          title="Tax Invoice & Order Tracking"
          subtitle={`Official tax invoice and live consignment status for Order #${order.id}`}
          image="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1920&q=80"
        />
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        {/* Navigation & Action Bar (Hidden in Print) */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 print:hidden">
          <Link
            href="/account?tab=orders"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to My Orders &amp; Tracking
          </Link>

          <div className="flex flex-wrap items-center gap-2.5">
            <a
              href={`https://wa.me/${(state.settings.whatsapp || state.settings.phone || "919175955009").replace(/[^0-9]/g, "")}?text=${encodeURIComponent(supportMsg)}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition-all"
            >
              <MessageCircle className="h-4 w-4 text-emerald-600" /> WhatsApp Support
            </a>

            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-xs font-bold text-primary-foreground shadow-sm hover:bg-secondary transition-all"
            >
              <Printer className="h-4 w-4" /> Print / Download PDF
            </button>
          </div>
        </div>

        {/* Live Tracking Progress Card */}
        <div className="mb-8 rounded-3xl border border-border bg-card p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-4">
            <div>
              <h2 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
                <Truck className="h-5 w-5 text-primary" /> Live Consignment Tracking
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Courier: <strong>{order.courier || "VRL Logistics / DTDC Express"}</strong> · Tracking ID:{" "}
                <span className="font-mono font-bold text-foreground">
                  {order.trackingNumber || `PHS-TRK-${order.id.slice(-6)}`}
                </span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold flex items-center gap-1.5 ${
                  order.status === "Delivered"
                    ? "bg-emerald-500/15 text-emerald-700 border border-emerald-500/30"
                    : order.status === "Shipped"
                    ? "bg-blue-500/15 text-blue-700 border border-blue-500/30"
                    : order.status === "Cancelled"
                    ? "bg-red-500/15 text-red-700 border border-red-500/30"
                    : "bg-amber-500/15 text-amber-700 border border-amber-500/30"
                }`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                Status: {order.status}
              </span>
            </div>
          </div>

          {/* Tracking Step Timeline */}
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {trackingStages.map((st) => {
              const isCompleted = st.step <= currentStage;
              const isCurrent = st.step === currentStage;

              return (
                <div key={st.step} className="flex flex-col items-center text-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-2xl text-xs font-bold transition-all ${
                      isCompleted
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-muted text-muted-foreground border border-border"
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : st.step}
                  </div>
                  <p
                    className={`mt-2.5 text-xs font-bold ${
                      isCurrent ? "text-primary font-extrabold" : "text-foreground"
                    }`}
                  >
                    {st.title}
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground leading-tight">{st.desc}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-5 rounded-2xl bg-muted/50 p-3 text-xs text-muted-foreground flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-primary" /> Estimated Delivery:{" "}
              <strong className="text-foreground">{order.estimatedDelivery || "3 - 5 business days"}</strong>
            </span>
            <span>Dispatch Center: Tidagundi, Vijayapura</span>
          </div>
        </div>

        {/* Official Printable Tax Invoice Sheet */}
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-10 shadow-sm print:border-0 print:p-0 print:shadow-none">
          {/* Invoice Header */}
          <div className="flex flex-wrap items-start justify-between gap-6 border-b border-border pb-6">
            <div className="flex items-start gap-3.5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white p-1.5 shadow-xs border border-border">
                <img src="/logo.png" alt="PHS" className="h-full w-full object-contain" />
              </div>
              <div>
                <h1 className="font-display text-xl sm:text-2xl font-bold text-primary leading-tight">
                  {state.settings.name || "Plant Health Solutions Pvt. Ltd."}
                </h1>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Agricultural Research &amp; Bio Inputs Manufacturer
                </p>
                <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                  {state.settings.address ||
                    "Horticulture Research & Extension Center, NH-52, Tidagundi, Vijayapura, Karnataka 586119"}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Phone: {state.settings.phone || "+91 91759 55009"} · Email:{" "}
                  {state.settings.email1 || "planthealthsol@gmail.com"}
                </p>
                <p className="text-xs font-bold text-foreground mt-1">
                  GSTIN: {state.settings.gst || "29AAGCP1234F1Z5"}
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-xs font-extrabold text-primary uppercase tracking-wider">
                TAX INVOICE
              </span>
              <p className="mt-2 font-mono text-sm font-bold text-foreground">#{order.id}</p>
              <p className="text-xs text-muted-foreground flex items-center justify-end gap-1 mt-0.5">
                <Calendar className="h-3.5 w-3.5" /> Date: {order.date}
              </p>
              <div className="mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold bg-emerald-500/15 text-emerald-700">
                <BadgeCheck className="h-3.5 w-3.5" /> {isPaid ? "Payment Verified" : "Payment Pending"}
              </div>
            </div>
          </div>

          {/* Bill To & Payment Metadata */}
          <div className="mt-6 grid gap-6 sm:grid-cols-2 border-b border-border pb-6 text-xs sm:text-sm">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-1.5">
                <MapPin className="h-3.5 w-3.5 text-primary" /> Billed &amp; Delivered To:
              </span>
              <p className="font-bold text-foreground text-sm">{order.customer}</p>
              <p className="text-muted-foreground mt-0.5">Phone: {order.phone}</p>
              <p className="text-muted-foreground">Email: {order.email}</p>
              <p className="text-muted-foreground mt-1 leading-relaxed">{order.address}</p>
            </div>

            <div className="sm:text-right">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex sm:justify-end items-center gap-1.5 mb-1.5">
                <CreditCard className="h-3.5 w-3.5 text-primary" /> Payment &amp; Gateways:
              </span>
              <p className="font-bold text-foreground">Method: {order.payment}</p>
              {order.paymentId && (
                <p className="font-mono text-xs text-muted-foreground mt-0.5">
                  Ref/ID: {order.paymentId}
                </p>
              )}
              <p className="text-muted-foreground mt-0.5">Payment Status: {order.paymentStatus || "Paid"}</p>
              <p className="text-muted-foreground mt-0.5">Dispatched via: {order.courier || "VRL Logistics"}</p>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-border text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  <th className="pb-3">S.No</th>
                  <th className="pb-3">Product Description</th>
                  <th className="pb-3">HSN Code</th>
                  <th className="pb-3 text-center">Qty</th>
                  <th className="pb-3 text-right">Unit Rate</th>
                  <th className="pb-3 text-right">Total (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {order.items.map((item, idx) => (
                  <tr key={item.id} className="py-3">
                    <td className="py-3.5 text-muted-foreground font-mono">{idx + 1}</td>
                    <td className="py-3.5">
                      <div className="flex items-center gap-2.5">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-9 w-9 rounded-lg object-cover print:hidden"
                          />
                        )}
                        <div>
                          <p className="font-bold text-foreground">{item.name}</p>
                          {item.unit && <p className="text-[11px] text-muted-foreground">{item.unit}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 text-muted-foreground font-mono text-xs">31010099</td>
                    <td className="py-3.5 text-center font-semibold text-foreground">{item.qty}</td>
                    <td className="py-3.5 text-right text-muted-foreground">{inr(item.price)}</td>
                    <td className="py-3.5 text-right font-bold text-foreground">
                      {inr(item.price * item.qty)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Financial Calculation Breakdown */}
          <div className="mt-6 border-t border-border pt-4">
            <div className="ml-auto w-full max-w-sm space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Taxable Subtotal:</span>
                <span className="font-semibold text-foreground">{inr(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-secondary">
                  <span>Coupon Discount Applied:</span>
                  <span className="font-semibold">- {inr(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-muted-foreground">
                <span>Doorstep Delivery / Freight:</span>
                <span className="font-semibold text-foreground">
                  {order.shipping ? inr(order.shipping) : "Free (Threshold reached)"}
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground text-xs">
                <span>CGST (2.5%):</span>
                <span>{inr(cgst)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground text-xs">
                <span>SGST (2.5%):</span>
                <span>{inr(sgst)}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-2.5 font-display text-base sm:text-lg font-bold text-primary">
                <span>Total Invoice Value:</span>
                <span>{inr(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Authorized Signature & Terms */}
          <div className="mt-10 pt-6 border-t border-border grid gap-6 sm:grid-cols-2 text-xs text-muted-foreground">
            <div>
              <p className="font-bold text-foreground mb-1">Terms &amp; Certification:</p>
              <ul className="list-disc list-inside space-y-0.5 text-[11px] leading-relaxed">
                <li>Formulated &amp; tested at Plant Health Solutions Tidagundi lab.</li>
                <li>Certified organic inputs compatible with standard fertigation.</li>
                <li>Store products in a cool, dry place away from direct sunlight.</li>
              </ul>
            </div>

            <div className="sm:text-right flex flex-col justify-end items-start sm:items-end">
              <div className="h-12 w-32 border-b border-dashed border-border mb-1 flex items-center justify-center text-[10px] text-muted-foreground">
                [ Authorized Stamp &amp; Sign ]
              </div>
              <p className="font-bold text-foreground">For Plant Health Solutions Pvt. Ltd.</p>
              <p className="text-[11px] text-muted-foreground">Managing Director / Quality Head</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
