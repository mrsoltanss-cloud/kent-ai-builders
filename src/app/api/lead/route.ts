import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

// Map UI strings -> Prisma enum Urgency
function mapUrgency(ui?: string | null): "ASAP" | "ONE_TO_THREE_MONTHS" | "FLEXIBLE" | null {
  if (!ui) return null;
  const v = ui.toLowerCase().trim();
  if (v === "asap") return "ASAP";
  if (v === "1-3 months" || v === "1–3 months" || v === "1 — 3 months") return "ONE_TO_THREE_MONTHS";
  // Treat "3-6 months" and "planning" as flexible window
  if (v === "3-6 months" || v === "3–6 months" || v === "planning" || v === "just planning") return "FLEXIBLE";
  // Fallback: FLEXIBLE
  return "FLEXIBLE";
}

type Payload = {
  service?: string;
  postcode?: string;
  urgency?: string | null;
  details?: Record<string, unknown> | null;
  description?: string | null;
  photos?: unknown; // array of data URLs/URLs as JSON
};

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as Payload;

    const service = body.service?.toLowerCase().trim();
    const postcode = body.postcode?.toUpperCase().trim();
    const urgencyText = body.urgency ?? null;
    const urgencyEnum = mapUrgency(urgencyText); // <-- convert to Prisma enum
    const description = body.description ?? null;
    const photos = Array.isArray(body.photos) ? body.photos : null;

    if (!service || !postcode) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Merge extra context into details JSON (keep raw urgency text + postcode)
    const incomingDetails = (body.details ?? {}) as Record<string, unknown>;
    const details = {
      ...incomingDetails,
      postcode,
      urgencyText, // keep user-friendly wording alongside enum
    };

    const lead = await prisma.lead.create({
      data: {
        service,
        urgency: urgencyEnum as any,      // Prisma enum value
        userId: (session.user as any).id, // required relation
        description,
        photos: photos as any,
        details: details as any
      } as any
    });

    return NextResponse.json({ id: lead.id }, { status: 200 });
  } catch (e: any) {
    console.error("Lead create error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
