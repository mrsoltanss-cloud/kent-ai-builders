const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

(async () => {
  const email = process.argv[2] || 'test@brixel.uk';
  const pwd   = process.argv[3] || 'Test123!';
  const hash  = await bcrypt.hash(pwd, 12);

  const user = await prisma.user.upsert({
    where: { email },
    update: { password: hash, role: 'HOMEOWNER', isBlocked: false, name: 'Test User' },
    create: { email, name: 'Test User', role: 'HOMEOWNER', password: hash, isBlocked: false },
  });

  console.log('✅ User ready:', user.email, '| role:', user.role);
  console.log('   Password:', pwd);
  await prisma.$disconnect();
})().catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
