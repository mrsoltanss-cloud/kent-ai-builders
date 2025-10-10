'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

type Saved = { name: string; query: string };
const LS_KEY = 'saved_searches_v1';

export default function SavedSearches() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const [saved, setSaved] = useState<Saved[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      setSaved(raw ? JSON.parse(raw) : []);
    } catch { /* noop */ }
  }, []);

  const currentQuery = useMemo(() => sp.toString(), [sp]);

  function saveCurrent() {
    const name = prompt('Name this search (e.g. "Priority bathrooms <£2k")');
    if (!name) return;
    const next = [{ name, query: currentQuery }, ...saved.filter(s => s.name !== name)].slice(0, 12);
    setSaved(next);
    localStorage.setItem(LS_KEY, JSON.stringify(next));
  }

  function apply(q: string) {
    router.replace(`${pathname}?${q}`);
  }

  async function share() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch { /* noop */ }
  }

  function clearAll() {
    if (!confirm('Remove all saved searches?')) return;
    setSaved([]);
    localStorage.removeItem(LS_KEY);
  }

  return (
    <div className="mb-3 flex flex-wrap items-center gap-2 text-sm">
      <button
        onClick={saveCurrent}
        className="px-3 py-1.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50"
      >
        ★ Save current filters
      </button>

      <div className="flex items-center gap-2">
        <select
          onChange={(e) => e.target.value && apply(e.target.value)}
          className="px-3 py-1.5 rounded-lg border border-gray-300 bg-white"
          value=""
        >
          <option value="" disabled>Select saved…</option>
          {saved.map(s => (
            <option key={s.name} value={s.query}>{s.name}</option>
          ))}
        </select>
        {saved.length ? (
          <button
            onClick={clearAll}
            className="px-2 py-1 rounded border border-gray-300 text-gray-500 hover:bg-gray-50"
            title="Clear all saved filters"
          >
            Clear
          </button>
        ) : null}
      </div>

      <button
        onClick={share}
        className="ml-auto px-3 py-1.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50"
        title="Copy current URL"
      >
        Share this search
      </button>
      {copied && <span className="text-emerald-700">Copied!</span>}
    </div>
  );
}
