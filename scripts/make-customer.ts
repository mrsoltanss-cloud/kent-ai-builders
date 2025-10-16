import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

async function main() {
  const prisma = new PrismaClient();
  const email = process.env.SEED_EMAIL || "customer@test.com";
  const pwd   = process.env.SEED_PASS  || "Test12345!";
  const name  = process.env.SEED_NAME  || "Test Customer";

  const passwordHash = await hash(pwd, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: { role: "CUSTOMER", passwordHash, name },
    create: { email, name, role: "CUSTOMER", passwordHash },
    select: { id: true, email: true, role: true },
  });

  console.log("✅ Upserted user:", user);
  await prisma.$disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
