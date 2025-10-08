import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { cookies } from "next/headers";
import { prisma } from "../../../lib/prisma";

function roleUp(x?: unknown) { return x ? String(x).toUpperCase() : null; }
const ALLOW = (r?: string|null) => !!r && (r === "ADMIN" || r === "OPS");

export async function GET() {
  const session = await getServerSession();
  const email = (session as any)?.user?.email as string | undefined;
  if (!email) {
    return NextResponse.json({ role: null, user: null, meta: { impersonating: false } });
  }

  // Current admin/ops?
  const me = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, name: true, role: true }
  });
  const myRole = roleUp(me?.role);
  const canImpersonate = ALLOW(myRole);

  // ✅ Await cookies()
  const jar = await cookies();
  const actAsId = jar.get("kab_impersonate_id")?.value || null;
  const actBy = jar.get("kab_impersonator_id")?.value || null;

  if (canImpersonate && actAsId) {
    const target = await prisma.user.findUnique({
      where: { id: actAsId },
      select: { id: true, email: true, name: true, role: true, createdAt: true }
    });
    if (target) {
      return NextResponse.json({
        role: roleUp(target.role),
        user: { id: target.id, email: target.email, name: target.name, createdAt: target.createdAt },
        meta: { impersonating: true, impersonatorEmail: me?.email ?? null, impersonatorId: me?.id ?? null }
      });
    }
  }

  // Normal (not impersonating)
  return NextResponse.json({
    role: myRole,
    user: { id: me?.id ?? null, email: me?.email ?? null, name: me?.name ?? null, createdAt: null },
    meta: { impersonating: false }
  });
}
