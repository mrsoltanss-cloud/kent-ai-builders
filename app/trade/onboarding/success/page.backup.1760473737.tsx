"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ConfettiTiny from "@/components/fx/ConfettiTiny";

export default function Success() {
  const router = useRouter();
  const [fire, setFire] = useState(true);
  const [company, setCompany] = useState<string>("Your profile");
  const [slug, setSlug] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setFire(false), 700);
    // Auto-redirect to /trade/profile after 5s
    const r = setTimeout(() => router.push("/trade/profile"), 5000);
    return () => { clearTimeout(t); clearTimeout(r); };
  }, [router]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/trade/profile", { cache: "no-store" });
        if (!res.ok) return;
        const j = await res.json();
        if (j?.profile?.companyName) setCompany(j.profile.companyName);
        if (j?.profile?.slug) setSlug(j.profile.slug);
      } catch {}
    })();
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 bg-aurora opacity-70" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.08),transparent_60%)]" />
      <MouseGlow />

      <div className="relative z-10 mx-auto flex min-h-[100dvh] max-w-3xl items-center justify-center px-6">
        <motion.div
          initial={{ y: 20, opacity: 0, scale: 0.98 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="glass-card w-full rounded-3xl p-10 text-center"
        >
          <div className="mx-auto mb-6 h-24 w-24"><CheckBurst /></div>

          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome aboard, <span className="text-cyan-300">{company}</span>!
          </h1>
          <p className="mt-2 text-slate-300">Your AI-ready profile is live and already working for you.</p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <Link href="/trade/profile"
              className="rounded-xl bg-cyan-500 px-5 py-3 text-center font-semibold text-slate-950 hover:bg-cyan-400 transition-colors">
              View My Profile
            </Link>
            <Link href="/trade/leads"
              className="rounded-xl border border-white/20 px-5 py-3 text-center font-semibold hover:bg-white/5 transition-colors">
              Explore Leads
            </Link>
            <button
              onClick={() => {
                const url = slug ? `${location.origin}/b/${slug}` : location.origin;
                navigator.clipboard.writeText(url);
              }}
              className="rounded-xl border border-white/20 px-5 py-3 text-center font-semibold hover:bg-white/5 transition-colors">
              Share profile
            </button>
          </div>

          <div className="mt-6 text-xs text-slate-400">
            Tip: keep your portfolio fresh — members with recent projects win more jobs.
          </div>
        </motion.div>
      </div>

      <ConfettiTiny fire={fire} />
    </div>
  );
}

function CheckBurst() {
  return (
    <svg viewBox="0 0 120 120" className="h-full w-full">
      <defs>
        <radialGradient id="g" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#67e8f9" stopOpacity="0.9" />
          <stop offset="60%" stopColor="#22d3ee" stopOpacity="0.4" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <circle cx="60" cy="60" r="40" fill="url(#g)" opacity="0.35" />
      <motion.circle
        cx="60" cy="60" r="34" fill="none" stroke="#22d3ee" strokeWidth="6" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.9, ease: "easeInOut" }}
      />
      <motion.path
        d="M45 61 L56 72 L78 50" fill="none" stroke="#e6fbff" strokeWidth="7" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.35, duration: 0.7, ease: "easeInOut" }}
      />
    </svg>
  );
}

function MouseGlow() {
  const [pos, setPos] = useState({ x: -200, y: -200 });
  useEffect(() => {
    const onMove = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);
  return (
    <div
      className="pointer-events-none fixed -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
      style={{
        left: pos.x, top: pos.y, width: 380, height: 380,
        background: "radial-gradient(150px 150px at center, rgba(34,211,238,0.18), transparent 60%)",
      }}
    />
  );
}
