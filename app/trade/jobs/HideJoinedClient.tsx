"use client";
import { useEffect, useState } from "react";

function ensureFp(): string {
  if (typeof window === "undefined") return "server";
  const k = "kab:fp";
  let v = localStorage.getItem(k);
  if (!v) { v = `kab:${navigator.userAgent}`; localStorage.setItem(k, v); }
  return v;
}

export default function HideJoinedClient({
  onReady,
}: { onReady?: (fp: string, joinedIds: string[]) => void }) {
  const [fp, setFp] = useState<string>("");
  useEffect(() => {
    const f = ensureFp();
    setFp(f);
    fetch(`/api/trade/intros?fp=${encodeURIComponent(f)}`)
      .then(r => r.json())
      .then(d => { onReady?.(f, d.items ?? []); })
      .catch(() => { onReady?.(f, []); });
  }, [onReady]);
  return null;
}
