import { getServerSession } from "next-auth";
import type { Session } from "next-auth";
import { db } from "@/server/db";
import { authOptions } from "@/lib/auth/options"; // keep this path as-is if your options live here

export async function requireUser() {
  // getServerSession in NextAuth v5 is typed as unknown unless you cast
  const session = (await getServerSession(authOptions as any)) as Session | null;

  const email = session?.user?.email ?? null;
  if (!email) return { session: null, user: null };

  const user = await db.user.findUnique({
    where: { email },
    select: { id: true, name: true, email: true, role: true },
  });

  return { session, user };
}
