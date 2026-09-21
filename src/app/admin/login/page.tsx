"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/lib/store";
import { inputCls } from "@/components/site/AdminUI";

export default function AdminLoginPage() {
  const { adminLogin, state, ready } = useApp();
  const router = useRouter();
  const [form, setForm] = React.useState({ user: "", pass: "" });
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (ready && state.admin) {
      router.replace("/admin");
    }
  }, [ready, state.admin, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.user.trim() || !form.pass) {
      toast.error("Please enter both username/email and password");
      return;
    }

    setLoading(true);
    try {
      const ok = await adminLogin(form.user.trim(), form.pass);
      if (ok) {
        toast.success("Welcome back, Dr. R. M. Kulkarni / Administrator");
        router.replace("/admin");
      } else {
        toast.error("Invalid admin credentials. Please check your username and password.");
      }
    } catch {
      toast.error("An error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#18361e] px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-card p-8 shadow-2xl">
        <div className="mb-6 flex items-center gap-4 border-b border-border pb-6">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white p-2 shadow-sm border border-border">
            <img src="/logo.png" alt="Plant Health Solutions" className="h-full w-full object-contain" />
          </div>
          <div>
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-primary">
              Management Portal
            </span>
            <p className="font-display text-xl font-bold text-foreground">PHS Admin Panel</p>
            <p className="text-xs text-muted-foreground">Plant Health Solutions Pvt. Ltd.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Admin Username / Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
              <input
                className={`${inputCls} pl-10`}
                placeholder="Enter admin email or username"
                value={form.user}
                onChange={(e) => setForm({ ...form, user: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
              <input
                className={`${inputCls} pl-10`}
                type="password"
                placeholder="••••••••••••"
                value={form.pass}
                onChange={(e) => setForm({ ...form, pass: e.target.value })}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-primary py-3 text-sm font-bold text-primary-foreground shadow-lg hover:opacity-95 transition-all disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                Sign In to Dashboard <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
