import { NextResponse } from "next/server";
import { z } from "zod";
import { PrismaClient, LeadStatus, Prisma } from "@prisma/client";

const db = new PrismaClient();

const LeadSchema = z.object({
  service: z.string().min(2),
  description: z.string().min(10),
  budgetMin: z.number().int().nonnegative().optional(),
  budgetMax: z.number().int().nonnegative().optional(),
  timeline: z.string().optional(),
  name: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  source: z.string().optional(), // e.g. "quote-wizard"
});
type LeadInput = z.infer<typeof LeadSchema>;

async function deliverToWebhook(lead: any) {
  const url = process.env.SHEETS_WEBHOOK_URL;
  if (!url) return { ok: true, skipped: true };

  for (let i = 0; i < 3; i++) {
    try {
      const r = await fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(lead),
      });
      if (r.ok) return { ok: true };
    } catch {
      // swallow and retry with small backoff
    }
    await new Promise((r) => setTimeout(r, 1000 * (i + 1)));
  }
  return { ok: false };
}

export async function POST(req: Request) {
  const json = await req.json().catch(() => ({}));
  const parsed = LeadSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Invalid payload", issues: parsed.error.format() },
      { status: 400 }
    );
  }

  // Assert the type now that Zod validated required fields
  const data = parsed.data as LeadInput as Prisma.LeadCreateInput;

  const created = await db.lead.create({ data });

  const result = await deliverToWebhook(created);
  if (result.ok) {
    await db.lead.update({
      where: { id: created.id },
      data: { status: LeadStatus.DELIVERED, deliveredAt: new Date() },
    });
    return NextResponse.json({ ok: true, id: created.id, delivered: true });
  }

  await db.lead.update({
    where: { id: created.id },
    data: { status: LeadStatus.QUEUED },
  });
  return NextResponse.json({
    ok: true,
    id: created.id,
    delivered: false,
    queued: true,
  });
}
