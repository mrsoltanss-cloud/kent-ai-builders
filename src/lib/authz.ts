// src/lib/authz.ts
import { getEffectiveSession } from "@/lib/session"

export async function requireAdmin() {
  const session = await getEffectiveSession()
  const u: any = session?.user
  if (!u || u.role !== "ADMIN" || u.isBlocked) return { ok: false as const, status: 403 }
  return { ok: true as const, user: u }
}

export async function requireUser() {
  const session = await getEffectiveSession()
  const u: any = session?.user
  if (!u || u.isBlocked) return { ok: false as const, status: 401 }
  return { ok: true as const, user: u }
}
