import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function TradeProfileRedirect() {
  const session = await getServerSession(authOptions);

  // Basic auth/role gate
  let role = (session as any)?.role || (session as any)?.user?.role;
  let userId: string | undefined =
    (session as any)?.user?.id || undefined;

  // Fallback: resolve userId by email if it wasn't injected yet
  if (!userId && session?.user?.email) {
    const u = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true },
    });
    userId = u?.id;
    role = role || (u as any)?.role;
  }

  if (!session || !userId || (role !== "BUILDER" && role !== "ADMIN")) {
    redirect("/trade/signin?error=unauthorized");
  }

  // Check for existing builder profile
  const profile = await prisma.builderProfile.findUnique({
    where: { userId },
    select: { id: true, status: true },
  });

  if (!profile) {
    // No profile yet → onboarding
    redirect("/trade/onboarding/account");
  }

  // Profile exists → go to leads hub
  redirect("/trade/leads");
}
