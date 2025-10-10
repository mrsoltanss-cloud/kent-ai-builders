"use client";
import { useEffect, useMemo, useState } from "react";

function getFp(): string {
  if (typeof window === "undefined") return "server";
  const k = "kab:fp";
  let v = localStorage.getItem(k);
  if (!v) { v = `kab:${navigator.userAgent}`; localStorage.setItem(k, v); }
  return v;
}

export default function HideJoinedToggle() {
  const [joined, setJoined] = useState<string[]>([]);
  const [enabled, setEnabled] = useState<boolean>(false);

  // fetch joined job IDs for this fingerprint
  useEffect(() => {
    const fp = getFp();
    fetch(`/api/trade/intros?fp=${encodeURIComponent(fp)}`)
      .then(r => r.json())
      .then(d => setJoined(d.items ?? []))
      .catch(() => setJoined([]));
  }, []);

  // apply DOM hide/show without touching server components
  useEffect(() => {
    const ids = new Set(joined);
    const items = Array.from(document.querySelectorAll<HTMLLIElement>("#jobs-list li[data-job-id]"));
    let hidden = 0;
    for (const li of items) {
      const id = li.getAttribute("data-job-id") || "";
      const shouldHide = enabled && ids.has(id);
      li.style.display = shouldHide ? "none" : "";
      if (shouldHide) hidden++;
    }
    const badge = document.getElementById("hide-joined-count");
    if (badge) badge.textContent = hidden ? String(hidden) : "";
  }, [enabled, joined]);

  const hasAny = joined.length > 0;
  const label = useMemo(() => (enabled ? "Hiding joined" : "Hide jobs I’ve joined"), [enabled]);

  return (
    <label className="flex items-center gap-2 px-3 py-2 rounded border bg-white">
      <input
        type="checkbox"
        checked={enabled}
        onChange={(e)=>setEnabled(e.target.checked)}
        disabled={!hasAny}
      />
      <span className={hasAny ? "" : "opacity-60"}>{label}</span>
      <span
        id="hide-joined-count"
        className="text-xs px-1.5 rounded bg-gray-100 text-gray-700"
        aria-hidden={!enabled}
      />
    </label>
  );
}
