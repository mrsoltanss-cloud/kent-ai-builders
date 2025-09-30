"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function SignUpPage() {
  const [name, setName] = useState("Home Owner");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data?.error ?? "Could not create account");
      setLoading(false);
      return;
    }

    // auto-login after sign up
    const login = await signIn("credentials", { redirect: false, email, password });
    setLoading(false);
    if (login?.ok) window.location.href = "/";
    else setError("Account created but sign-in failed—try logging in.");
  }

  return (
    <main className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl shadow-md border p-6 space-y-6 bg-white">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-semibold">Create your account</h1>
          <p className="text-sm text-gray-500">It only takes a minute.</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-3">
          <label className="block text-sm">
            Name
            <input
              className="mt-1 w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-400"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>

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
                placeholder="At least 8 characters"
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
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link href="/auth/signin" className="underline">Sign in</Link>
        </p>
      </div>
    </main>
  );
}
