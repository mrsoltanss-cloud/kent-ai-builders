import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/options"
import prisma from "@/lib/prisma"

export async function getCurrentUserId(req: Request): Promise<string | null> {
  try {
    const session = await getServerSession(authOptions as any)
    const uid = (session as any)?.user?.id as string | undefined
    if (uid) return uid
  } catch {}

  // Dev bypass: ?dev=1 -> ensure a throwaway user exists
  const url = new URL(req.url)
  if (url.searchParams.get("dev") === "1") {
    const dev = await prisma.user.upsert({
      where: { email: "dev@local" },
      update: {},
      create: { email: "dev@local", name: "Dev User", role: "BUILDER" as any },
      select: { id: true },
    })
    return dev.id
  }

  return null
}
