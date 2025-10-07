// src/app/api/admin/users/[id]/block/route.ts
import { requireAdmin } from "@/lib/authz"
import { prisma } from "@/lib/prisma"
import { audit } from "@/lib/audit"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(req: Request, context: any) {
  const g = await requireAdmin()
  if (!g.ok) return new Response("Forbidden", { status: g.status })

  const id = context?.params?.id as string
  if (!id) return new Response("Bad Request", { status: 400 })

  const { reason, block } = await req.json().catch(() => ({})) as { reason?: string; block?: boolean }
  const isBlocked = !!block
  const data: any = { isBlocked }
  if (isBlocked) {
    data.blockedAt = new Date()
    data.blockedReason = reason || "Blocked by admin"
  } else {
    data.blockedAt = null
    data.blockedReason = null
  }

  const updated = await prisma.user.update({ where: { id }, data })

  await audit({
    actorId: g.user.id,
    action: isBlocked ? "user.blocked" : "user.unblocked",
    targetUserId: id,
    meta: { reason: reason ?? null },
  })

  return Response.json({ ok: true, user: { id: updated.id, isBlocked: updated.isBlocked } })
}
