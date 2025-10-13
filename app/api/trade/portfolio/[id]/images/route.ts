import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getCurrentUserId } from "../../_auth"

type Params = { params: { id: string } }

export async function POST(req: Request, { params }: Params) {
  const userId = await getCurrentUserId(req)
  if (!userId) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 })

  const body = await req.json().catch(() => ({}))
  const url = String(body.url ?? "").trim()
  if (!url) return NextResponse.json({ ok: false, error: "url required" }, { status: 400 })

  const item = await prisma.portfolioItem.findFirst({ where: { id: params.id, userId }, select: { id: true } })
  if (!item) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 })

  const count = await prisma.portfolioImage.count({ where: { itemId: params.id } })
  const img = await prisma.portfolioImage.create({
    data: { itemId: params.id, url, caption: body.caption ?? null, position: count },
  })
  return NextResponse.json({ ok: true, image: img })
}
