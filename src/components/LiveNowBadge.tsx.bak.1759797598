"use client";

import { useEffect, useState } from "react";

/** Small pill badge matching the original "Live right now" style */
export default function LiveNowBadge() {
  const [count, setCount] = useState(215);
  useEffect(() => {
    // Gentle wiggle to feel "live" without being distracting
    const id = setInterval(() => {
      setCount((c) => Math.max(180, Math.min(350, c + (Math.random() > 0.5 ? 1 : -1))));
    }, 4000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50/70 px-3 py-2 text-sm text-emerald-800">
      <span className="text-lg leading-none">👀</span>
      <span className="text-gray-700">Live right now:</span>
      <span className="font-semibold text-emerald-700 text-base">{count}</span>
      <span className="text-gray-700">people filling the form</span>
    </div>
  );
}
