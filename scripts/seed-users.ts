import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function upsertUser(email: string, role: Role, name: string, plainPassword: string) {
  const hashed = await bcrypt.hash(plainPassword, 10);
  await db.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name,
      role,
      password: hashed, // NOTE: using `password` (mapped), not `passwordHash`
    },
  });
}

async function main() {
  const defaultPass = process.env.SEED_PASSWORD || "Password123!";
  await upsertUser("admin@brixel.uk", Role.ADMIN, "Admin", defaultPass);
  await upsertUser("home@brixel.uk", Role.HOMEOWNER, "Home Owner", defaultPass);
  await upsertUser("trader@brixel.uk", Role.TRADER, "Pro Trader", defaultPass);
  console.log("Seeded users with password:", defaultPass);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
