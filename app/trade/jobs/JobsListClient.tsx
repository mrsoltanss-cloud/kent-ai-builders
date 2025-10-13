// app/trade/jobs/JobsListClient.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

export type JobItem = {
  id: string;
  title: string;
  summary?: string | null;
  postcode: string;
  priceMin?: number | null;
  priceMax?: number | null;
  tier: "STANDARD" | "QUICKWIN" | "PRIORITY";
  status: "OPEN" | "PAUSED" | "CLOSED";
  views?: number | null;
  contactUnlocks: number;
  allocCap: number;
  isNew: boolean;
  allocationFull: boolean;
  trades: string[];
  createdAt: string;
};

function ensureFingerprint(): string {
  if (typeof window === "undefined") return "server";
  const key = "kab:fp";
  let v = localStorage.getItem(key);
  if (!v) {
    const rand = Math.random().toString(36).slice(2, 8);
    v = `kab:${navigator.userAgent}:${rand}`;
    localStorage.setItem(key, v);
  }
  return v;
}

export default function JobsListClient({ initial }: { initial: JobItem[] }) {
  const [hideJoined, setHideJoined] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("kab:hideJoined") === "1";
  });
  const [joinedIds, setJoinedIds] = useState<string[]>([]);

  useEffect(() => {
    const fp = ensureFingerprint();
    fetch(`/api/trade/intros?fp=${encodeURIComponent(fp)}`)
      .then((r) => r.json())
      .then((d) => Array.isArray(d.items) ? setJoinedIds(d.items) : setJoinedIds([]))
      .catch(() => setJoinedIds([]));
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("kab:hideJoined", hideJoined ? "1" : "0");
    }
  }, [hideJoined]);

  const items = useMemo(() => {
    if (!hideJoined) return initial;
    const set = new Set(joinedIds);
    return initial.filter((j) => !set.has(j.id));
  }, [hideJoined, joinedIds, initial]);

  return (
    <>
      <div className="mb-3 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Showing <strong>{items.length}</strong> job{items.length === 1 ? "" : "s"}
        </div>
        <label className="label cursor-pointer gap-2">
          <span className="label-text">Hide jobs I’ve joined</span>
          <input
            type="checkbox"
            className="toggle"
            checked={hideJoined}
            onChange={(e) => setHideJoined(e.target.checked)}
          />
        </label>
      </div>

      <ul className="space-y-6" id="jobs-list">
        {items.length === 0 && (
          <li className="text-gray-600">No jobs found. Try clearing filters or disabling the toggle.</li>
        )}

        {items.map((j) => {
          const introduced = j.contactUnlocks ?? 0;
          const cap = j.allocCap ?? 3;
          const slotsLeft = Math.max(0, cap - introduced);
          const full = introduced >= cap;

          return (
            <li key={j.id} className="rounded-xl border p-5 bg-white shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-medium flex-1">{j.title}</h2>
                {j.isNew && (
                  <span className="badge badge-success badge-outline">
                    NEW — be the first to contact
                  </span>
                )}
                <span className="badge">
                  {j.tier === "QUICKWIN" ? "Quick win" : j.tier === "PRIORITY" ? "Priority" : "Standard"}
                </span>
              </div>

              {j.summary && <p className="text-gray-700 mb-3">{j.summary}</p>}

              <div className="flex flex-wrap gap-3 text-sm mb-3">
                <span className="badge badge-ghost">📍 {j.postcode}</span>
                <span className="badge badge-ghost">
                  📄 £{j.priceMin?.toLocaleString() ?? "-"} — £{j.priceMax?.toLocaleString() ?? "-"}
                </span>
                <span className="badge badge-ghost">👀 {j.views ?? 0} views</span>
                <span className="badge badge-ghost">
                  👤 {introduced} / {cap} introduced
                </span>
              </div>

              <progress className="progress progress-warning w-full mb-3" value={introduced} max={cap} />

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  {introduced} / {cap} introduced — {slotsLeft} slots left
                </div>
                <div className="flex items-center gap-3">
                  <Link href={`/trade/jobs/${j.id}`} className="link link-hover text-sm">
                    View details
                  </Link>
                  <JoinBtn jobId={j.id} introduced={introduced} cap={cap} />
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}

// Tiny dynamic bridge to keep this file purely client
function JoinBtn(props: { jobId: string; introduced: number; cap: number }) {
  // @ts-ignore
  const Button = require("./JoinShortlistButton").default;
  return <Button {...props} />;
}
