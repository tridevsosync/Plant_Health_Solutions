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
  KeyRound,
  RotateCcw,
  ArrowLeft,
} from "lucide-react";
import { useApp, useUser } from "@/lib/store";
import { PageHero } from "@/components/site/Section";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/account";

  const { sendLoginOtp, verifyOtp } = useApp();
  const user = useUser();

  const [step, setStep] = React.useState<1 | 2>(1);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [otp, setOtp] = React.useState("");
  const [testOtp, setTestOtp] = React.useState<string | undefined>(undefined);
  const [loading, setLoading] = React.useState(false);
  const [countdown, setCountdown] = React.useState(0);

  // If already logged in, redirect
  React.useEffect(() => {
    if (user) {
      router.push(redirectUrl);
    }
  }, [user, router, redirectUrl]);

  // Resend OTP countdown timer
  React.useEffect(() => {
    if (step === 2 && countdown > 0) {
      const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [step, countdown]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      toast.error("Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);
      const res = await sendLoginOtp(email.trim(), password);

      if (!res.success) {
        toast.error(res.error || "Authentication failed. Please check your credentials.");
      } else {
        setStep(2);
        setCountdown(60);
        if (res.testOtp) {
          setTestOtp(res.testOtp);
          toast.success(`Verification OTP sent to ${email.trim()}! (Demo/Dev Code: ${res.testOtp})`, {
            duration: 8000,
          });
        } else {
          toast.success(`A 6-digit security code has been sent to ${email.trim()}.`);
        }
      }
    } catch {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp.trim() || otp.trim().length < 6) {
      toast.error("Please enter the complete 6-digit OTP code sent to your email.");
      return;
    }

    try {
      setLoading(true);
      const res = await verifyOtp(email.trim(), otp.trim(), "login");

      if (!res.success) {
        toast.error(res.error || "Invalid verification code. Please check and try again.");
      } else {
        toast.success("Security verification successful! Welcome back.");
        router.push(redirectUrl);
      }
    } catch {
      toast.error("An unexpected error occurred during verification. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return;
    try {
      setLoading(true);
      const res = await sendLoginOtp(email.trim(), password);
      if (res.success) {
        setCountdown(60);
        if (res.testOtp) {
          setTestOtp(res.testOtp);
          toast.success(`New OTP sent! (Demo Code: ${res.testOtp})`, { duration: 8000 });
        } else {
          toast.success("A fresh OTP verification code has been dispatched to your email.");
        }
      } else {
        toast.error(res.error || "Failed to resend OTP.");
      }
    } catch {
      toast.error("Failed to resend OTP code.");
    } finally {
      setLoading(false);
    }
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
            {step === 1 ? <Sprout className="h-6 w-6" /> : <KeyRound className="h-6 w-6" />}
          </div>
          <h2 className="font-display text-2xl font-bold text-foreground">
            {step === 1
              ? redirectUrl === "/checkout"
                ? "Sign In to Checkout"
                : "Sign In to Your Account"
              : "2-Step Email Verification"}
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            {step === 1
              ? redirectUrl === "/checkout"
                ? "Sign in with 2-Step OTP verification to complete your order."
                : "Manage your orders, farm delivery addresses, and organic fertilizers."
              : `Enter the 6-digit security OTP code sent to ${email}`}
          </p>
        </div>

        {/* 2-Step Banner */}
        <div className="mb-5 rounded-2xl bg-primary/10 border border-primary/20 p-3 text-xs text-foreground flex items-center gap-2.5">
          <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
          <span>
            {step === 1
              ? "2-Step Verification enabled: An email OTP will be sent to confirm your identity."
              : "Step 2 of 2: Please enter the one-time code sent to your registered email."}
          </span>
        </div>

        {step === 1 ? (
          <>
            {/* Login Credentials Form */}
            <form onSubmit={handleSendOtp} className="space-y-4">
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
                    placeholder="your.email@example.com"
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
                    <Loader2 className="h-4 w-4 animate-spin" /> Verifying Credentials...
                  </>
                ) : (
                  <>
                    Continue &amp; Send OTP <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          </>
        ) : (
          /* Step 2: OTP Verification Form */
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            {testOtp && (
              <div className="rounded-2xl bg-amber-500/10 border border-amber-500/30 p-3 text-xs text-amber-900 dark:text-amber-200">
                <p className="font-bold">Sandbox / Test Mode Active:</p>
                <p className="mt-0.5">
                  Your OTP is: <span className="font-mono text-sm font-bold text-primary">{testOtp}</span> (Email dispatched in background).
                </p>
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                6-Digit Email Verification Code <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  maxLength={6}
                  required
                  autoFocus
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="123456"
                  className="w-full rounded-xl border border-border bg-background pl-10 pr-4 py-3 text-center text-xl font-bold tracking-[0.3em] text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || otp.length < 6}
              className="w-full mt-2 flex items-center justify-center gap-2 rounded-full bg-primary py-3 text-sm font-bold text-primary-foreground shadow-md hover:opacity-90 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Verifying Code...
                </>
              ) : (
                <>
                  Verify OTP &amp; Sign In <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            {/* Resend & Back Controls */}
            <div className="flex items-center justify-between pt-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setOtp("");
                }}
                className="inline-flex items-center gap-1 font-semibold text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back / Change Email
              </button>

              <button
                type="button"
                disabled={countdown > 0 || loading}
                onClick={handleResendOtp}
                className="inline-flex items-center gap-1 font-semibold text-primary hover:underline disabled:text-muted-foreground disabled:no-underline"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                {countdown > 0 ? `Resend OTP in ${countdown}s` : "Resend OTP"}
              </button>
            </div>
          </form>
        )}

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
