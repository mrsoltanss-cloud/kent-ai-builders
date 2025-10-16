import { PrismaClient } from "@prisma/client";
import { hash, compare } from "bcryptjs";
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
  const fetched = await prisma.user.findUnique({ where: { email }, select: { passwordHash: true } });
  const ok = fetched?.passwordHash ? await compare(pwd, fetched.passwordHash) : false;
  console.log("✅ Upserted:", user, "| bcrypt:", ok ? "OK" : "FAIL");
  await prisma.$disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
