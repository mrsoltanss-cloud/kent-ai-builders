"use client";
import { useEffect, useState } from "react";

function fp(): string {
  if (typeof window === "undefined") return "server";
  return localStorage.getItem("kab:fp") || `kab:${navigator.userAgent}`;
}

function markJoined(jobId: string) {
  try {
    const prev = JSON.parse(localStorage.getItem("kab:joined") || "[]") as string[];
    const set = new Set<string>(prev);
    set.add(jobId);
    localStorage.setItem("kab:joined", JSON.stringify([...set]));
  } catch {
    localStorage.setItem("kab:joined", JSON.stringify([jobId]));
  }
  // Let HideJoinedToggle re-apply filters
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("kab:joined-ready"));
  }
}

export default function JoinShortlistButton({
  jobId, introduced, cap
}: { jobId: string; introduced: number; cap: number }) {
  const [busy, setBusy] = useState(false);
  const [mine, setMine] = useState(false);
  const [count, setCount] = useState(introduced);
  const full = count >= cap;

  // If this job was already joined on this device, reflect that
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const joined = new Set<string>(JSON.parse(localStorage.getItem("kab:joined") || "[]"));
      if (joined.has(jobId)) setMine(true);
    } catch {}
  }, [jobId]);

  const onClick = async () => {
    if (busy || full || mine) return;
    setBusy(true);
    try {
      const res = await fetch("/api/trade/interest", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ jobId, fingerprint: fp() }),
      });
      if (res.status === 409) {
        // already on shortlist
        setMine(true);
        markJoined(jobId);
        alert("You’re already on this shortlist.");
      } else if (!res.ok) {
        alert("Sorry — couldn’t join the shortlist.");
      } else {
        const d = await res.json();
        setCount(d.contactUnlocks ?? (count + 1));
        setMine(true);
        markJoined(jobId);
      }
    } finally {
      setBusy(false);
    }
  };

  if (mine) return <button disabled className="px-3 py-2 rounded bg-emerald-600/10 text-emerald-700">You’re on the shortlist!</button>;
  return (
    <button onClick={onClick} disabled={busy || full}
      className={`px-3 py-2 rounded ${full ? "bg-gray-200 text-gray-500" : "bg-black text-white hover:bg-gray-900"}`}>
      {full ? "Shortlist full" : "Join shortlist"}
    </button>
  );
}
