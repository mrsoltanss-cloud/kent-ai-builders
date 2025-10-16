"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldCheck, BadgeCheck, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";

function Background() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_10%_10%,rgba(16,185,129,0.12),transparent_60%),radial-gradient(60%_50%_at_90%_20%,rgba(16,185,129,0.10),transparent_60%)]" />
      <svg className="absolute inset-0 h-full w-full opacity-[0.08]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="p" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M32 0H0V32" fill="none" stroke="currentColor" strokeWidth=".5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#p)" className="text-emerald-700" />
      </svg>
    </div>
  );
}

function AccentGlow() {
  return (
    <div
      aria-hidden
      className="absolute right-6 top-8 h-40 w-40 rounded-full blur-2xl"
      style={{ background: "radial-gradient(closest-side, rgba(16,185,129,.25), rgba(16,185,129,0))" }}
    />
  );
}

function TrustBadge({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-emerald-100/70 bg-white/70 px-3 py-2 shadow-sm backdrop-blur">
      <div className="text-emerald-700">{icon}</div>
      <div className="mt-1 text-[11px] font-medium text-gray-700">{label}</div>
    </div>
  );
}

function LogoStrip() {
  return (
    <div className="mt-10 w-full max-w-xl">
      <div className="text-[11px] uppercase tracking-wider text-gray-400">Trusted by local pros</div>
      <div className="mt-3 grid grid-cols-5 items-center gap-4 opacity-70">
        {[0,1,2,3,4].map(i => (
          <div key={i} className="h-7 rounded-md border border-gray-200/70 bg-white/70 backdrop-blur-sm" />
        ))}
      </div>
    </div>
  );
}

function MetricsRow() {
  return (
    <div className="mt-8 grid w-full max-w-xl grid-cols-2 gap-3">
      <motion.div
        initial={{ y: 8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: .45 }}
        className="rounded-xl border border-emerald-100/70 bg-white/70 p-4 shadow-sm backdrop-blur"
      >
        <div className="text-xs text-gray-500">Avg. first-week wins</div>
        <div className="mt-1 text-2xl font-semibold text-emerald-700">2.1<span className="ml-1 text-sm font-medium text-gray-500">jobs</span></div>
      </motion.div>
      <motion.div
        initial={{ y: 8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: .5, delay: .05 }}
        className="rounded-xl border border-emerald-100/70 bg-white/70 p-4 shadow-sm backdrop-blur"
      >
        <div className="text-xs text-gray-500">Lead match quality</div>
        <div className="mt-1 text-2xl font-semibold text-emerald-700">93%<span className="ml-1 text-sm font-medium text-gray-500">fit</span></div>
      </motion.div>
    </div>
  );
}

function QuoteCard() {
  return (
    <motion.div
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: .5, delay: .1 }}
      className="mt-10 w-full max-w-xl rounded-xl border border-gray-200/70 bg-white/80 p-4 text-sm text-gray-700 shadow-sm backdrop-blur"
    >
      “Best lead quality we’ve had in ages. Landed two projects in the first week.”
      <span className="ml-2 font-medium text-gray-900">— Kent Renovations</span>
    </motion.div>
  );
}

export default function SigninClient() {
  const sp = useSearchParams();
  const router = useRouter();
  const roleError =
    sp.get("error") === "wrong_role"
      ? "This area is for builders only. Please use Trade sign in."
      : null;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(roleError);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    const res = await signIn("credentials", { redirect: false, email, password });
    setLoading(false);
    if (res?.ok) {
      router.push("/trade/profile");
    } else {
      setErrorMsg(
        res?.error === "CredentialsSignin"
          ? "Incorrect email or password."
          : res?.error || "Sign-in failed. Please try again."
      );
    }
  }

  return (
    <div className="fixed inset-0 z-[99999] overflow-auto bg-white">
      <Background />

      <div className="relative mx-auto grid w-full max-w-6xl grid-cols-1 gap-12 px-4 py-10 md:grid-cols-2 md:py-16">
        <section className="order-2 md:order-1">
          <motion.div initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: .5 }}>
            <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
              Welcome back, <span className="text-emerald-700">pro</span> builder
            </h1>
            <p className="mt-3 max-w-xl text-sm text-gray-600 md:text-base">
              Sign in to manage your profile, browse live jobs, and win work with transparent, AI-assisted insights.
            </p>

            <div className="mt-7 grid max-w-sm grid-cols-3 items-center gap-3 text-center">
              <TrustBadge icon={<ShieldCheck className="h-5 w-5" />} label="Verified docs" />
              <TrustBadge icon={<BadgeCheck className="h-5 w-5" />} label="High-quality leads" />
              <TrustBadge icon={<Lock className="h-5 w-5" />} label="Bank-grade security" />
            </div>

            <MetricsRow />
            <LogoStrip />
            <QuoteCard />

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
          </motion.div>
        </section>

        <section className="order-1 md:order-2">
          <div className="relative">
            <AccentGlow />
            <motion.div
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: .55, delay: .05 }}
              className="rounded-2xl border border-emerald-100 bg-white/95 p-6 shadow-xl md:p-8 backdrop-blur"
            >
              <div className="mb-6">
                <h2 className="text-xl font-semibold leading-none">Trade sign in</h2>
                <p className="mt-1 text-xs text-gray-500">Access your builder dashboard &amp; live jobs.</p>
              </div>

              {errorMsg && (
                <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {errorMsg}
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
                  {loading ? "Signing in…" : "Sign in"}
                  {!loading && <ArrowRight className="h-4 w-4 transition group-active:translate-x-0.5" />}
                </button>

                <p className="text-center text-xs text-gray-500">By continuing, you agree to our Terms &amp; Privacy.</p>
              </form>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}
