"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Sparkles,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  BadgeCheck,
} from "lucide-react";

export default function SigninClient() {
  const sp = useSearchParams();
  const error = sp.get("error");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn("credentials", {
        redirect: true,
        email,
        password,
        // 👇 always land in the builder area; /trade/profile will route to /trade/leads or onboarding
        callbackUrl: "/trade/profile",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] overflow-auto bg-white">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.25 }}
        transition={{ duration: 1.2 }}
        className="pointer-events-none absolute inset-0"
      />
      <div className="relative mx-auto grid w-full max-w-6xl grid-cols-1 gap-8 px-4 py-8 md:grid-cols-2 md:py-16">
        {/* LEFT */}
        <motion.section
          initial={{ y: 14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="order-2 md:order-1"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-[12px] shadow-sm ring-1 ring-emerald-200">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            <span className="font-medium text-emerald-700">Fast access to premium leads</span>
          </div>

          <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
            Welcome back, <span className="text-emerald-700">pro builder</span>
          </h1>
          <p className="mt-3 max-w-xl text-sm text-gray-600 md:text-base">
            Sign in to manage your profile, browse live jobs, and win work with transparent, AI-assisted insights.
          </p>

          <div className="mt-8 grid grid-cols-3 items-center gap-3 text-center md:max-w-md">
            <TrustBadge icon={<ShieldCheck className="h-5 w-5" />} label="Verified docs" />
            <TrustBadge icon={<BadgeCheck className="h-5 w-5" />} label="High-quality leads" />
            <TrustBadge icon={<Lock className="h-5 w-5" />} label="Bank-grade security" />
          </div>

          <ul className="mt-8 space-y-3 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-emerald-600" />
              AI summaries to spotlight best-fit jobs first.
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-emerald-600" />
              Fair credit pricing with expiring slots.
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-emerald-600" />
              Showcase your portfolio and verification badges.
            </li>
          </ul>

          <div className="mt-10 flex flex-wrap items-center gap-4 text-sm">
            <Link
              href="/trade/signup"
              className="group inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 font-medium text-emerald-700 shadow-sm transition hover:border-emerald-300"
            >
              New to Brixel Trade? Create account
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </Link>
            <Link href="/" className="text-gray-500 underline-offset-4 hover:text-gray-700 hover:underline">
              ← Back home
            </Link>
          </div>
        </motion.section>

        {/* RIGHT */}
        <motion.section
          initial={{ y: 14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.55, delay: 0.05 }}
          className="order-1 md:order-2"
        >
          <div className="relative">
            <div className="rounded-2xl border border-emerald-100 bg-white/95 p-6 shadow-xl md:p-8">
              <div className="mb-6 flex items-center gap-2">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                  <Lock className="h-5 w-5 text-emerald-700" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold leading-none">Trade sign in</h2>
                  <p className="mt-1 text-xs text-gray-500">Access your builder dashboard & live jobs.</p>
                </div>
              </div>

              {error && (
                <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error === "wrong_role"
                    ? "This area is for builders only. Please use Trade sign in."
                    : "Sign-in failed. Double-check your email and password."}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-[15px] shadow-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                    placeholder="you@company.com"
                    autoComplete="email"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl border border-gray-300 px-3 py-2.5 pr-10 text-[15px] shadow-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                      placeholder="••••••••"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-500 hover:bg-gray-100"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.75 font-medium text-white shadow-md transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-80"
                >
                  {loading ? (
                    <>
                      <Spinner />
                      Signing in…
                    </>
                  ) : (
                    <>
                      Sign in
                      <ArrowRight className="h-4 w-4 transition group-active:translate-x-0.5" />
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-gray-500">By continuing, you agree to our Terms & Privacy.</p>
              </form>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-4 rounded-xl border border-emerald-100 bg-white/90 p-4 text-sm text-gray-700 shadow-sm"
            >
              “Best lead quality we’ve had in ages. Landed two projects in the first week.”
              <span className="ml-2 font-medium text-gray-900">— Kent Renovations</span>
            </motion.div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}

function TrustBadge({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-emerald-100 bg-white/80 px-3 py-2 shadow-sm">
      <div className="text-emerald-700">{icon}</div>
      <div className="mt-1 text-[11px] font-medium text-gray-700">{label}</div>
    </div>
  );
}

function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}
