import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function TradeProfileRedirect() {
  const session = await getServerSession(authOptions);
  const role = (session as any)?.role;
  const userId = (session as any)?.user?.id;

  if (!session || (role !== "BUILDER" && role !== "ADMIN")) {
    redirect("/trade/signin?error=unauthorized");
  }

  const profile = await prisma.builderProfile.findUnique({
    where: { userId },
    select: { id: true, status: true },
  });

  if (!profile) redirect("/trade/onboarding/account");
  redirect("/trade/leads");
}
