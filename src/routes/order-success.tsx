import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/order-success")({
  head: () => ({
    meta: [
      { title: "Order Placed — Plant Health Solutions" },
      { name: "description", content: "Your order has been placed successfully." },
      { property: "og:title", content: "Order Placed — Plant Health Solutions" },
      { property: "og:description", content: "Your order has been placed successfully." },
    ],
  }),
  component: Success,
});

function Success() {
  const { state } = useApp();
  const latest = state.orders[0];
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <CheckCircle2 className="mx-auto h-14 w-14 text-secondary" />
      <h1 className="mt-4 font-display text-3xl font-bold text-primary">Order placed successfully</h1>
      <p className="mt-2 text-muted-foreground">Our team will call you shortly to confirm dispatch.</p>
      {latest && (
        <Link
          to="/orders/$id"
          params={{ id: latest.id }}
          className="mt-6 inline-block rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground"
        >
          View invoice & tracking
        </Link>
      )}
    </div>
  );
}
