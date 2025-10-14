import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const emailRaw = (body?.email ?? "").toString().trim().toLowerCase();
    const password = (body?.password ?? "").toString();
    const name = (body?.name ?? "").toString().trim() || null;

    if (!emailRaw || !password) {
      return NextResponse.json({ ok: false, error: "Email and password are required." }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ ok: false, error: "Password must be at least 6 characters." }, { status: 400 });
    }

    // Duplicate check
    const exists = await prisma.user.findUnique({ where: { email: emailRaw }, select: { id: true } });
    if (exists) {
      return NextResponse.json({ ok: false, error: "Email already registered." }, { status: 409 });
    }

    // Discover the actual enum type name used by "User"."role" (e.g., Role / role)
    const typeRows = await prisma.$queryRawUnsafe<Array<{ typname: string }>>(
      `SELECT t.typname
         FROM pg_attribute a
         JOIN pg_type t ON a.atttypid = t.oid
        WHERE a.attrelid = '"User"'::regclass
          AND a.attname  = 'role'`
    );
    const enumType = typeRows[0]?.typname ?? 'Role'; // sensible fallback

    // Load enum labels for that type
    const labelRows = await prisma.$queryRawUnsafe<Array<{ enumlabel: string }>>(
      `SELECT e.enumlabel
         FROM pg_enum e
         JOIN pg_type t ON e.enumtypid = t.oid
        WHERE t.typname = $1
        ORDER BY e.enumsortorder`,
      enumType
    );
    const labels = labelRows.map(r => r.enumlabel);

    // Choose a homeowner-like label actually present in the DB
    const PREFER = ["HOMEOWNER","CUSTOMER","CLIENT","USER","RESIDENT","MEMBER"];
    let chosen =
      labels.find(l => PREFER.includes(l.toUpperCase())) ??
      labels.find(l => !/^ADMIN$/i.test(l) && !/^TRADER$/i.test(l)) ??
      labels[0];

    if (!chosen) {
      console.error("No Role enum labels found; cannot create user.");
      return NextResponse.json({ ok: false, error: "Server role configuration error." }, { status: 500 });
    }

    const hashed = await hash(password, 12);
    const id = "usr_" + randomUUID().replace(/-/g, "");

    // IMPORTANT: set BOTH createdAt and updatedAt
    const inserted = await prisma.$queryRawUnsafe<any>(
      `
      INSERT INTO "User" (id, email, name, "passwordHash", role, "isBlocked", "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, '${chosen}'::"${enumType}", false, NOW(), NOW())
      RETURNING id, email, role
      `,
      id, emailRaw, name, hashed
    );

    const user = Array.isArray(inserted) ? inserted[0] : inserted;
    return NextResponse.json({ ok: true, user }, { status: 201 });
  } catch (e) {
    console.error("Signup error:", e);
    return NextResponse.json({ ok: false, error: "Signup failed." }, { status: 500 });
  }
}
