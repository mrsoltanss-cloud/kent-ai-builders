"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  texts: string[];
  speed?: number;      // ms per char while typing
  backspace?: number;  // ms per char while deleting
  pause?: number;      // ms to hold when fully typed
  className?: string;
};

export default function TypewriterText({
  texts,
  speed = 28,
  backspace = 18,
  pause = 1600,
  className = "",
}: Props) {
  const [i, setI] = useState(0);
  const [out, setOut] = useState("");
  const [phase, setPhase] = useState<"typing"|"hold"|"deleting">("typing");
  const reduced = useReducedMotion();

  const current = texts[i % texts.length] ?? "";

  useEffect(() => {
    if (reduced) { setOut(current); return; }
    let t: any;
    if (phase === "typing") {
      if (out.length < current.length) {
        t = setTimeout(() => setOut(current.slice(0, out.length + 1)), speed);
      } else {
        t = setTimeout(() => setPhase("hold"), pause);
      }
    } else if (phase === "hold") {
      t = setTimeout(() => setPhase("deleting"), Math.max(500, pause / 2));
    } else {
      if (out.length > 0) {
        t = setTimeout(() => setOut(current.slice(0, out.length - 1)), backspace);
      } else {
        setPhase("typing");
        setI((n) => (n + 1) % texts.length);
      }
    }
    return () => clearTimeout(t);
  }, [out, phase, current, speed, backspace, pause, reduced, texts.length]);

  useEffect(() => {
    if (reduced) setOut(current);
  }, [current, reduced]);

  return (
    <div aria-live="polite" className={className}>
      <span className="font-medium text-slate-700">{out}</span>
      {!reduced && <span className="inline-block w-[1ch] animate-pulse">|</span>}
    </div>
  );
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  const mounted = useRef(false);
  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;
    if (typeof window === "undefined" || !("matchMedia" in window)) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(!!mq.matches);
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, []);
  return reduced;
}
