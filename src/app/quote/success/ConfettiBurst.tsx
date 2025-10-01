"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";

/** Fires a short celebratory confetti sequence when mounted. */
export default function ConfettiBurst() {
  useEffect(() => {
    // base burst
    const defaults = { origin: { y: 0.6 } };

    function fire(particleRatio: number, opts: any) {
      confetti(Object.assign({}, defaults, opts, {
        particleCount: Math.floor(240 * particleRatio),
      }));
    }

    // a few varied shots for a nice sequence
    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2,  { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.9 });
    fire(0.1,  { spread: 120, startVelocity: 25 });
    fire(0.1,  { spread: 120, startVelocity: 45 });

    // optional subtle trailing sparkle
    const t1 = setTimeout(() => confetti({ particleCount: 40, angle: 60, spread: 55, origin: { x: 0,   y: 0.6 } }), 250);
    const t2 = setTimeout(() => confetti({ particleCount: 40, angle: 120, spread: 55, origin: { x: 1,   y: 0.6 } }), 250);

    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return null;
}
