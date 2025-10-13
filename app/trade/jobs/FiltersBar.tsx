'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

type Trade = { key: string; label: string };

function useFingerprint() {
  return useMemo(() => {
    if (typeof window === 'undefined') return '';
    const KEY = 'builder_fp';
    let fp = localStorage.getItem(KEY);
    if (!fp) {
      // simple stable anonymous id
      fp = (crypto?.randomUUID?.() || Math.random().toString(36).slice(2)) + '-fp';
      localStorage.setItem(KEY, fp);
    }
    return fp;
  }, []);
}

export default function FiltersBar() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const fp = useFingerprint();

  const [q, setQ] = useState(sp?.get?.('q') || '');
  const [trade, setTrade] = useState(sp?.get?.('trade') || '');
  const [tier, setTier] = useState(sp?.get?.('tier') || '');
  const [min, setMin] = useState(sp?.get?.('min') || '');
  const [max, setMax] = useState(sp?.get?.('max') || '');
  const [sort, setSort] = useState(sp?.get?.('sort') || 'new');
  const [notBid, setNotBid] = useState(sp?.get?.('notBid') === '1');

  const [trades, setTrades] = useState<Trade[]>([]);
  const [loadingTrades, setLoadingTrades] = useState(false);

  useEffect(() => {
    let ignore = false;
    (async () => {
      setLoadingTrades(true);
      try {
        const res = await fetch('/api/trades', { cache: 'no-store' });
        const data = await res.json();
        if (!ignore) setTrades(data.items || []);
      } catch {
        /* noop */
      } finally {
        if (!ignore) setLoadingTrades(false);
      }
    })();
    return () => { ignore = true; };
  }, []);

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => pushQuery(), 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  function pushQuery(extra?: Record<string,string|undefined>) {
    const next = new URLSearchParams(Array.from(sp?.entries?.() ?? []));

    const setOrDel = (k: string, v?: string) => {
      if (v && v.trim() !== '') next.set(k, v.trim());
      else next.delete(k);
    };

    setOrDel('q', q);
    setOrDel('trade', trade);
    setOrDel('tier', tier);
    setOrDel('min', min);
    setOrDel('max', max);
    setOrDel('sort', sort);

    if (notBid) next.set('notBid', '1'); else next.delete('notBid');

    // include fingerprint only when notBid is active
    if (notBid && fp) next.set('fp', fp); else next.delete('fp');

    if (extra) {
      for (const [k, v] of Object.entries(extra)) setOrDel(k, v);
    }

    router.replace(`${pathname}?${next.toString()}`);
  }

  return (
    <div className="mb-4 p-3 rounded-xl border border-gray-200 bg-white/70 backdrop-blur">
      <div className="flex flex-wrap gap-2 items-center">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search jobs (title, summary, description, postcode)"
          className="flex-1 min-w-[220px] px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
        />

        <select
          value={trade}
          onChange={(e) => { setTrade(e.target.value); pushQuery(); }}
          className="px-3 py-2 rounded-lg border border-gray-300"
          disabled={loadingTrades}
        >
          <option value="">All trades</option>
          {trades.map(t => (
            <option key={t.key} value={t.key}>{t.label}</option>
          ))}
        </select>

        <select
          value={tier}
          onChange={(e) => { setTier(e.target.value); pushQuery(); }}
          className="px-3 py-2 rounded-lg border border-gray-300"
        >
          <option value="">All tiers</option>
          <option value="PRIORITY">Priority</option>
          <option value="QUICKWIN">Quick win</option>
          <option value="STANDARD">Standard</option>
        </select>

        <input
          type="number"
          inputMode="numeric"
          value={min}
          onChange={(e) => { setMin(e.target.value); }}
          onBlur={() => pushQuery()}
          placeholder="Min £"
          className="w-28 px-3 py-2 rounded-lg border border-gray-300"
        />
        <input
          type="number"
          inputMode="numeric"
          value={max}
          onChange={(e) => { setMax(e.target.value); }}
          onBlur={() => pushQuery()}
          placeholder="Max £"
          className="w-28 px-3 py-2 rounded-lg border border-gray-300"
        />

        <select
          value={sort}
          onChange={(e) => { setSort(e.target.value); pushQuery(); }}
          className="px-3 py-2 rounded-lg border border-gray-300"
        >
          <option value="new">Newest</option>
          <option value="budget">Budget (high→low)</option>
          <option value="slots">Slots left</option>
        </select>

        <label className="inline-flex items-center gap-2 ml-2">
          <input
            type="checkbox"
            checked={notBid}
            onChange={(e) => { setNotBid(e.target.checked); pushQuery(); }}
          />
          <span className="text-sm">Only not bid</span>
        </label>

        <button
          className="ml-auto px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 text-sm"
          onClick={() => {
            setQ('');
            setTrade('');
            setTier('');
            setMin('');
            setMax('');
            setSort('new');
            setNotBid(false);
            router.replace(pathname || "/trade/jobs");
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
