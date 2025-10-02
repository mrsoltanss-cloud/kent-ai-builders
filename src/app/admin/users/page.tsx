// src/app/admin/users/page.tsx
"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { toast } from "sonner"

type User = {
  id: string
  email: string
  name?: string | null
  role: "USER" | "ADMIN"
  isBlocked: boolean
  blockedAt?: string | null
  blockedReason?: string | null
  createdAt: string
  updatedAt: string
  _count: { leads: number }
}

export default function AdminUsersPage() {
  // table data
  const [items, setItems] = useState<User[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  // filters / paging
  const [q, setQ] = useState("")
  const [page, setPage] = useState(1)
  const take = 25
  const pages = useMemo(() => Math.max(1, Math.ceil(total / take)), [total])

  // selection for bulk
  const [selected, setSelected] = useState<Record<string, boolean>>({})

  const load = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), take: String(take) })
    if (q) params.set("q", q)

    const r = await fetch(`/api/admin/users?` + params.toString())
    if (!r.ok) { setItems([]); setTotal(0); setLoading(false); return }
    const j = await r.json()
    setItems(j.items); setTotal(j.total); setLoading(false)
    setSelected({})
  }, [q, page])

  useEffect(() => { load() }, [load])

  const allIds = useMemo(() => items.map(u => u.id), [items])
  const selectedIds = useMemo(() => allIds.filter(id => selected[id]), [allIds, selected])
  const anyChecked = selectedIds.length > 0
  const allChecked = items.length > 0 && selectedIds.length === items.length

  function toggleAll(next: boolean) {
    const n: Record<string, boolean> = {}
    if (next) for (const id of allIds) n[id] = true
    setSelected(n)
  }

  async function toggleBlock(id: string, next: boolean) {
    await fetch(`/api/admin/users/${id}/block`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ block: next, reason: next ? "Admin action" : null }),
    })
    toast.success(next ? "Blocked" : "Unblocked")
    load()
  }
  async function delUser(id: string) {
    if (!confirm("Delete this user and all their leads?")) return
    await fetch(`/api/admin/users/${id}`, { method: "DELETE" })
    toast.success("User deleted")
    load()
  }

  // bulk
  async function bulk(action: "block" | "unblock" | "delete") {
    if (!anyChecked) return
    if (action === "delete" && !confirm(`Delete ${selectedIds.length} users and their leads?`)) return
    // naive sequential; fine for admin small batches
    for (const id of selectedIds) {
      if (action === "delete") {
        await fetch(`/api/admin/users/${id}`, { method: "DELETE" })
      } else {
        await fetch(`/api/admin/users/${id}/block`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ block: action === "block", reason: "Admin bulk action" }),
        })
      }
    }
    toast.success(`Bulk ${action} complete`)
    load()
  }

  const csvHref = useMemo(() => {
    const p = new URLSearchParams({ format: "csv", page: "1", take: String(Math.min(5000, total || 1000)) })
    if (q) p.set("q", q)
    return `/api/admin/users?` + p.toString()
  }, [q, total])

  return (
    <div className="space-y-4 p-2">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Users</h1>
        <a href={csvHref} target="_blank" className="rounded border px-3 py-1 text-sm">Export CSV</a>
      </div>

      <div className="flex gap-2">
        <input
          className="h-9 rounded border px-3 w-full md:w-80"
          placeholder="Search email or name…"
          value={q}
          onChange={(e)=>{ setQ(e.target.value); setPage(1) }}
        />
        <button className="rounded border px-3 py-1" onClick={()=>{ setPage(1); load() }}>Search</button>
        <div className="ml-auto flex gap-2">
          <button className="rounded border px-3 py-1" onClick={()=>bulk("block")} disabled={!anyChecked}>Block</button>
          <button className="rounded border px-3 py-1" onClick={()=>bulk("unblock")} disabled={!anyChecked}>Unblock</button>
          <button className="rounded border px-3 py-1 bg-red-600 text-white disabled:opacity-50" onClick={()=>bulk("delete")} disabled={!anyChecked}>Delete</button>
        </div>
      </div>

      {loading ? <p className="text-slate-600">Loading…</p> : (
        <div className="overflow-x-auto rounded-xl border bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left">
              <tr>
                <th className="p-2">
                  <input
                    type="checkbox"
                    checked={allChecked}
                    ref={el => { if (el) el.indeterminate = !allChecked && anyChecked }}
                    onChange={e => toggleAll(e.currentTarget.checked)}
                  />
                </th>
                <th className="p-2">Email</th>
                <th className="p-2">Name</th>
                <th className="p-2">Role</th>
                <th className="p-2">Leads</th>
                <th className="p-2">Blocked</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(u => (
                <tr key={u.id} className="border-t">
                  <td className="p-2">
                    <input
                      type="checkbox"
                      checked={!!selected[u.id]}
                      onChange={e => setSelected(s => ({ ...s, [u.id]: e.currentTarget.checked }))}
                    />
                  </td>
                  <td className="p-2">
                    <Link href={`/admin/users/${u.id}`} className="underline text-emerald-700">{u.email}</Link>
                  </td>
                  <td className="p-2">{u.name ?? "—"}</td>
                  <td className="p-2">{u.role}</td>
                  <td className="p-2">{u._count.leads}</td>
                  <td className="p-2">{u.isBlocked ? "Yes" : "No"}</td>
                  <td className="p-2 flex gap-2">
                    <button
                      className={`px-3 py-1 rounded ${u.isBlocked ? "bg-emerald-600 text-white" : "bg-amber-600 text-white"}`}
                      onClick={() => toggleBlock(u.id, !u.isBlocked)}
                    >
                      {u.isBlocked ? "Unblock" : "Block"}
                    </button>
                    <button
                      className="px-3 py-1 rounded bg-red-600 text-white"
                      onClick={() => delUser(u.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td className="p-4 text-slate-500" colSpan={7}>No users found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex items-center justify-end gap-2">
        <button disabled={page===1} className="rounded border px-3 py-1 disabled:opacity-50" onClick={()=>setPage(p=>Math.max(1,p-1))}>Prev</button>
        <span className="text-sm">Page {page} / {pages}</span>
        <button disabled={page===pages} className="rounded border px-3 py-1 disabled:opacity-50" onClick={()=>setPage(p=>Math.min(pages,p+1))}>Next</button>
      </div>
    </div>
  )
}
