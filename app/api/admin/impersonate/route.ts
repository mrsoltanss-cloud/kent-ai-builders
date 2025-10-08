import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { cookies } from "next/headers";
import { prisma } from "../../../../lib/prisma";

const ALLOW = (r?: string|null) =>
  !!r && (String(r).toUpperCase()==="ADMIN" || String(r).toUpperCase()==="OPS");

export async function POST(req: Request) {
  const session = await getServerSession();
  const email = (session as any)?.user?.email as string | undefined;
  if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const me = await prisma.user.findUnique({ where: { email }, select: { id: true, role: true } });
  if (!ALLOW(me?.role ?? null)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json().catch(()=> ({}));
  const userId = String(body?.userId ?? "");
  if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });

  const target = await prisma.user.findUnique({ where: { id: userId }, select: { id: true }});
  if (!target) return NextResponse.json({ error: "User not found" }, { status: 404 });

  // ✅ Await cookies()
  const jar = await cookies();
  jar.set("kab_impersonate_id", target.id, { httpOnly: true, sameSite: "lax", path: "/" });
  jar.set("kab_impersonator_id", me!.id, { httpOnly: true, sameSite: "lax", path: "/" });

  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const session = await getServerSession();
  if (!(session as any)?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const jar = await cookies(); // ✅ await
  jar.delete("kab_impersonate_id");
  jar.delete("kab_impersonator_id");
  return NextResponse.json({ ok: true });
}
