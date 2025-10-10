import * as prismaMod from "@/lib/prisma";
import { NextResponse } from "next/server";

// Be tolerant to either export style
const db: any = (prismaMod as any).db ?? (prismaMod as any).default ?? (prismaMod as any);

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const jobId: string | undefined = body?.jobId;
    const fingerprint: string | undefined = body?.fingerprint;
    const builderId: string | null = body?.builderId ?? null;

    if (!jobId || !fingerprint) {
      return NextResponse.json({ error: "Missing jobId or fingerprint" }, { status: 400 });
    }

    const now = new Date();

    const result = await db.$transaction(async (tx: any) => {
      const job = await tx.job.findUnique({
        where: { id: jobId },
        select: { id: true, contactUnlocks: true, allocCap: true },
      });
      if (!job) return { status: 404, introduced: 0, cap: 0 };

      // Try to create a unique intro (unique on jobId+fingerprint)
      try {
        await tx.jobIntro.create({
          data: { jobId, builderId, fingerprint, createdAt: now },
        });
      } catch (_e: any) {
        // Unique constraint -> already joined
        return { status: 409, introduced: job.contactUnlocks ?? 0, cap: job.allocCap ?? 3 };
      }

      const updated = await tx.job.update({
        where: { id: jobId },
        data: { contactUnlocks: (job.contactUnlocks ?? 0) + 1, updatedAt: now },
        select: { contactUnlocks: true, allocCap: true },
      });

      return { status: 200, introduced: updated.contactUnlocks ?? 0, cap: updated.allocCap ?? 3 };
    });

    return NextResponse.json(
      { ok: result.status === 200, introduced: result.introduced, cap: result.cap },
      { status: result.status }
    );
  } catch (err) {
    console.error("interest api error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
