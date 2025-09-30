"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function SignInPage() {
  const [email, setEmail] = useState("homeowner@brixel.uk");
  const [password, setPassword] = useState("Password123!");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await signIn("credentials", {
      redirect: true,
      callbackUrl: "/me",   // go to role-aware area after login
      email,
      password,
    });
    if (!res?.ok) setError("Invalid email or password");
  }

  return (
    <main className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl shadow-md border p-6 space-y-6 bg-white">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-semibold">Log in to Brixel</h1>
          <p className="text-sm text-gray-500">Welcome back! 👋</p>
        </div>

        <button
          onClick={() => signIn("google", { callbackUrl: "/me" })}
          className="w-full border rounded-lg px-4 py-2 hover:bg-gray-50 transition"
        >
          <span className="inline-flex items-center gap-2">Continue with Google</span>
        </button>

        <div className="flex items-center gap-3 text-xs text-gray-400">
          <div className="h-px flex-1 bg-gray-200" />
          <span>or</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <form onSubmit={onSubmit} className="space-y-3">
          <label className="block text-sm">
            Email
            <input
              className="mt-1 w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-400"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              required
            />
          </label>

          <label className="block text-sm">
            Password
            <div className="mt-1 relative">
              <input
                className="w-full border rounded-md px-3 py-2 pr-10 outline-none focus:ring-2 focus:ring-emerald-400"
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-500"
              >
                {show ? "Hide" : "Show"}
              </button>
            </div>
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in with Email"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-600">
          New to Brixel? <Link href="/auth/signup" className="underline">Create an account</Link>
        </p>
      </div>
    </main>
  );
}
