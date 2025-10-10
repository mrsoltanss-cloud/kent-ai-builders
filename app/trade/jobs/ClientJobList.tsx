'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

type Tier = 'STANDARD' | 'QUICKWIN' | 'PRIORITY';
type Job = {
  id: string;
  title: string;
  summary?: string | null;
  postcode?: string | null;
  priceMin?: number | null;
  priceMax?: number | null;
  tier?: Tier | null;
  views?: number | null;
  contactUnlocks?: number | null;
  allocCap?: number | null;
  status: 'OPEN' | 'CLOSED';
  createdAt: string;
  visibleUntil?: string | null;
  hasBid?: boolean; // from API for the current builder
};

export default function ClientJobList() {
  const sp = useSearchParams();
  const [items, setItems] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  // tiny per-query cache so the list feels instant but updates quickly after actions
  const cache = useRef(new Map<string, { ts: number; data: Job[] }>());
  const TTL = 5_000; // 5s

  const qs = useMemo(() => sp.toString(), [sp]);

  useEffect(() => {
    const key = qs;
    const ctrl = new AbortController();
    const cached = cache.current.get(key);
    if (cached && Date.now() - cached.ts < TTL) {
      setItems(cached.data);
      setLoading(false);
    } else {
      setLoading(true);
    }
    fetch(`/api/jobs?${key}`, { signal: ctrl.signal, cache: 'no-store' })
      .then((r) => r.json())
      .then((data) => {
        const next: Job[] = data.items || [];
        cache.current.set(key, { data: next, ts: Date.now() });
        setItems(next);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
    return () => ctrl.abort();
  }, [qs]);

  if (loading && items.length === 0) {
    return (
      <div className="grid gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-xl border border-gray-200 bg-white p-4 animate-pulse h-24" />
        ))}
      </div>
    );
  }
  if (!items.length) return <div className="text-sm text-gray-500">No jobs match your filters.</div>;

  return (
    <div className="grid gap-3">
      {items.map((j) => {
        const cap = j.allocCap ?? 3;
        const intro = j.contactUnlocks ?? 0;
        const slotsLeft = Math.max(0, cap - intro);
        const pct = Math.min(100, Math.round((intro / cap) * 100));
        const filled = j.status === 'CLOSED';

        // status label rules:
        // - if user has already bid: show joined
        // - else show NEW only when intro === 0
        const statusLabel = j.hasBid
          ? "You're on the shortlist"
          : intro === 0
          ? 'NEW — be the first to contact'
          : `${intro}/${cap} contacted — ${slotsLeft} slot${slotsLeft === 1 ? '' : 's'} left`;

        const ring =
          j.tier === 'PRIORITY' ? 'ring-rose-300' :
          j.tier === 'QUICKWIN' ? 'ring-amber-300' :
          'ring-emerald-300';

        const tierPill =
          j.tier === 'PRIORITY' ? 'bg-rose-50 text-rose-700' :
          j.tier === 'QUICKWIN' ? 'bg-amber-50 text-amber-700' :
          'bg-emerald-50 text-emerald-700';

        const bar =
          j.tier === 'PRIORITY' ? 'bg-rose-400' :
          j.tier === 'QUICKWIN' ? 'bg-amber-500' :
          'bg-emerald-500';

        return (
          <Link
            key={j.id}
            href={`/trade/jobs/${j.id}`}
            className={[
              'block rounded-xl border border-gray-200 bg-white p-4 transition',
              'hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400',
              'ring-1', ring,
              filled ? 'opacity-80' : ''
            ].join(' ')}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="font-medium truncate">{j.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2 mt-1">{j.summary}</p>

                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-600">
                  {j.tier ? <span className={`px-2 py-0.5 rounded ${tierPill}`}>{j.tier === 'QUICKWIN' ? 'Quick win' : j.tier.charAt(0) + j.tier.slice(1).toLowerCase()}</span> : null}
                  <span className="px-2 py-0.5 rounded bg-gray-50">{statusLabel}</span>
                  {j.postcode && <span className="px-2 py-0.5 rounded bg-gray-50">📍 {j.postcode}</span>}
                  {(j.priceMin ?? null) !== null && (j.priceMax ?? null) !== null && (
                    <span className="px-2 py-0.5 rounded bg-gray-50">£{(j.priceMin || 0).toLocaleString()}–£{(j.priceMax || 0).toLocaleString()}</span>
                  )}
                  <span className="px-2 py-0.5 rounded bg-gray-50">👀 {j.views ?? 0}</span>
                </div>

                {/* progress bar */}
                <div className="mt-3 h-2 rounded-full bg-gray-200 overflow-hidden">
                  <div className={`h-2 ${bar}`} style={{ width: `${pct}%` }} />
                </div>
              </div>

              {filled && (
                <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-600 bg-gray-100 px-2 py-1 rounded shrink-0">
                  Full — hidden in 72h
                </span>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
