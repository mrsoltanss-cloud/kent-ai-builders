// src/app/api/admin/users/bulk/block/route.ts
import { requireAdmin } from "@/lib/authz"
import { prisma } from "@/lib/prisma"
import { audit } from "@/lib/audit"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  const g = await requireAdmin()
  if (!g.ok) return new Response("Forbidden", { status: g.status })

  const { ids, block, reason } = await req.json().catch(() => ({})) as {
    ids?: string[], block?: boolean, reason?: string
  }
  if (!Array.isArray(ids) || ids.length === 0) return new Response("Bad Request", { status: 400 })

  const isBlocked = !!block
  const data: any = { isBlocked }
  if (isBlocked) {
    data.blockedAt = new Date()
    data.blockedReason = reason || "Blocked by admin (bulk)"
  } else {
    data.blockedAt = null
    data.blockedReason = null
  }

  await prisma.user.updateMany({ where: { id: { in: ids } }, data })

  await audit({
    actorId: g.user.id,
    action: isBlocked ? "users.bulk_block" : "users.bulk_unblock",
    meta: { count: ids.length, ids, reason: reason ?? null },
  })

  return Response.json({ ok: true, count: ids.length })
}
