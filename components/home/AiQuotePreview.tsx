"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";


import AnimatedConfidenceBar from "./AnimatedConfidenceBar";
import TypewriterText from "./TypewriterText";
import RecentTicker, { type TickerItem } from "./RecentTicker";

type Quote = {
  low: number;
  mid: number;
  high: number;
  confidence?: "low" | "medium" | "high";
  timelineWeeks?: [number, number];
};

const PREVIEW_ENDPOINT =
  process.env.NEXT_PUBLIC_AI_PREVIEW_ENDPOINT || "/api/aiQuote";

const PHRASES = [
  "Kitchen renovation in Maidstone",
  "Loft conversion in Sevenoaks",
  "Rear extension in Tonbridge",
  "Bathroom refit in Canterbury",
  "Full rewire in Gillingham",
  "Driveway paving in Ashford",
  "Garage conversion in Dartford",
];

function useIsTypingCooldown(delayMs = 1200) {
  const [typing, setTyping] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const ping = useCallback(() => {
    setTyping(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setTyping(false), delayMs);
  }, [delayMs]);
  useEffect(() => () => timeoutRef.current && clearTimeout(timeoutRef.current), []);
  return { typing, ping };
}

async function fetchPreview(query: string): Promise<Quote | null> {
  try {
    const res = await fetch(`${PREVIEW_ENDPOINT}?q=${encodeURIComponent(query)}`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    const text = await res.text();
    if (text.trim().startsWith("<")) return null;
    const data = JSON.parse(text);
    if (typeof data?.low === "number" && typeof data?.mid === "number" && typeof data?.high === "number") {
      return {
        low: data.low,
        mid: data.mid,
        high: data.high,
        confidence:
          data.confidence === "low" || data.confidence === "high" ? data.confidence : "medium",
        timelineWeeks: Array.isArray(data.timelineWeeks) && data.timelineWeeks.length === 2
          ? [Number(data.timelineWeeks[0]), Number(data.timelineWeeks[1])]
          : undefined,
      };
    }
    return null;
  } catch {
    return null;
  }
}

function useCountUp(value: number, durationMs = 650) {
  const [display, setDisplay] = useState(value);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number>(0);
  const fromRef = useRef<number>(value);

  useEffect(() => {
    fromRef.current = display;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    startRef.current = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - startRef.current) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      const next = Math.round(fromRef.current + (value - fromRef.current) * eased);
      setDisplay(next);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => rafRef.current && cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return display;
}

function StatCard({
  label,
  value,
  accent,
  loading,
}: {
  label: string;
  value: number;
  accent: "low" | "mid" | "high";
  loading?: boolean;
}) {
  const v = useCountUp(value);
  const accentClass =
    accent === "low"
      ? "from-sky-400/20 to-sky-400/0 ring-sky-300/50"
      : accent === "mid"
      ? "from-amber-400/20 to-amber-400/0 ring-amber-300/50"
      : "from-rose-400/20 to-rose-400/0 ring-rose-300/50";
  return (
  <div className={`relative rounded-xl ring-1 ring-inset ${accentClass} bg-gradient-to-b p-4 sm:p-5`}>
    <TypewriterText texts={PHRASES} className="mb-3 text-sm text-slate-500" />
      {loading ? (
        <div className="h-8 w-28 rounded-md bg-slate-200/70 animate-pulse" />
      ) : (
        <div className="text-2xl sm:text-3xl font-semibold tabular-nums tracking-tight">
          £{v.toLocaleString()}
        </div>
      )}
      <div className="mt-1 text-xs uppercase tracking-wide text-slate-500">{label}</div>
      <div className="pointer-events-none absolute inset-x-0 -top-px mx-4 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent opacity-[0.12]" />
    </div>
  );
}

function Confidence({ confidence }: { confidence?: string | null }) {
  return <AnimatedConfidenceBar confidence={confidence ?? "medium"} className="mt-3" />;
}

export default function AiQuotePreview() {
  const [query, setQuery] = useState(PHRASES[0]);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [tickerItems, setTickerItems] = useState<TickerItem[]>([
    { service: "Kitchen renovation", town: "Maidstone", low: 7200, high: 9100, weeks: [3, 6] },
    { service: "Loft conversion", town: "Sevenoaks", low: 18000, high: 26000, weeks: [6, 10] },
    { service: "Rear extension", town: "Tonbridge", low: 24000, high: 33000, weeks: [8, 14] },
    { service: "Bathroom refit", town: "Canterbury", low: 4500, high: 7600, weeks: [2, 4] },
  ]);
  const phraseIdxRef = useRef(0);
  const { typing, ping } = useIsTypingCooldown(1200);

  const fallbackQuote = useCallback((q: string): Quote => {
    const base = 6000 + (q.length % 17) * 150;
    return {
      low: Math.round(base * 0.85),
      mid: Math.round(base * 1.0),
      high: Math.round(base * 1.25),
      confidence: "medium",
      timelineWeeks: [2, 5],
    };
  }, []);

  const run = useCallback(
    async (q: string) => {
      setLoading(true);
      setErr(null);
      const data = await fetchPreview(q);
      if (!data) {
        setErr(
          "Preview endpoint returned an unexpected response. Using a safe local estimate until the API is ready."
        );
        setQuote(fallbackQuote(q));
      } else {
        setQuote({ ...data, timelineWeeks: data.timelineWeeks ?? [2, 5] });
      }
      setLoading(false);

      // Push a compact item into the ticker so it feels live
      const townMatch = q.match(/\b(in|at)\s+([A-Za-z\s\-']+)$/i);
      const town = townMatch?.[2]?.trim() || "Kent";
      const service = q.replace(/\b(in|at)\s+[A-Za-z\s\-']+$/i, "").trim() || "Home project";
      const low = (data?.low ?? fallbackQuote(q).low) | 0;
      const high = (data?.high ?? fallbackQuote(q).high) | 0;
      const weeks = (data?.timelineWeeks as [number, number]) ?? [2, 5];
      setTickerItems((prev) => {
        const next = [{ service, town, low, high, weeks }, ...prev];
        return next.slice(0, 12);
      });
    },
    [fallbackQuote]
  );

  useEffect(() => {
    run(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Rotate phrases every 5s, pause if user is typing
  useEffect(() => {
    const interval = setInterval(() => {
      if (typing) return;
      phraseIdxRef.current = (phraseIdxRef.current + 1) % PHRASES.length;
      const next = PHRASES[phraseIdxRef.current];
      setQuery(next);
      run(next);
    }, 5000);
    return () => clearInterval(interval);
  }, [typing, run]);

  const timeline = useMemo(() => {
    const [a, b] = quote?.timelineWeeks ?? [2, 5];
    return `${a}–${b} weeks`;
  }, [quote]);

  return (
    <div className="p-5 sm:p-6 md:p-8">
      {/* Bloomberg-style Recent Estimates ticker */}
      <RecentTicker items={tickerItems} className="mb-5 sm:mb-6" />

      {/* Input row */}
      <div className="flex flex-col md:flex-row md:items-center gap-3">
        <div className="relative flex-1">
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              ping();
            }}
            placeholder="Describe your project (e.g., Loft conversion in Sevenoaks)"
            className="w-full rounded-xl border border-slate-200/70 bg-white/70 backdrop-blur px-4 py-3 text-slate-900 placeholder:text-slate-400 shadow-inner focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
          />
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
            Preview
          </div>
        </div>

        <button
          onClick={() => run(query)}
          className="inline-flex items-center justify-center rounded-xl bg-slate-900 text-white px-4 py-3 text-sm font-medium shadow hover:bg-slate-800 active:scale-[0.99] transition"
          disabled={loading}
        >
          {loading ? "Estimating…" : "Try our AI now"}
        </button>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <StatCard label="Low" value={quote?.low ?? 0} accent="low" loading={loading && !quote} />
        <StatCard label="Estimate" value={quote?.mid ?? 0} accent="mid" loading={loading && !quote} />
        <StatCard label="High" value={quote?.high ?? 0} accent="high" loading={loading && !quote} />
      </div>

      {/* Meta / Confidence */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 md:items-center">
        <div className="md:col-span-2">
          <Confidence level={quote?.confidence ?? "medium"} />
          <div className="mt-3 text-sm text-slate-600">
            <span className="tabular-nums">2,300+</span> Kent projects
          </div>
          {err && <div className="mt-3 text-xs text-amber-600">{err}</div>}
        </div>

        <div className="flex md:justify-end mt-2 md:mt-0">
          <a
            href="https://wa.me/4471474462265?text=Hi%20—%20I%20just%20got%20an%20AI%20estimate%20and%20want%20to%20chat."
            className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white/70 backdrop-blur px-4 py-2.5 text-sm font-medium text-slate-800 shadow hover:border-slate-400"
          >
            Talk on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
