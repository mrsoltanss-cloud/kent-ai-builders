"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";

type Confidence = "low" | "medium" | "high";
type Props = { confidence?: Confidence | string | null; className?: string };

function pctFor(conf?: string | null) {
  const c = (conf || "medium").toLowerCase();
  if (c === "low") return 35;
  if (c === "high") return 92;
  return 65;
}

export default function AnimatedConfidenceBar({ confidence, className = "" }: Props) {
  const [pct, setPct] = useState(pctFor(confidence));
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    setPct(pctFor(confidence));
    setFlash(true);
    const t = setTimeout(() => setFlash(false), 500);
    return () => clearTimeout(t);
  }, [confidence]);

  const label = useMemo(() => {
    const c = (confidence || "medium").toLowerCase();
    return `${c[0].toUpperCase()}${c.slice(1)} confidence`;
  }, [confidence]);

  return (
    <div className={className}>
      <div className="flex items-center gap-2 text-xs text-slate-600 mb-1">
        <span
          className={`inline-block h-2 w-2 rounded-full ${
            confidence === "high"
              ? "bg-emerald-500"
              : confidence === "low"
              ? "bg-amber-500"
              : "bg-sky-500"
          } animate-pulse`}
        />
        <span>{label}</span>
      </div>

      <div className="relative h-2.5 w-full rounded-full bg-slate-200/80 overflow-hidden">
        <div
          className={`absolute left-0 top-0 h-full rounded-full transition-all duration-700 ease-out 
            ${confidence === "high" ? "bg-gradient-to-r from-emerald-400 to-emerald-600"
            : confidence === "low" ? "bg-gradient-to-r from-amber-300 to-amber-500"
            : "bg-gradient-to-r from-sky-300 to-sky-500"}`}
          style={{ width: `${pct}%` }}
        />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 -translate-x-full shimmer" />
        </div>
        {flash && (
          <div className="absolute inset-0 rounded-full ring-2 ring-sky-300/40 animate-[ping_0.6s_ease-out_1]" />
        )}
      </div>

      <style jsx>{`
        @keyframes shimmerMove {
          0% { transform: translateX(-100%); opacity: .0; }
          20% { opacity: .15; }
          100% { transform: translateX(100%); opacity: .0; }
        }
        .shimmer {
          background: linear-gradient(
            90deg,
            rgba(255,255,255,0) 0%,
            rgba(255,255,255,0.5) 50%,
            rgba(255,255,255,0) 100%
          );
          animation: shimmerMove 1.8s infinite;
        }
      `}</style>
    </div>
  );
}
