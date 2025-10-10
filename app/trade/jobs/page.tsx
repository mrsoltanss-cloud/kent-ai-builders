'use client';

import { useEffect, useMemo, useState } from 'react';

type Trade = { id: string; key: string; label: string };
type Job = {
  id: string;
  title: string;
  summary?: string | null;
  postcode?: string | null;
  priceMin?: number | null;
  priceMax?: number | null;
  status?: string | null;
  createdAt?: string | null;
};

async function fetchTrades(): Promise<Trade[]> {
  const r = await fetch('/api/trade/trades', { cache: 'no-store' });
  if (!r.ok) return [];
  const j = await r.json().catch(() => ({}));
  return j?.trades ?? [];
}

async function fetchJobs(params: { q?: string; trade?: string }): Promise<Job[]> {
  const q = new URLSearchParams();
  if (params.q) q.set('q', params.q);
  if (params.trade) q.set('trade', params.trade);
  const r = await fetch(`/api/jobs?${q.toString()}`, { cache: 'no-store' });
  if (!r.ok) return [];
  const j = await r.json().catch(() => ({}));
  return j?.items ?? [];
}

export default function TradeJobsPage() {
  const [loading, setLoading] = useState(true);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [items, setItems] = useState<Job[]>([]);
  const [q, setQ] = useState('');
  const [trade, setTrade] = useState('');

  // initial load
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const [t, jobs] = await Promise.all([fetchTrades(), fetchJobs({})]);
        if (mounted) {
          setTrades(t);
          setItems(jobs);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const onSearch = async () => {
    setLoading(true);
    try {
      const data = await fetchJobs({ q, trade });
      setItems(data);
    } finally {
      setLoading(false);
    }
  };

  const clear = async () => {
    setQ('');
    setTrade('');
    setLoading(true);
    try {
      setItems(await fetchJobs({}));
    } finally {
      setLoading(false);
    }
  };

  const total = items.length;
  const header = useMemo(() => {
    const parts = [];
    if (trade) parts.push(trades.find(t => t.key === trade)?.label || trade);
    if (q) parts.push(`“${q}”`);
    return parts.length ? parts.join(' · ') : 'All jobs';
  }, [trade, q, trades]);

  return (
    <main className="mx-auto max-w-5xl p-4 space-y-6">
      <header className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Jobs</h1>
        <div className="text-sm text-slate-600">{loading ? 'Loading…' : `${total} job${total === 1 ? '' : 's'}`}</div>
      </header>

      <section className="grid gap-3 md:grid-cols-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by title, summary, postcode…"
          className="md:col-span-2 w-full border rounded-xl px-3 py-2"
        />
        <select
          value={trade}
          onChange={(e) => setTrade(e.target.value)}
          className="w-full border rounded-xl px-3 py-2"
        >
          <option value="">All trades</option>
          {trades.map(t => (
            <option key={t.id} value={t.key}>{t.label}</option>
          ))}
        </select>

        <div className="md:col-span-3 flex gap-2">
          <button
            onClick={onSearch}
            className="rounded-xl px-4 py-2 bg-black text-white"
            disabled={loading}
          >
            {loading ? 'Searching…' : 'Search'}
          </button>
          <button
            onClick={clear}
            className="rounded-xl px-4 py-2 border"
            disabled={loading}
          >
            Clear
          </button>
        </div>
      </section>

      <h2 className="text-lg font-medium">{header}</h2>

      <section className="grid gap-4">
        {items.map(job => (
          <article key={job.id} className="border rounded-2xl p-4 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold">{job.title}</h3>
                {job.summary && <p className="text-sm text-slate-700 mt-1">{job.summary}</p>}
                <div className="text-xs text-slate-500 mt-2 flex gap-3">
                  {job.postcode && <span>Postcode: {job.postcode}</span>}
                  {(job.priceMin ?? null) !== null && (job.priceMax ?? null) !== null && (
                    <span>£{job.priceMin?.toLocaleString()} – £{job.priceMax?.toLocaleString()}</span>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                {job.status && (
                  <span className="text-xs rounded-full border px-2 py-1">{job.status}</span>
                )}
                <a
                  href={`/trade/jobs/${job.id}`}
                  className="text-sm rounded-xl px-3 py-2 bg-black text-white"
                >
                  View / Bid
                </a>
              </div>
            </div>
          </article>
        ))}
        {!loading && items.length === 0 && (
          <div className="text-sm text-slate-600">No jobs found. Try clearing filters.</div>
        )}
      </section>
    </main>
  );
}
