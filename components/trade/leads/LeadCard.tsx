'use client'
import React from 'react'

export type Lead = {
  id: string
  title: string
  trade?: string
  town?: string
  postcode?: string
  budget?: string
  createdAt?: string | Date
  slotsTotal?: number
  slotsUsed?: number
  heat?: number
  summary?: string
  desc?: string
  expiresAt?: string | Date
  status?: 'OPEN'|'ACTIVE'|'FILLED'|'EXPIRED'
}

function Badge({children,className=''}:{children:React.ReactNode,className?:string}) {
  return <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs ${className}`} >{children}</span>
}

export default function LeadCard({
  lead,
  onBid,
}: {
  lead: Lead,
  onBid?: (lead: Lead) => void
}) {
  const slotsLeft = Math.max(0, (lead.slotsTotal ?? 0) - (lead.slotsUsed ?? 0))
  const heat = Math.min(100, Math.max(0, lead.heat ?? Math.round(((lead.slotsUsed ?? 0)/(lead.slotsTotal || 1))*100)))

  const statusLabel =
    slotsLeft === 0 ? '🚫 Filled — 24h to close' :
    (lead.slotsUsed ?? 0) >= 3 ? '🔥 Popular' :
    (lead.slotsUsed ?? 0) >= 1 ? '⚡ Bidding in progress' :
    '💥 NEW — be the first'

  const statusColor =
    slotsLeft === 0 ? 'border-red-300 text-red-600' :
    (lead.slotsUsed ?? 0) >= 3 ? 'border-orange-300 text-orange-600' :
    (lead.slotsUsed ?? 0) >= 1 ? 'border-amber-300 text-amber-600' :
    'border-emerald-300 text-emerald-600'

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4 md:p-5 hover:shadow-md transition-shadow">
      <div className="flex flex-wrap items-start gap-2 justify-between">
        <h3 className="text-lg font-semibold text-slate-900">{lead.title}</h3>
        <Badge className={statusColor}>{statusLabel}</Badge>
      </div>

      <div className="mt-1 text-slate-600 text-sm">
        <span className="mr-3">{lead.trade ?? 'General'}</span>
        {lead.town && <span className="mr-3">📍 {lead.town} {lead.postcode ? `(${lead.postcode})` : ''}</span>}
        {lead.budget && <span>💷 {lead.budget}</span>}
      </div>

      {lead.summary && (
        <p className="mt-3 text-slate-700 text-[15px] leading-relaxed">
          <span className="font-medium">🤖 AI summary:</span> {lead.summary}
        </p>
      )}

      <div className="mt-4 flex items-center gap-3">
        <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
          <div
            className={`h-full rounded-full ${slotsLeft === 0 ? 'bg-red-400' : 'bg-cyan-500'}`}
            style={{ width: `${heat}%` }}
          />
        </div>
        <div className="text-xs text-slate-600 whitespace-nowrap">
          Slots: {(lead.slotsUsed ?? 0)}/{lead.slotsTotal ?? 0}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {lead.postcode && <Badge className="border-slate-300 text-slate-600">Map</Badge>}
        {lead.expiresAt && <Badge className="border-slate-300 text-slate-600">⏳ Expires soon</Badge>}
        {lead.heat && <Badge className="border-slate-300 text-slate-600">Heat {lead.heat}%</Badge>}
      </div>

      <div className="mt-5 flex gap-3">
        <button
          onClick={() => onBid?.(lead)}
          disabled={slotsLeft===0}
          className={`px-4 h-10 rounded-xl text-white text-sm font-semibold ${
            slotsLeft===0 ? 'bg-slate-400 cursor-not-allowed' : 'bg-cyan-600 hover:bg-cyan-700'
          }`}
        >
          {slotsLeft===0 ? 'Filled' : '💥 Bid (2 credits)'}
        </button>
        <a
          href={`/trade/jobs/${lead.id}`}
          className="px-4 h-10 rounded-xl border border-slate-300 text-slate-800 text-sm font-semibold hover:bg-slate-50 inline-flex items-center"
        >
          View details
        </a>
      </div>
    </div>
  )
}
