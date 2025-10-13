import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "../../../../../lib/prisma";

function isAllowed(role?: string | null) {
  if (!role) return false;
  const R = String(role).toUpperCase();
  return R === "ADMIN" || R === "OPS";
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession();
  const email = (session as any)?.user?.email as string | undefined;
  if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const me = await prisma.user.findUnique({ where: { email }, select: { role: true } });
  if (!isAllowed(me?.role ?? null)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await prisma.lead.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
