'use client';

import * as React from 'react';
import Link from 'next/link';

const fmtGBP = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 });

type Summary = {
  ok: boolean;
  lead?: { id: string; jobType?: string | null; status?: string | null; createdAt?: string } | null;
  counts?: { leads: number; files: number; messages: number };
  nextAction?: { label: string; href: string };
  error?: string;
};

export default function MySummaryClient() {
  const [data, setData] = React.useState<Summary | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [err, setErr] = React.useState<string | null>(null);

  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch('/api/my/summary', { cache: 'no-store' });
        const json: Summary = await res.json();
        if (!alive) return;
        if (!res.ok || !json.ok) throw new Error(json?.error || 'Failed');
        setData(json);
      } catch (e: any) {
        setErr(e?.message || 'Failed to load');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  if (loading) {
    return (
      <section className="mx-auto w-full max-w-5xl px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[...Array(4)].map((_,i)=>(
            <div key={i} className="h-28 rounded-xl bg-neutral-100 animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (err || !data?.ok) {
    return (
      <section className="mx-auto w-full max-w-3xl px-4 py-6">
        <div className="rounded-xl bg-red-50 text-red-700 p-4 text-sm">
          {err || data?.error || 'Could not load your dashboard.'}
        </div>
      </section>
    );
  }

  const lead = data.lead || null;
  const next = data.nextAction || { label: 'Start your quote', href: '/quote' };
  const jobHref = lead ? `/my/jobs/${lead.id}` : '/quote';

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-8">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-tight">Your dashboard</h2>
        <Link href={next.href} className="text-sm font-medium text-emerald-700 hover:underline">
          {next.label} →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Job summary */}
        <Link href={jobHref} className="rounded-xl ring-1 ring-black/10 bg-white p-4 hover:shadow-sm transition">
          <p className="text-xs text-neutral-500">Current job</p>
          <p className="mt-1 font-semibold">{lead?.jobType || 'Not started'}</p>
          <p className="mt-2 text-xs text-neutral-500">Status</p>
          <p className="text-sm">{lead?.status || '—'}</p>
        </Link>

        {/* Estimate teaser (optional) */}
        <div className="rounded-xl ring-1 ring-black/10 bg-white p-4">
          <p className="text-xs text-neutral-500">Estimate</p>
          <p className="mt-1 font-semibold">
            {/* In future, show a real range from API; for now show friendly state */}
            {lead ? 'We’re working on it' : '—'}
          </p>
          <p className="mt-2 text-xs text-neutral-500">Next</p>
          <Link href={next.href} className="text-sm font-medium text-emerald-700 hover:underline">
            {next.label} →
          </Link>
        </div>

        {/* Files */}
        <Link
          href={lead ? `/my/jobs/${lead.id}/files` : '/quote'} 
          className="rounded-xl ring-1 ring-black/10 bg-white p-4 hover:shadow-sm transition"
        >
          <p className="text-xs text-neutral-500">Your files</p>
          <p className="mt-1 font-semibold">Photos & plans</p>
          <p className="mt-2 text-xs text-neutral-500">Action</p>
          <p className="text-sm">{lead ? 'Add or view files' : 'Start a job first'}</p>
        </Link>

        {/* Timeline */}
        <Link
          href={lead ? `/my/jobs/${lead.id}` : '/quote'}
          className="rounded-xl ring-1 ring-black/10 bg-white p-4 hover:shadow-sm transition"
        >
          <p className="text-xs text-neutral-500">Timeline</p>
          <p className="mt-1 font-semibold">See progress</p>
          <p className="mt-2 text-xs text-neutral-500">Stage</p>
          <p className="text-sm">{lead?.status || '—'}</p>
        </Link>
      </div>
    </section>
  );
}
