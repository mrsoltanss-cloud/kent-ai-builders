"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    const res = await signIn("credentials", { email, password, callbackUrl: "/quote" });
    if (res?.error) setErr("Invalid email or password.");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-sky-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/90 backdrop-blur rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        <header className="px-8 pt-8 text-center">
          <div className="inline-flex items-center gap-2 text-3xl font-extrabold text-gray-900">
            <span className="wave text-4xl">👋</span>
            <span>Welcome back</span>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Sign in to continue to <span className="font-semibold">Brixel</span>
          </p>
        </header>

        <form onSubmit={handleSubmit} className="px-8 pt-6 pb-8 space-y-5">
          {err && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {err}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@brixel.uk"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl shadow-md transition"
          >
            {loading ? "Signing you in…" : "Sign in"}
          </button>

          <div className="flex items-center justify-between text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-700">
              ← Back home
            </Link>
            <Link href="/auth/signup" className="text-emerald-700 font-semibold hover:underline">
              New here? Create an account
            </Link>
          </div>

          <div className="pt-4 text-center text-xs text-gray-500">
            🔒 Bank-grade encryption • Trusted by homeowners & builders
          </div>
        </form>
      </div>

      <style jsx>{`
        .wave {
          display: inline-block;
          transform-origin: 70% 70%;
          animation: wave 1.6s ease-in-out infinite;
        }
        @keyframes wave {
          0% { transform: rotate(0deg); }
          15% { transform: rotate(12deg); }
          30% { transform: rotate(-8deg); }
          45% { transform: rotate(12deg); }
          60% { transform: rotate(-4deg); }
          75% { transform: rotate(8deg); }
          100% { transform: rotate(0deg); }
        }
      `}</style>
    </div>
  );
}
