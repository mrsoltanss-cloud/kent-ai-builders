import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  try {
    const { name, email } = await req.json().catch(() => ({}))
    if (!email) return NextResponse.json({ ok: false, error: "Email required" }, { status: 400 })

    // Create or return existing user; default role is USER
    const user = await prisma.user.upsert({
      where: { email },
      update: { name: name ?? undefined },
      create: { email, name: name ?? null, role: "USER" },
      select: { id: true, email: true, name: true, role: true },
    })

    return NextResponse.json({ ok: true, user })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? "Signup failed" }, { status: 500 })
  }
}
