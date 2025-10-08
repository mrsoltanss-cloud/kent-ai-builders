"use client";
import * as React from "react";
import { signIn } from "next-auth/react";

export default function AdminLogin() {
  const [loading,setLoading]=React.useState(false);
  return (
    <div className="mx-auto max-w-sm rounded-2xl border p-6 shadow-sm">
      <h2 className="text-lg font-semibold">Admin sign in</h2>
      <p className="mt-1 text-sm text-slate-600">Use your admin/ops account to continue.</p>
      <button
        onClick={async ()=>{ setLoading(true); await signIn(undefined, { callbackUrl: "/admin/portal" }); setLoading(false); }}
        className="mt-4 w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
        disabled={loading}
      >
        {loading ? "Opening sign-in…" : "Sign in"}
      </button>
      <p className="mt-3 text-xs text-slate-500">
        Don’t have access? Ask a site admin to set your role to <span className="font-medium">ADMIN</span> or <span className="font-medium">OPS</span>.
      </p>
    </div>
  );
}
