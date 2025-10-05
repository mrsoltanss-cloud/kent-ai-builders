import { NextResponse } from 'next/server';
import { PrismaClient, Urgency } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';

const prisma = new PrismaClient();
export const dynamic = 'force-dynamic';

/** Case-insensitive mapper to Prisma Urgency enum with a safe fallback. */
function normalizeUrgency(input: unknown): Urgency | undefined {
  if (input == null) return undefined;
  const raw = String(input).trim();
  if (!raw) return undefined;

  const canon = raw.toUpperCase().replace(/\s+/g, '');
  const allowed = Object.values(Urgency) as string[];

  const direct = allowed.find((v) => v.toUpperCase().replace(/\s+/g, '') === canon);
  if (direct) return direct as Urgency;

  const syn: Record<string, string[]> = {
    ASAP: ['ASAP', 'URGENT', 'IMMEDIATE', 'NOW', 'EMERGENCY'],
    SOON: ['SOON', 'SHORTLY', 'NEXTFEWWEEKS', 'WITHIN2WEEKS', '2WEEKS'],
    FLEXIBLE: ['FLEXIBLE', 'LATER', 'NORUSH', 'WHENEVER'],
  };
  for (const [target, words] of Object.entries(syn)) {
    if (words.some((w) => w.toUpperCase().replace(/\s+/g, '') === canon)) {
      const exists = allowed.find((v) => v.toUpperCase() === target);
      if (exists) return exists as Urgency;
    }
  }
  return undefined;
}

/** Strip undefined values from a plain object (for JSON columns). */
function stripUndefined<T extends Record<string, any>>(obj: T | null | undefined) {
  if (!obj || typeof obj !== 'object') return undefined;
  const entries = Object.entries(obj).filter(([, v]) => v !== undefined);
  return entries.length ? Object.fromEntries(entries) : undefined;
}

export async function POST(req: Request) {
  try {
    // Auth (server-side)
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id as string | undefined;
    if (!userId) {
      return NextResponse.json({ ok: false, error: 'Not signed in' }, { status: 401 });
    }

    // Parse & extract
    const body = await req.json().catch(() => ({}));
    const {
      service,
      scope,
      rooms,
      sqm,
      age,             // some clients send `age`
      propertyAge,     // your DB uses `propertyAge`
      urgency,
      budget,
      timeline,
      description,
      notes,
      photos,
      details,
      // contactName/contactEmail are intentionally ignored (not in your DB schema)
    } = body || {};

    // Normalize & sanitize
    const urgencyEnum = normalizeUrgency(urgency) ?? Urgency.FLEXIBLE;
    const photosArr = Array.isArray(photos) ? photos : [];
    const detailsJson = stripUndefined(details);

    const data: any = {
      userId: String(userId),
      service: service ? String(service) : 'General',
      scope: typeof scope === 'string' && scope.trim() !== '' ? scope : null,
      rooms: typeof rooms === 'number' ? rooms : rooms == null ? null : Number(rooms) || null,
      sqm: typeof sqm === 'number' ? sqm : sqm == null ? null : Number(sqm) || null,
      propertyAge:
        propertyAge != null
          ? String(propertyAge)
          : age != null
          ? String(age)
          : null,
      urgency: urgencyEnum, // REQUIRED in your DB; always set
      budget: typeof budget === 'number' ? budget : budget == null ? null : Number(budget) || null,
      timeline: timeline ?? null,
      description:
        typeof description === 'string'
          ? description.trim() === '' ? null : description
          : description == null
          ? null
          : String(description),
      notes: notes ?? null,
    };

    // Attach JSON/array fields ONLY if present in your schema
    if (detailsJson) data.details = detailsJson;
    if (photosArr.length) data.photos = photosArr;

    const lead = await prisma.lead.create({
      data,
      select: { id: true, createdAt: true },
    });

    return NextResponse.json({ ok: true, leadId: lead.id, createdAt: lead.createdAt });
  } catch (e: any) {
    console.error('Lead create error:', e);
    const msg = String(e?.message || '');
    if (msg.includes('Expected Urgency') || msg.includes('Argument `urgency` is missing')) {
      return NextResponse.json(
        { ok: false, error: 'Invalid or missing urgency. Allowed: ASAP, SOON, FLEXIBLE.' },
        { status: 400 }
      );
    }
    if (msg.includes('Unknown argument')) {
      return NextResponse.json(
        { ok: false, error: 'Payload included fields not in the database schema.' },
        { status: 400 }
      );
    }
    return NextResponse.json({ ok: false, error: 'Lead create failed.' }, { status: 400 });
  }
}
