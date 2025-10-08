import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();

async function main() {
  const users = await db.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: { id: true, email: true, name: true, role: true, createdAt: true },
    take: 100,
  });
  console.table(users);
}
main().finally(()=>process.exit());
