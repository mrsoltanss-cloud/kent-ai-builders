"use client";

import { useEffect, useMemo, useRef, useState } from "react";

function hourBand(now = new Date()) {
  // local time banding
  const h = now.getHours();
  // Peak: 7–10, 12–14, 17–21
  if ((h >= 7 && h < 10) || (h >= 12 && h < 14) || (h >= 17 && h < 21)) return "peak";
  // Shoulder: 10–12, 14–17
  if ((h >= 10 && h < 12) || (h >= 14 && h < 17)) return "shoulder";
  // Off-peak: 21–7
  return "off";
}

function bandRange(band: "peak" | "shoulder" | "off") {
  if (band === "peak") return [300, 500] as const;
  if (band === "shoulder") return [150, 300] as const;
  return [50, 150] as const;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function LiveCounter({ className = "" }: { className?: string }) {
  const band = useMemo(() => hourBand(), []);
  const [min, max] = bandRange(band);
  const seed = useMemo(() => {
    // start somewhere sensible in band
    const start = Math.floor((min + max) / 2 + (Math.random() - 0.5) * (max - min) * 0.2);
    return clamp(start, min, max);
  }, [min, max]);

  const [value, setValue] = useState(seed);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    function tick() {
      // random walk: tiny steps, bias back toward band center
      const center = (min + max) / 2;
      const toCenter = (center - value) * 0.05; // gentle pull
      const noise = (Math.random() - 0.5) * (max - min) * 0.02; // small wiggle
      const step = toCenter + noise;
      setValue(v => clamp(Math.round(v + step), min, max));

      // 1–2s cadence
      const nextIn = 1000 + Math.random() * 1000;
      timer.current = window.setTimeout(tick, nextIn) as unknown as number;
    }
    timer.current = window.setTimeout(tick, 1000) as unknown as number;
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [min, max]);

  return (
    <div className={className}>
      <div className="inline-flex items-baseline gap-2 rounded-xl bg-emerald-50 text-emerald-800 px-3 py-1.5 border border-emerald-200">
        <span className="text-lg">👀</span>
        <span className="text-sm">Live right now:</span>
        <strong className="text-xl tabular-nums">{value}</strong>
        <span className="text-sm">people filling the form</span>
      </div>
    </div>
  );
}
