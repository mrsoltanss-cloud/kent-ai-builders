// src/app/api/admin/leads/[id]/route.ts
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/authz"
import { audit } from "@/lib/audit"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// GET one lead (ADMIN)
export async function GET(_req: Request, context: any) {
  const g = await requireAdmin()
  if (!g.ok) return new Response("Forbidden", { status: g.status })

  const id = context?.params?.id as string
  if (!id) return new Response("Bad Request", { status: 400 })

  const lead = await prisma.lead.findUnique({
    where: { id },
    include: { user: { select: { id: true, email: true, name: true } } },
  })
  if (!lead) return new Response("Not Found", { status: 404 })
  return Response.json({ ok: true, lead })
}

// PATCH update status/notes (ADMIN)
export async function PATCH(req: Request, context: any) {
  const g = await requireAdmin()
  if (!g.ok) return new Response("Forbidden", { status: g.status })

  const id = context?.params?.id as string
  if (!id) return new Response("Bad Request", { status: 400 })

  const body = (await req.json().catch(() => ({}))) as {
    status?: string
    noteAppend?: string
  }

  const data: any = {}
  if (body.status) data.status = body.status
  if (body.noteAppend && body.noteAppend.trim()) {
    const ts = new Date().toISOString()
    const existing = await prisma.lead.findUnique({ where: { id }, select: { notes: true } })
    const nextNotes =
      (existing?.notes ? existing.notes + "\n\n" : "") + `[${ts}] ${body.noteAppend.trim()}`
    data.notes = nextNotes
  }

  const updated = await prisma.lead.update({ where: { id }, data })

  await audit({
    actorId: g.user.id,
    action: "lead.updated",
    leadId: id,
    meta: { status: body.status ?? null, noteAppended: !!body.noteAppend },
  })

  return Response.json({ ok: true, lead: updated })
}

// DELETE a lead (ADMIN)
export async function DELETE(_req: Request, context: any) {
  const g = await requireAdmin()
  if (!g.ok) return new Response("Forbidden", { status: g.status })

  const id = context?.params?.id as string
  if (!id) return new Response("Bad Request", { status: 400 })

  await prisma.lead.delete({ where: { id } })
  await audit({ actorId: g.user.id, action: "lead.deleted", leadId: id })
  return Response.json({ ok: true })
}
