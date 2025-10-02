"use client";
import { useEffect, useRef } from "react";

type Mode = "once" | "session" | "always";

type Props = {
  /** Storage key to remember we've already fired. Change to re-test easily. */
  storageKey?: string;
  /** once = localStorage, session = sessionStorage, always = never store */
  mode?: Mode;
  /** 1..3 — scales particles a bit */
  power?: 1 | 2 | 3;
  /** Center the burst (0..1) */
  originX?: number;
  originY?: number;
};

export default function ConfettiOnce({
  storageKey = "confetti_success_v2",
  mode = "session",
  power = 2,
  originX = 0.5,
  originY = 0.6,
}: Props) {
  const fired = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Respect reduced motion
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    // Choose persistence store
    const store =
      mode === "once" ? window.localStorage :
      mode === "session" ? window.sessionStorage : null;

    try {
      if (store && store.getItem(storageKey) === "done") return;
    } catch {
      // ignore storage errors
    }

    if (fired.current) return;
    fired.current = true;

    // Try to import canvas-confetti; if it fails, use a graceful fallback.
    import("canvas-confetti")
      .then(({ default: confetti }) => {
        const count = 80 * power;
        const spread = 70;
        const ticks = 200;

        // Stagger 3 bursts for a premium feel
        confetti({ particleCount: Math.round(count * 0.6), spread, origin: { x: originX, y: originY }, ticks });
        setTimeout(() => confetti({ particleCount: Math.round(count * 0.25), spread: spread + 10, origin: { x: originX, y: originY }, ticks }), 180);
        setTimeout(() => confetti({ particleCount: Math.round(count * 0.15), spread: spread + 20, origin: { x: originX, y: originY }, ticks }), 320);

        try { if (store) store.setItem(storageKey, "done"); } catch {}
      })
      .catch(() => {
        // Fallback: zero-deps emoji sprinkle
        emojiFallback({ originX, originY, power });
        try { if (store) store.setItem(storageKey, "done"); } catch {}
      });
  }, [mode, originX, originY, power, storageKey]);

  return null;
}

/** Minimal, self-cleaning emoji animation as a fallback */
function emojiFallback({
  originX = 0.5,
  originY = 0.6,
  power = 2,
}: { originX?: number; originY?: number; power?: number }) {
  const root = document.createElement("div");
  root.style.position = "fixed";
  root.style.left = "0";
  root.style.top = "0";
  root.style.width = "100vw";
  root.style.height = "100vh";
  root.style.pointerEvents = "none";
  root.style.zIndex = "2147483647";
  document.body.appendChild(root);

  const cx = window.innerWidth * originX;
  const cy = window.innerHeight * originY;

  const count = 28 * power;
  const emojis = ["🎉", "✨", "🎊", "⭐️", "💫"];
  for (let i = 0; i < count; i++) {
    const span = document.createElement("span");
    span.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    span.style.position = "absolute";
    span.style.left = `${cx}px`;
    span.style.top = `${cy}px`;
    span.style.fontSize = `${12 + Math.random() * 12}px`;
    span.style.opacity = "0";
    span.style.transform = `translate(-50%, -50%)`;

    const dx = (Math.random() - 0.5) * 300;
    const dy = (Math.random() - 0.5) * 280 - 80; // bias upward a bit
    const rot = (Math.random() - 0.5) * 90;
    const dur = 900 + Math.random() * 600;

    span.animate(
      [
        { transform: `translate(-50%,-50%) translate(0px,0px) rotate(0deg)`, opacity: 0 },
        { opacity: 1, offset: 0.15 },
        { transform: `translate(-50%,-50%) translate(${dx}px,${dy}px) rotate(${rot}deg)`, opacity: 0 }
      ],
      { duration: dur, easing: "cubic-bezier(.2,.7,.2,1)" }
    );

    root.appendChild(span);
  }

  setTimeout(() => { root.remove(); }, 1800);
}
