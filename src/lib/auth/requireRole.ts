import { getServerSession } from "next-auth";
import type { Session } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { redirect } from "next/navigation";

/** Server-side role guard (server components / route handlers) */
export async function requireRole(
  roles: Array<"ADMIN" | "TRADER" | "HOMEOWNER">
) {
  const session = (await getServerSession(authOptions)) as Session | null;

  // No session -> send to sign-in
  if (!session?.user) {
    redirect("/auth/signin");
  }

  // Role check
  const role = (session.user as any)?.role ?? "HOMEOWNER";
  if (!roles.includes(role)) {
    // Not allowed -> send to a safe page (home)
    redirect("/");
  }

  return session.user;
}
