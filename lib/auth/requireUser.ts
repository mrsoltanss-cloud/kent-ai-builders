import { getServerSession } from "next-auth";
import { db } from "@/server/db";

type SessionLike = {
  user?: { email?: string | null } | null;
} | null;

export async function requireUser() {
  let session: SessionLike = null;

  try {
    // Prefer using centralised NextAuth options if present
    const mod = await import("@/lib/auth/options");
    session = (await getServerSession((mod as any).authOptions)) as SessionLike;
  } catch {
    // Fallback: let NextAuth infer from route handler config
    session = (await getServerSession()) as SessionLike;
  }

  const email = session?.user?.email ?? null;
  if (!email) return { session: null, user: null };

  const user = await db.user.findUnique({
    where: { email },
    select: { id: true, name: true, email: true, role: true },
  });

  return { session, user };
}
