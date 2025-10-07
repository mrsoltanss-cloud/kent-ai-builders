// src/app/api/admin/audit/route.ts
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
  const q = searchParams.get("q") ?? ""                  // search action / meta (stringified)
  const actorId = searchParams.get("actorId") ?? undefined
  const targetId = searchParams.get("targetId") ?? undefined
  const action = searchParams.get("action") ?? undefined
  const from = searchParams.get("from")                  // ISO
  const to = searchParams.get("to")                      // ISO
  const take = Math.min(parseInt(searchParams.get("take") ?? "20", 10), 200)
  const page = Math.max(parseInt(searchParams.get("page") ?? "1", 10), 1)
  const csv = searchParams.get("format") === "csv"
  const skip = (page - 1) * take

  const where: Prisma.AuditLogWhereInput = {
    ...(actorId ? { actorId } : {}),
    ...(targetId ? { targetId } : {}),
    ...(action ? { action } : {}),
    ...(from || to
      ? { ts: { gte: from ? new Date(from) : undefined, lte: to ? new Date(to) : undefined } }
      : {}),
    ...(q
      ? {
          OR: [
            { action: { contains: q, mode: "insensitive" } },
            // naive meta search via JSON string cast
            // @ts-expect-error: Prisma doesn't type JSON contains string; most providers accept it.
            { meta: { contains: q } },
          ],
        }
      : {}),
  }

  const [items, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      orderBy: { ts: "desc" },   // <-- use ts, not createdAt
      skip,
      take,
      include: {
        actor: { select: { id: true, email: true, name: true } },
      },
    }),
    prisma.auditLog.count({ where }),
  ])

  if (csv) {
    const rows = [
      ["id", "ts", "action", "actorEmail", "targetId", "leadId", "meta"],
      ...items.map(a => [
        a.id,
        a.ts.toISOString(),
        a.action,
        a.actor?.email ?? "",
        a.targetId ?? "",
        a.leadId ?? "",
        JSON.stringify(a.meta ?? {}),
      ]),
    ]
    const body = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n")
    return new Response(body, {
      headers: {
        "content-type": "text/csv",
        "content-disposition": "attachment; filename=audit.csv",
      },
    })
  }

  return Response.json({ ok: true, items, total, page, take })
}
