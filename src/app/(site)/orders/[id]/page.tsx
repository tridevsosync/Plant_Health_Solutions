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
  MessageCircle,
  ArrowLeft,
  Calendar,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { PageHero } from "@/components/site/Section";
import { TaxInvoice } from "@/components/site/TaxInvoice";

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
        <h1 className="font-display text-2xl font-bold text-primary">
          Order Not Found
        </h1>
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
              href={`https://wa.me/${(
                state.settings.whatsapp ||
                state.settings.phone ||
                "919175955009"
              ).replace(/[^0-9]/g, "")}?text=${encodeURIComponent(supportMsg)}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition-all"
            >
              <MessageCircle className="h-4 w-4 text-emerald-600" /> WhatsApp Support
            </a>

            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-xs font-bold text-primary-foreground shadow-xs hover:bg-secondary transition-all"
            >
              <Printer className="h-4 w-4" /> Print / Save as PDF
            </button>
          </div>
        </div>

        {/* Live Tracking Progress Card (Hidden in Print to ensure clean single-page invoice) */}
        <div className="mb-8 rounded-3xl border border-border bg-card p-6 shadow-xs print:hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-4">
            <div>
              <h2 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
                <Truck className="h-5 w-5 text-primary" /> Live Consignment Tracking
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Courier:{" "}
                <strong>{order.courier || "VRL Logistics / DTDC Express"}</strong> · Tracking ID:{" "}
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
                        ? "bg-primary text-primary-foreground shadow-xs"
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
                  <p className="mt-0.5 text-[11px] text-muted-foreground leading-tight">
                    {st.desc}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-5 rounded-2xl bg-muted/50 p-3 text-xs text-muted-foreground flex flex-wrap items-center justify-between gap-2">
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-primary" /> Estimated Delivery:{" "}
              <strong className="text-foreground">
                {order.estimatedDelivery || "3 - 5 business days"}
              </strong>
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-primary" /> Placed on: {order.date}
            </span>
            <span>Dispatch Center: Tidagundi, Vijayapura</span>
          </div>
        </div>

        {/* Official Printable Tax Invoice Sheet */}
        <TaxInvoice order={order} settings={state.settings} />
      </div>
    </div>
  );
}
