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

const KEY = "phs_state_v5";

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
  whatsapp?: string;
  email1: string;
  email2: string;
  address: string;
  description: string;
  gst?: string;
  announcement?: string;
  freeShippingThreshold?: number;
  shippingFee?: number;
  facebook?: string;
  instagram?: string;
  youtube?: string;
  twitter?: string;
  // Contact page custom fields
  workingHours?: string;
  contactHeroBadge?: string;
  contactHeroTitle?: string;
  contactHeroSubtitle?: string;
  contactHeroImage?: string;
  facilityName?: string;
  facilityDescription?: string;
  facilityLocationTitle?: string;
  facilityImage?: string;
  googleMapsUrl?: string;
  enquiryFormTitle?: string;
  enquiryFormSubtitle?: string;
  dealerBadge?: string;
  dealerTitle?: string;
  dealerDesc?: string;
  dealerButtonText?: string;
  dealerWhatsappText?: string;
  soilTestingBadge?: string;
  soilTestingTitle?: string;
  soilTestingDesc?: string;
  soilTestingButtonText?: string;
  soilTestingLinkUrl?: string;
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
  customers: [],
  orders: seedOrders,
  reviews: seedReviews,
  enquiries: seedEnquiries,
  coupons: seedCoupons,
  settings: {
    name: COMPANY.name,
    owner: COMPANY.owner,
    phone: COMPANY.phone,
    whatsapp: COMPANY.phone,
    email1: COMPANY.email1,
    email2: COMPANY.email2,
    address: COMPANY.address,
    description: COMPANY.description,
    gst: "29AAGCP1234F1Z5",
    announcement: "Free soil testing on orders above ₹5,000",
    freeShippingThreshold: 2000,
    shippingFee: 90,
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    youtube: "https://youtube.com",
    twitter: "https://twitter.com",
    // Contact page default settings
    workingHours: "Mon – Sat: 9:00 AM – 6:30 PM",
    contactHeroBadge: "Direct Farmer & Dealer Support",
    contactHeroTitle: "Get in Touch with Our Agronomists",
    contactHeroSubtitle:
      "Whether you need crop advice, soil test recommendations, dealership inquiries, or bulk orders, our research and extension team is here to help.",
    contactHeroImage: "https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=1920&q=80",
    facilityName: "Horticulture Research & Extension Center",
    facilityDescription:
      "Our 40-acre center on National Highway 52 houses state-of-the-art microbiology testing, blending plants, and demonstration plots.",
    facilityLocationTitle: "Tidagundi, Vijayapura (NH-52)",
    facilityImage: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80",
    googleMapsUrl: "https://maps.google.com/?q=Plant+Health+Solutions+Tidagundi+Vijayapura",
    enquiryFormTitle: "Send an Enquiry",
    enquiryFormSubtitle:
      "Fill out the form below and our agronomy extension team will review your query and get back to you promptly.",
    dealerBadge: "Distribution Network",
    dealerTitle: "Become an Authorized Dealer",
    dealerDesc:
      "Join our 300+ strong dealer network across Karnataka, Maharashtra, AP, Telangana, and MP. Benefit from high-demand research-backed formulations and marketing support.",
    dealerButtonText: "Inquire for Dealership →",
    dealerWhatsappText: "Hello, I am interested in dealership registration with Plant Health Solutions.",
    soilTestingBadge: "Soil Health",
    soilTestingTitle: "Free Soil & Water Testing",
    soilTestingDesc:
      "Bring or courier your soil and water sample to our Tidagundi lab. Our chief agronomists will analyze pH, organic carbon, and micronutrient status free of cost.",
    soilTestingButtonText: "Explore Crop Solutions →",
    soilTestingLinkUrl: "/farmer-solutions",
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
  // Auth & 2-Step Verification
  register: (u: { name: string; email: string; password: string; confirmPassword?: string; phone?: string }) => Promise<string | null>;
  login: (email: string, password: string) => Promise<string | null>;
  sendLoginOtp: (email: string, password: string) => Promise<{ success: boolean; error?: string; testOtp?: string }>;
  sendRegisterOtp: (u: { name: string; email: string; password: string; confirmPassword?: string; phone?: string }) => Promise<{ success: boolean; error?: string; testOtp?: string }>;
  verifyOtp: (email: string, otp: string, type: "login" | "registration") => Promise<{ success: boolean; error?: string }>;
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
  deleteAllCoupons: () => Promise<boolean>;
  // Customer CRUD
  saveCustomer: (c: Customer, isNew: boolean) => Promise<boolean>;
  deleteCustomer: (id: string) => Promise<boolean>;
  deleteAllCustomers: () => Promise<boolean>;
  // Enquiry CRUD
  createEnquiry: (enq: Partial<Enquiry>) => Promise<{ success: boolean; error?: string }>;
  updateEnquiryStatus: (id: string, status: "New" | "Answered") => Promise<boolean>;
  deleteEnquiry: (id: string) => Promise<boolean>;
  deleteAllEnquiries: () => Promise<boolean>;
  // Testimonial & Feedback CRUD
  submitTestimonialFeedback: (t: Partial<Testimonial>) => Promise<{ success: boolean; message?: string; error?: string }>;
  saveTestimonial: (t: Testimonial, isNew: boolean) => Promise<boolean>;
  updateTestimonialStatus: (id: string, status: "Pending" | "Approved" | "Rejected") => Promise<boolean>;
  deleteTestimonial: (id: string) => Promise<boolean>;
  deleteAllTestimonials: () => Promise<boolean>;
  // Product Reviews & Feedback CRUD
  submitProductReview: (review: Partial<Review>) => Promise<{ success: boolean; message?: string; error?: string }>;
  updateReviewStatus: (id: string, status: "Pending" | "Approved" | "Rejected") => Promise<boolean>;
  deleteReview: (id: string) => Promise<boolean>;
  deleteAllReviews: () => Promise<boolean>;
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
        revRes,
      ] = await Promise.allSettled([
        fetch("/api/products").then((r) => r.json()),
        fetch("/api/categories").then((r) => r.json()),
        fetch("/api/blogs").then((r) => r.json()),
        fetch("/api/orders").then((r) => r.json()),
        fetch("/api/testimonials?all=true").then((r) => r.json()),
        fetch("/api/enquiries").then((r) => r.json()),
        fetch("/api/coupons").then((r) => r.json()),
        fetch("/api/customers").then((r) => r.json()),
        fetch("/api/settings").then((r) => r.json()),
        fetch("/api/reviews?all=true").then((r) => r.json()),
      ]);

      setState((prev) => {
        const next = { ...prev };
        if (prodRes.status === "fulfilled" && prodRes.value?.success && Array.isArray(prodRes.value.products)) {
          next.products = prodRes.value.products;
        }

        if (catRes.status === "fulfilled" && catRes.value?.success && Array.isArray(catRes.value.categories)) {
          next.categories = catRes.value.categories;
        }

        if (blogRes.status === "fulfilled" && blogRes.value?.success && Array.isArray(blogRes.value.blogs)) {
          next.blogs = blogRes.value.blogs;
        }
        if (orderRes.status === "fulfilled" && orderRes.value?.success && Array.isArray(orderRes.value.orders)) {
          next.orders = orderRes.value.orders;
        }
        if (testRes.status === "fulfilled" && testRes.value?.success && Array.isArray(testRes.value.testimonials)) {
          next.testimonials = testRes.value.testimonials;
        }
        if (enqRes.status === "fulfilled" && enqRes.value?.success && Array.isArray(enqRes.value.enquiries)) {
          next.enquiries = enqRes.value.enquiries;
        }
        if (coupRes.status === "fulfilled" && coupRes.value?.success && Array.isArray(coupRes.value.coupons)) {
          next.coupons = coupRes.value.coupons;
        }
        if (custRes.status === "fulfilled" && custRes.value?.success && Array.isArray(custRes.value.customers)) {
          next.customers = custRes.value.customers;
        }
        if (settRes.status === "fulfilled" && settRes.value?.success && settRes.value.settings) {
          next.settings = settRes.value.settings;
        }
        if (revRes.status === "fulfilled" && revRes.value?.success && Array.isArray(revRes.value.reviews)) {
          next.reviews = revRes.value.reviews;
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
        setState((s) => ({
          ...s,
          ...parsed,
          products: parsed.products && parsed.products.length > 0 ? parsed.products : s.products,
          categories: parsed.categories && parsed.categories.length > 0 ? parsed.categories : s.categories,
        }));

        if (parsed.currentUser) {
          fetch(`/api/auth/user?email=${encodeURIComponent(parsed.currentUser)}`)
            .then((r) => r.json())
            .then((d) => {
              if (d.success && d.user) {
                const u = d.user;
                setState((s) => ({
                  ...s,
                  currentUserData: u,
                  users: [
                    ...s.users.filter((x) => x.email.toLowerCase() !== u.email.toLowerCase()),
                    u,
                  ],
                }));
              }
            })
            .catch(() => {});
        }
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

  const sendLoginOtp = async (email: string, pass: string) => {
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "login", email, password: pass }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || "Failed to send verification OTP." };
      }
      return { success: true, testOtp: data.testOtp };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Network error while sending OTP";
      return { success: false, error: msg };
    }
  };

  const sendRegisterOtp = async (u: { name: string; email: string; password: string; confirmPassword?: string; phone?: string }) => {
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "registration", ...u }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || "Failed to send registration OTP." };
      }
      return { success: true, testOtp: data.testOtp };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Network error while sending OTP";
      return { success: false, error: msg };
    }
  };

  const verifyOtp = async (email: string, otp: string, type: "login" | "registration") => {
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, type }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || "Invalid or expired OTP." };
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

      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Network error while verifying OTP";
      return { success: false, error: msg };
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
      await fetch(`/api/products/${encodeURIComponent(id)}`, { method: "DELETE" });
    } catch (e) {
      console.error("Delete product error:", e);
    }
    set((s) => ({
      ...s,
      products: s.products.filter((p) => p.id !== id && p.name !== id),
      cart: s.cart.filter((c) => c.id !== id),
      wishlist: s.wishlist.filter((w) => w !== id),
    }));
    return true;
  };

  const saveCategory = async (c: Category, isNew: boolean) => {
    try {
      const url = isNew ? "/api/categories" : `/api/categories/${encodeURIComponent(c.id)}`;
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
      await fetch(`/api/categories/${encodeURIComponent(id)}`, { method: "DELETE" });
    } catch (e) {
      console.error("Delete category error:", e);
    }
    set((s) => ({
      ...s,
      categories: s.categories.filter((c) => c.id !== id && c.slug !== id && c.name !== id),
    }));
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
      await fetch(`/api/orders/${encodeURIComponent(id)}`, { method: "DELETE" });
    } catch (e) {
      console.error("Delete order error:", e);
    }
    set((s) => ({ ...s, orders: s.orders.filter((o) => o.id !== id) }));
    return true;
  };

  const saveBlog = async (b: Blog, isNew: boolean) => {
    try {
      const url = isNew ? "/api/blogs" : `/api/blogs/${encodeURIComponent(b.id)}`;
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
      await fetch(`/api/blogs/${encodeURIComponent(id)}`, { method: "DELETE" });
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
      await fetch(`/api/coupons/${encodeURIComponent(code)}`, { method: "DELETE" });
    } catch (e) {
      console.error("Delete coupon error:", e);
    }
    set((s) => ({
      ...s,
      coupons: s.coupons.filter((c) => c.code.toUpperCase() !== code.toUpperCase()),
    }));
    return true;
  };

  const deleteAllCoupons = async () => {
    try {
      await fetch("/api/coupons", { method: "DELETE" });
    } catch (e) {
      console.error("Delete all coupons error:", e);
    }
    set((s) => ({
      ...s,
      coupons: [],
    }));
    return true;
  };

  const saveCustomer = async (c: Customer, isNew: boolean) => {
    try {
      const url = isNew ? "/api/customers" : `/api/customers/${encodeURIComponent(c.id)}`;
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

  const deleteCustomer = async (idOrEmail: string) => {
    try {
      await fetch(`/api/customers/${encodeURIComponent(idOrEmail)}`, { method: "DELETE" });
    } catch (e) {
      console.error("Delete customer error:", e);
    }
    const target = idOrEmail.toLowerCase();
    set((s) => ({
      ...s,
      customers: s.customers.filter(
        (c) =>
          c.id !== idOrEmail &&
          c.id?.toLowerCase() !== target &&
          c.email?.toLowerCase() !== target &&
          (c as unknown as { _id?: string })._id !== idOrEmail
      ),
    }));
    return true;
  };

  const deleteAllCustomers = async () => {
    try {
      await fetch("/api/customers", { method: "DELETE" });
    } catch (e) {
      console.error("Delete all customers error:", e);
    }
    set((s) => ({
      ...s,
      customers: [],
    }));
    return true;
  };

  const createEnquiry = async (enq: Partial<Enquiry>) => {
    const id = enq.id || `e_${Date.now()}`;
    const date = enq.date || new Date().toISOString().split("T")[0];
    const fallbackEnq: Enquiry = {
      id,
      name: enq.name || "",
      email: enq.email || "",
      phone: enq.phone || "",
      subject: enq.subject || "General Farming Enquiry",
      message: enq.message || "",
      date,
      status: (enq.status as "New" | "Answered") || "New",
    };

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fallbackEnq),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        const saved = data.enquiry || fallbackEnq;
        set((s) => ({ ...s, enquiries: [saved, ...s.enquiries.filter((x) => x.id !== saved.id)] }));
        return { success: true };
      }
    } catch (err: unknown) {
      console.warn("Submit enquiry API fallback:", err);
    }

    set((s) => ({ ...s, enquiries: [fallbackEnq, ...s.enquiries.filter((x) => x.id !== id)] }));
    return { success: true };
  };

  const updateEnquiryStatus = async (id: string, status: "New" | "Answered") => {
    try {
      const res = await fetch(`/api/enquiries/${encodeURIComponent(id)}`, {
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
      const res = await fetch(`/api/enquiries/${encodeURIComponent(id)}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (data && data.success === false) {
        console.error("Delete enquiry API error:", data.error);
      }
    } catch (e) {
      console.error("Delete enquiry error:", e);
    }
    const cleanId = String(id).trim();
    set((s) => ({
      ...s,
      enquiries: s.enquiries.filter((e) => {
        const eId = String(e.id || "").trim();
        const eMongoId = String((e as unknown as { _id?: string })._id || "").trim();
        return eId !== cleanId && eMongoId !== cleanId && e.id !== id;
      }),
    }));
    return true;
  };

  const deleteAllEnquiries = async () => {
    try {
      await fetch("/api/enquiries", { method: "DELETE" });
    } catch (e) {
      console.error("Delete all enquiries error:", e);
    }
    set((s) => ({ ...s, enquiries: [] }));
    return true;
  };

  const submitTestimonialFeedback = async (t: Partial<Testimonial>) => {
    const id = t.id || `t_${Date.now()}`;
    const date = t.date || new Date().toISOString().split("T")[0];
    const status = (t.status as "Pending" | "Approved" | "Rejected") || "Pending";

    const newTestimonial: Testimonial = {
      id,
      name: t.name ? t.name.trim() : "",
      place: t.place ? t.place.trim() : "Vijayapura, Karnataka",
      crop: t.crop ? t.crop.trim() : "Sugarcane",
      rating: Number(t.rating || 5),
      quote: t.quote ? t.quote.trim() : "",
      productId: t.productId || "",
      productName: t.productName || "",
      status,
      date,
      image: t.image || "",
    };

    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTestimonial),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        const saved = data.testimonial || newTestimonial;
        set((s) => ({
          ...s,
          testimonials: [saved, ...s.testimonials.filter((x) => x.id !== saved.id)],
        }));
        return {
          success: true,
          message:
            data.message ||
            (status === "Pending"
              ? "Thank you! Your feedback has been submitted for admin approval."
              : "Thank you! Your feedback has been submitted and is now live on our website!"),
        };
      }
    } catch (e) {
      console.warn("Submit testimonial API fallback:", e);
    }

    set((s) => ({
      ...s,
      testimonials: [newTestimonial, ...s.testimonials.filter((x) => x.id !== id)],
    }));
    return {
      success: true,
      message:
        status === "Pending"
          ? "Thank you! Your feedback has been submitted for admin approval."
          : "Thank you! Your feedback has been submitted and is now live on our website!",
    };
  };

  const updateTestimonialStatus = async (id: string, status: "Pending" | "Approved" | "Rejected") => {
    try {
      const res = await fetch(`/api/testimonials/${encodeURIComponent(id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        set((s) => ({
          ...s,
          testimonials: s.testimonials.map((t) => (t.id === id ? { ...t, status } : t)),
        }));
        return true;
      }
    } catch (e) {
      console.error("Update testimonial status error:", e);
    }
    set((s) => ({
      ...s,
      testimonials: s.testimonials.map((t) => (t.id === id ? { ...t, status } : t)),
    }));
    return true;
  };

  const saveTestimonial = async (t: Testimonial, isNew: boolean) => {
    try {
      const url = isNew ? "/api/testimonials" : `/api/testimonials/${encodeURIComponent(t.id)}`;
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
            ? [saved, ...s.testimonials.filter((x) => x.id !== saved.id)]
            : s.testimonials.map((item) => (item.id === saved.id ? saved : item)),
        }));
        return true;
      }
    } catch (e) {
      console.error("Save testimonial error:", e);
    }
    const fallbackItem = { ...t };
    set((s) => ({
      ...s,
      testimonials: isNew
        ? [{ ...fallbackItem, id: t.id || `t_${Date.now()}` }, ...s.testimonials]
        : s.testimonials.map((item) => (item.id === t.id ? fallbackItem : item)),
    }));
    return true;
  };

  const deleteTestimonial = async (id: string) => {
    try {
      await fetch(`/api/testimonials/${encodeURIComponent(id)}`, { method: "DELETE" });
    } catch (e) {
      console.error("Delete testimonial error:", e);
    }
    set((s) => ({ ...s, testimonials: s.testimonials.filter((t) => t.id !== id) }));
    return true;
  };

  const deleteAllTestimonials = async () => {
    try {
      await fetch("/api/testimonials", { method: "DELETE" });
    } catch (e) {
      console.error("Delete all testimonials error:", e);
    }
    set((s) => ({ ...s, testimonials: [] }));
    return true;
  };

  // Product Reviews & Feedback CRUD
  const submitProductReview = async (review: Partial<Review>) => {
    const id = review.id || `r_${Date.now()}`;
    const date = review.date || new Date().toISOString().split("T")[0];
    const status = (review.status as "Pending" | "Approved" | "Rejected") || "Pending";

    const newReview: Review = {
      id,
      productId: review.productId || "",
      name: review.name ? review.name.trim() : "",
      rating: Number(review.rating || 5),
      date,
      comment: review.comment ? review.comment.trim() : "",
      status,
    };

    const updateProductRatingInState = (reviewsList: Review[], prodId: string) => {
      const prodApprovedReviews = reviewsList.filter(
        (r) => r.productId === prodId && (r.status === "Approved" || !r.status)
      );
      const avg =
        prodApprovedReviews.length > 0
          ? prodApprovedReviews.reduce((sum, r) => sum + (r.rating || 5), 0) / prodApprovedReviews.length
          : 0;
      set((s) => ({
        ...s,
        products: s.products.map((p) =>
          p.id === prodId
            ? {
                ...p,
                reviews: prodApprovedReviews.length,
                rating: Number(avg.toFixed(1)),
              }
            : p
        ),
      }));
    };

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReview),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        const saved = data.review || newReview;
        set((s) => {
          const nextReviews = [saved, ...s.reviews.filter((x) => x.id !== saved.id)];
          return { ...s, reviews: nextReviews };
        });
        if (saved.status === "Approved" && saved.productId) {
          updateProductRatingInState([saved, ...state.reviews], saved.productId);
        }
        return {
          success: true,
          message:
            data.message ||
            (status === "Pending"
              ? "Thank you! Your feedback has been submitted for admin approval."
              : "Thank you! Your crop review has been posted successfully."),
        };
      }
    } catch (e) {
      console.warn("Submit product review API fallback:", e);
    }

    set((s) => {
      const nextReviews = [newReview, ...s.reviews.filter((x) => x.id !== id)];
      return { ...s, reviews: nextReviews };
    });
    if (newReview.status === "Approved" && newReview.productId) {
      updateProductRatingInState([newReview, ...state.reviews], newReview.productId);
    }
    return {
      success: true,
      message:
        status === "Pending"
          ? "Thank you! Your feedback has been submitted for admin approval."
          : "Thank you! Your crop review has been posted successfully.",
    };
  };

  const updateReviewStatus = async (id: string, status: "Pending" | "Approved" | "Rejected") => {
    let targetProdId = "";
    try {
      const res = await fetch(`/api/reviews/${encodeURIComponent(id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        set((s) => {
          const updatedReviews = s.reviews.map((r) => {
            if (r.id === id) {
              targetProdId = r.productId;
              return { ...r, status };
            }
            return r;
          });
          let updatedProducts = s.products;
          if (targetProdId) {
            const prodApproved = updatedReviews.filter(
              (r) => r.productId === targetProdId && (r.status === "Approved" || !r.status)
            );
            const avg =
              prodApproved.length > 0
                ? prodApproved.reduce((sum, r) => sum + (r.rating || 5), 0) / prodApproved.length
                : 0;
            updatedProducts = s.products.map((p) =>
              p.id === targetProdId
                ? { ...p, reviews: prodApproved.length, rating: Number(avg.toFixed(1)) }
                : p
            );
          }
          return { ...s, reviews: updatedReviews, products: updatedProducts };
        });
        return true;
      }
    } catch (e) {
      console.error("Update review status error:", e);
    }
    set((s) => {
      const updatedReviews = s.reviews.map((r) => {
        if (r.id === id) {
          targetProdId = r.productId;
          return { ...r, status };
        }
        return r;
      });
      let updatedProducts = s.products;
      if (targetProdId) {
        const prodApproved = updatedReviews.filter(
          (r) => r.productId === targetProdId && (r.status === "Approved" || !r.status)
        );
        const avg =
          prodApproved.length > 0
            ? prodApproved.reduce((sum, r) => sum + (r.rating || 5), 0) / prodApproved.length
            : 0;
        updatedProducts = s.products.map((p) =>
          p.id === targetProdId
            ? { ...p, reviews: prodApproved.length, rating: Number(avg.toFixed(1)) }
            : p
        );
      }
      return { ...s, reviews: updatedReviews, products: updatedProducts };
    });
    return true;
  };

  const deleteReview = async (id: string) => {
    let targetProdId = "";
    try {
      await fetch(`/api/reviews/${encodeURIComponent(id)}`, { method: "DELETE" });
    } catch (e) {
      console.error("Delete review error:", e);
    }
    set((s) => {
      const reviewToDelete = s.reviews.find((r) => r.id === id);
      targetProdId = reviewToDelete?.productId || "";
      const updatedReviews = s.reviews.filter((r) => r.id !== id);
      let updatedProducts = s.products;
      if (targetProdId) {
        const prodApproved = updatedReviews.filter(
          (r) => r.productId === targetProdId && (r.status === "Approved" || !r.status)
        );
        const avg =
          prodApproved.length > 0
            ? prodApproved.reduce((sum, r) => sum + (r.rating || 5), 0) / prodApproved.length
            : 0;
        updatedProducts = s.products.map((p) =>
          p.id === targetProdId
            ? { ...p, reviews: prodApproved.length, rating: Number(avg.toFixed(1)) }
            : p
        );
      }
      return { ...s, reviews: updatedReviews, products: updatedProducts };
    });
    return true;
  };

  const deleteAllReviews = async () => {
    try {
      await fetch("/api/reviews", { method: "DELETE" });
    } catch (e) {
      console.error("Delete all reviews error:", e);
    }
    set((s) => ({
      ...s,
      reviews: [],
      products: s.products.map((p) => ({ ...p, reviews: 0 })),
    }));
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
    sendLoginOtp,
    sendRegisterOtp,
    verifyOtp,
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
    deleteAllCoupons,
    saveCustomer,
    deleteCustomer,
    deleteAllCustomers,
    createEnquiry,
    updateEnquiryStatus,
    deleteEnquiry,
    deleteAllEnquiries,
    submitTestimonialFeedback,
    saveTestimonial,
    updateTestimonialStatus,
    deleteTestimonial,
    deleteAllTestimonials,
    submitProductReview,
    updateReviewStatus,
    deleteReview,
    deleteAllReviews,
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
