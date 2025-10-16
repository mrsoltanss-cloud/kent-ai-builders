import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Reference format: BK-XXXX-XXXX (base36 timestamp + id hash), uppercase
function makeRef(seedA: number, seedB: string) {
  const a = seedA.toString(36).toUpperCase().padStart(6, "0").slice(-6);
  const b = seedB.replace(/[^a-z0-9]/gi, "").slice(-6).toUpperCase();
  const chunk = (s: string) => `${s.slice(0, 4)}-${s.slice(4, 8)}`;
  const raw = (a + b).slice(-8); // 8 chars
  return `BK-${chunk(raw)}`;
}

export async function POST(req: NextRequest) {
  try {
    const { leadId } = await req.json();
    if (!leadId || typeof leadId !== "string") {
      return NextResponse.json({ error: "leadId required" }, { status: 400 });
    }
    const lead = await prisma.lead.findUnique({ where: { id: leadId } });
    if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });

    if (lead.reference) {
      return NextResponse.json({ reference: lead.reference });
    }

    // Try to generate a unique reference (loop very unlikely >1)
    let tries = 0;
    while (tries < 3) {
      const ref = makeRef(Math.floor((lead.createdAt ?? new Date()).getTime() / 1000), lead.id);
      try {
        const updated = await prisma.lead.update({
          where: { id: lead.id },
          data: { reference: ref },
          select: { reference: true },
        });
        return NextResponse.json({ reference: updated.reference });
      } catch (e: any) {
        // Unique collision — add a tiny jitter and retry
        tries++;
      }
    }

    return NextResponse.json({ error: "Failed to allocate reference" }, { status: 500 });
  } catch (e: any) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
