"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "Failed to create account.");
      }
      router.push("/auth/signin?created=1");
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/90 backdrop-blur rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        <header className="px-8 pt-8 text-center">
          <div className="inline-flex items-center gap-2 text-3xl font-extrabold text-gray-900">
            <span className="text-4xl">🚀</span>
            <span>Create your account</span>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Join <span className="font-semibold">Brixel</span> — it takes less than a minute.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="px-8 pt-6 pb-8 space-y-5">
          {err && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {err}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Builder"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
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
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl shadow-md transition"
          >
            {loading ? "Creating your account…" : "Create account"}
          </button>

          <p className="text-sm text-center text-gray-600">
            Already have an account?{" "}
            <Link href="/auth/signin" className="text-emerald-700 font-semibold hover:underline">
              Sign in
            </Link>
          </p>

          <div className="pt-4 text-center text-xs text-gray-500">
            ✅ No spam • Cancel anytime • Privacy-first
          </div>
        </form>
      </div>
    </div>
  );
}
