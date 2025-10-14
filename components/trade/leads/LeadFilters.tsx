'use client'
import React from 'react'

export type Filters = {
  q?: string
  trade?: string
  status?: 'OPEN'|'ACTIVE'|'FILLED'|'EXPIRED'|'ALL'
  sort?: 'new'|'hot'|'price'
}

export default function LeadFilters({
  value,
  onChange
}:{
  value: Filters,
  onChange: (f: Filters)=>void
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 md:p-5 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <input
          placeholder="Search jobs…"
          className="h-10 rounded-xl border border-slate-300 px-3"
          value={value.q ?? ''}
          onChange={(e)=>onChange({ ...value, q: e.target.value })}
        />
        <select
          className="h-10 rounded-xl border border-slate-300 px-3"
          value={value.trade ?? ''}
          onChange={(e)=>onChange({ ...value, trade: e.target.value })}
        >
          <option value="">All trades</option>
          <option>Carpentry & joinery</option>
          <option>Roofing & gutters</option>
          <option>Brickwork & extensions</option>
          <option>Bathroom refit</option>
          <option>Kitchen refit</option>
          <option>Painting & decorating</option>
          <option>Plumbing & heating</option>
          <option>Electrical</option>
          <option>Landscaping & patios</option>
          <option>Fencing & decking</option>
          <option>Tiling / Flooring</option>
          <option>Plastering / Rendering</option>
          <option>Windows & doors</option>
          <option>Driveways / Paving</option>
          <option>Loft conversion</option>
          <option>Garden office</option>
          <option>Handyman</option>
        </select>
        <select
          className="h-10 rounded-xl border border-slate-300 px-3"
          value={value.status ?? 'OPEN'}
          onChange={(e)=>onChange({ ...value, status: e.target.value as any })}
        >
          <option value="OPEN">Open</option>
          <option value="ACTIVE">Active</option>
          <option value="FILLED">Filled</option>
          <option value="EXPIRED">Expired</option>
          <option value="ALL">All</option>
        </select>
        <select
          className="h-10 rounded-xl border border-slate-300 px-3"
          value={value.sort ?? 'new'}
          onChange={(e)=>onChange({ ...value, sort: e.target.value as any })}
        >
          <option value="new">Newest</option>
          <option value="hot">Hottest</option>
          <option value="price">Budget</option>
        </select>
      </div>
      <div className="mt-3 flex flex-wrap gap-2 text-sm">
        <button className="px-3 h-8 rounded-full bg-emerald-100 text-emerald-700" onClick={()=>onChange({...value, sort:'hot'})}>🔥 Hot leads</button>
        <button className="px-3 h-8 rounded-full bg-cyan-100 text-cyan-700" onClick={()=>onChange({...value, status:'OPEN'})}>💥 New</button>
        <button className="px-3 h-8 rounded-full bg-amber-100 text-amber-700" onClick={()=>onChange({...value, sort:'price'})}>💎 Premium</button>
      </div>
    </div>
  )
}
