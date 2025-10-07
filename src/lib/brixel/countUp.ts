"use client";
import { useEffect, useRef, useState } from "react";

export function useCountUp(target: number, duration = 700) {
  const [val, setVal] = useState(0);
  const targetRef = useRef(target);

  useEffect(() => { targetRef.current = target; }, [target]);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const from = val;
    const to = targetRef.current;

    const tick = (t: number) => {
      const e = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - e, 3);
      setVal(Math.round(from + (to - from) * eased));
      if (e < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  return val;
}
