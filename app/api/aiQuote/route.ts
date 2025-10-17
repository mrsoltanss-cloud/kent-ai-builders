import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "home improvement in Kent").trim();

  // deterministic demo calc
  const baseSeed = [...q.toLowerCase()].reduce((a, c) => a + c.charCodeAt(0), 0) % 97;
  const base = 6500 + baseSeed * 37;
  const low = Math.round(base * 0.92);
  const mid = Math.round(base * 1.05);
  const high = Math.round(base * 1.26);

  return NextResponse.json(
    { low, mid, high, confidence: "medium", timelineWeeks: [2, 5] },
    { headers: { "Cache-Control": "no-store" } }
  );
}
