// components/trade/BidTimeline.tsx
'use client'

import * as React from 'react'

type Props = {
  createdAt?: string | Date | null
  bids?: number | null
  allocCap?: number | null
  views?: number | null
  heat?: number | null
  expiresInHours?: number | null
  state?: 'NEW' | 'BIDDING' | 'HOT' | 'FILLED_CLOSING' | 'EXPIRING' | 'OPEN'
}

function clsx(...xs: (string | false | null | undefined)[]) {
  return xs.filter(Boolean).join(' ')
}

export default function BidTimeline({
  createdAt,
  bids = 0,
  allocCap = 3,
  views = 0,
  heat = 0,
  expiresInHours = null,
  state = 'OPEN',
}: Props) {
  const now = Date.now()
  const started = createdAt ? new Date(createdAt).getTime() : now - 1000 * 60 * 60 * 3 // fallback 3h ago
  const ageHrs = Math.max(0, Math.round((now - started) / 36e5))
  const cap = Math.max(1, Number(allocCap ?? 3))

  // Build coarse phases
  const phases = [
    { key: 'posted', label: 'Posted', icon: '📣', done: true },
    { key: 'firstBid', label: 'First bid', icon: '💌', done: (bids ?? 0) >= 1 },
    { key: 'inPlay', label: 'Bidding', icon: '⚡', done: (bids ?? 0) >= 2 || state === 'HOT' },
    { key: 'lastSlots', label: 'Last slots', icon: '⏳', done: (cap - (bids ?? 0)) <= 1 || state === 'EXPIRING' },
    { key: 'filled', label: 'Filled', icon: '🚫', done: (cap - (bids ?? 0)) <= 0 || state === 'FILLED_CLOSING' },
  ]

  const pctBids = Math.min(100, Math.round(((bids ?? 0) / cap) * 100))
  const heatDesc =
    heat && heat >= 25 ? 'High interest' : heat && heat >= 10 ? 'Moderate interest' : 'Calm'

  return (
    <div className="rounded-2xl border bg-white p-4">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-sm font-medium">Bidding timeline</div>
        <div className="text-xs text-neutral-500">
          {ageHrs}h old • {views ?? 0} views • {bids ?? 0}/{cap} bids
        </div>
      </div>

      <div className="flex items-center gap-2">
        {phases.map((p, i) => {
          const active = i === phases.findIndex((x) => !x.done)
          const isLast = i === phases.length - 1
        return (
          <div key={p.key} className="flex items-center gap-2">
            <div
              className={clsx(
                'flex h-8 w-8 items-center justify-center rounded-full border text-sm',
                p.done ? 'bg-emerald-100 border-emerald-200' : active ? 'bg-amber-100 border-amber-200' : 'bg-neutral-100 border-neutral-200'
              )}
              title={p.label}
            >
              {p.icon}
            </div>
            {!isLast && <div className="h-0.5 w-10 sm:w-16 bg-neutral-200" />}
          </div>
        )})}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-xl border bg-neutral-50 px-3 py-2">🎯 Capacity used: <span className="font-medium">{pctBids}%</span></div>
        <div className="rounded-xl border bg-neutral-50 px-3 py-2">🔥 Heat: <span className="font-medium">{heat ?? 0}</span> <span className="text-neutral-500">({heatDesc})</span></div>
        {expiresInHours !== null && (
          <div className="rounded-xl border bg-neutral-50 px-3 py-2 col-span-2">
            ⏰ Time remaining: <span className="font-medium">{expiresInHours}h</span>
          </div>
        )}
      </div>
    </div>
  )
}
