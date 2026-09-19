import * as React from "react";
import { Link } from "@tanstack/react-router";
import { Leaf, Mail, MapPin, Phone, Send, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/lib/store";

export function Footer() {
  const { state } = useApp();
  const s = state.settings;
  const [email, setEmail] = React.useState("");

  return (
    <footer className="mt-20 bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-accent-foreground">
              <Leaf className="h-5 w-5" />
            </span>
            <span className="font-display text-xl font-bold">{s.name}</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-primary-foreground/80">{s.description}</p>
          <p className="mt-4 flex items-center gap-2 text-sm text-accent">
            <ShieldCheck className="h-4 w-4" /> ISO certified manufacturing unit
          </p>
        </div>

        <div>
          <h4 className="font-display text-lg font-semibold">Quick Links</h4>
          <ul className="mt-4 space-y-2 text-sm text-primary-foreground/80">
            <li><Link to="/about" className="hover:text-accent">About Us</Link></li>
            <li><Link to="/products" search={{ q: "", category: "" }} className="hover:text-accent">All Products</Link></li>
            <li><Link to="/farmer-solutions" className="hover:text-accent">Farmer Solutions</Link></li>
            <li><Link to="/blog" className="hover:text-accent">Research Blog</Link></li>
            <li><Link to="/contact" className="hover:text-accent">Contact</Link></li>
            <li><Link to="/account" className="hover:text-accent">My Account</Link></li>
            <li><Link to="/admin/login" className="hover:text-accent">Admin Login</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg font-semibold">Categories</h4>
          <ul className="mt-4 space-y-2 text-sm text-primary-foreground/80">
            {state.categories.map((c) => (
              <li key={c.id}>
                <Link to="/products" search={{ q: "", category: c.name }} className="hover:text-accent">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg font-semibold">Research Center</h4>
          <ul className="mt-4 space-y-3 text-sm text-primary-foreground/80">
            <li className="flex gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />{s.address}</li>
            <li className="flex gap-2"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-accent" />{s.phone}</li>
            <li className="flex gap-2"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent" />{s.email1}</li>
            <li className="flex gap-2"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent" />{s.email2}</li>
          </ul>
          <form
            className="mt-5 flex overflow-hidden rounded-full bg-white/10"
            onSubmit={(e) => {
              e.preventDefault();
              if (!email) return;
              toast.success("Subscribed to the PHS research newsletter");
              setEmail("");
            }}
          >
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Your email"
              className="w-full bg-transparent px-4 py-2 text-sm placeholder:text-primary-foreground/60 outline-none"
            />
            <button className="bg-accent px-4 text-accent-foreground" aria-label="Subscribe">
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-primary-foreground/70 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} {s.name}. Owner: {s.owner}. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            <Link to="/privacy-policy" className="hover:text-accent">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-accent">Terms</Link>
            <Link to="/refund-policy" className="hover:text-accent">Refund Policy</Link>
            <Link to="/shipping-policy" className="hover:text-accent">Shipping Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
