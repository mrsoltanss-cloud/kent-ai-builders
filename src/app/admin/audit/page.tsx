// src/app/admin/audit/page.tsx
"use client"

import { useCallback, useEffect, useMemo, useState } from "react"

type Audit = {
  id: string
  ts: string
  action: string
  actor?: { id: string; email: string; name?: string | null } | null
  targetId?: string | null
  leadId?: string | null
  meta?: any
}

export default function AdminAuditPage() {
  const [items, setItems] = useState<Audit[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  // filters
  const [q, setQ] = useState("")
  const [actorId, setActorId] = useState("")
  const [targetId, setTargetId] = useState("")
  const [action, setAction] = useState("")
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")

  // paging
  const [page, setPage] = useState(1)
  const take = 25
  const pages = useMemo(() => Math.max(1, Math.ceil(total / take)), [total])

  const load = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({
      page: String(page),
      take: String(take),
    })
    if (q) params.set("q", q)
    if (actorId) params.set("actorId", actorId)
    if (targetId) params.set("targetId", targetId)
    if (action) params.set("action", action)
    if (from) params.set("from", from)
    if (to) params.set("to", to)

    const r = await fetch(`/api/admin/audit?` + params.toString())
    if (!r.ok) {
      setItems([]); setTotal(0); setLoading(false)
      return
    }
    const j = await r.json()
    setItems(j.items); setTotal(j.total); setLoading(false)
  }, [q, actorId, targetId, action, from, to, page])

  useEffect(() => { load() }, [load])

  function resetFilters() {
    setQ(""); setActorId(""); setTargetId(""); setAction(""); setFrom(""); setTo(""); setPage(1)
  }

  const csvHref = useMemo(() => {
    const p = new URLSearchParams({
      format: "csv",
      page: "1",
      take: String(Math.min(5000, total || 1000)) // big export
    })
    if (q) p.set("q", q)
    if (actorId) p.set("actorId", actorId)
    if (targetId) p.set("targetId", targetId)
    if (action) p.set("action", action)
    if (from) p.set("from", from)
    if (to) p.set("to", to)
    return `/api/admin/audit?` + p.toString()
  }, [q, actorId, targetId, action, from, to, total])

  return (
    <div className="space-y-4 p-2">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Audit</h1>
        <a href={csvHref} target="_blank" className="rounded border px-3 py-1 text-sm">Export CSV</a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-2">
        <input className="h-9 rounded border px-3" placeholder="Search action/meta…" value={q} onChange={e=>setQ(e.target.value)} />
        <input className="h-9 rounded border px-3" placeholder="Actor ID (optional)" value={actorId} onChange={e=>setActorId(e.target.value)} />
        <input className="h-9 rounded border px-3" placeholder="Target ID (optional)" value={targetId} onChange={e=>setTargetId(e.target.value)} />
        <input className="h-9 rounded border px-3" placeholder="Action (e.g. lead.updated)" value={action} onChange={e=>setAction(e.target.value)} />
        <input className="h-9 rounded border px-3" type="datetime-local" value={from} onChange={e=>setFrom(e.target.value)} />
        <input className="h-9 rounded border px-3" type="datetime-local" value={to} onChange={e=>setTo(e.target.value)} />
      </div>

      <div className="flex gap-2">
        <button className="rounded border px-3 py-1" onClick={()=>{ setPage(1); load() }}>Apply</button>
        <button className="rounded border px-3 py-1" onClick={resetFilters}>Reset</button>
        <div className="ml-auto flex items-center gap-2">
          <button disabled={page===1} className="rounded border px-3 py-1" onClick={()=>setPage(p=>Math.max(1,p-1))}>Prev</button>
          <span className="text-sm">Page {page} / {pages}</span>
          <button disabled={page===pages} className="rounded border px-3 py-1" onClick={()=>setPage(p=>Math.min(pages,p+1))}>Next</button>
        </div>
      </div>

      {loading ? <p className="text-slate-600">Loading…</p> : (
        <div className="overflow-x-auto rounded-xl border bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left">
              <tr>
                <th className="p-2">Time</th>
                <th className="p-2">Action</th>
                <th className="p-2">Actor</th>
                <th className="p-2">Target</th>
                <th className="p-2">Lead</th>
                <th className="p-2">Meta</th>
              </tr>
            </thead>
            <tbody>
              {items.map(a => (
                <tr key={a.id} className="border-t align-top">
                  <td className="p-2 whitespace-nowrap">{new Date(a.ts).toLocaleString()}</td>
                  <td className="p-2 font-medium">{a.action}</td>
                  <td className="p-2">{a.actor?.email ?? a.actor?.id?.slice(0,8) ?? "—"}</td>
                  <td className="p-2">{a.targetId ? a.targetId.slice(0,8) : "—"}</td>
                  <td className="p-2">{a.leadId ? a.leadId.slice(0,8) : "—"}</td>
                  <td className="p-2"><pre className="whitespace-pre-wrap text-xs text-slate-700">{a.meta ? JSON.stringify(a.meta, null, 2) : "—"}</pre></td>
                </tr>
              ))}
              {items.length === 0 && <tr><td className="p-4 text-slate-500" colSpan={6}>No audit entries.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
