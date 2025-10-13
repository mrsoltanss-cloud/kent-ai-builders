// app/api/trade/interest/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { jobId, fingerprint } = body as { jobId?: string; fingerprint?: string };

    if (!jobId || !fingerprint) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    // Check job status + capacity
    const j = await db.job.findUnique({
      where: { id: jobId },
      select: { allocCap: true, contactUnlocks: true, status: true },
    });
    if (!j || j.status !== "OPEN") {
      return NextResponse.json({ error: "Job not open" }, { status: 404 });
    }

    const cap = j.allocCap ?? 3;
    if ((j.contactUnlocks ?? 0) >= cap) {
      return NextResponse.json({ error: "Full" }, { status: 409 });
    }

    // Capture best-effort metadata
    const ip =
      (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() ||
      req.headers.get("x-real-ip") ||
      undefined;
    const userAgent = req.headers.get("user-agent") || undefined;

    // Transaction: create intro (unique) + increment counter
    const result = await db.$transaction(async (tx) => {
      try {
        await tx.jobIntro.create({
          data: { jobId, fingerprint, ip, userAgent },
        });
      } catch (e: any) {
        // Unique violation: already joined this job from this device
        if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
          return { already: true as const, contactUnlocks: j.contactUnlocks ?? 0 };
        }
        throw e;
      }

      const updated = await tx.job.update({
        where: { id: jobId },
        data: { contactUnlocks: { increment: 1 } },
        select: { contactUnlocks: true },
      });

      return { already: false as const, contactUnlocks: updated.contactUnlocks };
    });

    if (result.already) {
      return NextResponse.json({ ok: false, already: true, contactUnlocks: result.contactUnlocks }, { status: 409 });
    }

    return NextResponse.json({ ok: true, contactUnlocks: result.contactUnlocks });
  } catch (e) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
