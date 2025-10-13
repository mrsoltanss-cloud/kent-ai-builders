// src/app/admin/leads/[id]/page.tsx
"use client"
import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

type Lead = {
  id: string; createdAt: string; updatedAt: string;
  service: string; scope?: string | null; sqm?: number | null;
  urgency: string; budget?: number | null; status: string; notes?: string | null;
  user: { id: string; email: string; name?: string | null }
}

export default function LeadDetail({ params }: any) {
  const id: string = params?.id
  const [lead, setLead] = useState<Lead | null>(null)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState<string>("")
  const [note, setNote] = useState("")
  const router = useRouter()

  const load = useCallback(async () => {
    setLoading(true)
    const r = await fetch(`/api/admin/leads/${id}`)
    if (!r.ok) { toast.error("Not found"); router.push("/admin/leads"); return }
    const j = await r.json()
    setLead(j.lead); setStatus(j.lead.status)
    setLoading(false)
  }, [id, router])

  useEffect(() => { if (id) load() }, [id, load])

  async function save() {
    const r = await fetch(`/api/admin/leads/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status, noteAppend: note || undefined })
    })
    if (!r.ok) { toast.error("Save failed"); return }
    toast.success("Saved")
    setNote("")
    load()
  }

  if (loading || !lead) return <div className="p-4 text-slate-600">Loading…</div>

  return (
    <div className="max-w-3xl space-y-6 p-2">
      <div>
        <button onClick={() => router.push("/admin/leads")} className="text-sm underline">← Back to Leads</button>
      </div>

      <h1 className="text-2xl font-semibold">Lead #{lead.id.slice(0,8)}</h1>
      <p className="text-slate-600">Created {new Date(lead.createdAt).toLocaleString()} • User {lead.user.email}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border bg-white p-4 space-y-2">
          <div><span className="text-slate-500">Service:</span> {lead.service}</div>
          <div><span className="text-slate-500">Scope:</span> {lead.scope ?? "—"}</div>
          <div><span className="text-slate-500">sqm:</span> {lead.sqm ?? "—"}</div>
          <div><span className="text-slate-500">Urgency:</span> {lead.urgency}</div>
          <div><span className="text-slate-500">Budget:</span> {lead.budget ? `£${lead.budget.toLocaleString()}` : "—"}</div>
        </div>

        <div className="rounded-xl border bg-white p-4 space-y-3">
          <label className="block text-sm text-slate-600">Status</label>
          <select value={status} onChange={(e)=>setStatus(e.target.value)} className="h-9 rounded border px-3">
            <option value="PENDING">PENDING</option>
            <option value="CONTACTED">CONTACTED</option>
            <option value="WON">WON</option>
            <option value="LOST">LOST</option>
          </select>

          <label className="block text-sm text-slate-600 mt-3">Add note (appends with timestamp)</label>
          <textarea value={note} onChange={(e)=>setNote(e.target.value)} rows={4} className="w-full rounded border px-3 py-2" placeholder="Called homeowner…"></textarea>

          <div className="pt-2">
            <button onClick={save} className="rounded bg-emerald-600 text-white px-4 py-2">Save</button>
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-4">
        <h2 className="font-semibold mb-2">Notes</h2>
        <pre className="whitespace-pre-wrap text-sm text-slate-800">{lead.notes ?? "—"}</pre>
      </div>
    </div>
  )
}
