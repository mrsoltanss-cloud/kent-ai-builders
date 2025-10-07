// src/app/api/admin/impersonate/route.ts
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/authz"
import { audit } from "@/lib/audit"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// POST /api/admin/impersonate { userId: string }   -> sets cookie
export async function POST(req: NextRequest) {
  const g = await requireAdmin()
  if (!g.ok) return new Response("Forbidden", { status: g.status })
  const { userId } = await req.json().catch(() => ({})) as { userId?: string }
  if (!userId) return new Response("Bad Request", { status: 400 })

  // don't allow impersonating another admin unless it's yourself
  const target = await prisma.user.findUnique({ where: { id: userId } })
  if (!target) return new Response("Not Found", { status: 404 })
  if (target.role === "ADMIN" && target.id !== g.user.id) {
    return new Response("Refuse: cannot impersonate another admin", { status: 403 })
  }

  const res = NextResponse.json({ ok: true })
  res.cookies.set("impersonateUserId", userId, {
    httpOnly: true, sameSite: "lax", secure: true, path: "/", maxAge: 60 * 60
  })
  await audit({ actorId: g.user.id, action: "impersonate.start", targetUserId: userId })
  return res
}

// DELETE /api/admin/impersonate -> clears cookie
export async function DELETE() {
  const g = await requireAdmin()
  if (!g.ok) return new Response("Forbidden", { status: g.status })
  const res = NextResponse.json({ ok: true })
  res.cookies.set("impersonateUserId", "", { httpOnly: true, sameSite: "lax", secure: true, path: "/", maxAge: 0 })
  await audit({ actorId: g.user.id, action: "impersonate.stop" })
  return res
}
