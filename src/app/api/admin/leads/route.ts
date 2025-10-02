// src/app/api/admin/leads/route.ts
import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/authz"
import type { Prisma } from "@prisma/client"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  const g = await requireAdmin()
  if (!g.ok) return new Response("Forbidden", { status: g.status })

  const { searchParams } = new URL(req.url)
  const q = searchParams.get("q") ?? ""
  const take = Math.min(parseInt(searchParams.get("take") ?? "20", 10), 100)
  const page = Math.max(parseInt(searchParams.get("page") ?? "1", 10), 1)
  const csv = searchParams.get("format") === "csv"
  const skip = (page - 1) * take

  const where: Prisma.LeadWhereInput = q
    ? {
        OR: [
          { service: { contains: q, mode: "insensitive" as const } },
          { scope:   { contains: q, mode: "insensitive" as const } },
        ],
      }
    : {}

  const [items, total] = await Promise.all([
    prisma.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip, take,
      include: { user: { select: { id: true, email: true, name: true } } },
    }),
    prisma.lead.count({ where })
  ])

  if (csv) {
    const rows = [
      ["id","createdAt","userEmail","service","scope","sqm","urgency","budget","status"],
      ...items.map(l => [
        l.id, l.createdAt.toISOString(), l.user.email, l.service, l.scope ?? "",
        l.sqm ?? "", l.urgency, l.budget ?? "", l.status
      ])
    ]
    const body = rows.map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(",")).join("\n")
    return new Response(body, {
      headers: { "content-type":"text/csv","content-disposition":"attachment; filename=leads.csv" }
    })
  }

  return Response.json({ ok: true, items, total, page, take })
}
