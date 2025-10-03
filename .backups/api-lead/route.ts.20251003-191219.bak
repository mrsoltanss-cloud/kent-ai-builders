import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

function mapUrgency(ui?: string | null): "ASAP" | "ONE_TO_THREE_MONTHS" | "FLEXIBLE" | null {
  if (!ui) return null;
  const v = ui.toLowerCase().trim();
  if (v === "asap") return "ASAP";
  if (v === "1-3 months" || v === "1–3 months") return "ONE_TO_THREE_MONTHS";
  if (v === "3-6 months" || v === "3–6 months" || v === "planning" || v === "just planning") return "FLEXIBLE";
  return "FLEXIBLE";
}

type Payload = {
  service?: string;
  postcode?: string;
  urgency?: string | null;
  details?: Record<string, unknown> | null;
  description?: string | null;
  photos?: unknown;
};

export async function POST(req: Request) {
  const ref = "BK-" + Math.random().toString(36).slice(2, 8).toUpperCase();

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as Payload;
    const service = body.service?.toLowerCase().trim();
    const postcode = body.postcode?.toUpperCase().trim();
    const urgencyEnum = mapUrgency(body.urgency ?? null);
    const description = body.description ?? null;
    const photos = Array.isArray(body.photos) ? body.photos : null;

    if (!service || !postcode) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Always keep postcode + original urgency text in details JSON
    const incomingDetails = (body.details ?? {}) as Record<string, unknown>;
    const details = { ...incomingDetails, postcode, urgencyText: body.urgency ?? null, ref };

    try {
      // Try to persist with the new columns (works once migrations are applied)
      const lead = await prisma.lead.create({
        data: {
          service,
          urgency: urgencyEnum as any,
          userId: (session.user as any).id,
          description,
          photos: photos as any,
          details: details as any,
        } as any,
      });
      return NextResponse.json({ id: lead.id, ref, saved: true }, { status: 200 });
    } catch (dbErr) {
      console.error("Lead save failed (falling back):", dbErr);
      // Fallback: try minimal shape if your old schema doesn’t have the new columns
      try {
        const minimal = await prisma.lead.create({
          data: {
            service,
            urgency: urgencyEnum as any,
            userId: (session.user as any).id,
          } as any,
        });
        return NextResponse.json({ id: minimal.id, ref, saved: true, downgraded: true }, { status: 200 });
      } catch (fallbackErr) {
        console.error("Fallback save also failed:", fallbackErr);
        // Last resort: don’t block the UI — return success with saved:false
        return NextResponse.json({ id: ref, ref, saved: false }, { status: 200 });
      }
    }
  } catch (e) {
    console.error("Lead endpoint fatal:", e);
    // Still don’t block the UI
    return NextResponse.json({ id: ref, ref, saved: false }, { status: 200 });
  }
}
