"use client";
import * as React from "react";
import { signIn } from "next-auth/react";

export default function AdminLogin() {
  const [email, setEmail] = React.useState("admin@brixel.uk");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setErr(null);
    const res = await signIn("credentials", { redirect: false, email, password, callbackUrl: "/admin/portal" });
    setLoading(false);
    if (!res || res.error) { setErr("Sign in failed. Check email and password."); return; }
    window.location.href = "/admin/portal";
  }

  return (
    <div className="mx-auto max-w-sm rounded-2xl border p-6 shadow-sm">
      <h2 className="text-lg font-semibold">Admin sign in</h2>
      <p className="mt-1 text-sm text-slate-600">Use a whitelisted admin email + password.</p>

      <form onSubmit={onSubmit} className="mt-4 space-y-3">
        <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)}
          className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-600"
          placeholder="admin@brixel.uk" required />
        <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)}
          className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-600"
          placeholder="Password" required />
        {err && <div className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">{err}</div>}
        <button type="submit" className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="mt-3 text-xs text-slate-500">
        Whitelist: <code>ADMIN_LOGIN_EMAILS</code> • Password: <code>ADMIN_PASSWORD</code> (in <code>.env.local</code>)
      </p>
    </div>
  );
}
