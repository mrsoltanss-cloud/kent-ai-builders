'use client'
export default function EmptyState({hint='AI is scanning Kent for new leads…'}:{hint?:string}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-600">
      <div className="text-3xl mb-2">🔎</div>
      <div className="text-slate-900 font-semibold mb-1">No leads match your filters</div>
      <p className="text-sm">{hint}</p>
    </div>
  )
}
