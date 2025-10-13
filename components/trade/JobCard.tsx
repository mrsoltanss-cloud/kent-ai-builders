// components/trade/JobCard.tsx
'use client'

import * as React from 'react'
import { toast } from 'sonner'
import { useWatchlist } from '@/lib/useWatchlist'

type Job = {
  id: string
  title: string
  summary?: string | null
  priceMin?: number | null
  priceMax?: number | null
  tier?: 'QUICKWIN' | 'STANDARD' | 'PREMIUM' | string | null
  status?: string | null
  views?: number | null
  contactUnlocks?: number | null
  allocCap?: number | null
  visibleUntil?: string | null
  postcode?: string | null
  aiSummary?: string | null
  meta?: {
    state: 'NEW' | 'BIDDING' | 'HOT' | 'FILLED_CLOSING' | 'EXPIRING' | 'OPEN'
    label: string
    emoji: string
    slotsLeft: number
    expiresInHours: number | null
    heatScore: number
    matchConfidence?: number
    verifiedHomeowner?: boolean
    bidPrice?: number
  }
}

function clsx(...xs: (string | false | null | undefined)[]) {
  return xs.filter(Boolean).join(' ')
}

function tierTheme(tier?: Job['tier']) {
  switch (tier) {
    case 'QUICKWIN':
      return {
        ring: 'ring-emerald-200',
        chipBg: 'bg-emerald-100 text-emerald-800',
        barBg: 'bg-emerald-100',
        barFill: 'bg-emerald-500',
        shadow: 'shadow-[0_0_0_1px_rgba(16,185,129,0.12)]',
      }
    case 'PREMIUM':
      return {
        ring: 'ring-indigo-200',
        chipBg: 'bg-indigo-100 text-indigo-800',
        barBg: 'bg-indigo-100',
        barFill: 'bg-indigo-500',
        shadow: 'shadow-[0_0_0_1px_rgba(99,102,241,0.12)]',
      }
    case 'STANDARD':
    default:
      return {
        ring: 'ring-sky-200',
        chipBg: 'bg-sky-100 text-sky-800',
        barBg: 'bg-sky-100',
        barFill: 'bg-sky-500',
        shadow: 'shadow-[0_0_0_1px_rgba(56,189,248,0.12)]',
      }
  }
}

function ProgressBar({ used, total, bg, fill }: { used: number; total: number; bg: string; fill: string }) {
  const t = Math.max(1, total || 1)
  const pct = Math.min(100, Math.round((Math.max(0, used) / t) * 100))
  return (
    <div className={clsx('h-2 w-full overflow-hidden rounded-full', bg)} aria-label="Bids progress">
      <div className={clsx('h-full transition-all', fill)} style={{ width: `${pct}%` }} />
    </div>
  )
}

function WatchButton({ id }: { id: string }) {
  const { has, toggle } = useWatchlist()
  const saved = has(id)
  return (
    <button
      onClick={(e) => { e.preventDefault(); toggle(id) }}
      className={
        saved
          ? 'rounded-xl px-3 py-2 text-sm border bg-yellow-100 text-yellow-900'
          : 'rounded-xl px-3 py-2 text-sm border bg-white hover:bg-neutral-50'
      }
      title={saved ? 'Remove from watchlist' : 'Save to watchlist'}
    >
      {saved ? '★ Saved' : '⭐ Save'}
    </button>
  )
}

export default function JobCard({ job }: { job: Job }) {
  const state = job.meta?.state ?? 'OPEN'
  const label = job.meta?.label ?? 'Open'
  const emoji = job.meta?.emoji ?? '🟢'
  const slotsLeft = job.meta?.slotsLeft ?? Math.max(0, (job.allocCap ?? 0) - (job.contactUnlocks ?? 0))
  const expiresInHours = job.meta?.expiresInHours ?? null
  const isFilled = state === 'FILLED_CLOSING' || slotsLeft === 0
  const isHot = state === 'HOT'
  const isNew = state === 'NEW'
  const theme = tierTheme(job.tier as any)
  const bids = job.contactUnlocks ?? 0
  const total = job.allocCap ?? 3
  const [open, setOpen] = React.useState(false)

  // NEW: fetch selectedCount for this job (demo shortlist)
  const [selectedCount, setSelectedCount] = React.useState<number>(0)
  const [slotsTotal, setSlotsTotal] = React.useState<number>(total)
  React.useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const r = await fetch(`/api/job/${job.id}/bids`, { cache: 'no-store' })
        if (!r.ok) return
        const j = await r.json()
        if (!alive) return
        setSelectedCount(j.selectedCount || 0)
        setSlotsTotal(j.slotsTotal || total)
      } catch { /* ignore */ }
    })()
    return () => { alive = false }
  }, [job.id, total])

  async function handleBid() {
    try {
      const res = await fetch('/api/bids', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ jobId: job.id }),
      })
      if (res.status === 409) { toast.error('This job is already filled.'); return }
      if (!res.ok) throw new Error('Failed')
      toast.success('Bid placed 🎉')
      window.location.reload()
    } catch {
      toast.error('Could not place bid')
    }
  }

  return (
    <div
      className={clsx(
        'rounded-2xl border p-4 sm:p-5 transition bg-white',
        isFilled ? 'opacity-60 grayscale' : 'hover:shadow-md',
        isHot && theme.ring,
        theme.shadow,
        isNew ? 'animate-pulse' : ''
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-lg font-semibold leading-tight">
            <a href={`/trade/jobs/${job.id}`} className="hover:underline">{job.title}</a>
          </h3>
          {job.postcode && (
            <a
              className="text-sm text-sky-700 hover:underline"
              target="_blank"
              rel="noreferrer"
              href={`https://www.google.com/maps/search/${encodeURIComponent(job.postcode)}`}
              title="Open in Maps"
            >
              📍 {job.postcode}
            </a>
          )}
        </div>

        <div className="flex flex-col items-end gap-1">
          <span
            className={clsx('inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm', theme.chipBg)}
            title={label}
          >
            <span>{emoji}</span>
            <span className="font-medium">{label}</span>
          </span>

          {/* NEW: show selected x/N if any selections exist */}
          {selectedCount > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
              ✅ Selected {selectedCount}/{slotsTotal}
            </span>
          )}
        </div>
      </div>

      {/* chips row */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className={clsx('rounded-full px-3 py-1 text-xs font-medium', theme.chipBg)}>
          {job.tier === 'QUICKWIN' && '⚡ Quickwin'}
          {job.tier === 'STANDARD' && '📦 Standard'}
          {job.tier === 'PREMIUM' && '💎 Premium'}
          {!job.tier && '📦 Standard'}
        </span>
        {job.meta?.verifiedHomeowner && (
          <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-medium text-teal-800">🛡️ Verified homeowner</span>
        )}
        {job.postcode && (
          <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-700">🧭 Nearby</span>
        )}
        <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-700">🤖 Match {job.meta?.matchConfidence ?? 70}%</span>
      </div>

      {/* AI summary */}
      <div className="mt-3 text-sm text-neutral-700">
        {job.aiSummary ? <p>{job.aiSummary}</p> : job.summary ? <p>🤖 AI summary: {job.summary}</p> : null}
      </div>

      {/* metrics */}
      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
        <span className="rounded-full bg-neutral-100 px-3 py-1">💷 Est. {fmtGBP(job.priceMin)} – {fmtGBP(job.priceMax)}</span>
        {typeof job.views === 'number' && <span className="rounded-full bg-neutral-100 px-3 py-1">👀 {job.views} views</span>}
        {typeof job.contactUnlocks === 'number' && typeof job.allocCap === 'number' && (
          <span className="rounded-full bg-neutral-100 px-3 py-1">🎯 {bids}/{total} bids</span>
        )}
        {typeof job.meta?.heatScore === 'number' && <span className="rounded-full bg-neutral-100 px-3 py-1">🔥 Heat {job.meta.heatScore}</span>}
        {expiresInHours !== null && (
          <span className={clsx('rounded-full px-3 py-1', isFilled ? 'bg-amber-100' : 'bg-neutral-100')}>⏳ {expiresInHours}h left</span>
        )}
      </div>

      {/* progress bar */}
      <div className="mt-3">
        <ProgressBar used={bids} total={total} bg={theme.barBg} fill={theme.barFill} />
        <div className="mt-1 flex justify-between text-xs text-neutral-600">
          <span>{Math.min(100, Math.round((Math.max(0, bids) / Math.max(1, total)) * 100))}% capacity</span>
          <span>{Math.max(0, total - bids)} slots left</span>
        </div>
      </div>

      {isFilled && (
        <div className="mt-4 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700">
          🚫 Job filled — this will be removed in 24 hours.
        </div>
      )}

      {/* CTA row */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-xs text-neutral-500">
          Tip: early contact wins more bids. <a href="/trade/watchlist" className="underline">View watchlist</a>.
        </div>
        <div className="flex gap-2">
          <a
            href={`/trade/jobs/${job.id}`}
            className={clsx(
              'rounded-xl px-3 py-2 text-sm border',
              isFilled ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed' : 'bg-white hover:bg-neutral-50'
            )}
            aria-disabled={isFilled}
            title="View full job details"
          >
            👁️ View details
          </a>
          <button
            className={clsx(
              'rounded-xl px-3 py-2 text-sm text-white',
              isFilled ? 'bg-neutral-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'
            )}
            disabled={isFilled}
            title="Place a bid (spends credits)"
            onClick={handleBid}
          >
            💥 Bid ({job.meta?.bidPrice ?? 2} credits)
          </button>
          <WatchButton id={job.id} />
        </div>
      </div>

      {/* Contact modal kept loaded for future direct-contact flows (currently unused) */}
      {/* <ContactModal open={open} onClose={() => setOpen(false)} job={{ id: job.id, title: job.title, postcode: job.postcode }} /> */}
    </div>
  )
}

function fmtGBP(v?: number | null) {
  if (typeof v !== 'number') return '£—'
  try {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      maximumFractionDigits: 0,
    }).format(v)
  } catch {
    return `£${Math.round(v)}`
  }
}
