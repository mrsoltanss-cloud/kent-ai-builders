// src/app/admin/leads/page.tsx
"use client"
import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { toast } from "sonner"

type Lead = {
  id: string; service: string; scope?: string | null; sqm?: number | null;
  urgency: string; budget?: number | null; status: string; createdAt: string;
  user: { id: string; email: string; name?: string | null }
}

export default function AdminLeadsPage() {
  const [items, setItems] = useState<Lead[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState("")
  const [page, setPage] = useState(1)
  const take = 20
  const [sel, setSel] = useState<Record<string, boolean>>({})

  const allSelected = useMemo(() => items.length>0 && items.every(i => sel[i.id]), [items, sel])
  const selectedIds = useMemo(() => items.filter(i => sel[i.id]).map(i => i.id), [items, sel])

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const r = await fetch(`/api/admin/leads?q=${encodeURIComponent(q)}&page=${page}&take=${take}`)
      if (!r.ok) throw new Error(await r.text())
      const j = await r.json()
      setItems(j.items); setTotal(j.total)
      setSel({})
    } catch (e:any) { toast.error(e.message || "Load failed") }
    finally { setLoading(false) }
  }, [q, page])

  useEffect(() => { load() }, [load])

  async function delLead(id: string) {
    if (!confirm("Delete this lead?")) return
    await fetch(`/api/admin/leads/${id}`, { method: "DELETE" })
    toast.success("Lead deleted"); load()
  }

  async function bulkDelete() {
    if (selectedIds.length === 0) return
    if (!confirm(`Delete ${selectedIds.length} leads?`)) return
    await fetch(`/api/admin/leads/bulk/delete`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ids: selectedIds })
    })
    toast.success("Bulk deleted"); load()
  }

  function toggleAll(next:boolean) {
    const m: Record<string, boolean> = {}
    items.forEach(i => m[i.id] = next)
    setSel(m)
  }

  const pages = Math.max(1, Math.ceil(total / take))

  return (
    <div className="space-y-4 p-2">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Leads</h1>
        <a className="text-sm underline" href={`/api/admin/leads?format=csv&q=${encodeURIComponent(q)}`} target="_blank">Export CSV</a>
      </div>

      <div className="flex gap-2 items-center">
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search service or scope…" className="h-9 rounded border px-3" />
        <button onClick={() => setPage(1)} className="h-9 rounded border px-3">Search</button>
        <div className="ml-auto">
          <button disabled={selectedIds.length===0} onClick={bulkDelete} className="px-3 py-1 rounded bg-red-600 text-white">Bulk Delete</button>
        </div>
      </div>

      {loading ? <p className="text-slate-600">Loading…</p> : (
        <div className="overflow-x-auto rounded-xl border bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left sticky top-0">
              <tr>
                <th className="p-2"><input type="checkbox" checked={allSelected} onChange={e => toggleAll(e.target.checked)} /></th>
                <th className="p-2">Created</th>
                <th className="p-2">User</th>
                <th className="p-2">Service / Scope</th>
                <th className="p-2">sqm</th>
                <th className="p-2">Urgency</th>
                <th className="p-2">Budget</th>
                <th className="p-2">Status</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(l => (
                <tr key={l.id} className="border-t">
                  <td className="p-2"><input type="checkbox" checked={!!sel[l.id]} onChange={e => setSel(s=>({ ...s, [l.id]: e.target.checked }))} /></td>
                  <td className="p-2">{new Date(l.createdAt).toLocaleString()}</td>
                  <td className="p-2">{l.user.email}</td>
                  <td className="p-2">
                    <Link href={`/admin/leads/${l.id}`} className="text-emerald-700 underline">
                      {l.service}{l.scope ? ` / ${l.scope}` : ""}
                    </Link>
                  </td>
                  <td className="p-2">{l.sqm ?? "—"}</td>
                  <td className="p-2">{l.urgency}</td>
                  <td className="p-2">{l.budget ? `£${l.budget.toLocaleString()}` : "—"}</td>
                  <td className="p-2">{l.status}</td>
                  <td className="p-2">
                    <button className="px-3 py-1 rounded bg-red-600 text-white" onClick={() => delLead(l.id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && <tr><td className="p-4 text-slate-500" colSpan={9}>No leads found.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex items-center gap-2">
        <button disabled={page===1} onClick={()=>setPage(p=>Math.max(1,p-1))} className="px-3 py-1 rounded border">Prev</button>
        <span>Page {page} / {pages}</span>
        <button disabled={page===pages} onClick={()=>setPage(p=>Math.min(pages,p+1))} className="px-3 py-1 rounded border">Next</button>
      </div>
    </div>
  )
}
