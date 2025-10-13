import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getCurrentUserId } from "../_auth"

export async function POST(req: Request) {
  const userId = await getCurrentUserId(req)
  if (!userId) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 })

  const body = await req.json().catch(() => ({}))
  const ids: string[] = Array.isArray(body.ids) ? body.ids : []
  if (!ids.length) return NextResponse.json({ ok: false, error: "ids array required" }, { status: 400 })

  // Verify all belong to user
  const items = await prisma.portfolioItem.findMany({ where: { id: { in: ids }, userId }, select: { id: true } })
  const allowed = new Set(items.map(i => i.id))
  const updates = ids
    .filter(id => allowed.has(id))
    .map((id, idx) => prisma.portfolioItem.update({ where: { id }, data: { position: idx } }))

  await prisma.$transaction(updates)
  return NextResponse.json({ ok: true })
}
