"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Leaf } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/lib/store";
import { inputCls } from "@/components/site/AdminUI";

export default function AdminLoginPage() {
  const { adminLogin, state, ready } = useApp();
  const router = useRouter();
  const [form, setForm] = React.useState({ user: "", pass: "" });

  React.useEffect(() => {
    if (ready && state.admin) {
      router.replace("/admin");
    }
  }, [ready, state.admin, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-primary px-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (adminLogin(form.user.trim(), form.pass)) {
            toast.success("Welcome back, admin");
            router.replace("/admin");
          } else {
            toast.error("Invalid admin credentials");
          }
        }}
        className="w-full max-w-sm rounded-2xl bg-card p-6 shadow-xl"
      >
        <div className="mb-5 flex items-center gap-2">
          <span className="rounded-full bg-primary p-2 text-primary-foreground">
            <Leaf className="h-5 w-5" />
          </span>
          <div>
            <p className="font-display text-lg font-bold text-foreground">PHS Admin</p>
            <p className="text-xs text-muted-foreground">Plant Health Solutions Pvt. Ltd.</p>
          </div>
        </div>
        <div className="grid gap-3">
          <input
            className={inputCls}
            placeholder="Username"
            value={form.user}
            onChange={(e) => setForm({ ...form, user: e.target.value })}
          />
          <input
            className={inputCls}
            type="password"
            placeholder="Password"
            value={form.pass}
            onChange={(e) => setForm({ ...form, pass: e.target.value })}
          />
          <button className="rounded-full bg-primary py-2.5 text-sm font-semibold text-primary-foreground">Sign In</button>
        </div>
        <p className="mt-4 text-center text-xs text-muted-foreground">Demo credentials: admin / admin123</p>
      </form>
    </div>
  );
}
