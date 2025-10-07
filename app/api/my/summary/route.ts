import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';

const prisma = new PrismaClient();
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;
    if (!userId) {
      return NextResponse.json({ ok: false, error: 'Not signed in' }, { status: 401 });
    }

    const [leadCount, recent, latest] = await Promise.all([
      prisma.lead.count({ where: { userId } }),
      prisma.lead.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          service: true,
          status: true,
          createdAt: true,
        },
      }),
      prisma.lead.findFirst({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          service: true,
          scope: true,
          rooms: true,
          sqm: true,
          propertyAge: true,  // matches your DB
          urgency: true,
          budget: true,
          timeline: true,
          status: true,
          notes: true,
          description: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
    ]);

    return NextResponse.json({ ok: true, leadCount, recent, latest });
  } catch (e) {
    console.error('summary error:', e);
    return NextResponse.json({ ok: false, error: 'Summary failed.' }, { status: 500 });
  }
}
