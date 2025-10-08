import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();

async function main() {
  const email = process.argv[2];
  const role  = (process.argv[3] || 'ADMIN').toUpperCase();
  if (!email) {
    console.error("Usage: npx tsx prisma/grant-admin.ts <email> [ADMIN|OPS]");
    process.exit(1);
  }
  const user = await db.user.findUnique({ where: { email } });
  if (!user) {
    console.error(`No user found for ${email}`);
    process.exit(1);
  }
  const updated = await db.user.update({
    where: { email },
    data: { role: role as any },
    select: { id: true, email: true, role: true }
  });
  console.log("✅ Updated role:", updated);
}
main().finally(()=>process.exit());
