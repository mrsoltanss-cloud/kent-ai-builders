// src/app/api/admin/leads/bulk/delete/route.ts
import { requireAdmin } from "@/lib/authz"
import { prisma } from "@/lib/prisma"
import { audit } from "@/lib/audit"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  const g = await requireAdmin()
  if (!g.ok) return new Response("Forbidden", { status: g.status })

  const { ids } = (await req.json().catch(() => ({}))) as { ids?: string[] }
  if (!Array.isArray(ids) || ids.length === 0) {
    return new Response("Bad Request", { status: 400 })
  }

  await prisma.lead.deleteMany({ where: { id: { in: ids } } })

  await audit({
    actorId: g.user.id,
    action: "leads.bulk_delete",
    meta: { count: ids.length, ids },
  })

  return Response.json({ ok: true, count: ids.length })
}
