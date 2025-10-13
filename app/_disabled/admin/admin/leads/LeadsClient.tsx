"use client"

import { useMemo, useState } from "react"
import { toast } from "sonner"
import Empty from "@/components/Empty"

type LeadRow = {
  id: string
  createdAt: string
  service: string
  scope: string | null
  sqm: number | null
  urgency: string
  budget: number | null
  status: string
  user: { id: string; email: string; name: string | null }
}

export default function LeadsClient({
  initialItems,
  total,
  page,
  take,
  q,
}: {
  initialItems: LeadRow[]
  total: number
  page: number
  take: number
  q: string
}) {
  const [items, setItems] = useState<LeadRow[]>(initialItems)
  const [selected, setSelected] = useState<Record<string, boolean>>({})

  const allSelected = useMemo(
    () => items.length > 0 && items.every((i) => selected[i.id]),
    [items, selected]
  )

  function toggleAll() {
    if (allSelected) {
      setSelected({})
    } else {
      const next: Record<string, boolean> = {}
      for (const i of items) next[i.id] = true
      setSelected(next)
    }
  }

  function toggleOne(id: string) {
    setSelected((s) => ({ ...s, [id]: !s[id] }))
  }

  async function deleteOne(id: string) {
    if (!confirm("Delete this lead?")) return
    const res = await fetch(`/api/admin/leads/${id}`, { method: "DELETE" })
    if (!res.ok) {
      toast.error("Failed to delete lead")
      return
    }
    setItems((it) => it.filter((x) => x.id !== id))
    toast.success("Lead deleted")
  }

  async function bulkDelete() {
    const ids = Object.keys(selected).filter((k) => selected[k])
    if (ids.length === 0) return toast.message("Select at least one row")
    if (!confirm(`Delete ${ids.length} selected lead(s)?`)) return
    const res = await fetch(`/api/admin/leads/bulk/delete`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ids }),
    })
    if (!res.ok) {
      toast.error("Bulk delete failed")
      return
    }
    setItems((it) => it.filter((x) => !ids.includes(x.id)))
    setSelected({})
    toast.success("Deleted")
  }

  const start = (page - 1) * take + 1
  const end = Math.min(page * take, total)

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {total ? `Showing ${start}-${end} of ${total}` : "No results"}
        </div>
        <div className="flex gap-2">
          <button
            onClick={bulkDelete}
            className="px-3 py-2 rounded border disabled:opacity-50"
            disabled={Object.values(selected).every((v) => !v)}
          >
            Delete selected
          </button>
        </div>
      </div>

      <div className="overflow-auto rounded border">
        <table className="min-w-[900px] w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="[&>th]:px-3 [&>th]:py-2 text-left">
              <th className="w-10">
                <input type="checkbox" checked={allSelected} onChange={toggleAll} />
              </th>
              <th>Created</th>
              <th>User</th>
              <th>Service</th>
              <th>Scope</th>
              <th>Sqm</th>
              <th>Urgency</th>
              <th>Budget</th>
              <th>Status</th>
              <th className="w-24"></th>
            </tr>
          </thead>
          <tbody className="[&>tr>*]:px-3 [&>tr>*]:py-2">
            {items.map((l) => (
              <tr key={l.id} className="border-t">
                <td>
                  <input
                    type="checkbox"
                    checked={!!selected[l.id]}
                    onChange={() => toggleOne(l.id)}
                  />
                </td>
                <td>{new Date(l.createdAt).toLocaleString()}</td>
                <td title={l.user.name ?? ""}>{l.user.email}</td>
                <td>{l.service}</td>
                <td className="max-w-[280px] truncate" title={l.scope ?? ""}>
                  {l.scope ?? "—"}
                </td>
                <td>{l.sqm ?? "—"}</td>
                <td>{l.urgency}</td>
                <td>{l.budget ?? "—"}</td>
                <td>{l.status}</td>
                <td className="text-right">
                  <button
                    onClick={() => deleteOne(l.id)}
                    className="px-2 py-1 rounded border hover:bg-gray-50"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {!items.length && (
              <tr>
                <td colSpan={10} className="p-0">
                  <Empty title="No leads found" hint="Try another search or create a lead." />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
