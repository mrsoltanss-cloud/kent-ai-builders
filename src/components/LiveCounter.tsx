"use client";
import { useEffect, useMemo, useRef, useState } from "react";

/** Pick a target band based on local hour */
function hourBand(h: number){
  // peak 7–10, 12–14, 17–21
  if ((h>=7 && h<10) || (h>=12 && h<14) || (h>=17 && h<21)) return [300,500] as const;
  // shoulder 10–12, 14–17
  if ((h>=10 && h<12) || (h>=14 && h<17)) return [150,300] as const;
  // off-peak
  return [50,150] as const;
}

export default function LiveCounter({ className="" }: { className?: string }){
  const [mounted, setMounted] = useState(false);
  const [value, setValue]   = useState<number | null>(null);
  const timer = useRef<number | null>(null);

  // Start after mount to avoid SSR/client mismatch
  useEffect(() => {
    setMounted(true);
    const h = new Date().getHours();
    const [lo, hi] = hourBand(h);

    // seed near middle of band
    let v = Math.round((lo + hi) / 2 + (Math.random()-0.5) * (hi-lo) * 0.15);
    v = Math.max(lo, Math.min(hi, v));
    setValue(v);

    function tick(){
      const hNow = new Date().getHours();
      const [loNow, hiNow] = hourBand(hNow);

      // random walk with small step
      const step = Math.round((Math.random()-0.5) * 8); // -4..+4
      v = v + step;

      // gently pull back toward band if we drift
      if (v < loNow) v += Math.ceil((loNow - v) * 0.3);
      if (v > hiNow) v -= Math.ceil((v - hiNow) * 0.3);

      // clamp just in case
      v = Math.max(50, Math.min(500, v));
      setValue(v);

      // 1–2s cadence
      const next = 1000 + Math.floor(Math.random()*1000);
      timer.current = window.setTimeout(tick, next);
    }

    timer.current = window.setTimeout(tick, 1200);
    return () => { if (timer.current) window.clearTimeout(timer.current); };
  }, []);

  return (
    <div className={className}>
      <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-emerald-900 ring-1 ring-emerald-100">
        <span className="text-lg">👀</span>
        <span className="text-sm">Live right now:</span>
        {/* Show a stable placeholder on the server to avoid hydration mismatch */}
        <strong className="text-xl tabular-nums" suppressHydrationWarning>
          {mounted && value !== null ? value : "—"}
        </strong>
        <span className="text-sm">people filling the form</span>
      </div>
    </div>
  );
}
