'use client'
import React from 'react'

export function TrendChart({ data }: { data?: Array<{ x: string|number; y: number }> }) {
  // Simple SVG sparkline placeholder; ignore data for now but accept the prop
  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <div className="mb-2 text-sm text-slate-500">Leads over time</div>
      <svg viewBox="0 0 100 30" className="w-full h-24">
        <polyline points="0,20 15,18 30,22 45,16 60,12 75,15 90,8 100,10"
          fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    </div>
  )
}

export function StatusChart({ data }: { data?: Array<{ label: string; v: number }> }) {
  // Simple horizontal bars placeholder; use provided data if present
  const rows = data && data.length ? data : [
    { label: 'Pending', v: 14 },
    { label: 'Quoted', v: 9 },
    { label: 'Closed', v: 5 },
  ]
  const max = Math.max(...rows.map(r => r.v)) || 1
  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <div className="mb-2 text-sm text-slate-500">Lead status</div>
      <div className="space-y-2">
        {rows.map(r => (
          <div key={r.label} className="flex items-center gap-2">
            <div className="w-24 text-xs text-slate-500">{r.label}</div>
            <div className="flex-1 h-2 rounded bg-slate-200">
              <div className="h-2 rounded bg-slate-900" style={{ width: `${(r.v / max) * 100}%` }} />
            </div>
            <div className="w-8 text-xs text-slate-500 text-right">{r.v}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
