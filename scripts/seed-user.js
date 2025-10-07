const { PrismaClient, Role } = require("@prisma/client");
const { hash } = require("bcryptjs");
const prisma = new PrismaClient();

(async () => {
  const email = process.env.SEED_EMAIL || "test@brixel.uk";
  const pwd   = process.env.SEED_PASSWORD || "ChangeMe123";
  const name  = process.env.SEED_NAME || "Test User";

  const hashed = await hash(pwd, 10);

  // Normalize any legacy 'USER' roles to HOMEOWNER before upserting
  try {
    await prisma.$executeRawUnsafe(
      'UPDATE "User" SET "role" = $1 WHERE "role"::text = $2',
      'HOMEOWNER',
      'USER'
    );
  } catch (_) {}

  const user = await prisma.user.upsert({
    where: { email },
    update: { password: hashed, name, role: Role.HOMEOWNER },
    create: { email, password: hashed, name, role: Role.HOMEOWNER },
  });

  console.log("Seeded:", { id: user.id, email: user.email, role: user.role });
  console.log("Password:", pwd);
  process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
