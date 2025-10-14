'use client'

import Link from "next/link"
import { useEffect, useState } from "react"

export default function TradeOnboardingIndex() {
  // read a simple % complete from localStorage (written by steps) if available
  const [pct, setPct] = useState<number>(0)
  useEffect(()=>{
    try {
      const v = Number(localStorage.getItem('trade_onboarding_pct') || '0')
      if (!Number.isNaN(v)) setPct(Math.max(0, Math.min(100, v)))
    } catch {}
  },[])

  return (
    <main className="min-h-screen bg-[radial-gradient(1200px_600px_at_10%_-20%,#0ea5e9_0%,transparent_50%),radial-gradient(1200px_600px_at_110%_120%,#10b981_0%,transparent_50%)] 
                      from-slate-900 via-slate-950 to-slate-950 text-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-3xl rounded-3xl shadow-2xl ring-1 ring-white/10 bg-slate-900/60 backdrop-blur-xl p-8 sm:p-10">
        <header className="mb-6">
          <p className="uppercase tracking-widest text-xs text-slate-300/80">Builder onboarding</p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold">
            Get set up in minutes
          </h1>
          <p className="mt-2 text-slate-300/90">
            Create your trade account, add company details, portfolio and verification — then start receiving AI-matched jobs.
          </p>
        </header>

        <div className="mb-6">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-slate-300/80">Progress</span>
            <span className="text-slate-200 font-medium">{pct}% complete</span>
          </div>
          <div className="h-2 rounded-full bg-slate-700/50 overflow-hidden">
            <div className="h-full bg-emerald-500 transition-all" style={{ width: `${pct}%` }} />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <Link
            href="/trade/onboarding/account"
            className="inline-flex items-center justify-center h-11 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-semibold"
          >
            Start / Continue onboarding
          </Link>

          <Link
            href="/trade/onboarding/success"
            className="inline-flex items-center justify-center h-11 rounded-xl ring-1 ring-white/15 hover:ring-white/25 text-cyan-200 hover:text-white"
          >
            I’ve finished — show success
          </Link>
        </div>

        <ul className="mt-8 grid sm:grid-cols-3 gap-3 text-sm">
          {[
            "Create account",
            "Company details",
            "Trades & services",
            "Coverage area",
            "Portfolio",
            "Trust & verification",
          ].map((s, i)=>(
            <li key={i} className="rounded-lg bg-white/5 ring-1 ring-white/10 p-3">
              <span className="text-slate-200">{i+1}. {s}</span>
            </li>
          ))}
        </ul>

        <p className="mt-6 text-xs text-slate-400">
          Tip: this page no longer auto-redirects — bookmark it if you prefer starting here.
        </p>
      </div>
    </main>
  )
}
