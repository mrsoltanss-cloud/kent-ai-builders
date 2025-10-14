import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions as any);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const profile = await prisma.builderProfile.upsert({
    where: { userId: user.id },
    update: { status: "PENDING_REVIEW" },
    create: { userId: user.id, status: "PENDING_REVIEW" },
  });

  return NextResponse.json({ ok: true, profile });
}
