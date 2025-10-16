"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

function Bg() {
  return (
    <div aria-hidden className="absolute inset-0">
      <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_20%_10%,rgba(16,185,129,0.12),transparent_60%),radial-gradient(60%_50%_at_90%_20%,rgba(16,185,129,0.10),transparent_60%)]" />
      <svg className="absolute inset-0 h-full w-full opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M32 0H0V32" fill="none" stroke="currentColor" strokeWidth=".5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" className="text-emerald-700" />
      </svg>
    </div>
  );
}

export default function HomeownerSignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    setOk(false);

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (!res.ok) {
      setLoading(false);
      const j = await res.json().catch(() => ({}));
      setErr(j?.error || "Could not create your account. Please try again.");
      return;
    }

    // Auto sign-in then head to Quote flow
    const signin = await signIn("credentials", { redirect: false, email, password });
    setLoading(false);
    if (signin?.ok) {
      setOk(true);
      router.push("/quote?welcome=1");
    } else {
      // fallback: send to sign-in page
      router.push("/auth/signin?registered=1");
    }
  }

  return (
    <main className="relative min-h-[88vh] overflow-hidden bg-white">
      <Bg />
      <div className="relative mx-auto grid w-full max-w-5xl grid-cols-1 gap-12 px-4 py-10 md:grid-cols-2 md:py-16">
        {/* Left: value prop */}
        <section className="order-2 md:order-1">
          <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: .5 }}>
            <h1 className="text-4xl font-semibold md:text-5xl">Create your account</h1>
            <p className="mt-2 max-w-md text-gray-600">
              Save quotes, track progress, and book vetted local builders. No spam, full transparency.
            </p>

            <div className="mt-8 grid max-w-md grid-cols-3 items-center gap-3 text-center">
              <div className="rounded-xl border border-emerald-100/70 bg-white/70 px-3 py-2 text-xs font-medium text-gray-700 backdrop-blur">Bank-grade security</div>
              <div className="rounded-xl border border-emerald-100/70 bg-white/70 px-3 py-2 text-xs font-medium text-gray-700 backdrop-blur">Verified pros</div>
              <div className="rounded-xl border border-emerald-100/70 bg-white/70 px-3 py-2 text-xs font-medium text-gray-700 backdrop-blur">GDPR friendly</div>
            </div>

            <div className="mt-8 w-full max-w-md rounded-xl border border-gray-200/70 bg-white/80 p-4 text-sm text-gray-700 shadow-sm backdrop-blur">
              “We posted our job and had two professional quotes within a day. Loved the clarity.”
              <span className="ml-2 font-medium text-gray-900">— Amy, Maidstone</span>
            </div>

            <div className="mt-10 text-sm text-gray-600">
              Are you a builder?{" "}
              <Link href="/trade/signup" className="text-emerald-700 underline-offset-4 hover:underline">
                Trade sign up
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Right: form */}
        <section className="order-1 md:order-2">
          <motion.div
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: .55, delay: .05 }}
            className="rounded-2xl border border-emerald-100 bg-white/95 p-6 shadow-xl backdrop-blur md:p-8"
          >
            <p className="text-sm text-gray-500">For homeowners • <Link href="/trade/signup" className="text-emerald-700 hover:underline">Are you a builder?</Link></p>
            <form onSubmit={submit} className="mt-4 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Full name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-3 py-2.5 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-3 py-2.5 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Password</label>
                <div className="relative">
                  <input
                    type={show ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-3 py-2.5 pr-16 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShow((s) => !s)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-sm text-gray-600 hover:bg-gray-100"
                  >
                    {show ? "Hide" : "Show"}
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500">Use 8+ characters with letters and a number.</p>
              </div>

              {err && (
                <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {err}
                </div>
              )}

              {ok && (
                <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                  Account created. Redirecting…
                </div>
              )}

              <button
                disabled={loading}
                className="w-full rounded-xl bg-emerald-600 px-4 py-2.5 font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-80"
              >
                {loading ? "Creating…" : "Create account"}
              </button>

              <p className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link href="/auth/signin" className="text-emerald-700 hover:underline">Sign in</Link>
                <span className="mx-1">•</span>
                <Link href="/trade/signin" className="text-emerald-700 hover:underline">Trade sign in</Link>
              </p>
            </form>
            <div className="mt-4 text-center text-xs text-gray-500">
              DBS-checked teams • £5m insurance • 12-month guarantee
            </div>
          </motion.div>
        </section>
      </div>
    </main>
  );
}
