"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Sparkles, Check, X } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  services: string[];
  onSelect: (service: string) => void;
  hint?: string;
};

function fuzzyScore(q: string, s: string) {
  // super light fuzzy: rewards prefix + subsequence matches
  const t = s.toLowerCase();
  let score = 0, i = 0;
  if (t.startsWith(q)) score += 100; // prefix
  for (const c of q) {
    const j = t.indexOf(c, i);
    if (j === -1) return -1;
    score += Math.max(1, 10 - (j - i));
    i = j + 1;
  }
  return score;
}

export default function CommandSearch({ open, onClose, services, onSelect, hint }: Props) {
  const [query, setQuery] = useState("");
  const [idx, setIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 0);
      setIdx(0);
      setQuery("");
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "Escape") { e.preventDefault(); onClose(); }
      if (e.key === "ArrowDown") { e.preventDefault(); setIdx((i) => Math.min(i + 1, 9)); }
      if (e.key === "ArrowUp") { e.preventDefault(); setIdx((i) => Math.max(i - 1, 0)); }
      if (e.key === "Enter") {
        e.preventDefault();
        if (results[idx]) { onSelect(results[idx].text); onClose(); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, idx]); // eslint-disable-line

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return services.slice(0, 10).map((s) => ({ text: s, score: 0 }));
    return services
      .map((s) => ({ text: s, score: fuzzyScore(q, s) }))
      .filter((r) => r.score >= 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  }, [query, services]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 grid place-items-start md:place-items-center pt-12 md:pt-0">
            <motion.div
              initial={{ y: 16, opacity: 0, scale: .98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 16, opacity: 0, scale: .98 }}
              transition={{ type: "spring", stiffness: 280, damping: 30 }}
              className="w-[min(680px,92vw)] overflow-hidden rounded-3xl border border-white/40 bg-white/90 shadow-[0_30px_120px_rgba(0,0,0,0.25)]"
            >
              <div className="relative border-b border-white/60">
                <div className="pointer-events-none absolute inset-0 rounded-3xl">
                  <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-r from-emerald-300/40 via-emerald-500/40 to-teal-400/40 blur-md" />
                </div>
                <div className="relative flex items-center gap-2 px-4 py-3">
                  <Search className="h-5 w-5 text-emerald-700" />
                  <input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search services…  (Try “kitchen”, “roof”, “solar”…)"
                    className="h-10 w-full bg-transparent text-base outline-none placeholder:text-gray-500"
                  />
                  <button
                    onClick={onClose}
                    className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100"
                    aria-label="Close"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                {hint && (
                  <div className="flex items-center gap-2 px-4 pb-3 text-xs text-gray-600">
                    <Sparkles className="h-4 w-4 text-emerald-600" />
                    {hint}
                  </div>
                )}
              </div>

              <ul className="max-h-[56vh] overflow-auto p-2">
                {results.map((r, i) => (
                  <li key={r.text}>
                    <button
                      onMouseEnter={() => setIdx(i)}
                      onClick={() => { onSelect(r.text); onClose(); }}
                      className={`group flex w-full items-center justify-between rounded-2xl px-3 py-3 text-left ${
                        i === idx ? "bg-emerald-50 ring-1 ring-emerald-200" : "hover:bg-gray-50"
                      }`}
                    >
                      <span className="text-sm text-gray-800">{r.text}</span>
                      {i === idx && <Check className="h-4 w-4 text-emerald-700 opacity-80" />}
                    </button>
                  </li>
                ))}
                {results.length === 0 && (
                  <li className="px-4 py-6 text-sm text-gray-500">No matches. Try a broader term.</li>
                )}
              </ul>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
