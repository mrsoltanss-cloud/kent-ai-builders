// app/api/trade/intros/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const fp = url.searchParams.get("fp") || "";
  if (!fp) return NextResponse.json({ items: [] });

  const rows = await db.jobIntro.findMany({
    where: {
      fingerprint: fp,
      createdAt: { gte: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90) }, // last 90 days
    },
    select: { jobId: true },
  });

  return NextResponse.json({ items: rows.map((r) => r.jobId) });
}
