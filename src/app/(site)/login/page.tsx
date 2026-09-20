"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  ShieldCheck,
  Sprout,
  CheckCircle2,
  UserCheck,
} from "lucide-react";
import { useApp, useUser } from "@/lib/store";
import { PageHero } from "@/components/site/Section";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/account";

  const { login } = useApp();
  const user = useUser();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  // If already logged in, redirect
  React.useEffect(() => {
    if (user) {
      router.push(redirectUrl);
    }
  }, [user, router, redirectUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      toast.error("Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);
      const err = await login(email.trim(), password);

      if (err) {
        toast.error(err);
      } else {
        toast.success("Welcome back! Login successful.");
        router.push(redirectUrl);
      }
    } catch {
      toast.error("An unexpected error occurred during login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fillDemoFarmer = () => {
    setEmail("farmer@example.com");
    setPassword("Farmer@123");
    toast.info("Filled demo farmer credentials!");
  };

  const fillDemoAdmin = () => {
    setEmail("planthealth@gmail.com");
    setPassword("Planthealth@123");
    toast.info("Filled demo admin credentials!");
  };

  if (user) {
    return (
      <div className="mx-auto max-w-md p-8 text-center bg-card rounded-3xl border border-border shadow-lg">
        <CheckCircle2 className="mx-auto h-12 w-12 text-primary mb-3" />
        <h2 className="text-xl font-bold text-foreground">You are already signed in</h2>
        <p className="text-sm text-muted-foreground mt-1">Logged in as {user.email}</p>
        <Link
          href={redirectUrl}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          Continue to {redirectUrl === "/checkout" ? "Checkout" : "My Account"} <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg">
      <div className="overflow-hidden rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xl">
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Sprout className="h-6 w-6" />
          </div>
          <h2 className="font-display text-2xl font-bold text-foreground">
            {redirectUrl === "/checkout" ? "Sign In to Checkout" : "Sign In to Your Account"}
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            {redirectUrl === "/checkout"
              ? "Sign in with your farmer account to complete your order."
              : "Manage your orders, farm delivery addresses, and organic fertilizers."}
          </p>
        </div>

        {redirectUrl === "/checkout" && (
          <div className="mb-5 rounded-2xl bg-primary/10 border border-primary/20 p-3 text-xs text-foreground flex items-center gap-2.5">
            <Lock className="h-4 w-4 text-primary shrink-0" />
            <span>Sign in to confirm delivery address and complete your order.</span>
          </div>
        )}

        {/* Quick Demo Credentials */}
        <div className="mb-6 rounded-2xl bg-muted/60 p-3.5 border border-border/80">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
            <UserCheck className="h-3.5 w-3.5 text-primary" /> Quick Demo Credentials
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={fillDemoFarmer}
              className="rounded-xl border border-border bg-background px-3 py-2 text-left text-xs hover:border-primary transition-all"
            >
              <div className="font-bold text-foreground">Farmer Account</div>
              <div className="text-[11px] text-muted-foreground truncate">farmer@example.com</div>
            </button>
            <button
              type="button"
              onClick={fillDemoAdmin}
              className="rounded-xl border border-border bg-background px-3 py-2 text-left text-xs hover:border-primary transition-all"
            >
              <div className="font-bold text-foreground">Admin Account</div>
              <div className="text-[11px] text-muted-foreground truncate">planthealth@gmail.com</div>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Email Address <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="farmer@example.com"
                className="w-full rounded-xl border border-border bg-background pl-10 pr-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Password <span className="text-destructive">*</span>
              </label>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-xl border border-border bg-background pl-10 pr-10 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground p-0.5"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-3 flex items-center justify-center gap-2 rounded-full bg-primary py-3 text-sm font-bold text-primary-foreground shadow-md hover:opacity-90 transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Signing In...
              </>
            ) : (
              <>
                Sign In <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer switcher */}
        <div className="mt-6 pt-5 border-t border-border text-center text-xs sm:text-sm text-muted-foreground">
          Don&apos;t have an account yet?{" "}
          <Link
            href={redirectUrl ? `/register?redirect=${encodeURIComponent(redirectUrl)}` : "/register"}
            className="font-bold text-primary underline hover:opacity-80"
          >
            Create Free Account
          </Link>
        </div>

        {/* Security badge */}
        <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground/80">
          <ShieldCheck className="h-3.5 w-3.5 text-primary" /> 256-bit encrypted secure authentication
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] bg-background">
      <PageHero
        title="Account Sign In"
        subtitle="Access your certified bio fertilizer orders, field soil test reports, and registered farm addresses."
      />
      <div className="mx-auto max-w-7xl px-4 py-12">
        <React.Suspense
          fallback={
            <div className="mx-auto max-w-md p-12 text-center">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
            </div>
          }
        >
          <LoginForm />
        </React.Suspense>
      </div>
    </div>
  );
}
