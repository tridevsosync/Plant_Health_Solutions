"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  User as UserIcon,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  MapPin,
  Package,
  Heart,
  LogOut,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  UserCheck,
  Truck,
  FileText,
  Clock,
  CreditCard,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { inr, useApp, useUser, type Address } from "@/lib/store";
import { PageHero } from "@/components/site/Section";

function AccountContent() {
  const { state, login, register, logout, addToCart, toggleWishlist, updateUserAddresses, updateUserProfile } = useApp();
  const user = useUser();
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as "dashboard" | "profile" | "addresses" | "wishlist" | "orders") || "dashboard";

  const [mode, setMode] = React.useState<"login" | "register">("login");
  const [loading, setLoading] = React.useState(false);
  const [showLoginPassword, setShowLoginPassword] = React.useState(false);
  const [showRegPassword, setShowRegPassword] = React.useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = React.useState(false);

  // Form states
  const [regForm, setRegForm] = React.useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [loginForm, setLoginForm] = React.useState({
    email: "",
    password: "",
  });

  const [tab, setTab] = React.useState<"dashboard" | "profile" | "addresses" | "wishlist" | "orders">(
    ["dashboard", "profile", "addresses", "wishlist", "orders"].includes(initialTab) ? initialTab : "dashboard"
  );

  React.useEffect(() => {
    const t = searchParams.get("tab");
    if (t && ["dashboard", "profile", "addresses", "wishlist", "orders"].includes(t)) {
      setTab(t as typeof tab);
    }
  }, [searchParams]);

  // Address modal/form state
  const [showAddressModal, setShowAddressModal] = React.useState(false);
  const [addrForm, setAddrForm] = React.useState<Address>({
    label: "Home",
    line: "",
    city: "",
    pincode: "",
  });

  // Profile edit state
  const [profileName, setProfileName] = React.useState("");
  const [profilePhone, setProfilePhone] = React.useState("");

  React.useEffect(() => {
    if (user) {
      setProfileName(user.name || "");
      setProfilePhone(user.phone || "");
    }
  }, [user]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regForm.name.trim()) {
      toast.error("Please enter your full name.");
      return;
    }
    if (!regForm.email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(regForm.email.trim())) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (!regForm.password) {
      toast.error("Please create a password.");
      return;
    }
    if (regForm.password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }
    if (regForm.password !== regForm.confirmPassword) {
      toast.error("Passwords do not match! Please confirm your password.");
      return;
    }

    try {
      setLoading(true);
      const err = await register({
        name: regForm.name.trim(),
        email: regForm.email.trim(),
        phone: regForm.phone.trim(),
        password: regForm.password,
        confirmPassword: regForm.confirmPassword,
      });

      if (err) {
        toast.error(err);
      } else {
        toast.success(`Welcome to Plant Health Solutions, ${regForm.name}!`);
      }
    } catch {
      toast.error("An error occurred during registration. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginForm.email.trim() || !loginForm.password) {
      toast.error("Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);
      const err = await login(loginForm.email.trim(), loginForm.password);
      if (err) {
        toast.error(err);
      } else {
        toast.success("Welcome back! Login successful.");
      }
    } catch {
      toast.error("An error occurred during login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fillDemoFarmer = () => {
    setLoginForm({
      email: "farmer@example.com",
      password: "Farmer@123",
    });
    toast.info("Filled demo farmer credentials!");
  };

  const fillDemoAdmin = () => {
    setLoginForm({
      email: "planthealth@gmail.com",
      password: "Planthealth@123",
    });
    toast.info("Filled demo admin credentials!");
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName.trim()) {
      toast.error("Full name cannot be empty.");
      return;
    }
    setLoading(true);
    const ok = await updateUserProfile(profileName.trim(), profilePhone.trim());
    setLoading(false);
    if (ok) {
      toast.success("Profile details updated successfully!");
    } else {
      toast.error("Failed to update profile.");
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrForm.line.trim() || !addrForm.city.trim() || !addrForm.pincode.trim()) {
      toast.error("Please fill in address line, city, and pincode.");
      return;
    }

    const currentAddresses = user?.addresses || [];
    const updated = [...currentAddresses, addrForm];
    setLoading(true);
    const ok = await updateUserAddresses(updated);
    setLoading(false);
    if (ok) {
      toast.success("Address added successfully!");
      setShowAddressModal(false);
      setAddrForm({ label: "Home", line: "", city: "", pincode: "" });
    } else {
      toast.error("Failed to save address.");
    }
  };

  const handleDeleteAddress = async (index: number) => {
    if (!user) return;
    const updated = user.addresses.filter((_, i) => i !== index);
    const ok = await updateUserAddresses(updated);
    if (ok) {
      toast.success("Address removed.");
    }
  };

  if (!user) {
    return (
      <div className="min-h-[80vh] bg-background">
        <PageHero
          title="Account Login & Registration"
          subtitle="Access your order history, manage farm delivery addresses, and track real-time dispatches."
        />

        <div className="mx-auto max-w-lg px-4 py-12">
          <div className="overflow-hidden rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xl">
            {/* Tab switch */}
            <div className="flex rounded-2xl bg-muted p-1.5 mb-6">
              <button
                type="button"
                onClick={() => setMode("login")}
                className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all ${
                  mode === "login"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setMode("register")}
                className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all ${
                  mode === "register"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Create Account
              </button>
            </div>

            {mode === "login" ? (
              <div>
                {/* Quick Demo Credentials */}
                <div className="mb-5 rounded-2xl bg-muted/60 p-3 border border-border/80">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                    <UserCheck className="h-3.5 w-3.5 text-primary" /> Quick Demo Credentials
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={fillDemoFarmer}
                      className="rounded-xl border border-border bg-background px-3 py-1.5 text-left text-xs hover:border-primary transition-all"
                    >
                      <div className="font-bold text-foreground">Farmer Account</div>
                      <div className="text-[10px] text-muted-foreground truncate">farmer@example.com</div>
                    </button>
                    <button
                      type="button"
                      onClick={fillDemoAdmin}
                      className="rounded-xl border border-border bg-background px-3 py-1.5 text-left text-xs hover:border-primary transition-all"
                    >
                      <div className="font-bold text-foreground">Admin Account</div>
                      <div className="text-[10px] text-muted-foreground truncate">planthealth@gmail.com</div>
                    </button>
                  </div>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Email Address <span className="text-destructive">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                      <input
                        type="email"
                        required
                        value={loginForm.email}
                        onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                        placeholder="farmer@example.com"
                        className="w-full rounded-xl border border-border bg-background pl-10 pr-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Password <span className="text-destructive">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                      <input
                        type={showLoginPassword ? "text" : "password"}
                        required
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        placeholder="Enter your password"
                        className="w-full rounded-xl border border-border bg-background pl-10 pr-10 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground p-0.5"
                        aria-label={showLoginPassword ? "Hide password" : "Show password"}
                      >
                        {showLoginPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-2 flex items-center justify-center gap-2 rounded-full bg-primary py-3 text-sm font-bold text-primary-foreground shadow-md hover:opacity-90 transition-all disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign In to Account"}
                  </button>

                  <p className="pt-2 text-center text-xs text-muted-foreground">
                    Don&apos;t have an account yet?{" "}
                    <button
                      type="button"
                      onClick={() => setMode("register")}
                      className="font-semibold text-primary underline hover:opacity-80"
                    >
                      Register here
                    </button>
                  </p>
                </form>
              </div>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Full Name <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      required
                      value={regForm.name}
                      onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                      placeholder="e.g. Ramesh Patil"
                      className="w-full rounded-xl border border-border bg-background pl-10 pr-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Email Address <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                    <input
                      type="email"
                      required
                      value={regForm.email}
                      onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                      placeholder="name@farm.com"
                      className="w-full rounded-xl border border-border bg-background pl-10 pr-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Phone Number (Optional)
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                    <input
                      type="tel"
                      value={regForm.phone}
                      onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                      placeholder="+91 98450 12345"
                      className="w-full rounded-xl border border-border bg-background pl-10 pr-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Password <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                    <input
                      type={showRegPassword ? "text" : "password"}
                      required
                      value={regForm.password}
                      onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                      placeholder="Minimum 6 characters"
                      className="w-full rounded-xl border border-border bg-background pl-10 pr-10 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground p-0.5"
                      aria-label={showRegPassword ? "Hide password" : "Show password"}
                    >
                      {showRegPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Confirm Password <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                    <input
                      type={showRegConfirmPassword ? "text" : "password"}
                      required
                      value={regForm.confirmPassword}
                      onChange={(e) => setRegForm({ ...regForm, confirmPassword: e.target.value })}
                      placeholder="Re-enter password to confirm"
                      className="w-full rounded-xl border border-border bg-background pl-10 pr-10 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground p-0.5"
                      aria-label={showRegConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                    >
                      {showRegConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {regForm.password && regForm.confirmPassword && (
                    <div className="mt-1.5 flex items-center gap-1.5 text-xs">
                      {regForm.password === regForm.confirmPassword ? (
                        <span className="text-primary flex items-center gap-1 font-medium">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Passwords match
                        </span>
                      ) : (
                        <span className="text-destructive flex items-center gap-1 font-medium">
                          <AlertCircle className="h-3.5 w-3.5" /> Passwords do not match
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-3 flex items-center justify-center gap-2 rounded-full bg-primary py-3 text-sm font-bold text-primary-foreground shadow-md hover:opacity-90 transition-all disabled:opacity-50"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Free Account"}
                </button>

                <p className="pt-2 text-center text-xs text-muted-foreground">
                  Already registered?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    className="font-semibold text-primary underline hover:opacity-80"
                  >
                    Sign in here
                  </button>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  const myOrders = state.orders.filter(
    (o) => o.email?.toLowerCase() === user.email?.toLowerCase()
  );
  const wishlist = state.products.filter((p) => state.wishlist.includes(p.id));

  return (
    <div className="min-h-[80vh] bg-background">
      <PageHero
        title={`Namaste, ${user.name || "Farmer Friend"}`}
        subtitle={`Logged in as ${user.email} · Track orders, farm addresses, and personal recommendations.`}
      />

      <div className="mx-auto max-w-7xl px-4 py-10">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
          <div className="flex flex-wrap gap-2">
            {[
              { id: "dashboard", label: "Dashboard", icon: Package },
              { id: "orders", label: `Orders & Tracking (${myOrders.length})`, icon: Truck },
              { id: "wishlist", label: `Wishlist (${wishlist.length})`, icon: Heart },
              { id: "addresses", label: `Addresses (${user.addresses?.length || 0})`, icon: MapPin },
              { id: "profile", label: "Profile", icon: UserIcon },
            ].map((t) => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id as typeof tab)}
                  className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-all ${
                    active
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "border border-border bg-card text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {t.label}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => {
              logout();
              toast.success("Successfully logged out");
            }}
            className="inline-flex items-center gap-2 rounded-full border border-destructive/30 px-5 py-2 text-sm font-semibold text-destructive hover:bg-destructive/10 transition-all"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>

        {/* Tab Contents */}
        <div className="mt-8">
          {tab === "dashboard" && (
            <div className="space-y-8">
              <div className="grid gap-5 sm:grid-cols-3">
                <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Placed Orders</span>
                    <Truck className="h-5 w-5 text-primary" />
                  </div>
                  <p className="mt-3 text-3xl font-extrabold text-foreground">{myOrders.length}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Total orders placed to date</p>
                </div>

                <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Wishlist Products</span>
                    <Heart className="h-5 w-5 text-rose-500" />
                  </div>
                  <p className="mt-3 text-3xl font-extrabold text-foreground">{wishlist.length}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Saved for future reference</p>
                </div>

                <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Farm Addresses</span>
                    <MapPin className="h-5 w-5 text-secondary" />
                  </div>
                  <p className="mt-3 text-3xl font-extrabold text-foreground">
                    {user.addresses?.length || 0}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">Saved delivery locations</p>
                </div>
              </div>

              {/* Recent Orders Overview */}
              <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display text-lg font-bold text-foreground">Recent Orders</h3>
                  <button
                    onClick={() => setTab("orders")}
                    className="text-xs font-semibold text-primary underline hover:opacity-80"
                  >
                    View All Orders &amp; Invoices ({myOrders.length})
                  </button>
                </div>

                {myOrders.length === 0 ? (
                  <p className="py-6 text-center text-sm text-muted-foreground">
                    You haven&apos;t placed any orders yet. Explore our Bio Fertilizers and Farm Solutions!
                  </p>
                ) : (
                  <div className="divide-y divide-border">
                    {myOrders.slice(0, 3).map((o) => (
                      <div key={o.id} className="flex flex-wrap items-center justify-between py-4 gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-foreground">{o.id}</p>
                            <span className="text-xs font-mono text-muted-foreground">
                              ({o.trackingNumber || `PHS-TRK-${o.id.slice(-6)}`})
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Placed on {o.date} · {o.items.length} items · {o.payment}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              o.status === "Delivered"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : o.status === "Shipped"
                                ? "bg-blue-50 text-blue-700 border border-blue-200"
                                : o.status === "Cancelled"
                                ? "bg-red-50 text-red-700 border border-red-200"
                                : "bg-amber-50 text-amber-700 border border-amber-200"
                            }`}
                          >
                            {o.status}
                          </span>
                          <span className="font-bold text-foreground">{inr(o.total)}</span>
                          <Link
                            href={`/orders/${o.id}`}
                            className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary hover:bg-primary hover:text-primary-foreground transition-all"
                          >
                            <FileText className="h-3.5 w-3.5" /> Tax Invoice &amp; Track
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {tab === "orders" && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="font-display text-xl font-bold text-foreground">My Orders &amp; Consignment Tracking</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Track real-time dispatch progress, carrier consignment numbers, and download official GST tax invoices.
                  </p>
                </div>
                <Link
                  href="/shop"
                  className="rounded-full bg-primary px-5 py-2 text-xs font-bold text-primary-foreground shadow-sm hover:bg-secondary transition-all"
                >
                  Browse Catalogue
                </Link>
              </div>

              {myOrders.length === 0 ? (
                <div className="rounded-3xl border border-border bg-card py-16 px-4 text-center shadow-sm">
                  <Package className="mx-auto h-16 w-16 text-muted-foreground/40 mb-3" />
                  <p className="text-lg font-bold text-foreground">No orders placed yet</p>
                  <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
                    When you order bio fertilizers, disease protectors, or organic enrichers, your order tracking and GST invoices will appear here.
                  </p>
                  <Link
                    href="/shop"
                    className="mt-6 inline-block rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground hover:bg-secondary transition-all"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="grid gap-6">
                  {myOrders.map((o) => {
                    const step =
                      o.status === "Delivered"
                        ? 4
                        : o.status === "Shipped"
                        ? 3
                        : o.status === "Processing"
                        ? 2
                        : 1;

                    return (
                      <div
                        key={o.id}
                        className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
                      >
                        {/* Order Header Bar */}
                        <div className="flex flex-wrap items-center justify-between gap-4 bg-muted/40 p-5 sm:px-6 border-b border-border">
                          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                            <div>
                              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Order ID</span>
                              <p className="font-mono font-bold text-foreground text-sm">{o.id}</p>
                            </div>
                            <div>
                              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Date Placed</span>
                              <p className="font-semibold text-foreground text-sm">{o.date}</p>
                            </div>
                            <div>
                              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Payment Method</span>
                              <p className="font-semibold text-foreground text-sm flex items-center gap-1.5">
                                <CreditCard className="h-3.5 w-3.5 text-primary" /> {o.payment}
                              </p>
                            </div>
                            <div>
                              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Total Amount</span>
                              <p className="font-extrabold text-primary text-sm">{inr(o.total)}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2.5">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-bold flex items-center gap-1.5 ${
                                o.status === "Delivered"
                                  ? "bg-emerald-500/15 text-emerald-700 border border-emerald-500/30"
                                  : o.status === "Shipped"
                                  ? "bg-blue-500/15 text-blue-700 border border-blue-500/30"
                                  : o.status === "Cancelled"
                                  ? "bg-red-500/15 text-red-700 border border-red-500/30"
                                  : "bg-amber-500/15 text-amber-700 border border-amber-500/30"
                              }`}
                            >
                              <span className="h-1.5 w-1.5 rounded-full bg-current" />
                              {o.status}
                            </span>
                            <Link
                              href={`/orders/${o.id}`}
                              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground shadow-xs hover:bg-secondary transition-all"
                            >
                              <FileText className="h-3.5 w-3.5" /> Tax Invoice &amp; Live Tracking
                            </Link>
                          </div>
                        </div>

                        {/* Order Body */}
                        <div className="p-5 sm:p-6 space-y-5">
                          {/* Live Tracking Status Bar */}
                          <div className="rounded-2xl border border-border/80 bg-background p-4">
                            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                              <div className="flex items-center gap-2">
                                <Truck className="h-4 w-4 text-primary" />
                                <span className="text-xs font-bold text-foreground">
                                  Courier: {o.courier || "VRL Logistics / DTDC Express"}
                                </span>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                Tracking No:{" "}
                                <strong className="font-mono text-foreground">
                                  {o.trackingNumber || `PHS-TRK-${o.id.slice(-6)}`}
                                </strong>
                              </span>
                            </div>

                            {/* 4-step progress line */}
                            <div className="grid grid-cols-4 gap-2 pt-1">
                              {[
                                { stage: 1, name: "Confirmed" },
                                { stage: 2, name: "Quality Check" },
                                { stage: 3, name: "Dispatched" },
                                { stage: 4, name: "Delivered" },
                              ].map((s) => {
                                const isDone = s.stage <= step;
                                return (
                                  <div key={s.stage} className="flex flex-col items-center">
                                    <div
                                      className={`h-1.5 w-full rounded-full transition-all ${
                                        isDone ? "bg-primary" : "bg-muted"
                                      }`}
                                    />
                                    <span
                                      className={`mt-1.5 text-[10px] sm:text-xs font-semibold text-center ${
                                        isDone ? "text-primary font-bold" : "text-muted-foreground"
                                      }`}
                                    >
                                      {s.name}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Items Preview */}
                          <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                              Ordered Products ({o.items.length})
                            </p>
                            <div className="divide-y divide-border/60">
                              {o.items.map((it) => (
                                <div key={it.id} className="flex items-center justify-between py-2.5 gap-4">
                                  <div className="flex items-center gap-3">
                                    {it.image && (
                                      <img
                                        src={it.image}
                                        alt={it.name}
                                        className="h-10 w-10 rounded-xl object-cover border border-border"
                                      />
                                    )}
                                    <div>
                                      <p className="text-sm font-bold text-foreground">{it.name}</p>
                                      <p className="text-xs text-muted-foreground">
                                        Qty: {it.qty} {it.unit ? `· ${it.unit}` : ""} · {inr(it.price)} each
                                      </p>
                                    </div>
                                  </div>
                                  <p className="font-bold text-foreground text-sm">{inr(it.price * it.qty)}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Order Footer Link */}
                          <div className="flex flex-wrap items-center justify-between pt-3 border-t border-border/80 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1.5">
                              <MapPin className="h-3.5 w-3.5 text-primary" /> Delivery to: {o.address}
                            </span>
                            <Link
                              href={`/orders/${o.id}`}
                              className="font-bold text-primary hover:underline inline-flex items-center gap-1"
                            >
                              Open Full Printable Invoice <ExternalLink className="h-3 w-3" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {tab === "wishlist" && (
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <h3 className="font-display text-lg font-bold text-foreground mb-4">Saved Wishlist</h3>
              {wishlist.length === 0 ? (
                <div className="py-12 text-center">
                  <Heart className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
                  <p className="text-base font-semibold text-foreground">Your wishlist is empty</p>
                  <p className="text-sm text-muted-foreground mt-1">Tap the heart icon on any product to save it here.</p>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {wishlist.map((p) => (
                    <div
                      key={p.id}
                      className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-4 transition-all hover:shadow-md"
                    >
                      <div>
                        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-muted">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                        <span className="mt-3 inline-block rounded-md bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                          {p.category}
                        </span>
                        <h4 className="mt-1 font-display font-bold text-foreground">{p.name}</h4>
                        <p className="mt-1 text-sm font-extrabold text-primary">{inr(p.price)}</p>
                      </div>

                      <div className="mt-4 flex items-center gap-2 pt-3 border-t border-border">
                        <button
                          onClick={() => {
                            addToCart(p.id);
                            toggleWishlist(p.id);
                            toast.success("Moved product to cart!");
                          }}
                          className="flex-1 rounded-full bg-primary py-2 text-xs font-bold text-primary-foreground hover:opacity-90"
                        >
                          Move to Cart
                        </button>
                        <button
                          onClick={() => {
                            toggleWishlist(p.id);
                            toast.info("Removed from wishlist");
                          }}
                          className="rounded-full border border-border p-2 text-muted-foreground hover:bg-muted hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === "addresses" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg font-bold text-foreground">Delivery Addresses</h3>
                <button
                  onClick={() => setShowAddressModal(true)}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-sm hover:opacity-90"
                >
                  <Plus className="h-4 w-4" /> Add New Address
                </button>
              </div>

              {(!user.addresses || user.addresses.length === 0) ? (
                <div className="rounded-3xl border border-border bg-card p-12 text-center">
                  <MapPin className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
                  <p className="text-base font-semibold text-foreground">No addresses saved yet</p>
                  <p className="text-sm text-muted-foreground mt-1">Add your farm or warehouse address for faster checkout.</p>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {user.addresses.map((addr, idx) => (
                    <div key={idx} className="relative rounded-2xl border border-border bg-card p-5 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="rounded-full bg-secondary/10 px-3 py-0.5 text-xs font-bold text-secondary">
                          {addr.label || "Address"}
                        </span>
                        <button
                          onClick={() => handleDeleteAddress(idx)}
                          className="text-muted-foreground hover:text-destructive p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-sm font-medium text-foreground">{addr.line}</p>
                      <p className="text-xs text-muted-foreground mt-1">{addr.city}, {addr.pincode}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Add address modal */}
              {showAddressModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
                  <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl">
                    <h4 className="font-display text-lg font-bold text-foreground mb-4">Add Delivery Address</h4>
                    <form onSubmit={handleAddAddress} className="space-y-4">
                      <div>
                        <label className="text-xs font-semibold uppercase text-muted-foreground">Label</label>
                        <select
                          value={addrForm.label}
                          onChange={(e) => setAddrForm({ ...addrForm, label: e.target.value })}
                          className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
                        >
                          <option value="Home">Home</option>
                          <option value="Farm / Field">Farm / Field</option>
                          <option value="Warehouse">Warehouse / Shop</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-semibold uppercase text-muted-foreground">Address Line</label>
                        <input
                          required
                          value={addrForm.line}
                          onChange={(e) => setAddrForm({ ...addrForm, line: e.target.value })}
                          placeholder="Plot / Survey No, Village / Road"
                          className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-semibold uppercase text-muted-foreground">City / District</label>
                          <input
                            required
                            value={addrForm.city}
                            onChange={(e) => setAddrForm({ ...addrForm, city: e.target.value })}
                            placeholder="Vijayapura"
                            className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold uppercase text-muted-foreground">Pincode</label>
                          <input
                            required
                            value={addrForm.pincode}
                            onChange={(e) => setAddrForm({ ...addrForm, pincode: e.target.value })}
                            placeholder="586119"
                            className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
                          />
                        </div>
                      </div>
                      <div className="mt-6 flex justify-end gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setShowAddressModal(false)}
                          className="rounded-full border border-border px-5 py-2 text-sm font-semibold hover:bg-muted"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={loading}
                          className="rounded-full bg-primary px-6 py-2 text-sm font-bold text-primary-foreground shadow hover:opacity-90"
                        >
                          Save Address
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {tab === "profile" && (
            <div className="max-w-xl rounded-3xl border border-border bg-card p-6 shadow-sm">
              <h3 className="font-display text-lg font-bold text-foreground mb-4">Edit Profile</h3>
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Email Address (Registered)
                  </label>
                  <input
                    type="email"
                    disabled
                    value={user.email}
                    className="w-full rounded-xl border border-border bg-muted/50 px-4 py-2.5 text-sm text-muted-foreground cursor-not-allowed"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">Email cannot be changed after registration.</p>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    placeholder="+91 91759 55009"
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground shadow hover:opacity-90 transition-all disabled:opacity-50"
                >
                  {loading ? "Saving Changes..." : "Save Profile"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm font-medium text-muted-foreground">Loading account dashboard...</p>
        </div>
      }
    >
      <AccountContent />
    </React.Suspense>
  );
}
