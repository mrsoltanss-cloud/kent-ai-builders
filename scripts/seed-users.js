const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const db = new PrismaClient();

async function upsertUser(email, password, role, name) {
  const hashed = password ? await bcrypt.hash(password, 10) : null;
  return db.user.upsert({
    where: { email },
    update: {},
    create: { email, password: hashed, role, name },
  });
}

async function main() {
  await upsertUser('admin@brixel.uk','admin123','ADMIN','Admin');
  await upsertUser('home@brixel.uk','home123','HOMEOWNER','Home Owner');
  await upsertUser('trader@brixel.uk','trader123','TRADER','Pro Trader');
  console.log('Seeded users with roles.');
}

main().catch(e=>{console.error(e);process.exit(1)}).finally(()=>db.$disconnect());
