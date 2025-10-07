"use client";

import React, { useEffect, useMemo, useState } from "react";
import { DateTime } from "luxon";

/**
 * Demand curve shaped by time-of-day (Europe/London).
 * Peaks around lunch and early evening; low overnight; weekends slightly lower.
 * Returns a normalized value 0..1.
 */
function demandScore(now: DateTime) {
  const h = now.hour + now.minute / 60; // 0..24
  const gauss = (x: number, mu: number, sigma: number) =>
    Math.exp(-0.5 * Math.pow((x - mu) / sigma, 2));

  // Two peaks: ~12:30 (strong), ~19:30 (medium). A little morning shoulder.
  let score =
    0.06 +                       // baseline so it never hits zero
    1.0 * gauss(h, 12.5, 2.2) +  // lunch peak
    0.75 * gauss(h, 19.5, 2.1) + // evening peak
    0.25 * gauss(h, 8.5, 1.8);   // morning shoulder

  // Weekends see less traffic
  const isWeekend = now.weekday === 6 || now.weekday === 7; // Sat=6, Sun=7
  if (isWeekend) score *= 0.75;

  // Clamp to 0..1
  return Math.max(0, Math.min(1, score));
}

/** Convert score → people count, with small noise. */
function targetCount(now: DateTime) {
  const MIN = 5;
  const MAX = 200;
  const s = demandScore(now);
  let val = MIN + s * (MAX - MIN);

  // Light jitter (±6%) so it doesn't look robotic
  val *= 1 + (Math.random() * 0.12 - 0.06);

  return Math.round(val);
}

export default function LiveNowBadge() {
  const initial = useMemo(
    () => targetCount(DateTime.now().setZone("Europe/London")),
    []
  );
  const [count, setCount] = useState<number>(initial);

  useEffect(() => {
    // Recompute every 15s and ease towards the new target (smooth, not jumpy)
    const id = setInterval(() => {
      const now = DateTime.now().setZone("Europe/London");
      const next = targetCount(now);
      setCount((c) => {
        const delta = next - c;
        // Limit step so it animates towards the target
        const step = Math.max(-12, Math.min(12, Math.round(delta)));
        return c + step;
      });
    }, 15000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 px-4 py-3 text-sm text-gray-700 flex items-center gap-3 shadow-sm">
      <span className="text-lg" aria-hidden>👀</span>
      <div className="flex items-baseline gap-2">
        <div className="font-medium">Live right now:</div>
        <div className="text-emerald-700 font-extrabold text-2xl tabular-nums">{count}</div>
        <div>people filling the form</div>
      </div>
    </div>
  );
}
