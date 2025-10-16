"use client";
import { useEffect, useState } from "react";
import { CheckCircle2, Clock, ShieldCheck, Star } from "lucide-react";

function LiveNowBadge() {
  const [tick, setTick] = useState(0);
  useEffect(() => { const id = setInterval(()=>setTick(t=> (t+1)%60), 1000); return ()=>clearInterval(id); }, []);
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-emerald-700 ring-1 ring-emerald-200">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-emerald-500 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-600" />
      </span>
      <span className="text-sm font-medium">Live now</span>
      <span className="mx-1 text-emerald-300">•</span>
      <span className="flex items-center gap-1 text-xs text-emerald-700/90">
        <Clock className="h-3.5 w-3.5" /> avg response ~6 min
      </span>
    </div>
  );
}

function Chip({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-100 bg-white/70 px-3 py-2 text-sm text-gray-700 backdrop-blur">
      <span className="text-emerald-700">{icon}</span><span>{text}</span>
    </div>
  );
}

export default function HeroBelt() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-emerald-100 bg-white/80 p-5 md:p-6 backdrop-blur">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_0%_0%,rgba(16,185,129,0.10),transparent_60%),radial-gradient(60%_50%_at_100%_0%,rgba(16,185,129,0.08),transparent_60%)]" />
        <svg className="absolute inset-0 h-full w-full opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid-q" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M32 0H0V32" fill="none" stroke="currentColor" strokeWidth=".5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-q)" className="text-emerald-700" />
        </svg>
      </div>

      <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold leading-snug md:text-3xl">
            Your instant, AI-powered quote — <span className="text-emerald-700">fair, fast, and guaranteed.</span>
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            No pushy sales calls. No guesswork. Just trusted local builders with 10+ years experience.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Chip icon={<Star className="h-4 w-4" />} text="4.9★ average" />
            <Chip icon={<ShieldCheck className="h-4 w-4" />} text="£5m insured" />
            <Chip icon={<CheckCircle2 className="h-4 w-4" />} text="DBS-checked teams" />
          </div>
        </div>
        <div className="mt-2 md:mt-0"><LiveNowBadge /></div>
      </div>

      <div className="relative mt-5 grid gap-2 text-[13px] text-gray-600 md:grid-cols-3">
        <div className="rounded-lg border border-gray-200/70 bg-white/70 px-3 py-2">1. Job type &amp; postcode</div>
        <div className="rounded-lg border border-gray-200/70 bg-white/70 px-3 py-2">2. Size, urgency &amp; budget</div>
        <div className="rounded-lg border border-gray-200/70 bg-white/70 px-3 py-2">3. Photos &amp; access details</div>
      </div>
    </div>
  );
}
