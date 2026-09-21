"use client";

import * as React from "react";
import {
  Printer,
  Download,
  Share2,
  CheckCircle2,
  Building2,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Truck,
  ShieldCheck,
  Calendar,
  FileCheck2,
  BadgeCheck,
} from "lucide-react";
import { toast } from "sonner";
import { inr, useApp, type Settings } from "@/lib/store";
import type { Order } from "@/lib/data";
import { numberToIndianWords, formatTaxInvoiceNo } from "@/lib/utils";

interface TaxInvoiceProps {
  order: Order;
  settings?: Settings;
  showActions?: boolean;
  className?: string;
}

export function TaxInvoice({
  order,
  settings: propSettings,
  showActions = true,
  className = "",
}: TaxInvoiceProps) {
  const { state } = useApp();
  const settings = propSettings || state.settings;

  const invoiceNo = formatTaxInvoiceNo(order.id);
  const isPaid =
    order.paymentStatus === "Paid" ||
    !order.payment.toLowerCase().includes("cash");

  const cgst = Math.round(order.tax / 2);
  const sgst = order.tax - cgst;
  const wordsAmount = numberToIndianWords(order.total);

  const companyName =
    settings.name || "Plant Health Solutions Pvt. Ltd.";
  const companyAddress =
    settings.address ||
    "Horticulture Research & Extension Center, NH-52, Tidagundi, Vijayapura, Karnataka 586119";
  const companyGst = settings.gst || "29AAGCP1234F1Z5";
  const companyPhone = settings.phone || "+91 91759 55009";
  const companyEmail = settings.email1 || "planthealthsol@gmail.com";
  const companyPan = "AAGCP1234F";
  const stateCode = "29 (Karnataka)";

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    const text = `*Tax Invoice - Plant Health Solutions*\nInvoice No: ${invoiceNo}\nOrder ID: #${order.id}\nCustomer: ${order.customer}\nTotal Amount: ${inr(order.total)}\nStatus: ${order.status}\n\nTrack order / View invoice: ${typeof window !== "undefined" ? window.location.href : ""}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  const handleCopyLink = async () => {
    if (typeof window !== "undefined") {
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Invoice link copied to clipboard!");
      } catch {
        toast.error("Could not copy link to clipboard");
      }
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Top Action Bar (Hidden on Print) */}
      {showActions && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4 shadow-xs print:hidden">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <FileCheck2 className="h-4 w-4" />
            </span>
            <div>
              <p className="text-xs font-bold text-foreground">GST Tax Invoice</p>
              <p className="text-[11px] font-mono text-muted-foreground">
                {invoiceNo} · #{order.id}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleCopyLink}
              type="button"
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3.5 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
            >
              <Share2 className="h-3.5 w-3.5" /> Share
            </button>
            <button
              onClick={handleShareWhatsApp}
              type="button"
              className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-50 px-3.5 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 transition-colors"
            >
              WhatsApp
            </button>
            <button
              onClick={handlePrint}
              type="button"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground shadow-xs hover:bg-secondary transition-all"
            >
              <Printer className="h-3.5 w-3.5" /> Print / Save as PDF
            </button>
          </div>
        </div>
      )}

      {/* Main Printable A4 Tax Invoice Sheet */}
      <div className="print-invoice-sheet mx-auto max-w-4xl overflow-hidden rounded-3xl border border-border bg-white text-zinc-900 shadow-md transition-all print:max-w-none print:rounded-none print:border-none print:shadow-none">
        {/* Top Header Bar */}
        <div className="border-b border-zinc-200 bg-zinc-900 px-6 py-3 text-white flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
            <span className="font-bold tracking-wider uppercase">
              Govt. of India GST Compliant Tax Invoice
            </span>
          </div>
          <span className="font-mono text-zinc-300 text-[11px]">
            Original for Recipient / Customer Copy
          </span>
        </div>

        {/* Invoice Company & Details Header */}
        <div className="p-6 sm:p-8">
          <div className="grid gap-6 border-b border-zinc-200 pb-6 md:grid-cols-12">
            {/* Left: Supplier / Seller Info */}
            <div className="md:col-span-7 space-y-2">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-white p-1 shadow-2xs">
                  <img
                    src="/logo.png"
                    alt="Plant Health Solutions"
                    className="h-full w-full object-contain"
                  />
                </div>
                <div>
                  <h1 className="font-display text-xl font-bold tracking-tight text-zinc-900 sm:text-2xl">
                    {companyName}
                  </h1>
                  <p className="text-xs font-medium text-emerald-800">
                    Agricultural Research &amp; Bio-Inputs Manufacturing Unit
                  </p>
                </div>
              </div>

              <p className="text-xs text-zinc-600 leading-relaxed max-w-md pt-1">
                {companyAddress}
              </p>

              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-zinc-600 pt-1">
                <p>
                  <span className="font-semibold text-zinc-800">GSTIN:</span>{" "}
                  <span className="font-mono font-bold text-zinc-900">{companyGst}</span>
                </p>
                <p>
                  <span className="font-semibold text-zinc-800">PAN:</span>{" "}
                  <span className="font-mono">{companyPan}</span>
                </p>
                <p>
                  <span className="font-semibold text-zinc-800">State:</span>{" "}
                  {stateCode}
                </p>
                <p>
                  <span className="font-semibold text-zinc-800">Phone:</span>{" "}
                  {companyPhone}
                </p>
                <p className="col-span-2">
                  <span className="font-semibold text-zinc-800">Email:</span>{" "}
                  {companyEmail} · www.planthealthsolutions.in
                </p>
              </div>
            </div>

            {/* Right: Tax Invoice Details */}
            <div className="md:col-span-5 flex flex-col justify-between rounded-2xl border border-zinc-200 bg-zinc-50/80 p-4 text-xs">
              <div className="space-y-2">
                <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800">
                    TAX INVOICE
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      isPaid
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                        : "bg-amber-100 text-amber-800 border border-amber-300"
                    }`}
                  >
                    {isPaid ? "PAID / VERIFIED" : "PAYMENT PENDING"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-y-1.5 pt-1 text-[11px]">
                  <span className="text-zinc-500">Invoice Number:</span>
                  <span className="font-mono font-bold text-zinc-900 text-right">
                    {invoiceNo}
                  </span>

                  <span className="text-zinc-500">Invoice Date:</span>
                  <span className="font-semibold text-zinc-900 text-right">
                    {order.date}
                  </span>

                  <span className="text-zinc-500">Order Ref ID:</span>
                  <span className="font-mono font-bold text-zinc-900 text-right">
                    #{order.id}
                  </span>

                  <span className="text-zinc-500">Place of Supply:</span>
                  <span className="font-semibold text-zinc-900 text-right">
                    Karnataka (29)
                  </span>

                  <span className="text-zinc-500">Reverse Charge:</span>
                  <span className="font-semibold text-zinc-900 text-right">
                    No
                  </span>
                </div>
              </div>

              <div className="mt-3 border-t border-zinc-200 pt-2 text-[10px] text-zinc-500 flex items-center justify-between">
                <span>Dispatch Center: Tidagundi</span>
                <span>Courier: {order.courier || "VRL Express"}</span>
              </div>
            </div>
          </div>

          {/* Party Details (Bill To & Ship To) */}
          <div className="grid gap-6 border-b border-zinc-200 py-5 sm:grid-cols-2 text-xs">
            {/* Bill To */}
            <div className="rounded-xl border border-zinc-200/80 bg-zinc-50/50 p-4 space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                <MapPin className="h-3 w-3" /> Billed To (Buyer / Farmer)
              </span>
              <p className="text-sm font-bold text-zinc-900">{order.customer}</p>
              <p className="text-zinc-600">
                <span className="font-semibold text-zinc-700">Phone:</span> {order.phone}
              </p>
              <p className="text-zinc-600">
                <span className="font-semibold text-zinc-700">Email:</span> {order.email}
              </p>
              <p className="text-zinc-700 font-medium pt-1 leading-relaxed">
                {order.address}
              </p>
            </div>

            {/* Shipped To & Payment Info */}
            <div className="rounded-xl border border-zinc-200/80 bg-zinc-50/50 p-4 space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                <Truck className="h-3 w-3" /> Delivery &amp; Payment Gateway Details
              </span>
              <p className="text-zinc-600">
                <span className="font-semibold text-zinc-700">Payment Mode:</span>{" "}
                <strong className="text-zinc-900">{order.payment}</strong>
              </p>
              {order.paymentId && (
                <p className="text-zinc-600">
                  <span className="font-semibold text-zinc-700">Transaction ID:</span>{" "}
                  <span className="font-mono text-zinc-900">{order.paymentId}</span>
                </p>
              )}
              <p className="text-zinc-600">
                <span className="font-semibold text-zinc-700">Logistics Partner:</span>{" "}
                {order.courier || "VRL Logistics / DTDC Express"}
              </p>
              <p className="text-zinc-600">
                <span className="font-semibold text-zinc-700">Consignment Waybill:</span>{" "}
                <span className="font-mono font-bold text-zinc-900">
                  {order.trackingNumber || `PHS-TRK-${order.id.slice(-6)}`}
                </span>
              </p>
            </div>
          </div>

          {/* Itemized Particulars Table */}
          <div className="py-5">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-zinc-200">
                <thead>
                  <tr className="bg-zinc-100 text-[11px] font-bold text-zinc-700 border-b border-zinc-200">
                    <th className="p-2.5 text-center w-10">#</th>
                    <th className="p-2.5">Description of Goods &amp; Bio Formulations</th>
                    <th className="p-2.5 text-center w-24">HSN Code</th>
                    <th className="p-2.5 text-center w-16">Qty</th>
                    <th className="p-2.5 text-right w-24">Rate (₹)</th>
                    <th className="p-2.5 text-right w-24">Taxable (₹)</th>
                    <th className="p-2.5 text-right w-20">GST (5%)</th>
                    <th className="p-2.5 text-right w-28">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {order.items.map((item, idx) => {
                    const itemTotal = item.price * item.qty;
                    const itemTaxable = Math.round((itemTotal / 1.05) * 100) / 100;
                    const itemGst = Math.round((itemTotal - itemTaxable) * 100) / 100;

                    return (
                      <tr key={item.id || idx} className="hover:bg-zinc-50/50">
                        <td className="p-2.5 text-center font-mono text-zinc-500">
                          {idx + 1}
                        </td>
                        <td className="p-2.5">
                          <p className="font-bold text-zinc-900">{item.name}</p>
                          {item.unit && (
                            <p className="text-[10px] text-zinc-500">
                              Pack size / Volume: {item.unit}
                            </p>
                          )}
                        </td>
                        <td className="p-2.5 text-center font-mono text-zinc-600 text-[11px]">
                          31010099
                        </td>
                        <td className="p-2.5 text-center font-semibold text-zinc-900">
                          {item.qty}
                        </td>
                        <td className="p-2.5 text-right font-mono text-zinc-700">
                          {inr(item.price)}
                        </td>
                        <td className="p-2.5 text-right font-mono text-zinc-700">
                          {inr(itemTaxable)}
                        </td>
                        <td className="p-2.5 text-right font-mono text-zinc-500 text-[11px]">
                          {inr(itemGst)}
                        </td>
                        <td className="p-2.5 text-right font-mono font-bold text-zinc-900">
                          {inr(itemTotal)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Calculations, Amount in Words, and Financial Breakup */}
          <div className="grid gap-6 border-b border-zinc-200 pb-6 md:grid-cols-12 text-xs">
            {/* Amount in words & Bank Info */}
            <div className="md:col-span-7 space-y-4">
              {/* Words Box */}
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                  Total Amount (in words):
                </span>
                <p className="mt-1 font-semibold text-zinc-900 italic leading-relaxed">
                  {wordsAmount}
                </p>
              </div>

              {/* Bank Account Details */}
              <div className="rounded-xl border border-dashed border-zinc-300 p-3.5 space-y-1 text-[11px] text-zinc-600 bg-white">
                <p className="font-bold text-zinc-900 text-xs flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-emerald-700" /> Company Bank Account Details for NEFT/RTGS:
                </p>
                <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 pt-1">
                  <p>
                    <span className="text-zinc-500">Account Name:</span> {companyName}
                  </p>
                  <p>
                    <span className="text-zinc-500">Bank Name:</span> State Bank of India
                  </p>
                  <p>
                    <span className="text-zinc-500">A/C Number:</span>{" "}
                    <span className="font-mono font-semibold text-zinc-800">
                      40928172901
                    </span>
                  </p>
                  <p>
                    <span className="text-zinc-500">IFSC Code:</span>{" "}
                    <span className="font-mono font-semibold text-zinc-800">
                      SBIN0007214
                    </span>
                  </p>
                  <p className="col-span-2">
                    <span className="text-zinc-500">Branch:</span> Tidagundi Agriculture Center, Vijayapura
                  </p>
                </div>
              </div>
            </div>

            {/* Financial Summary Breakdown */}
            <div className="md:col-span-5 flex flex-col justify-between rounded-xl border border-zinc-200 bg-zinc-50 p-4">
              <div className="space-y-2">
                <div className="flex justify-between text-zinc-600">
                  <span>Gross Item Subtotal:</span>
                  <span className="font-mono font-semibold text-zinc-800">
                    {inr(order.subtotal)}
                  </span>
                </div>

                {order.discount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Promotional / Coupon Discount:</span>
                    <span className="font-mono font-semibold">- {inr(order.discount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-zinc-600">
                  <span>Freight &amp; Packaging:</span>
                  <span className="font-mono font-semibold text-zinc-800">
                    {order.shipping ? inr(order.shipping) : "FREE"}
                  </span>
                </div>

                <div className="border-t border-zinc-200 pt-2 space-y-1 text-[11px] text-zinc-500">
                  <div className="flex justify-between">
                    <span>Central GST (CGST @ 2.5%):</span>
                    <span className="font-mono">{inr(cgst)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>State GST (SGST @ 2.5%):</span>
                    <span className="font-mono">{inr(sgst)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t-2 border-zinc-900 pt-2.5 text-base font-bold text-zinc-900">
                  <span>Grand Total:</span>
                  <span className="font-display font-black text-emerald-900 text-lg">
                    {inr(order.total)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Terms, Conditions & Authorized Signatory Block */}
          <div className="pt-6 grid gap-6 md:grid-cols-12 text-xs">
            <div className="md:col-span-8 space-y-2 text-zinc-500 text-[10px] leading-relaxed">
              <p className="font-bold text-zinc-800 uppercase tracking-wider text-[11px]">
                Terms &amp; Conditions:
              </p>
              <ol className="list-decimal list-inside space-y-0.5">
                <li>
                  Goods sold are certified bio-active organic formulations tested under
                  ICAR standards at Tidagundi research lab.
                </li>
                <li>
                  Store products in a cool, dry place away from direct sunlight and chemical
                  fertilizers.
                </li>
                <li>
                  Claims for transit damages must be notified within 48 hours of doorstep
                  delivery.
                </li>
                <li>Subject to Vijayapura, Karnataka jurisdiction only.</li>
              </ol>
              <p className="pt-2 text-zinc-400 italic">
                * This is a system generated official tax invoice and does not require a physical signature when digitally authenticated.
              </p>
            </div>

            {/* Digital Stamp & Authorized Signatory */}
            <div className="md:col-span-4 flex flex-col items-center justify-end text-center">
              {/* Digital Seal / QR Badge */}
              <div className="mb-2 flex items-center justify-center rounded-2xl border-2 border-dashed border-emerald-700/40 bg-emerald-50/50 p-2.5">
                <div className="flex items-center gap-2 text-emerald-900">
                  <ShieldCheck className="h-6 w-6 text-emerald-700" />
                  <div className="text-left text-[9px] font-bold leading-tight uppercase">
                    <span>Plant Health Solutions</span>
                    <br />
                    <span className="text-emerald-700">Digital Certified Seal</span>
                  </div>
                </div>
              </div>

              <div className="mt-1 border-t border-zinc-400 w-full pt-1">
                <p className="font-bold text-zinc-900 text-xs">
                  For {companyName}
                </p>
                <p className="text-[10px] text-zinc-500 font-medium">
                  Authorized Signatory &amp; Quality Head
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Ribbon */}
        <div className="border-t border-zinc-200 bg-zinc-50 px-6 py-2.5 text-center text-[10px] text-zinc-500">
          Plant Health Solutions Pvt. Ltd. · NH-52, Tidagundi, Vijayapura, Karnataka 586119 · www.planthealthsolutions.in · Support: +91 91759 55009
        </div>
      </div>
    </div>
  );
}
