import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Parse body (whatever your calculator expects)
  const body = await req.json().catch(() => ({} as any));
  const { service = "extension", scope = "standard", sqm = 20, urgency = "soon" } = body;

  // --- Fallback deterministic estimate (safe placeholder) ---
  // Replace this with your existing AI + fallback logic if you have it elsewhere.
  const base = Math.max(1, Number(sqm) || 20) * 1500;
  const factor = scope === "premium" ? 1.25 : scope === "basic" ? 0.9 : 1.0;
  const min = Math.round(base * factor * 0.9);
  const max = Math.round(base * factor * 1.2);

  return NextResponse.json({
    estimateMin: min,
    estimateMax: max,
    _source: "fallback",
    service, scope, sqm, urgency,
  }, { headers: { "x-ai-source": "fallback" } });
}

export async function GET() {
  // Optional: block GET too
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ ok: true });
}
