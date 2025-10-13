// src/app/api/admin/users/[id]/route.ts
import { requireAdmin } from "@/lib/authz"
import { prisma } from "@/lib/prisma"
import { audit } from "@/lib/audit"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function DELETE(_req: Request, context: any) {
  const g = await requireAdmin()
  if (!g.ok) return new Response("Forbidden", { status: g.status })

  const id = context?.params?.id as string
  if (!id) return new Response("Bad Request", { status: 400 })

  await prisma.lead.deleteMany({ where: { userId: id } })
  await prisma.user.delete({ where: { id } })

  await audit({ actorId: g.user.id, action: "user.deleted", targetUserId: id })

  return Response.json({ ok: true })
}
