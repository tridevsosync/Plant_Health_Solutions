"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { useApp } from "@/lib/store";

import { PageHero } from "@/components/site/Section";

export default function OrderSuccessPage() {
  const { state } = useApp();
  const latest = state.orders[0];
  return (
    <div>
      <PageHero
        title="Order Placed Successfully"
        subtitle="Thank you for choosing Plant Health Solutions. Your order has been recorded."
        image="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1920&q=80"
      />
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <CheckCircle2 className="mx-auto h-16 w-16 text-secondary" />
        <h2 className="mt-4 font-display text-3xl font-bold text-primary">Thank You for Your Order!</h2>
        <p className="mt-2 text-muted-foreground">Our dispatch and agronomy team will call you shortly to confirm shipment.</p>
        {latest && (
          <Link
            href={`/orders/${latest.id}`}
            className="mt-6 inline-block rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground hover:bg-secondary transition-colors"
          >
            View invoice &amp; tracking
          </Link>
        )}
      </div>
    </div>
  );
}
