const { PrismaClient, Role } = require("@prisma/client");
const { hash } = require("bcryptjs");
const prisma = new PrismaClient();

async function main() {
  const email = process.env.SEED_EMAIL || "test@brixel.uk";
  const plain = process.env.SEED_PASSWORD || "ChangeMe123";
  const name = process.env.SEED_NAME || "Test Local";

  const hashed = await hash(plain, 10);
  const user = await prisma.user.upsert({
    where: { email: email.toLowerCase().trim() },
    update: { password: hashed, name, role: Role.HOMEOWNER },
    create: { email: email.toLowerCase().trim(), password: hashed, name, role: Role.HOMEOWNER },
  });

  console.log("Seeded user:", { id: user.id, email: user.email, role: user.role });
  console.log("Password:", plain);
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
