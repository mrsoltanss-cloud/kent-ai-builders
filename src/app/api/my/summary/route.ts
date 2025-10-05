import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';

const prisma = new PrismaClient();
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;
    if (!email) return NextResponse.json({ ok: false, error: 'Not signed in.' }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { email }, select: { id: true } });
    if (!user) return NextResponse.json({ ok: false, error: 'User not found.' }, { status: 401 });

    const lead = await prisma.lead.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        jobType: true,
        status: true,
        createdAt: true
        // Add fields here later as your schema evolves (estLow/estHigh, postcode, etc.)
      }
    });

    const counts = {
      leads: await prisma.lead.count({ where: { userId: user.id } }),
      files: 0,
      messages: 0
    };

    function nextActionFor(status?: string, id?: string) {
      if (!id) return { label: 'Start your quote', href: '/quote' };
      const base = `/my/jobs/${id}`;
      switch ((status || '').toUpperCase()) {
        case 'DRAFT': return { label: 'Continue quote', href: '/quote' };
        case 'SUBMITTED': return { label: 'Upload photos', href: `${base}/files` };
        case 'MATCHED': return { label: 'Book a survey', href: `${base}/schedule` };
        case 'QUOTED': return { label: 'Review quote', href: `${base}` };
        default: return { label: 'View your job', href: `${base}` };
      }
    }

    return NextResponse.json({
      ok: true,
      lead,
      counts,
      nextAction: nextActionFor(lead?.status as any, lead?.id)
    });
  } catch (e) {
    console.error('my/summary GET error:', e);
    return NextResponse.json({ ok: false, error: 'Failed to load dashboard.' }, { status: 500 });
  }
}
