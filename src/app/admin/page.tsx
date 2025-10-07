// src/app/admin/page.tsx
import KpiCards from "@/components/KpiCards"
import { TrendChart, StatusChart } from "@/components/AdminCharts"
import { requireAdmin } from "@/lib/authz"

export const dynamic = "force-dynamic"

export default async function AdminHome() {
  const g = await requireAdmin()
  if (!g.ok) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold">Forbidden</h1>
        <p className="text-slate-600">You need admin access.</p>
      </div>
    )
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/admin/kpis`, { cache: "no-store" }).catch(()=>null)
  const data = res?.ok ? await res!.json() : null

  const users = data?.totals?.users ?? 0
  const leads = data?.totals?.leads ?? 0
  const trend = data?.trend ?? []
  const status = data?.status ?? {}

  return (
    <div className="space-y-6 p-2">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      <KpiCards users={users} leads={leads} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrendChart data={trend} />
        <StatusChart data={status} />
      </div>
    </div>
  )
}
