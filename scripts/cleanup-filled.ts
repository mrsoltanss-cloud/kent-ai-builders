import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const HOURS = Number(process.env.FILLED_TTL_HOURS ?? 72);
const DRY_RUN = /^true$/i.test(process.env.DRY_RUN ?? 'false');

async function main() {
  const now = new Date();
  const cutoff = new Date(now.getTime() - HOURS * 60 * 60 * 1000);

  // Only rely on fields we know exist: filledAt, updatedAt, visibleUntil
  // Rule: if it looks filled (has a filledAt timestamp) AND it's older than cutoff
  // (or hasn't been updated since cutoff), set visibleUntil to now.
  const where: any = {
    AND: [
      { filledAt: { not: null } },
      { OR: [{ filledAt: { lte: cutoff } }, { updatedAt: { lte: cutoff } }] },
    ],
  };

  if (DRY_RUN) {
    const count = await prisma.job.count({ where });
    console.log(JSON.stringify({
      dryRun: true,
      cutoff: cutoff.toISOString(),
      wouldClose: count,
      ttlHours: HOURS
    }));
    return;
  }

  const res = await prisma.job.updateMany({
    where,
    data: { visibleUntil: now },
  });

  console.log(JSON.stringify({
    expiredClosed: res.count,
    cutoff: cutoff.toISOString(),
    ttlHours: HOURS
  }));
}

main()
  .catch((err) => { console.error(err); process.exitCode = 1; })
  .finally(async () => { await prisma.$disconnect(); });
