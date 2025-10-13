import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/authz";
import { audit } from "@/lib/audit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const g = await requireAdmin();
  if (!g.ok) return new Response("Forbidden", { status: g.status ?? 403 });

  const { userId } = await req.json().catch(() => ({}));
  if (!userId) return new Response("Bad Request", { status: 400 });

  const target = await prisma.user.findUnique({ where: { id: userId } });
  if (!target) return new Response("Not Found", { status: 404 });

  // Null-safe check: only block if trying to impersonate a different admin
  if (target.role === "ADMIN" && g.user && target.id !== g.user.id) {
    return new Response("Refuse: cannot impersonate another admin", { status: 403 });
  }

  await audit({ action: "admin.impersonate", actorId: g.user?.id ?? null, targetId: target.id });

  // Return a harmless placeholder token for now
  return new Response(JSON.stringify({ ok: true, token: "impersonation-dev-token" }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}
