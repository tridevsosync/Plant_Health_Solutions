import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Printer } from "lucide-react";
import { inr, useApp } from "@/lib/store";

export const Route = createFileRoute("/orders/$id")({
  head: () => ({
    meta: [
      { title: "Order Invoice — Plant Health Solutions" },
      { name: "description", content: "Printable invoice and live order tracking for your PHS order." },
      { property: "og:title", content: "Order Invoice — Plant Health Solutions" },
      { property: "og:description", content: "Printable invoice and live order tracking for your PHS order." },
    ],
  }),
  component: OrderPage,
});

const steps = ["Order Placed", "Processing", "Shipped", "Out for Delivery", "Delivered"];

function OrderPage() {
  const { id } = Route.useParams();
  const { state } = useApp();
  const order = state.orders.find((o) => o.id === id);

  if (!order) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="font-display text-2xl font-bold text-primary">Order not found</h1>
        <Link to="/account" className="mt-4 inline-block text-secondary underline">Go to my account</Link>
      </div>
    );
  }

  const stage =
    order.status === "Delivered" ? 5 : order.status === "Cancelled" ? 1 : order.status === "Shipped" ? 3 : order.status === "Processing" ? 2 : 1;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
        <CheckCircle2 className="mx-auto h-12 w-12 text-secondary" />
        <h1 className="mt-3 font-display text-3xl font-bold text-primary">Thank you for your order!</h1>
        <p className="mt-1 text-sm text-muted-foreground">Order {order.id} placed on {order.date}</p>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className="font-display text-xl font-semibold text-primary">Live Order Tracking</h2>
        <div className="mt-5 flex flex-wrap gap-4">
          {steps.map((s, i) => (
            <div key={s} className="flex flex-1 min-w-[120px] flex-col items-center text-center">
              <span className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${i < stage ? "bg-secondary text-white" : "bg-muted text-muted-foreground"}`}>
                {i + 1}
              </span>
              <p className="mt-2 text-xs font-medium">{s}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted-foreground">Current status: <strong className="text-foreground">{order.status}</strong></p>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-sm print:border-0">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-4">
          <div>
            <h2 className="font-display text-2xl font-bold text-primary">{state.settings.name}</h2>
            <p className="mt-1 max-w-sm text-xs text-muted-foreground">{state.settings.address}</p>
            <p className="text-xs text-muted-foreground">{state.settings.phone} · {state.settings.email1}</p>
          </div>
          <div className="text-right text-sm">
            <p className="font-semibold">Invoice {order.id}</p>
            <p className="text-muted-foreground">{order.date}</p>
            <p className="text-muted-foreground">Payment: {order.payment}</p>
          </div>
        </div>

        <div className="mt-4 text-sm">
          <p className="font-semibold">Billed to</p>
          <p className="text-muted-foreground">{order.customer} · {order.phone}</p>
          <p className="text-muted-foreground">{order.address}</p>
        </div>

        <table className="mt-5 w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="py-2">Item</th><th>Qty</th><th className="text-right">Price</th><th className="text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((it) => (
              <tr key={it.id} className="border-b border-border">
                <td className="py-2">{it.name}</td>
                <td>{it.qty}</td>
                <td className="text-right">{inr(it.price)}</td>
                <td className="text-right">{inr(it.price * it.qty)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 ml-auto w-full max-w-xs space-y-1 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>{inr(order.subtotal)}</span></div>
          <div className="flex justify-between"><span>Discount</span><span>- {inr(order.discount)}</span></div>
          <div className="flex justify-between"><span>Shipping</span><span>{order.shipping ? inr(order.shipping) : "Free"}</span></div>
          <div className="flex justify-between"><span>GST (5%)</span><span>{inr(order.tax)}</span></div>
          <div className="flex justify-between border-t border-border pt-1 font-display text-lg font-bold text-primary">
            <span>Total</span><span>{inr(order.total)}</span>
          </div>
        </div>

        <button
          onClick={() => window.print()}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground print:hidden"
        >
          <Printer className="h-4 w-4" /> Print / Download Invoice
        </button>
      </div>
    </div>
  );
}
