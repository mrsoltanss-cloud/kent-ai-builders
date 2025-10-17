"use client";

import React from "react";

export type TickerItem = {
  service: string;
  town: string;
  low: number;
  high: number;
  weeks?: [number, number];
};

export default function RecentTicker({
  items,
  paused,
  className = "",
  ariaLabel = "Recent estimates",
}: {
  items: TickerItem[];
  paused?: boolean;
  className?: string;
  ariaLabel?: string;
}) {
  const fmt = (i: TickerItem) => {
    const weeks =
      i.weeks && i.weeks.length === 2 ? `${i.weeks[0]}–${i.weeks[1]} wks` : "";
    return `${i.service} • ${i.town} • £${i.low.toLocaleString()}–£${i.high.toLocaleString()}${weeks ? ` • ${weeks}` : ""}`;
  };

  const track = [...items, ...items];

  return (
    <div
      className={`group relative isolate overflow-hidden rounded-xl border border-slate-200/70 bg-white/70 backdrop-blur px-3 py-2 ${className}`}
      aria-label={ariaLabel}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent opacity-[0.10]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent opacity-[0.10]" />

      <div
        className={`flex min-w-max gap-6 whitespace-nowrap will-change-transform [animation:rticker_22s_linear_infinite] group-hover:[animation-play-state:paused] ${
          paused ? "[animation-play-state:paused]" : ""
        }`}
        role="list"
      >
        {track.map((it, idx) => (
          <div
            key={idx}
            role="listitem"
            className="inline-flex items-center gap-2 text-xs sm:text-sm text-slate-700"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500/80" />
            <span className="tabular-nums">{fmt(it)}</span>
          </div>
        ))}
      </div>

      <style jsx global>{`
        @keyframes rticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @media (max-width: 640px) {
          .[animation\\:rticker_22s_linear_infinite] {
            animation: rticker 16s linear infinite;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .[animation\\:rticker_22s_linear_infinite] {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
