import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Reference format: BK-XXXX-XXXX (base36 timestamp + id hash), uppercase
function makeRef(seedA: number, seedB: string) {
  const a = seedA.toString(36).toUpperCase().padStart(6, "0").slice(-6);
  const b = seedB.replace(/[^a-z0-9]/gi, "").slice(-6).toUpperCase();
  const raw = (a + b).slice(-8); // 8 chars total
  return `BK-${raw.slice(0, 4)}-${raw.slice(4, 8)}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      userId,
      service,
      details,
      postcode,
      urgency, // "FLEXIBLE" | "SOON" | "URGENT" (optional)
      priceMin,
      priceMax,
    } = body || {};

    if (!service) {
      return NextResponse.json({ error: "service is required" }, { status: 400 });
    }

    // 1) Create lead
    const lead = await prisma.lead.create({
      data: {
        userId: userId ?? null,
        service,
        details: details ?? null,
        postcode: postcode ?? null,
        urgency: urgency ?? null,
        priceMin: priceMin ?? null,
        priceMax: priceMax ?? null,
      },
      select: { id: true, createdAt: true, reference: true },
    });

    // 2) Assign reference if missing (should be on first try; retry if unique collision)
    let reference = lead.reference || "";
    if (!reference) {
      let tries = 0;
      while (tries < 3) {
        const ref = makeRef(Math.floor(lead.createdAt.getTime() / 1000), lead.id);
        try {
          const updated = await prisma.lead.update({
            where: { id: lead.id },
            data: { reference: ref },
            select: { reference: true },
          });
          reference = updated.reference!;
          break;
        } catch {
          tries++;
        }
      }
      if (!reference) {
        // Fallback: add tiny jitter to seed and try once more
        const ref = makeRef(Math.floor(Date.now() / 1000) + Math.floor(Math.random() * 100), lead.id);
        try {
          const updated = await prisma.lead.update({
            where: { id: lead.id },
            data: { reference: ref },
            select: { reference: true },
          });
          reference = updated.reference!;
        } catch {
          // Still no dice — keep reference null, but return lead id so UI can call /api/lead/reference
        }
      }
    }

    return NextResponse.json({ id: lead.id, reference, ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
