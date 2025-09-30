const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const db = new PrismaClient();

async function hash(p){ return bcrypt.hashSync(p, bcrypt.genSaltSync(10)); }

async function main(){
  const pass = "Password123!";
  await db.user.upsert({
    where: { email: "admin@brixel.uk" },
    update: {},
    create: { email: "admin@brixel.uk", name: "Admin", role: "ADMIN", passwordHash: await hash(pass) },
  });
  await db.user.upsert({
    where: { email: "homeowner@brixel.uk" },
    update: {},
    create: { email: "homeowner@brixel.uk", name: "Home Owner", role: "HOMEOWNER", passwordHash: await hash(pass) },
  });
  await db.user.upsert({
    where: { email: "trader@brixel.uk" },
    update: {},
    create: { email: "trader@brixel.uk", name: "Trader One", role: "TRADER", passwordHash: await hash(pass) },
  });
  console.log("✅ Seeded users with password:", pass);
  await db.$disconnect();
}
main().catch(async (e)=>{ console.error(e); await db.$disconnect(); process.exit(1); });
