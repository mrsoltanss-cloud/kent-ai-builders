import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/server/db";
import { hashPassword } from "@/lib/auth/password";

const Schema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(200),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = Schema.parse(body);

    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already in use" }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);

    // Default role for new signups; adjust if you have enums
    const user = await db.user.create({
      data: { name, email, passwordHash, role: "HOMEOWNER" },
      select: { id: true, email: true, name: true },
    });

    return NextResponse.json({ ok: true, user });
  } catch (e: any) {
    const msg = e?.message || "Invalid request";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
