import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

async function main() {
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "owner@brixel.uk"
  await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: { role: "ADMIN", isBlocked: false, blockedAt: null, blockedReason: null },
    create: { email: ADMIN_EMAIL, name: "Site Owner", role: "ADMIN" },
  })
  console.log(`✅ Admin ensured: ${ADMIN_EMAIL}`)
}
main().catch(e => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())
