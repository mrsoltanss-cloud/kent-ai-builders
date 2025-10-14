import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions as any);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { type, fileUrl, filename, mimeType, size } = await req.json();
  const builder = await prisma.builderProfile.findUnique({ where: { userId: user.id }});
  if (!builder) return NextResponse.json({ error: "No builder profile" }, { status: 400 });

  const doc = await prisma.verificationDocument.create({
    data: {
      builderId: builder.id,
      type,
      fileUrl,
      filename,
      mimeType,
      size,
      status: "UPLOADED",
    },
  });

  return NextResponse.json({ ok: true, doc });
}
