import * as React from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { FREE_SHIPPING, SHIPPING_FEE, inr, useApp, useCartTotals, useUser } from "@/lib/store";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Plant Health Solutions" },
      { name: "description", content: "Enter delivery details, apply your coupon and place your order." },
      { property: "og:title", content: "Checkout — Plant Health Solutions" },
      { property: "og:description", content: "Enter delivery details, apply your coupon and place your order." },
    ],
  }),
  component: Checkout,
});

function Checkout() {
  const navigate = useNavigate();
  const { state, set, clearCart } = useApp();
  const user = useUser();
  const { lines, subtotal } = useCartTotals();
  const [step, setStep] = React.useState(1);
  const [payment, setPayment] = React.useState("UPI");
  const [coupon, setCoupon] = React.useState("");
  const [addr, setAddr] = React.useState({
    name: user?.name ?? "",
    phone: user?.phone ?? "",
    email: user?.email ?? "",
    line: "",
    city: "",
    pincode: "",
  });

  const applied = state.coupons.find((c) => c.code === coupon.toUpperCase() && subtotal >= c.minOrder);
  const discount = applied ? Math.round((subtotal * applied.discount) / 100) : 0;
  const shipping = subtotal - discount >= FREE_SHIPPING ? 0 : SHIPPING_FEE;
  const tax = Math.round((subtotal - discount) * 0.05);
  const total = subtotal - discount + shipping + tax;

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="font-display text-2xl font-bold text-primary">Your cart is empty</h1>
        <Link to="/products" search={{ q: "", category: "" }} className="mt-4 inline-block text-secondary underline">
          Browse products
        </Link>
      </div>
    );
  }

  const placeOrder = () => {
    if (!addr.name || !addr.phone || !addr.line || !addr.city || !addr.pincode) {
      toast.error("Please complete the delivery address");
      setStep(1);
      return;
    }
    const id = `PHS-2026-${Math.floor(2000 + Math.random() * 7999)}`;
    const items = lines
      .filter((l) => l.product)
      .map((l) => ({ id: l.line.id, name: l.product!.name, price: l.product!.price, qty: l.line.qty }));
    set((s) => ({
      ...s,
      orders: [
        {
          id,
          customer: addr.name,
          email: addr.email,
          phone: addr.phone,
          date: new Date().toISOString().slice(0, 10),
          status: "Pending" as const,
          items,
          subtotal,
          discount,
          shipping,
          tax,
          total,
          address: `${addr.line}, ${addr.city} - ${addr.pincode}`,
          payment,
        },
        ...s.orders,
      ],
    }));
    clearCart();
    toast.success("Order placed successfully");
    navigate({ to: "/orders/$id", params: { id } });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="font-display text-3xl font-bold text-primary">Checkout</h1>
      <div className="mt-4 flex gap-2 text-sm">
        {["Delivery Address", "Payment", "Review"].map((s, i) => (
          <button
            key={s}
            onClick={() => setStep(i + 1)}
            className={`rounded-full px-4 py-1.5 ${step === i + 1 ? "bg-primary text-primary-foreground" : "border border-border bg-card"}`}
          >
            {i + 1}. {s}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          {step === 1 && (
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ["name", "Full name"],
                ["phone", "Phone number"],
                ["email", "Email"],
                ["city", "City / Taluk"],
                ["pincode", "Pincode"],
              ].map(([k, label]) => (
                <label key={k} className="text-sm">
                  <span className="mb-1 block font-medium">{label}</span>
                  <input
                    value={(addr as Record<string, string>)[k as string] ?? ""}
                    onChange={(e) => setAddr({ ...addr, [k as string]: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2"
                  />
                </label>
              ))}
              <label className="text-sm sm:col-span-2">
                <span className="mb-1 block font-medium">Full address</span>
                <textarea
                  value={addr.line}
                  onChange={(e) => setAddr({ ...addr, line: e.target.value })}
                  rows={3}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2"
                />
              </label>
              <button onClick={() => setStep(2)} className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground sm:w-fit">
                Continue to Payment
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              {["UPI", "Net Banking", "Cash on Delivery"].map((m) => (
                <label key={m} className="flex cursor-pointer items-center gap-3 rounded-xl border border-border p-4">
                  <input type="radio" checked={payment === m} onChange={() => setPayment(m)} className="accent-[#4f8a3c]" />
                  <span className="text-sm font-medium">{m}</span>
                </label>
              ))}
              <button onClick={() => setStep(3)} className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground">
                Review Order
              </button>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="font-display text-xl font-semibold">Review & Place Order</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {addr.name} · {addr.phone}
                <br />
                {addr.line}, {addr.city} - {addr.pincode}
                <br />
                Payment: {payment}
              </p>
              <ul className="mt-4 space-y-2 text-sm">
                {lines.map((l) =>
                  l.product ? (
                    <li key={l.line.id} className="flex justify-between border-b border-border pb-2">
                      <span>{l.product.name} × {l.line.qty}</span>
                      <span>{inr(l.product.price * l.line.qty)}</span>
                    </li>
                  ) : null,
                )}
              </ul>
              <button onClick={placeOrder} className="mt-6 rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground">
                Place Order
              </button>
            </div>
          )}
        </div>

        <aside className="h-fit rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="font-display text-xl font-semibold">Order Summary</h2>
          <div className="mt-3 flex gap-2">
            <input
              value={coupon}
              onChange={(e) => setCoupon(e.target.value.toUpperCase())}
              placeholder="Coupon code"
              className="w-full rounded-full border border-border bg-background px-4 py-2 text-sm"
            />
          </div>
          {applied && <p className="mt-2 text-xs text-secondary">{applied.code} applied ({applied.discount}% off)</p>}
          <dl className="mt-4 space-y-2 text-sm text-muted-foreground">
            <div className="flex justify-between"><dt>Subtotal</dt><dd>{inr(subtotal)}</dd></div>
            <div className="flex justify-between"><dt>Discount</dt><dd>- {inr(discount)}</dd></div>
            <div className="flex justify-between"><dt>Shipping</dt><dd>{shipping ? inr(shipping) : "Free"}</dd></div>
            <div className="flex justify-between"><dt>GST (5%)</dt><dd>{inr(tax)}</dd></div>
            <div className="flex justify-between border-t border-border pt-2 font-display text-lg font-bold text-primary">
              <dt>Total</dt><dd>{inr(total)}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  );
}
