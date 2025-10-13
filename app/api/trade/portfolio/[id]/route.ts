import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getCurrentUserId } from "../_auth"

type Params = { params: { id: string } }

export async function PATCH(req: Request, { params }: Params) {
  const userId = await getCurrentUserId(req)
  if (!userId) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 })

  const body = await req.json().catch(() => ({}))
  const data: any = {}
  if (typeof body.title === "string") data.title = body.title
  if (typeof body.description === "string" || body.description === null) data.description = body.description ?? null
  if (typeof body.coverUrl === "string" || body.coverUrl === null) data.coverUrl = body.coverUrl ?? null
  if (Number.isInteger(body.position)) data.position = body.position

  const item = await prisma.portfolioItem.update({
    where: { id: params.id, userId },
    data,
  }).catch(() => null)

  if (!item) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 })
  return NextResponse.json({ ok: true, item })
}

export async function DELETE(req: Request, { params }: Params) {
  const userId = await getCurrentUserId(req)
  if (!userId) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 })

  const ok = await prisma.portfolioItem.delete({ where: { id: params.id, userId } }).catch(() => null)
  if (!ok) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 })
  return NextResponse.json({ ok: true })
}
