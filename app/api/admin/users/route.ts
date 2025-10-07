// src/app/api/admin/users/route.ts
import { NextRequest } from "next/server"
import type { Prisma } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/authz"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  const g = await requireAdmin()
  if (!g.ok) return new Response("Forbidden", { status: g.status })

  const { searchParams } = new URL(req.url)
  const q = searchParams.get("q") ?? ""
  const take = Math.min(parseInt(searchParams.get("take") ?? "25", 10), 100)
  const page = Math.max(parseInt(searchParams.get("page") ?? "1", 10), 1)
  const csv = searchParams.get("format") === "csv"
  const skip = (page - 1) * take

  const where: Prisma.UserWhereInput = q
    ? {
        OR: [
          { email: { contains: q, mode: "insensitive" } },
          { name:  { contains: q, mode: "insensitive" } },
        ],
      }
    : {}

  const [items, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take,
      select: {
        id: true, email: true, name: true, role: true,
        isBlocked: true, blockedAt: true, blockedReason: true,
        createdAt: true, updatedAt: true,
        _count: { select: { leads: true } },
      },
    }),
    prisma.user.count({ where }),
  ])

  if (csv) {
    const rows = [
      ["id","email","name","role","isBlocked","createdAt","updatedAt","leads"],
      ...items.map(u => [
        u.id, u.email, u.name ?? "", u.role, String(u.isBlocked),
        u.createdAt.toISOString(), u.updatedAt.toISOString(), String(u._count.leads),
      ]),
    ]
    const body = rows.map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(",")).join("\n")
    return new Response(body, {
      headers: {
        "content-type": "text/csv",
        "content-disposition": "attachment; filename=users.csv",
      },
    })
  }

  return Response.json({ ok: true, items, total, page, take })
}
