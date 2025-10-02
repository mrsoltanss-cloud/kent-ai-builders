// src/lib/session.ts
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { cookies } from "next/headers"
import { prisma } from "@/lib/prisma"

export async function getEffectiveSession() {
  const session = await getServerSession(authOptions)

  // In Next 15, cookies() returns a Promise<ReadonlyRequestCookies>
  const jar = await cookies()
  const imp = jar.get("impersonateUserId")?.value

  const isAdmin =
    (session as any)?.user?.role === "ADMIN" &&
    !(session as any)?.user?.isBlocked

  if (isAdmin && imp) {
    const u = await prisma.user.findUnique({ where: { id: imp } })
    if (u) {
      return {
        ...session,
        user: {
          id: u.id,
          email: u.email,
          name: u.name ?? null,
          role: u.role,
          isBlocked: u.isBlocked,
          __impersonated: true,
          __actorId: (session as any)?.user?.id,
        },
      } as any
    }
  }
  return session as any
}

export async function getEffectiveUser() {
  const s = await getEffectiveSession()
  return (s as any)?.user ?? null
}
