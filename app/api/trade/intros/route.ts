import * as prismaMod from "@/lib/prisma";
import { NextResponse } from "next/server";

// Be tolerant to either export style
const db: any = (prismaMod as any).db ?? (prismaMod as any).default ?? (prismaMod as any);

export async function GET(req: Request) {
  const url = new URL(req.url);
  const fp = url.searchParams.get("fp");
  const sinceHours = Number(url.searchParams.get("sinceHours") ?? 72);
  if (!fp) return NextResponse.json({ jobIds: [] });
  const since = new Date(Date.now() - sinceHours * 3600 * 1000);

  const rows = await db.jobIntro.findMany({
    where: { fingerprint: fp, createdAt: { gte: since } },
    select: { jobId: true },
  });

  // de-dup
  return NextResponse.json({ jobIds: [...new Set(rows.map((r: any) => r.jobId))] });
}
