"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import confetti from "canvas-confetti";

export default function SuccessPage() {
  const params = useSearchParams();
  const refFromUrl = params.get("ref") || "";

  const ref = useMemo(() => {
    if (refFromUrl) return refFromUrl;
    const d = new Date();
    const yy = String(d.getFullYear()).slice(-2);
    const mm = String(d.getMonth()+1).padStart(2,"0");
    const dd = String(d.getDate()).padStart(2,"0");
    const rand = Math.random().toString(36).slice(2,7).toUpperCase();
    return `BK-${yy}${mm}${dd}-${rand}`;
  }, [refFromUrl]);

  useEffect(() => {
    const colors = ["#00a86b","#00b4d8","#3a86ff","#fbbf24"]; // green, blue, gold
    const end = Date.now() + 1200;
    (function frame(){
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.3 },
        colors,
        ticks: 200,
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  }, []);

  return (
    <main className="relative">
      <div className="absolute inset-0 -z-10 bg-white" />
      <section className="mx-auto max-w-3xl px-4 py-12">
        <div className="rounded-2xl border border-gray-200 bg-gradient-to-b from-white to-gray-50 p-8 shadow-sm">
          <div className="flex items-center gap-2 text-emerald-600 text-2xl font-bold">
            <span>🎉</span><h1>Success — your request is locked in!</h1><span>✅</span>
          </div>
          <div className="mt-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-emerald-700">
              <span className="text-xs uppercase tracking-wide">Reference</span>
              <strong className="tabular-nums">{ref}</strong>
            </span>
          </div>
          <p className="mt-3 text-gray-700">
            You’ve joined 2,300+ homeowners in Kent who trust us.
          </p>

          {/* What happens next */}
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              ["⏱","We assign a specialist","Under 24 hours"],
              ["📧","You’ll get an email","Confirm the scope"],
              ["📸","Speed things up","Send photos now"],
            ].map(([icon, title, sub])=>(
              <div key={title as string} className="rounded-xl border border-gray-200 bg-white p-4 text-center">
                <div className="text-2xl">{icon}</div>
                <div className="mt-1 font-semibold">{title}</div>
                <div className="text-xs text-gray-500">{sub}</div>
              </div>
            ))}
          </div>

          {/* Stat bar */}
          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 text-amber-800 px-4 py-3 text-sm">
            <strong className="text-amber-700">124</strong> similar requests this week ·
            <span className="mx-1"></span>
            <strong className="text-emerald-700">98</strong> projects completed ·
            <span className="mx-1"></span>
            ⭐ <strong>4.9/5</strong> homeowner rating
          </div>

          {/* Actions */}
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Link
              href="https://wa.me/447000000000?text=Hi%20Brixel%2C%20here%20are%20my%20photos%20for%20ref%20{{ref}}"
              className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700 transition text-center"
            >
              Send photos on WhatsApp
            </Link>
            <Link
              href="mailto:hello@brixel.uk?subject=Photos%20for%20ref%20{{ref}}"
              className="inline-flex items-center justify-center rounded-xl border border-emerald-600 text-emerald-700 px-5 py-3 font-semibold hover:bg-emerald-50 transition text-center"
            >
              Email us now
            </Link>
          </div>

          <p className="mt-4 text-xs text-gray-500">
            £5m Insurance · 12-month guarantee · DBS checked teams
          </p>
        </div>
      </section>
    </main>
  );
}
