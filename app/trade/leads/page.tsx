'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import LeadCard, { Lead } from '@/components/trade/leads/LeadCard'
import LeadFilters, { Filters } from '@/components/trade/leads/LeadFilters'
import EmptyState from '@/components/trade/leads/EmptyState'

function Skeleton() {
  return (
    <div className="glass-card rounded-2xl p-5 border border-white/10 animate-pulse">
      <div className="h-5 w-60 bg-white/10 rounded mb-3" />
      <div className="h-4 w-full bg-white/10 rounded" />
      <div className="mt-3 flex gap-2">
        <div className="h-6 w-16 bg-white/10 rounded-full" />
        <div className="h-6 w-20 bg-white/10 rounded-full" />
        <div className="h-6 w-14 bg-white/10 rounded-full" />
      </div>
    </div>
  )
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]|null>(null)
  const [filters, setFilters] = useState<Filters>({ q:'', urgency:'ALL', town:'', quick:'ALL' })
  const [ticker, setTicker] = useState<string>('3 new jobs added in the last hour in Kent.')
  const timer = useRef<NodeJS.Timeout|null>(null)

  async function load() {
    const res = await fetch('/api/trade/leads', { cache:'no-store' })
    const j = await res.json()
    setLeads(j.items ?? [])
    if(j.ticker) setTicker(j.ticker)
  }

  useEffect(()=>{ load(); timer.current && clearInterval(timer.current); timer.current = setInterval(load, 25_000); return ()=>{ if(timer.current) clearInterval(timer.current) }}, [])

  const filtered = useMemo(()=>{
    if(!leads) return null
    return leads.filter(l=>{
      const qok = !filters.q || (l.title+' '+(l.aiSummary||'')+' '+(l.tags||[]).join(' ')).toLowerCase().includes(filters.q.toLowerCase())
      const uok = filters.urgency==='ALL' || l.urgency===filters.urgency
      const tok = !filters.town || l.town===filters.town
      const qf  = filters.quick==='ALL'
        || (filters.quick==='HOT' && l.status==='HOT')
        || (filters.quick==='PREMIUM' && l.tier==='PREMIUM')
        || (filters.quick==='EXPIRING' && l.status==='EXPIRING')
      return qok && uok && tok && qf
    })
  }, [leads, filters])

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-slate-950 to-slate-900 px-5 py-10">
      <div className="mx-auto w-[min(1100px,100%)]">
        <h1 className="text-2xl font-semibold text-white tracking-tight">Leads</h1>
        <p className="text-slate-300 mt-1">Curated by <span className="font-semibold text-cyan-200">Kent AI Estimator</span> — smart matches for quality builders.</p>

        <div className="mt-6">
          <LeadFilters value={filters} onChange={setFilters} ticker={ticker}/>
        </div>

        <div className="mt-6 grid gap-4">
          {leads===null && Array.from({length:5}).map((_,i)=><Skeleton key={i}/>)}
          {leads!==null && filtered && filtered.length===0 && <EmptyState onRefresh={load} />}
          {leads!==null && filtered && filtered.length>0 &&
            filtered.map(l => <LeadCard key={l.id} lead={l} onOpen={(id)=>location.href=`/trade/leads/${id}`}/>)
          }
        </div>
      </div>
    </div>
  )
}
