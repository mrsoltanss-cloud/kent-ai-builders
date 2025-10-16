import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

/** Homeowner signup only: creates a CUSTOMER user */
export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }

    const passwordHash = await hash(password, 10);
    const user = await prisma.user.create({
      data: { email, name: name ?? null, role: "CUSTOMER", passwordHash },
      select: { id: true, email: true, role: true },
    });

    return NextResponse.json({ ok: true, user }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: "Signup failed", detail: e?.message }, { status: 500 });
  }
}
