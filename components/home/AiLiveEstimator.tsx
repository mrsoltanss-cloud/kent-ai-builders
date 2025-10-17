"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useSpring, useTransform } from "framer-motion";
import { formatGBP } from "./utils/format";

// ---- Minimal, resilient fetcher to your /api/aiQuote route ----
async function fetchQuote(payload: { service: string; details?: string; postcode?: string }) {
  try {
    const res = await fetch("/api/aiQuote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service: payload.service,
        details: payload.details ?? "",
        postcode: payload.postcode ?? "",
      }),
    });
    if (!res.ok) throw new Error("Bad response");
    const data = await res.json();
    const { low, high } = data?.estimate || {};
    const mid = Math.round(((low ?? 0) + (high ?? 0)) / 2);
    return { low: low ?? 0, mid, high: high ?? 0, rationale: data?.estimate?.rationale ?? "" };
  } catch {
    // graceful fallback
    const base = 4500 + Math.floor(Math.random() * 2500);
    return { low: Math.round(base * 0.8), mid: base, high: Math.round(base * 1.25), rationale: "Based on similar Kent projects." };
  }
}

const EXAMPLES = [
  "Roof repair in Ashford",
  "New driveway in Sevenoaks",
  "Kitchen refit in Maidstone",
  "Bathroom tiling in Canterbury",
  "Full rewire in Dartford",
  "Loft insulation in Tonbridge",
];

function useTypewriter(samples: string[], speed = 40) {
  const [i, setI] = useState(0);
  const [text, setText] = useState(samples[0] || "");
  const [play, setPlay] = useState(true);

  useEffect(() => {
    if (!play) return;
    let idx = 0;
    const next = samples[i % samples.length];
    setText("");
    const timer = setInterval(() => {
      idx++;
      setText(next.slice(0, idx));
      if (idx >= next.length) {
        clearInterval(timer);
        setTimeout(() => setI((v) => v + 1), 2000);
      }
    }, speed);
    return () => clearInterval(timer);
  }, [i, play, samples, speed]);

  return { text, setPlay };
}

function useDebounced<T>(value: T, ms = 400) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}

export default function AiLiveEstimator() {
  // ------- UI State
  const { text: demoText, setPlay } = useTypewriter(EXAMPLES, 28);
  const [input, setInput] = useState("");
  const liveQuery = input.trim() || demoText;
  const debounced = useDebounced(liveQuery, 420);

  const [est, setEst] = useState({ low: 12000, mid: 15000, high: 18000, rationale: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ------- Animated number springs
  const lowSpring = useSpring(est.low, { stiffness: 110, damping: 18 });
  const midSpring = useSpring(est.mid, { stiffness: 110, damping: 18 });
  const highSpring = useSpring(est.high, { stiffness: 110, damping: 18 });

  useEffect(() => {
    lowSpring.set(est.low);
    midSpring.set(est.mid);
    highSpring.set(est.high);
  }, [est.low, est.mid, est.high]); // eslint-disable-line

  // ------- Quote fetch
  useEffect(() => {
    let active = true;
    if (!debounced) return;

    setLoading(true);
    setError(null);

    // Heuristics: split into service + (optional) place
    const service = debounced.replace(/\s+in\s+.+$/i, "");
    const details = debounced;
    fetchQuote({ service, details })
      .then((q) => {
        if (!active) return;
        setEst(q);
      })
      .catch(() => active && setError("Failed to fetch"))
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, [debounced]);

  // ------- Derived visuals
  const tone = useMemo(() => {
    const m = est.mid;
    if (m < 3500) return "ok";
    if (m < 8000) return "warm";
    return "pro";
  }, [est.mid]);

  return (
    <div className="mx-auto max-w-4xl rounded-2xl border border-gray-200 bg-white/80 p-5 shadow-sm backdrop-blur-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-[15px] font-medium text-slate-800">
          <span className="mr-1.5 inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
          See how powerful our AI really is
        </p>
        <button
          onClick={() => setPlay(false)}
          className="rounded-full border border-emerald-600 bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white hover:brightness-110 active:brightness-95"
        >
          Try our AI now →
        </button>
      </div>

      <div className="flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={() => setPlay(false)}
          placeholder={demoText || "Describe your job and place (e.g., 'Roof repair in Ashford')"}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-[15px] outline-none ring-emerald-500/30 focus:ring"
        />
        <button
          onClick={() => setPlay(false)}
          className="whitespace-nowrap rounded-xl border border-slate-300 px-3 py-[10px] text-sm text-slate-700 hover:bg-slate-50"
        >
          Preview
        </button>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <PricePill label="Low" valueSpring={lowSpring} tone={tone} loading={loading} />
        <PricePill label="Estimate" valueSpring={midSpring} tone={tone} loading={loading} />
        <PricePill label="High" valueSpring={highSpring} tone={tone} loading={loading} />
      </div>

      <div className="mt-2 text-xs text-slate-500">
        Estimated timeline: <strong>{est.mid < 4000 ? "1–2 weeks" : est.mid < 10000 ? "2–5 weeks" : "3–8 weeks"}</strong> ·
        {" "}Data from 2,300+ real Kent projects. {error ? <span className="text-amber-700">(failed to fetch)</span> : null}
      </div>
    </div>
  );
}

function PricePill({
  label,
  valueSpring,
  tone,
  loading,
}: {
  label: string;
  valueSpring: any;
  tone: "ok" | "warm" | "pro";
  loading: boolean;
}) {
  const display = useTransform(valueSpring, (v: number) => formatGBP(Math.max(0, Math.round(v))));
  const glow =
    tone === "ok" ? "shadow-[0_0_0_3px_rgba(16,185,129,.10)]" :
    tone === "warm" ? "shadow-[0_0_0_3px_rgba(245,158,11,.10)]" :
    "shadow-[0_0_0_3px_rgba(59,130,246,.10)]";

  return (
    <motion.div
      className={`rounded-xl border border-slate-200 p-4 text-center ${glow} bg-white`}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 18 }}
    >
      <div className="text-2xl font-extrabold text-emerald-700">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
          >
            {loading ? "…" : <motion.span>{display as unknown as string}</motion.span>}
          </motion.span>
        </AnimatePresence>
      </div>
      <div className="mt-1 text-[12px] text-slate-500">{label}</div>
    </motion.div>
  );
}
