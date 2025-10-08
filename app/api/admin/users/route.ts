import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "../../../../lib/prisma";

function isAllowed(role?: string | null) {
  if (!role) return false;
  const R = String(role).toUpperCase();
  return R === "ADMIN" || R === "OPS";
}

export async function GET() {
  const session = await getServerSession();
  const email = (session as any)?.user?.email as string | undefined;
  if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const me = await prisma.user.findUnique({ where: { email }, select: { role: true } });
  if (!isAllowed(me?.role ?? null)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, email: true, name: true, role: true, createdAt: true, updatedAt: true, _count: { select: { leads: true } } },
  });

  return NextResponse.json({ ok: true, users: users.map(u => ({ ...u, leadsCount: u._count.leads })) });
}
