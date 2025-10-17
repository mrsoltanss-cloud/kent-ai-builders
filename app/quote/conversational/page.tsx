"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  MAIN_CATEGORIES, STATS, TOWNS_30MI_WEST_KINGSDOWN,
  formatGBP, readableUrgency, waLinkPrefill
} from "@/lib/quote/constants";

type Quote = { low: number; mid: number; high: number; confidence?: string; timelineWeeks?: [number, number] };

const EMERALD_SCENES = [
  "from-emerald-50 via-white to-emerald-100",
  "from-emerald-100 via-white to-teal-100",
  "from-teal-100 via-white to-emerald-200",
  "from-emerald-200 via-white to-teal-200",
];

const STEP = {
  INTRO: 0, MAIN: 1, SUB: 2, TOWN: 3, DETAILS: 4, SIM: 5, REVEAL: 6
} as const;

const STEP_VARIANTS = {
  initial: { opacity: 0, y: 18, scale: 0.98 },
  enter:   { opacity: 1, y: 0,  scale: 1, transition: { duration: 0.35 } },
  exit:    { opacity: 0, y: -18, scale: 0.98, transition: { duration: 0.25 } },
};

export default function ConversationalQuote() {
  const [step, setStep] = useState<number>(STEP.INTRO);
  const [scene, setScene] = useState(0);
  const [main, setMain] = useState(MAIN_CATEGORIES[0]);
  const [sub, setSub] = useState<string>("Loft Conversion");
  const [town, setTown] = useState<string>(TOWNS_30MI_WEST_KINGSDOWN[0]);
  const [rooms, setRooms] = useState(3);
  const [sqm, setSqm] = useState(18);
  const [urgency, setUrgency] = useState("THIS_MONTH");
  const [customSub, setCustomSub] = useState("");
  const [customTown, setCustomTown] = useState("");
  const [loading, setLoading] = useState(false);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { setScene((s) => (s + 1) % EMERALD_SCENES.length); }, [step]);

  const chosenSub = useMemo(() => {
    return sub === "Other" ? (customSub.trim() || "Other") : sub;
  }, [sub, customSub]);

  const chosenTown = useMemo(() => {
    return customTown.trim() || town;
  }, [town, customTown]);

  const progress = Math.round(((Math.min(step, STEP.REVEAL)) / STEP.REVEAL) * 100);

  const prompt = useMemo(() => {
    const bits: string[] = [];
    bits.push(`${chosenSub} (${main.label}) in ${chosenTown}`);
    bits.push(`${rooms} rooms`);
    bits.push(`${sqm} sqm`);
    bits.push(`urgency ${urgency}`);
    return bits.join(", ");
  }, [main.label, chosenSub, chosenTown, rooms, sqm, urgency]);

  async function runQuote() {
    setLoading(true);
    setError(null);
    setQuote(null);
    try {
      const res = await fetch(`/api/aiQuote?q=${encodeURIComponent(prompt)}`);
      const data = await res.json().catch(() => null);
      if (!data || typeof data.low !== "number") throw new Error("Bad response");
      setQuote({ ...data, timelineWeeks: data.timelineWeeks ?? [2, 5] });
      setStep(STEP.REVEAL);
      burstConfetti();
    } catch {
      setError("Couldn’t reach our AI right now — using a safe local estimate.");
      const fallback = fallbackQuote(prompt);
      setQuote(fallback);
      setStep(STEP.REVEAL);
      burstConfetti();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`min-h-[100dvh] bg-gradient-to-br ${EMERALD_SCENES[scene]} transition-colors duration-700`}>
      <div className="mx-auto max-w-3xl px-4 pt-10 pb-24">
        <Header progress={progress} />

        <div className="mt-8">
          <AnimatePresence mode="wait">
            {step === STEP.INTRO && (
              <motion.div key="intro" variants={STEP_VARIANTS} initial="initial" animate="enter" exit="exit">
                <IntroCard onStart={() => setStep(STEP.MAIN)} />
              </motion.div>
            )}

            {step === STEP.MAIN && (
              <motion.div key="main" variants={STEP_VARIANTS} initial="initial" animate="enter" exit="exit">
                <StepCard title="What are we building?" subtitle="Pick a main category to get started." emoji="🧭">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {MAIN_CATEGORIES.map((m) => (
                      <button
                        key={m.key}
                        onClick={() => { setMain(m); setSub(m.sub[0]); }}
                        className={`group rounded-xl border px-4 py-4 text-left shadow-sm hover:shadow transition
                          ${main.key === m.key ? "border-emerald-500 bg-white" : "border-emerald-100/60 bg-white/80"}`}
                      >
                        <div className="text-2xl">{m.emoji}</div>
                        <div className="mt-2 font-semibold text-slate-800 group-hover:text-emerald-700">{m.label}</div>
                      </button>
                    ))}
                  </div>
                  <Nav onNext={() => setStep(STEP.SUB)} />
                </StepCard>
              </motion.div>
            )}

            {step === STEP.SUB && (
              <motion.div key="sub" variants={STEP_VARIANTS} initial="initial" animate="enter" exit="exit">
                <StepCard title="Dial it in" subtitle="Choose a sub-category or type your own." emoji="🎛️">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {main.sub.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSub(s)}
                        className={`rounded-xl border px-4 py-3 text-left transition
                          ${sub === s ? "bg-emerald-600 text-white border-emerald-600" : "bg-white/90 border-emerald-200 hover:bg-white"}`}
                      >
                        {s === "Other" ? "📝 Other project type" : s}
                      </button>
                    ))}
                  </div>
                  {sub === "Other" && (
                    <div className="mt-4">
                      <input
                        value={customSub}
                        onChange={(e) => setCustomSub(e.target.value)}
                        placeholder="Describe your project…"
                        className="w-full rounded-xl border border-emerald-300 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-300"
                      />
                    </div>
                  )}
                  <Nav onBack={() => setStep(STEP.MAIN)} onNext={() => setStep(STEP.TOWN)} />
                </StepCard>
              </motion.div>
            )}

            {step === STEP.TOWN && (
              <motion.div key="town" variants={STEP_VARIANTS} initial="initial" animate="enter" exit="exit">
                <StepCard title="Where is this?" subtitle="We’ll tune pricing to local projects." emoji="📍">
                  <div className="flex flex-wrap gap-2">
                    {TOWNS_30MI_WEST_KINGSDOWN.map((t) => (
                      <button
                        key={t}
                        onClick={() => setTown(t)}
                        className={`rounded-full px-4 py-2 text-sm border transition
                          ${town === t ? "bg-emerald-600 text-white border-emerald-600" : "bg-white/90 border-emerald-200 text-slate-700 hover:bg-white"}`}
                      >
                        {t}
                      </button>
                    ))}
                    <button
                      onClick={() => setTown("Other")}
                      className={`rounded-full px-4 py-2 text-sm border transition
                        ${town === "Other" ? "bg-emerald-600 text-white border-emerald-600" : "bg-white/90 border-emerald-200 text-slate-700 hover:bg-white"}`}
                    >
                      Other area
                    </button>
                  </div>
                  {town === "Other" && (
                    <div className="mt-4">
                      <input
                        value={customTown}
                        onChange={(e) => setCustomTown(e.target.value)}
                        placeholder="Type your town or postcode…"
                        className="w-full rounded-xl border border-emerald-300 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-300"
                      />
                    </div>
                  )}
                  <Nav onBack={() => setStep(STEP.SUB)} onNext={() => setStep(STEP.DETAILS)} />
                </StepCard>
              </motion.div>
            )}

            {step === STEP.DETAILS && (
              <motion.div key="details" variants={STEP_VARIANTS} initial="initial" animate="enter" exit="exit">
                <StepCard title="Scope & size" subtitle="Quick sense check — nothing too serious." emoji="📐">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium text-slate-700">How many rooms?</label>
                      <div className="flex items-center gap-3 mt-2">
                        <input type="range" min={1} max={10} value={rooms} onChange={(e)=>setRooms(Number(e.target.value))} className="w-full accent-emerald-600" />
                        <div className="min-w-16 text-right font-semibold">{rooms}</div>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700">Approx size (sqm)</label>
                      <div className="flex items-center gap-3 mt-2">
                        <input type="range" min={5} max={100} step={1} value={sqm} onChange={(e)=>setSqm(Number(e.target.value))} className="w-full accent-emerald-600" />
                        <div className="min-w-16 text-right font-semibold">{sqm}㎡</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5">
                    <label className="text-sm font-medium text-slate-700">How soon?</label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {[
                        {k:"ASAP", label:"ASAP ⚡️"},
                        {k:"THIS_MONTH", label:"This month 📆"},
                        {k:"THIS_QUARTER", label:"This quarter 🗓️"},
                        {k:"FLEXIBLE", label:"Flexible 🕊️"},
                      ].map(u=>(
                        <button key={u.k} onClick={()=>setUrgency(u.k)}
                          className={`rounded-xl border px-4 py-2 text-sm transition
                            ${urgency===u.k? "bg-emerald-600 text-white border-emerald-600":"bg-white/90 border-emerald-200 hover:bg-white"}`}>
                          {u.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Nav onBack={() => setStep(STEP.TOWN)} onNext={() => setStep(STEP.SIM)} />
                </StepCard>
              </motion.div>
            )}

            {step === STEP.SIM && (
              <motion.div key="sim" variants={STEP_VARIANTS} initial="initial" animate="enter" exit="exit">
                <StepCard title="Simulating your build…" subtitle="Scanning 2,300+ Kent projects…" emoji="🤖">
                  <SimLoader />
                  <div className="mt-6 flex items-center gap-3">
                    <button onClick={()=>setStep(STEP.DETAILS)} className="rounded-xl border border-emerald-300 bg-white px-5 py-3 font-medium text-emerald-700 hover:bg-emerald-50">
                      Back
                    </button>
                    <button onClick={runQuote} disabled={loading}
                      className="rounded-xl bg-emerald-700 text-white px-6 py-3 font-semibold shadow hover:bg-emerald-800 disabled:opacity-60">
                      {loading ? "Crunching…" : "Reveal AI Estimate"}
                    </button>
                  </div>
                  {error && <p className="mt-4 text-sm text-amber-700">{error}</p>}
                </StepCard>
              </motion.div>
            )}

            {step === STEP.REVEAL && (
              <motion.div key="reveal" variants={STEP_VARIANTS} initial="initial" animate="enter" exit="exit">
                <RevealCard
                  quote={quote}
                  prompt={prompt}
                  onWhatsApp={() => {
                    const url = waLinkPrefill({
                      main: main.label, sub: chosenSub, town: chosenTown,
                      sqm, rooms, urgency,
                      low: quote?.low, mid: quote?.mid, high: quote?.high
                    });
                    window.location.href = url;
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/** ---------- Intro / Header / Cards ---------- */

function Header({ progress }: { progress: number }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="inline-flex items-center gap-2 text-emerald-900/80 font-semibold">
        <span>👷‍♂️</span><span>Brixel Build Simulator</span>
      </div>
      <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold text-slate-900">Let’s price your project</h1>
      <p className="mt-2 text-slate-600 max-w-xl">Short, playful steps. Live AI guide price at the end.</p>
      <div className="mt-5 h-2 w-full max-w-xl rounded-full bg-emerald-200/60 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        />
      </div>
    </div>
  );
}

function IntroCard({ onStart }: { onStart: () => void }) {
  return (
    <div className="mt-6 rounded-2xl bg-white/80 backdrop-blur border border-emerald-100 shadow-xl overflow-hidden">
      <div className="p-5 sm:p-7 relative">
        {/* Animated wave bot */}
        <motion.div
          className="absolute top-2 right-3 text-4xl sm:text-5xl select-none"
          initial={{ rotate: 0 }} animate={{ rotate: [0, 15, -5, 10, 0] }}
          transition={{ times:[0, .25, .5, .75, 1], duration: 1.6, repeat: Infinity, repeatDelay: 3 }}
        >
          👋
        </motion.div>
        <div className="flex items-center gap-3">
          <div className="text-3xl">🤖</div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Hi, I’m Brixel-Bot — here to help 🚀</h2>
            <p className="text-slate-600">
              We’ll fly through a few playful steps, then I’ll generate a live AI estimate.
              No cold calls, ever — you’re always in control.
            </p>
          </div>
        </div>

        {/* Trust stats */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <StatCard emoji="🧱" label="AI quotes this week" value={String(STATS.aiQuotesThisWeek)} />
          <StatCard emoji="📅" label="Site surveys (7 days)" value={String(STATS.surveysBooked7Days)} />
          <StatCard emoji="💬" label="Zero spam policy" value="You message us first" />
        </div>

        <div className="mt-6">
          <button onClick={onStart}
            className="rounded-xl bg-emerald-700 text-white px-6 py-3 font-semibold shadow hover:bg-emerald-800">
            Start your build journey
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ emoji, label, value }: { emoji: string; label: string; value: string }) {
  return (
    <div className="rounded-xl bg-emerald-50/60 p-4 ring-1 ring-emerald-200">
      <div className="text-xl">{emoji}</div>
      <div className="mt-1 text-sm text-slate-600">{label}</div>
      <div className="text-lg font-bold text-slate-900">{value}</div>
    </div>
  );
}

function StepCard({ title, subtitle, emoji, children }: { title: string; subtitle: string; emoji: string; children: React.ReactNode }) {
  return (
    <div className="mt-6 rounded-2xl bg-white/80 backdrop-blur border border-emerald-100 shadow-xl">
      <div className="p-5 sm:p-7">
        <div className="flex items-center gap-3">
          <div className="text-2xl">{emoji}</div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{title}</h2>
            <p className="text-slate-600">{subtitle}</p>
          </div>
        </div>
        <div className="mt-5">{children}</div>
      </div>
    </div>
  );
}

function Nav({ onBack, onNext }: { onBack?: () => void; onNext?: () => void }) {
  return (
    <div className="mt-6 flex gap-3">
      {onBack && (
        <button onClick={onBack}
          className="rounded-xl border border-emerald-300 bg-white px-5 py-3 font-medium text-emerald-700 hover:bg-emerald-50">
          Back
        </button>
      )}
      {onNext && (
        <button onClick={onNext}
          className="rounded-xl bg-emerald-700 text-white px-6 py-3 font-semibold shadow hover:bg-emerald-800">
          Next
        </button>
      )}
    </div>
  );
}

/** ---------- Reveal ---------- */

function RevealCard({ quote, prompt, onWhatsApp }:
  { quote: Quote | null; prompt: string; onWhatsApp: () => void }) {
  return (
    <div className="mt-6 rounded-2xl bg-white/90 backdrop-blur border border-emerald-100 shadow-2xl">
      <div className="p-5 sm:p-7">
        <div className="flex items-center gap-3">
          <div className="text-2xl">🎉</div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Your AI guide price</h2>
            <p className="text-slate-600">Based on “{prompt}”.</p>
          </div>
        </div>

        {!quote && <div className="mt-6 text-slate-600">Crunching numbers…</div>}

        {quote && (
          <>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <PriceCard label="Low" value={quote.low} tone="from-sky-100 to-emerald-50" />
              <PriceCard label="Estimate" value={quote.mid} tone="from-emerald-50 to-emerald-100" big />
              <PriceCard label="High" value={quote.high} tone="from-rose-50 to-amber-50" />
            </div>

            <div className="mt-6">
              <ConfidenceBar confidence={quote.confidence ?? "medium"} />
              <p className="mt-2 text-xs text-slate-600">
                Estimated timeline: <span className="font-semibold">{(quote.timelineWeeks ?? [2,5]).join("–")} weeks</span> • We never cold-call — you message us.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button onClick={onWhatsApp}
                className="rounded-xl bg-emerald-700 text-white px-6 py-3 font-semibold shadow hover:bg-emerald-800">
                Message us on WhatsApp to get started
              </button>
              <a href="/quote/success"
                className="rounded-xl border border-emerald-300 bg-white px-5 py-3 font-medium text-emerald-700 hover:bg-emerald-50">
                View success page
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function PriceCard({ label, value, tone, big }: { label: string; value: number; tone: string; big?: boolean }) {
  return (
    <div className={`rounded-xl bg-gradient-to-br ${tone} p-4 ring-1 ring-emerald-100`}>
      <div className="text-slate-500 text-xs">{label.toUpperCase()}</div>
      <div className={`mt-1 font-extrabold ${big ? "text-3xl" : "text-2xl"} text-slate-900`}>{formatGBP(value)}</div>
    </div>
  );
}

function ConfidenceBar({ confidence }: { confidence: string }) {
  const pct = confidence === "high" ? 92 : confidence === "low" ? 35 : 65;
  return (
    <div>
      <div className="flex items-center gap-2 text-xs text-slate-600 mb-1">
        <span className={`inline-block h-2 w-2 rounded-full ${confidence === "high" ? "bg-emerald-500" : confidence === "low" ? "bg-amber-500" : "bg-sky-500"} animate-pulse`} />
        <span className="capitalize">{confidence} confidence</span>
      </div>
      <div className="relative h-2.5 w-full rounded-full bg-slate-200/80 overflow-hidden">
        <motion.div
          className={`absolute left-0 top-0 h-full rounded-full bg-gradient-to-r ${
            confidence === "high" ? "from-emerald-400 to-emerald-600" :
            confidence === "low"  ? "from-amber-300 to-amber-500" :
                                    "from-sky-300 to-sky-500"
          }`}
          initial={{ width: "0%" }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 -translate-x-full shimmer" />
        </div>
      </div>
      <style jsx>{`
        @keyframes shimmerMove {
          0% { transform: translateX(-100%); opacity: .0; }
          20% { opacity: .15; }
          100% { transform: translateX(100%); opacity: .0; }
        }
        .shimmer {
          background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0) 100%);
          animation: shimmerMove 1.8s infinite;
        }
      `}</style>
    </div>
  );
}

/** ---------- Bits ---------- */
function SimLoader() {
  return (
    <div className="mt-2">
      <motion.div
        className="h-2 w-full rounded-full bg-emerald-100 overflow-hidden"
        initial={{ opacity: 0.8 }} animate={{ opacity: 1 }} transition={{ duration: .6 }}
      >
        <motion.div
          className="h-full bg-gradient-to-r from-emerald-400 to-teal-500"
          initial={{ x: "-100%" }} animate={{ x: ["-100%","0%"] }} transition={{ duration: 1.4, repeat: Infinity }}
        />
      </motion.div>
      <p className="mt-3 text-sm text-slate-600">Scanning current market rates, recent projects, crew availability…</p>
    </div>
  );
}

function fallbackQuote(prompt: string): Quote {
  const seed = Array.from(prompt).reduce((a, c) => a + c.charCodeAt(0), 0);
  const base = 5000 + (seed % 3000);
  return { low: base, mid: base + 1000, high: base + 3000, confidence: "medium", timelineWeeks: [2, 5] };
}
function burstConfetti() {
  const end = Date.now() + 400;
  (function frame() {
    confetti({ particleCount: 40, spread: 55, origin: { x: 0.2, y: 0.6 }, colors: ["#10B981","#059669","#34D399"] });
    confetti({ particleCount: 40, spread: 55, origin: { x: 0.8, y: 0.6 }, colors: ["#10B981","#059669","#34D399"] });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}
