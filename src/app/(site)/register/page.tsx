"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  User as UserIcon,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  ShieldCheck,
  Sprout,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  RotateCcw,
  ArrowLeft,
} from "lucide-react";
import { useApp, useUser } from "@/lib/store";
import { PageHero } from "@/components/site/Section";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/account";

  const { sendRegisterOtp, verifyOtp } = useApp();
  const user = useUser();

  const [step, setStep] = React.useState<1 | 2>(1);
  const [form, setForm] = React.useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [otp, setOtp] = React.useState("");
  const [testOtp, setTestOtp] = React.useState<string | undefined>(undefined);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [countdown, setCountdown] = React.useState(0);

  // If already logged in, redirect
  React.useEffect(() => {
    if (user) {
      router.push(redirectUrl);
    }
  }, [user, router, redirectUrl]);

  // Resend countdown timer
  React.useEffect(() => {
    if (step === 2 && countdown > 0) {
      const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [step, countdown]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error("Please enter your full name.");
      return;
    }
    if (!form.email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email.trim())) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (!form.password) {
      toast.error("Please create a password.");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match! Please verify your password.");
      return;
    }

    try {
      setLoading(true);
      const res = await sendRegisterOtp({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
        confirmPassword: form.confirmPassword,
      });

      if (!res.success) {
        toast.error(res.error || "Failed to initialize registration. Please check your details.");
      } else {
        setStep(2);
        setCountdown(60);
        if (res.testOtp) {
          setTestOtp(res.testOtp);
          toast.success(`Verification OTP sent to ${form.email.trim()}! (Demo/Dev Code: ${res.testOtp})`, {
            duration: 8000,
          });
        } else {
          toast.success(`A 6-digit confirmation code has been dispatched to ${form.email.trim()}.`);
        }
      }
    } catch {
      toast.error("An unexpected error occurred during registration. Please try again.");
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
      const res = await verifyOtp(form.email.trim(), otp.trim(), "registration");

      if (!res.success) {
        toast.error(res.error || "Invalid verification code. Please check and try again.");
      } else {
        toast.success(`Welcome to Plant Health Solutions, ${form.name.trim()}! Account verified.`);
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
      const res = await sendRegisterOtp({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
        confirmPassword: form.confirmPassword,
      });

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
        <h2 className="text-xl font-bold text-foreground">You are already registered & signed in</h2>
        <p className="text-sm text-muted-foreground mt-1">Logged in as {user.email}</p>
        <Link
          href={redirectUrl}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          Go to {redirectUrl === "/checkout" ? "Checkout" : "My Account"} <ArrowRight className="h-4 w-4" />
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
                ? "Create Account to Checkout"
                : "Create Your Account"
              : "Verify Your Email Address"}
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            {step === 1
              ? "Join thousands of progressive farmers with 2-Step OTP email verification."
              : `Enter the 6-digit confirmation OTP sent to ${form.email}`}
          </p>
        </div>

        {/* 2-Step Banner */}
        <div className="mb-5 rounded-2xl bg-primary/10 border border-primary/20 p-3 text-xs text-foreground flex items-center gap-2.5">
          <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
          <span>
            {step === 1
              ? "2-Step Email Verification: A 6-digit security OTP will be dispatched to confirm your registration."
              : "Step 2 of 2: Please enter the one-time code sent to your registered email to activate your account."}
          </span>
        </div>

        {step === 1 ? (
          /* Register Form */
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Full Name <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
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
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="farmer@example.com"
                  className="w-full rounded-xl border border-border bg-background pl-10 pr-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Phone Number <span className="text-xs font-normal text-muted-foreground">(Optional for WhatsApp dispatch)</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
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
                  type={showPassword ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="At least 6 characters"
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

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Confirm Password <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  placeholder="Re-enter password to confirm"
                  className="w-full rounded-xl border border-border bg-background pl-10 pr-10 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground p-0.5"
                  aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {form.password && form.confirmPassword && (
                <div className="mt-1.5 flex items-center gap-1.5 text-xs">
                  {form.password === form.confirmPassword ? (
                    <span className="text-primary flex items-center gap-1 font-medium">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Passwords match perfectly
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
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Preparing Verification...
                </>
              ) : (
                <>
                  Continue with 2-Step OTP <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          /* Step 2: OTP Verification */
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            {testOtp && (
              <div className="rounded-2xl bg-amber-500/10 border border-amber-500/30 p-3 text-xs text-amber-900 dark:text-amber-200">
                <p className="font-bold">Sandbox / Test Mode Active:</p>
                <p className="mt-0.5">
                  Your OTP is: <span className="font-mono text-sm font-bold text-primary">{testOtp}</span> (Welcome email will be sent on verification).
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
                  <Loader2 className="h-4 w-4 animate-spin" /> Verifying Registration...
                </>
              ) : (
                <>
                  Verify OTP &amp; Complete Registration <ArrowRight className="h-4 w-4" />
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
                <ArrowLeft className="h-3.5 w-3.5" /> Back / Edit Details
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
          Already have an account?{" "}
          <Link
            href={redirectUrl ? `/login?redirect=${encodeURIComponent(redirectUrl)}` : "/login"}
            className="font-bold text-primary underline hover:opacity-80"
          >
            Sign In here
          </Link>
        </div>

        {/* Security badge */}
        <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground/80">
          <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Free registration · Welcome email delivered instantly
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-[80vh] bg-background">
      <PageHero
        title="Create Farmer Account"
        subtitle="Register to access dealer pricing, save multiple farm delivery addresses, and track fast dispatch."
      />
      <div className="mx-auto max-w-7xl px-4 py-12">
        <React.Suspense
          fallback={
            <div className="mx-auto max-w-md p-12 text-center">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
            </div>
          }
        >
          <RegisterForm />
        </React.Suspense>
      </div>
    </div>
  );
}
