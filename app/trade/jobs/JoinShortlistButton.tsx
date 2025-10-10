"use client";
import { useState, useTransition } from "react";

export default function JoinShortlistButton(
  { jobId, contactUnlocks, allocCap }:
  { jobId: string; contactUnlocks?: number; allocCap?: number }
) {
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  async function join() {
    setMsg(null);
    const fp = typeof navigator !== "undefined" ? `kab:${navigator.userAgent}` : "kab:server";
    const r = await fetch("/api/trade/interest", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ jobId, fingerprint: fp }),
    });
    if (r.status === 200) setMsg("Joined");
    else if (r.status === 409) setMsg("Already joined");
    else setMsg("Failed");
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => startTransition(join)}
        className="inline-flex items-center rounded-md bg-emerald-600 px-3 py-2 text-white text-sm disabled:opacity-50"
        disabled={pending}
      >
        {pending ? "Joining…" : "Join shortlist"}
      </button>
      {msg && <span className="text-xs text-gray-600">{msg}</span>}
    </div>
  );
}
