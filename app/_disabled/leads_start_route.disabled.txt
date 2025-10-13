import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';

const prisma = new PrismaClient();
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;
    if (!email) return NextResponse.json({ ok: false, error: 'Not signed in.' }, { status: 401 });

    const { jobType } = await req.json().catch(() => ({}));
    if (!jobType || typeof jobType !== 'string') {
      return NextResponse.json({ ok: false, error: 'jobType required' }, { status: 400 });
    }

    // Get user id
    const user = await prisma.user.findUnique({ where: { email }, select: { id: true } });
    if (!user) return NextResponse.json({ ok: false, error: 'User not found.' }, { status: 401 });

    // Find latest lead (keep it simple: most recent is "active")
    const existing = await prisma.lead.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      select: { id: true }
    });

    let leadId: string;

    if (!existing) {
      // Create with minimal fields (assumes schema defaults handle status, etc.)
      const created = await prisma.lead.create({
        data: { userId: user.id, jobType } as any,
        select: { id: true }
      });
      leadId = created.id;
    } else {
      const updated = await prisma.lead.update({
        where: { id: existing.id },
        data: { jobType },
        select: { id: true }
      });
      leadId = updated.id;
    }

    return NextResponse.json({ ok: true, leadId });
  } catch (e) {
    console.error('leads/start error:', e);
    return NextResponse.json({ ok: false, error: 'Failed to start lead.' }, { status: 500 });
  }
}
