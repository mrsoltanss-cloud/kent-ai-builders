import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "../../../../../../lib/prisma";

const ALLOW = (r?: string|null) =>
  !!r && (String(r).toUpperCase() === "ADMIN" || String(r).toUpperCase() === "OPS");

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;

  const session = await getServerSession();
  const email = (session as any)?.user?.email as string | undefined;
  if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const me = await prisma.user.findUnique({ where: { email }, select: { role: true } });
  if (!ALLOW(me?.role ?? null)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, email: true, name: true, role: true, createdAt: true, updatedAt: true },
  });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const leads = await prisma.lead.findMany({ where: { userId: id } });

  const payload = {
    exportedAt: new Date().toISOString(),
    user,
    leadsCount: leads.length,
    leads,
  };
  const body = JSON.stringify(payload, null, 2);

  return new NextResponse(body, {
    status: 200,
    headers: {
      "content-type": "application/json",
      "content-disposition": `attachment; filename="user-export-${user.id}.json"`,
    },
  });
}
