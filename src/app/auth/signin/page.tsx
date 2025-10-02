// src/app/auth/signin/page.tsx
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function SignInPage() {
  // Controlled inputs start empty => no default autofill
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: true,
      callbackUrl: "/admin",
    });

    if (!res || (res as any)?.error) setErr("Invalid email or password");
    setLoading(false);
  }

  return (
    <div className="mx-auto max-w-sm py-10">
      <h1 className="text-xl font-semibold mb-4">Log in to Brixel</h1>

      {/* Turn off form-level autofill */}
      <form onSubmit={onSubmit} autoComplete="off">
        <label className="block text-sm mb-1">Email</label>
        <input
          type="email"
          name="email"                // fine, but controlled value prevents default fill
          inputMode="email"
          autoComplete="username"     // explicit hint (prevents random passwords)
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded border p-2 mb-3"
          placeholder="you@brixel.uk"
        />

        <label className="block text-sm mb-1">Password</label>
        <input
          type="password"
          name="current-password"     // avoids Chrome reusing wrong saved creds
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded border p-2 mb-3"
          placeholder="••••••••"
        />

        {err && <p className="text-sm text-red-600 mb-2">{err}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-emerald-600 text-white py-2 hover:bg-emerald-700 disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
