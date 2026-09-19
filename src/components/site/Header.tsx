import * as React from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Heart, Leaf, Menu, Search, ShoppingCart, User, X } from "lucide-react";
import { useApp, useCartTotals } from "@/lib/store";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/products", label: "Products" },
  { to: "/farmer-solutions", label: "Farmer Solutions" },
  { to: "/blog", label: "Research Blog" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const { state } = useApp();
  const { count } = useCartTotals();
  const navigate = useNavigate();
  const [q, setQ] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/products", search: { q, category: "" } });
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur">
      <div className="bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-1.5 text-xs">
          <span>{state.settings.address.split(",").slice(-3).join(",").trim()}</span>
          <span className="font-medium">
            Agronomy helpline: {state.settings.phone} · {state.settings.email1}
          </span>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Leaf className="h-5 w-5" />
          </span>
          <span className="leading-tight">
            <span className="block font-display text-lg font-bold text-primary">Plant Health Solutions</span>
            <span className="block text-[11px] uppercase tracking-widest text-muted-foreground">
              Research · Manufacturing · Extension
            </span>
          </span>
        </Link>

        <form onSubmit={submit} className="ml-auto hidden flex-1 max-w-md items-center lg:flex">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search bio fertilizers, micronutrients, crop protection…"
              className="w-full rounded-full border border-border bg-background py-2 pl-9 pr-4 text-sm outline-none focus:border-secondary"
            />
          </div>
        </form>

        <div className="ml-auto flex items-center gap-1 lg:ml-0">
          <Link to="/account" className="rounded-full p-2 hover:bg-muted" aria-label="Account">
            <User className="h-5 w-5 text-primary" />
          </Link>
          <Link to="/account" className="relative rounded-full p-2 hover:bg-muted" aria-label="Wishlist">
            <Heart className="h-5 w-5 text-primary" />
            <Badge n={state.wishlist.length} />
          </Link>
          <Link to="/cart" className="relative rounded-full p-2 hover:bg-muted" aria-label="Cart">
            <ShoppingCart className="h-5 w-5 text-primary" />
            <Badge n={count} />
          </Link>
          <button className="rounded-full p-2 hover:bg-muted lg:hidden" onClick={() => setOpen((o) => !o)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <nav className="hidden border-t border-border lg:block">
        <div className="mx-auto flex max-w-7xl gap-6 px-4">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              {...(l.to === "/products" ? { search: { q: "", category: "" } } : {})}
              activeOptions={{ exact: l.to === "/" }}
              className="border-b-2 border-transparent py-3 text-sm font-medium text-foreground/80 transition hover:text-primary"
              activeProps={{ className: "!border-secondary !text-primary" }}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </nav>

      {open && (
        <div className="border-t border-border bg-card px-4 pb-4 lg:hidden">
          <form onSubmit={submit} className="py-3">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search products…"
              className="w-full rounded-full border border-border bg-background px-4 py-2 text-sm outline-none"
            />
          </form>
          <div className="flex flex-col">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                {...(l.to === "/products" ? { search: { q: "", category: "" } } : {})}
                onClick={() => setOpen(false)}
                className="border-b border-border py-2.5 text-sm font-medium"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

function Badge({ n }: { n: number }) {
  if (!n) return null;
  return (
    <span
      className={cn(
        "absolute -right-0 -top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-secondary px-1 text-[10px] font-bold text-secondary-foreground",
      )}
    >
      {n}
    </span>
  );
}
