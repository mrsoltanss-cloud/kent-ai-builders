import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getCurrentUserId } from "./_auth"

export async function GET(req: Request) {
  const userId = await getCurrentUserId(req)
  if (!userId) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 })

  const items = await prisma.portfolioItem.findMany({
    where: { userId },
    orderBy: [{ position: "asc" }, { createdAt: "desc" }],
    include: { images: { orderBy: [{ position: "asc" }] } },
  })
  return NextResponse.json({ ok: true, items })
}

export async function POST(req: Request) {
  const userId = await getCurrentUserId(req)
  if (!userId) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 })

  const body = await req.json().catch(() => ({}))
  const title = String(body.title ?? "").trim()
  if (!title) return NextResponse.json({ ok: false, error: "Title required" }, { status: 400 })

  const count = await prisma.portfolioItem.count({ where: { userId } })
  const item = await prisma.portfolioItem.create({
    data: {
      userId,
      title,
      description: body.description ?? null,
      coverUrl: body.coverUrl ?? null,
      position: count, // append
    },
  })
  return NextResponse.json({ ok: true, item })
}
