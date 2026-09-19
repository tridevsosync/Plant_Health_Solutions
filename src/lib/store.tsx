"use client";

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

const KEY = "phs_state_v2";

export type CartLine = { id: string; qty: number };
export type Address = { label: string; line: string; city: string; pincode: string };
export type User = {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  password?: string;
  role?: "user" | "admin";
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
  currentUserData: User | null;
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
  currentUserData: null,
  admin: false,
};

type Ctx = {
  state: State;
  ready: boolean;
  set: (fn: (s: State) => State) => void;
  refreshData: () => Promise<void>;
  // Cart & Wishlist
  addToCart: (id: string, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  toggleWishlist: (id: string) => void;
  // Auth
  register: (u: { name: string; email: string; password: string; confirmPassword?: string; phone?: string }) => Promise<string | null>;
  login: (email: string, password: string) => Promise<string | null>;
  logout: () => void;
  adminLogin: (u: string, p: string) => Promise<boolean>;
  adminLogout: () => void;
  updateUserAddresses: (addresses: Address[]) => Promise<boolean>;
  updateUserProfile: (name: string, phone: string) => Promise<boolean>;
  // Product helpers & CRUD
  product: (id: string) => Product | undefined;
  saveProduct: (p: Product, isNew: boolean) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;
  // Category CRUD
  saveCategory: (c: Category, isNew: boolean) => Promise<boolean>;
  deleteCategory: (id: string) => Promise<boolean>;
  // Order CRUD
  createOrder: (orderData: Partial<Order>) => Promise<{ success: boolean; order?: Order; error?: string }>;
  updateOrderStatus: (id: string, status: Order["status"]) => Promise<boolean>;
  deleteOrder: (id: string) => Promise<boolean>;
  // Blog CRUD
  saveBlog: (b: Blog, isNew: boolean) => Promise<boolean>;
  deleteBlog: (id: string) => Promise<boolean>;
  // Coupon CRUD
  saveCoupon: (coupon: Coupon, isNew: boolean) => Promise<boolean>;
  deleteCoupon: (code: string) => Promise<boolean>;
  // Customer CRUD
  saveCustomer: (c: Customer, isNew: boolean) => Promise<boolean>;
  deleteCustomer: (id: string) => Promise<boolean>;
  // Enquiry CRUD
  createEnquiry: (enq: Partial<Enquiry>) => Promise<{ success: boolean; error?: string }>;
  updateEnquiryStatus: (id: string, status: "New" | "Answered") => Promise<boolean>;
  deleteEnquiry: (id: string) => Promise<boolean>;
  // Testimonial CRUD
  saveTestimonial: (t: Testimonial, isNew: boolean) => Promise<boolean>;
  deleteTestimonial: (id: string) => Promise<boolean>;
  // Settings
  saveSettings: (s: Settings) => Promise<boolean>;
};

// Keep a single context instance even if this module gets evaluated twice
const g = globalThis as unknown as { __phsAppContext?: React.Context<Ctx | null> };
const AppContext: React.Context<Ctx | null> =
  g.__phsAppContext ?? (g.__phsAppContext = React.createContext<Ctx | null>(null));

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<State>(initialState);
  const [ready, setReady] = React.useState(false);

  const set = React.useCallback((fn: (s: State) => State) => setState((s) => fn(s)), []);

  // Hydrate from API
  const refreshData = React.useCallback(async () => {
    try {
      const [
        prodRes,
        catRes,
        blogRes,
        orderRes,
        testRes,
        enqRes,
        coupRes,
        custRes,
        settRes,
      ] = await Promise.allSettled([
        fetch("/api/products").then((r) => r.json()),
        fetch("/api/categories").then((r) => r.json()),
        fetch("/api/blogs").then((r) => r.json()),
        fetch("/api/orders").then((r) => r.json()),
        fetch("/api/testimonials").then((r) => r.json()),
        fetch("/api/enquiries").then((r) => r.json()),
        fetch("/api/coupons").then((r) => r.json()),
        fetch("/api/customers").then((r) => r.json()),
        fetch("/api/settings").then((r) => r.json()),
      ]);

      setState((prev) => {
        const next = { ...prev };
        if (prodRes.status === "fulfilled" && prodRes.value?.success && prodRes.value.products?.length) {
          next.products = prodRes.value.products;
        }
        if (catRes.status === "fulfilled" && catRes.value?.success && catRes.value.categories?.length) {
          next.categories = catRes.value.categories;
        }
        if (blogRes.status === "fulfilled" && blogRes.value?.success && blogRes.value.blogs?.length) {
          next.blogs = blogRes.value.blogs;
        }
        if (orderRes.status === "fulfilled" && orderRes.value?.success && orderRes.value.orders?.length) {
          next.orders = orderRes.value.orders;
        }
        if (testRes.status === "fulfilled" && testRes.value?.success && testRes.value.testimonials?.length) {
          next.testimonials = testRes.value.testimonials;
        }
        if (enqRes.status === "fulfilled" && enqRes.value?.success && enqRes.value.enquiries?.length) {
          next.enquiries = enqRes.value.enquiries;
        }
        if (coupRes.status === "fulfilled" && coupRes.value?.success && coupRes.value.coupons?.length) {
          next.coupons = coupRes.value.coupons;
        }
        if (custRes.status === "fulfilled" && custRes.value?.success && custRes.value.customers?.length) {
          next.customers = custRes.value.customers;
        }
        if (settRes.status === "fulfilled" && settRes.value?.success && settRes.value.settings) {
          next.settings = settRes.value.settings;
        }
        return next;
      });
    } catch (e) {
      console.error("Failed to hydrate data from API:", e);
    }
  }, []);

  // Initial load from localStorage + API
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<State>;
        setState((s) => ({ ...s, ...parsed }));
      }
    } catch {
      /* ignore */
    }
    setReady(true);
    refreshData();
  }, [refreshData]);

  // Persist to local cache for instant offline responsiveness
  React.useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* quota */
    }
  }, [state, ready]);

  // Auth Operations
  const register = async (u: { name: string; email: string; password: string; confirmPassword?: string; phone?: string }) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(u),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return data.error || "Registration failed";
      }

      const userData: User = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        phone: data.user.phone || "",
        role: data.user.role || "user",
        addresses: data.user.addresses || [],
      };

      set((s) => ({
        ...s,
        users: [...s.users.filter((x) => x.email !== userData.email), userData],
        currentUser: userData.email,
        currentUserData: userData,
      }));

      // Refresh customers in background
      fetch("/api/customers")
        .then((r) => r.json())
        .then((d) => {
          if (d.success && d.customers) set((s) => ({ ...s, customers: d.customers }));
        })
        .catch(() => {});

      return null;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Network error during registration";
      return msg;
    }
  };

  const login = async (email: string, pass: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: pass }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return data.error || "Invalid email or password";
      }

      const userData: User = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        phone: data.user.phone || "",
        role: data.user.role || "user",
        addresses: data.user.addresses || [],
      };

      set((s) => ({
        ...s,
        users: [...s.users.filter((x) => x.email !== userData.email), userData],
        currentUser: userData.email,
        currentUserData: userData,
      }));

      return null;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Network error during login";
      return msg;
    }
  };

  const logout = () => {
    set((s) => ({ ...s, currentUser: null, currentUserData: null }));
  };

  const adminLogin = async (u: string, p: string) => {
    try {
      const res = await fetch("/api/auth/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: u, pass: p }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        set((s) => ({ ...s, admin: true }));
        return true;
      }
      return false;
    } catch {
      // Offline fallback check
      const ok = (u === "admin" || u === "planthealth@gmail.com") && (p === "admin123" || p === "Planthealth@123");
      if (ok) set((s) => ({ ...s, admin: true }));
      return ok;
    }
  };

  const adminLogout = () => set((s) => ({ ...s, admin: false }));

  const updateUserAddresses = async (addresses: Address[]) => {
    if (!state.currentUser) return false;
    try {
      const res = await fetch("/api/auth/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: state.currentUser, addresses }),
      });
      const data = await res.json();
      if (data.success) {
        set((s) => ({
          ...s,
          users: s.users.map((u) => (u.email === s.currentUser ? { ...u, addresses } : u)),
          currentUserData: s.currentUserData ? { ...s.currentUserData, addresses } : null,
        }));
        return true;
      }
    } catch (e) {
      console.error("Address update failed:", e);
    }
    return false;
  };

  const updateUserProfile = async (name: string, phone: string) => {
    if (!state.currentUser) return false;
    try {
      const res = await fetch("/api/auth/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: state.currentUser, name, phone }),
      });
      const data = await res.json();
      if (data.success) {
        set((s) => ({
          ...s,
          users: s.users.map((u) => (u.email === s.currentUser ? { ...u, name, phone } : u)),
          currentUserData: s.currentUserData ? { ...s.currentUserData, name, phone } : null,
        }));
        return true;
      }
    } catch (e) {
      console.error("Profile update failed:", e);
    }
    return false;
  };

  // CRUD Implementations
  const saveProduct = async (p: Product, isNew: boolean) => {
    try {
      const url = isNew ? "/api/products" : `/api/products/${p.id}`;
      const method = isNew ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(p),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        const savedProd = data.product || p;
        set((s) => ({
          ...s,
          products: isNew
            ? [savedProd, ...s.products]
            : s.products.map((item) => (item.id === savedProd.id ? savedProd : item)),
        }));
        return true;
      }
    } catch (e) {
      console.error("Save product error:", e);
    }
    // Optimistic fallback
    set((s) => ({
      ...s,
      products: isNew
        ? [{ ...p, id: p.id || `p_${Date.now()}` }, ...s.products]
        : s.products.map((item) => (item.id === p.id ? p : item)),
    }));
    return true;
  };

  const deleteProduct = async (id: string) => {
    try {
      await fetch(`/api/products/${id}`, { method: "DELETE" });
    } catch (e) {
      console.error("Delete product error:", e);
    }
    set((s) => ({ ...s, products: s.products.filter((p) => p.id !== id) }));
    return true;
  };

  const saveCategory = async (c: Category, isNew: boolean) => {
    try {
      const url = isNew ? "/api/categories" : `/api/categories/${c.id}`;
      const method = isNew ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(c),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        const savedCat = data.category || c;
        set((s) => ({
          ...s,
          categories: isNew
            ? [...s.categories, savedCat]
            : s.categories.map((item) => (item.id === savedCat.id ? savedCat : item)),
        }));
        return true;
      }
    } catch (e) {
      console.error("Save category error:", e);
    }
    set((s) => ({
      ...s,
      categories: isNew
        ? [...s.categories, { ...c, id: c.id || `c_${Date.now()}` }]
        : s.categories.map((item) => (item.id === c.id ? c : item)),
    }));
    return true;
  };

  const deleteCategory = async (id: string) => {
    try {
      await fetch(`/api/categories/${id}`, { method: "DELETE" });
    } catch (e) {
      console.error("Delete category error:", e);
    }
    set((s) => ({ ...s, categories: s.categories.filter((c) => c.id !== id) }));
    return true;
  };

  const createOrder = async (orderData: Partial<Order>) => {
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        const savedOrder = data.order;
        set((s) => ({
          ...s,
          orders: [savedOrder, ...s.orders],
          cart: [], // Clear cart upon successful order
        }));
        return { success: true, order: savedOrder };
      }
      return { success: false, error: data.error || "Order placement failed" };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to place order";
      return { success: false, error: msg };
    }
  };

  const updateOrderStatus = async (id: string, status: Order["status"]) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        set((s) => ({
          ...s,
          orders: s.orders.map((o) => (o.id === id ? { ...o, status } : o)),
        }));
        return true;
      }
    } catch (e) {
      console.error("Update order status error:", e);
    }
    set((s) => ({
      ...s,
      orders: s.orders.map((o) => (o.id === id ? { ...o, status } : o)),
    }));
    return true;
  };

  const deleteOrder = async (id: string) => {
    try {
      await fetch(`/api/orders/${id}`, { method: "DELETE" });
    } catch (e) {
      console.error("Delete order error:", e);
    }
    set((s) => ({ ...s, orders: s.orders.filter((o) => o.id !== id) }));
    return true;
  };

  const saveBlog = async (b: Blog, isNew: boolean) => {
    try {
      const url = isNew ? "/api/blogs" : `/api/blogs/${b.id}`;
      const method = isNew ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(b),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        const savedBlog = data.blog || b;
        set((s) => ({
          ...s,
          blogs: isNew
            ? [savedBlog, ...s.blogs]
            : s.blogs.map((item) => (item.id === savedBlog.id ? savedBlog : item)),
        }));
        return true;
      }
    } catch (e) {
      console.error("Save blog error:", e);
    }
    set((s) => ({
      ...s,
      blogs: isNew
        ? [{ ...b, id: b.id || `b_${Date.now()}` }, ...s.blogs]
        : s.blogs.map((item) => (item.id === b.id ? b : item)),
    }));
    return true;
  };

  const deleteBlog = async (id: string) => {
    try {
      await fetch(`/api/blogs/${id}`, { method: "DELETE" });
    } catch (e) {
      console.error("Delete blog error:", e);
    }
    set((s) => ({ ...s, blogs: s.blogs.filter((b) => b.id !== id) }));
    return true;
  };

  const saveCoupon = async (coupon: Coupon, isNew: boolean) => {
    try {
      const url = isNew ? "/api/coupons" : `/api/coupons/${coupon.code}`;
      const method = isNew ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(coupon),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        const saved = data.coupon || coupon;
        set((s) => ({
          ...s,
          coupons: isNew
            ? [saved, ...s.coupons]
            : s.coupons.map((c) => (c.code === saved.code ? saved : c)),
        }));
        return true;
      }
    } catch (e) {
      console.error("Save coupon error:", e);
    }
    set((s) => ({
      ...s,
      coupons: isNew
        ? [coupon, ...s.coupons.filter((c) => c.code !== coupon.code)]
        : s.coupons.map((c) => (c.code === coupon.code ? coupon : c)),
    }));
    return true;
  };

  const deleteCoupon = async (code: string) => {
    try {
      await fetch(`/api/coupons/${code}`, { method: "DELETE" });
    } catch (e) {
      console.error("Delete coupon error:", e);
    }
    set((s) => ({ ...s, coupons: s.coupons.filter((c) => c.code !== code) }));
    return true;
  };

  const saveCustomer = async (c: Customer, isNew: boolean) => {
    try {
      const url = isNew ? "/api/customers" : `/api/customers/${c.id}`;
      const method = isNew ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(c),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        const saved = data.customer || c;
        set((s) => ({
          ...s,
          customers: isNew
            ? [saved, ...s.customers]
            : s.customers.map((item) => (item.id === saved.id ? saved : item)),
        }));
        return true;
      }
    } catch (e) {
      console.error("Save customer error:", e);
    }
    set((s) => ({
      ...s,
      customers: isNew
        ? [{ ...c, id: c.id || `c_${Date.now()}` }, ...s.customers]
        : s.customers.map((item) => (item.id === c.id ? c : item)),
    }));
    return true;
  };

  const deleteCustomer = async (id: string) => {
    try {
      await fetch(`/api/customers/${id}`, { method: "DELETE" });
    } catch (e) {
      console.error("Delete customer error:", e);
    }
    set((s) => ({ ...s, customers: s.customers.filter((c) => c.id !== id) }));
    return true;
  };

  const createEnquiry = async (enq: Partial<Enquiry>) => {
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(enq),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        const saved = data.enquiry;
        set((s) => ({ ...s, enquiries: [saved, ...s.enquiries] }));
        return { success: true };
      }
      return { success: false, error: data.error || "Failed to submit enquiry" };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to submit enquiry";
      return { success: false, error: msg };
    }
  };

  const updateEnquiryStatus = async (id: string, status: "New" | "Answered") => {
    try {
      const res = await fetch(`/api/enquiries/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        set((s) => ({
          ...s,
          enquiries: s.enquiries.map((e) => (e.id === id ? { ...e, status } : e)),
        }));
        return true;
      }
    } catch (e) {
      console.error("Update enquiry error:", e);
    }
    set((s) => ({
      ...s,
      enquiries: s.enquiries.map((e) => (e.id === id ? { ...e, status } : e)),
    }));
    return true;
  };

  const deleteEnquiry = async (id: string) => {
    try {
      await fetch(`/api/enquiries/${id}`, { method: "DELETE" });
    } catch (e) {
      console.error("Delete enquiry error:", e);
    }
    set((s) => ({ ...s, enquiries: s.enquiries.filter((e) => e.id !== id) }));
    return true;
  };

  const saveTestimonial = async (t: Testimonial, isNew: boolean) => {
    try {
      const url = isNew ? "/api/testimonials" : `/api/testimonials/${t.id}`;
      const method = isNew ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(t),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        const saved = data.testimonial || t;
        set((s) => ({
          ...s,
          testimonials: isNew
            ? [saved, ...s.testimonials]
            : s.testimonials.map((item) => (item.id === saved.id ? saved : item)),
        }));
        return true;
      }
    } catch (e) {
      console.error("Save testimonial error:", e);
    }
    set((s) => ({
      ...s,
      testimonials: isNew
        ? [{ ...t, id: t.id || `t_${Date.now()}` }, ...s.testimonials]
        : s.testimonials.map((item) => (item.id === t.id ? t : item)),
    }));
    return true;
  };

  const deleteTestimonial = async (id: string) => {
    try {
      await fetch(`/api/testimonials/${id}`, { method: "DELETE" });
    } catch (e) {
      console.error("Delete testimonial error:", e);
    }
    set((s) => ({ ...s, testimonials: s.testimonials.filter((t) => t.id !== id) }));
    return true;
  };

  const saveSettings = async (settingsData: Settings) => {
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settingsData),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        set((s) => ({ ...s, settings: data.settings || settingsData }));
        return true;
      }
    } catch (e) {
      console.error("Save settings error:", e);
    }
    set((s) => ({ ...s, settings: settingsData }));
    return true;
  };

  const value: Ctx = {
    state,
    ready,
    set,
    refreshData,
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
    register,
    login,
    logout,
    adminLogin,
    adminLogout,
    updateUserAddresses,
    updateUserProfile,
    saveProduct,
    deleteProduct,
    saveCategory,
    deleteCategory,
    createOrder,
    updateOrderStatus,
    deleteOrder,
    saveBlog,
    deleteBlog,
    saveCoupon,
    deleteCoupon,
    saveCustomer,
    deleteCustomer,
    createEnquiry,
    updateEnquiryStatus,
    deleteEnquiry,
    saveTestimonial,
    deleteTestimonial,
    saveSettings,
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
  if (state.currentUserData) return state.currentUserData;
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
