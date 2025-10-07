import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getToken } from 'next-auth/jwt';

const prisma = new PrismaClient();
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // Read the NextAuth JWT from cookies (works on Vercel and locally)
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token?.email) {
      return NextResponse.json({ ok: false, error: 'Not signed in.' }, { status: 401 });
    }

    // Body → normalized profile fields
    const body = await req.json();
    const data = {
      postcode:      body.postcode ?? null,
      addressLine1:  body.addressLine1 ?? null,
      addressLine2:  body.addressLine2 ?? null,
      city:          body.city ?? null,
      phone:         body.phone ?? null,
      timeframe:     body.timeframe ?? null,
      propertyType:  body.propertyType ?? null,
      ownership:     body.ownership ?? null,
      accessNotes:   body.accessNotes ?? null,
    };

    // Resolve the user id from email present in the JWT
    const user = await prisma.user.findUnique({
      where: { email: String(token.email) },
      select: { id: true },
    });
    if (!user?.id) {
      return NextResponse.json({ ok: false, error: 'User not found.' }, { status: 401 });
    }

    // Upsert the profile
    await prisma.userProfile.upsert({
      where:  { userId: user.id },
      update: data,
      create: { userId: user.id, ...data },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('profile POST error:', e);
    return NextResponse.json({ ok: false, error: 'Profile update failed.' }, { status: 500 });
  }
}
