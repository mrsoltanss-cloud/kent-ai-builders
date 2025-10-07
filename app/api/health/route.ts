import { PrismaClient } from "@prisma/client";

export async function GET() {
  const prisma = new PrismaClient();
  try {
    await prisma.$queryRaw`SELECT 1`;
    return Response.json({ ok: true, service: "api/health", db: "up" });
  } catch (e: any) {
    return new Response(JSON.stringify({ ok: false, error: e?.message || "unknown" }), { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
