import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();

async function main() {
  const email = process.argv[2];
  const name  = process.argv[3] || 'Admin';
  if (!email) {
    console.error('Usage: npx tsx prisma/upsert-admin.ts <email> [name]');
    process.exit(1);
  }
  const updated = await db.user.upsert({
    where: { email },
    update: { role: 'ADMIN' as any, name },
    create: { email, name, role: 'ADMIN' as any },
    select: { id: true, email: true, role: true, name: true, createdAt: true },
  });
  console.log('✅ Admin ensured:', updated);
}
main().finally(()=>process.exit());
