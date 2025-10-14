import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import prisma from "@/lib/prisma";

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions as any);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { postcode, radiusMiles, lat, lng } = await req.json();

  const profile = await prisma.builderProfile.upsert({
    where: { userId: user.id },
    update: { postcode, radiusMiles, lat, lng, status: "DRAFT" },
    create: { userId: user.id, postcode, radiusMiles, lat, lng },
  });

  return NextResponse.json({ ok: true, profile });
}
