// src/app/api/admin/kpis/route.ts
import { requireAdmin } from "@/lib/authz"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

type Point = { week: string; users: number; leads: number }

function startOfISOWeek(d: Date) {
  const n = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))
  const day = n.getUTCDay() || 7 // 1..7
  if (day > 1) n.setUTCDate(n.getUTCDate() - (day - 1))
  n.setUTCHours(0,0,0,0)
  return n
}

function weekKey(d: Date) {
  const s = startOfISOWeek(d)
  return s.toISOString().slice(0,10) // YYYY-MM-DD
}

export async function GET() {
  const g = await requireAdmin()
  if (!g.ok) return new Response("Forbidden", { status: g.status })

  const now = new Date()
  const eightWeeksAgo = new Date(now.getTime() - 8 * 7 * 24 * 3600 * 1000)

  // Fetch raw rows (we aggregate here to stay provider-agnostic)
  const [usersRaw, leadsRaw, totals, statusCounts] = await Promise.all([
    prisma.user.findMany({ where: { createdAt: { gte: eightWeeksAgo } }, select: { createdAt: true } }),
    prisma.lead.findMany({ where: { createdAt: { gte: eightWeeksAgo } }, select: { createdAt: true, status: true } }),
    Promise.all([
      prisma.user.count(),
      prisma.lead.count()
    ]),
    prisma.lead.findMany({
      where: {},
      select: { status: true },
    }),
  ])

  const [totalUsers, totalLeads] = totals

  // weekly trend
  const map = new Map<string, Point>()
  for (let i = 0; i < 8; i++) {
    const d = new Date(now.getTime() - (7 * i) * 24 * 3600 * 1000)
    const key = weekKey(d)
    map.set(key, { week: key, users: 0, leads: 0 })
  }
  usersRaw.forEach(u => {
    const key = weekKey(u.createdAt)
    if (map.has(key)) map.get(key)!.users++
  })
  leadsRaw.forEach(l => {
    const key = weekKey(l.createdAt)
    if (map.has(key)) map.get(key)!.leads++
  })
  const trend = Array.from(map.values()).sort((a,b)=>a.week.localeCompare(b.week))

  // status breakdown
  const statuses = ["PENDING","CONTACTED","WON","LOST"] as const
  const statusMap: Record<string, number> = Object.fromEntries(statuses.map(s => [s, 0]))
  statusCounts.forEach(l => { statusMap[l.status] = (statusMap[l.status] ?? 0) + 1 })

  return Response.json({
    ok: true,
    totals: { users: totalUsers, leads: totalLeads },
    status: statusMap,
    trend,
    generatedAt: new Date().toISOString(),
  }, { headers: { "cache-control": "no-store" }})
}
