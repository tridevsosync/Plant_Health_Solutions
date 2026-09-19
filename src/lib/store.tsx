import * as React from "react";
import {
  blogs as seedBlogs,
  categories as seedCategories,
  COMPANY,
  coupons as seedCoupons,
  customers as seedCustomers,
  enquiries as seedEnquiries,
  orders as seedOrders,
  products as seedProducts,
  reviews as seedReviews,
  testimonials as seedTestimonials,
  type Blog,
  type Category,
  type Coupon,
  type Customer,
  type Enquiry,
  type Order,
  type Product,
  type Review,
  type Testimonial,
} from "./data";

const KEY = "phs_state_v1";

export type CartLine = { id: string; qty: number };
export type Address = { label: string; line: string; city: string; pincode: string };
export type User = {
  name: string;
  email: string;
  phone: string;
  password: string;
  addresses: Address[];
};

export type Settings = {
  name: string;
  owner: string;
  phone: string;
  email1: string;
  email2: string;
  address: string;
  description: string;
};

export type State = {
  products: Product[];
  categories: Category[];
  blogs: Blog[];
  testimonials: Testimonial[];
  customers: Customer[];
  orders: Order[];
  reviews: Review[];
  enquiries: Enquiry[];
  coupons: Coupon[];
  settings: Settings;
  cart: CartLine[];
  wishlist: string[];
  users: User[];
  currentUser: string | null;
  admin: boolean;
};

const initialState: State = {
  products: seedProducts,
  categories: seedCategories,
  blogs: seedBlogs,
  testimonials: seedTestimonials,
  customers: seedCustomers,
  orders: seedOrders,
  reviews: seedReviews,
  enquiries: seedEnquiries,
  coupons: seedCoupons,
  settings: {
    name: COMPANY.name,
    owner: COMPANY.owner,
    phone: COMPANY.phone,
    email1: COMPANY.email1,
    email2: COMPANY.email2,
    address: COMPANY.address,
    description: COMPANY.description,
  },
  cart: [],
  wishlist: [],
  users: [],
  currentUser: null,
  admin: false,
};

type Ctx = {
  state: State;
  ready: boolean;
  set: (fn: (s: State) => State) => void;
  // cart
  addToCart: (id: string, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  toggleWishlist: (id: string) => void;
  // auth
  register: (u: Omit<User, "addresses">) => string | null;
  login: (email: string, password: string) => string | null;
  logout: () => void;
  adminLogin: (u: string, p: string) => boolean;
  adminLogout: () => void;
  product: (id: string) => Product | undefined;
};

// Keep a single context instance even if this module gets evaluated twice
// (hot reloads can otherwise create a second context and break useApp()).
const g = globalThis as unknown as { __phsAppContext?: React.Context<Ctx | null> };
const AppContext: React.Context<Ctx | null> =
  g.__phsAppContext ?? (g.__phsAppContext = React.createContext<Ctx | null>(null));

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<State>(initialState);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setState({ ...initialState, ...(JSON.parse(raw) as Partial<State>) });
    } catch {
      /* ignore corrupt storage */
    }
    setReady(true);
  }, []);

  React.useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* quota */
    }
  }, [state, ready]);

  const set = React.useCallback((fn: (s: State) => State) => setState((s) => fn(s)), []);

  const value: Ctx = {
    state,
    ready,
    set,
    product: (id) => state.products.find((p) => p.id === id),
    addToCart: (id, qty = 1) =>
      set((s) => {
        const existing = s.cart.find((c) => c.id === id);
        return {
          ...s,
          cart: existing
            ? s.cart.map((c) => (c.id === id ? { ...c, qty: c.qty + qty } : c))
            : [...s.cart, { id, qty }],
        };
      }),
    setQty: (id, qty) =>
      set((s) => ({
        ...s,
        cart: s.cart.map((c) => (c.id === id ? { ...c, qty: Math.max(1, qty) } : c)),
      })),
    removeFromCart: (id) => set((s) => ({ ...s, cart: s.cart.filter((c) => c.id !== id) })),
    clearCart: () => set((s) => ({ ...s, cart: [] })),
    toggleWishlist: (id) =>
      set((s) => ({
        ...s,
        wishlist: s.wishlist.includes(id) ? s.wishlist.filter((w) => w !== id) : [...s.wishlist, id],
      })),
    register: (u) => {
      if (state.users.some((x) => x.email === u.email)) return "An account with this email already exists.";
      set((s) => ({
        ...s,
        users: [...s.users, { ...u, addresses: [] }],
        currentUser: u.email,
      }));
      return null;
    },
    login: (email, password) => {
      const found = state.users.find((u) => u.email === email && u.password === password);
      if (!found) return "Invalid email or password.";
      set((s) => ({ ...s, currentUser: email }));
      return null;
    },
    logout: () => set((s) => ({ ...s, currentUser: null })),
    adminLogin: (u, p) => {
      const ok = u === "admin" && p === "admin123";
      if (ok) set((s) => ({ ...s, admin: true }));
      return ok;
    },
    adminLogout: () => set((s) => ({ ...s, admin: false })),
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = React.useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}

export function useUser() {
  const { state } = useApp();
  return state.users.find((u) => u.email === state.currentUser) ?? null;
}

export function useCartTotals() {
  const { state } = useApp();
  const lines = state.cart.map((c) => {
    const p = state.products.find((x) => x.id === c.id);
    return { line: c, product: p };
  });
  const subtotal = lines.reduce((s, l) => s + (l.product ? l.product.price * l.line.qty : 0), 0);
  const count = state.cart.reduce((s, c) => s + c.qty, 0);
  return { lines, subtotal, count };
}

export const inr = (n: number) =>
  `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

export const FREE_SHIPPING = 2000;
export const SHIPPING_FEE = 90;
