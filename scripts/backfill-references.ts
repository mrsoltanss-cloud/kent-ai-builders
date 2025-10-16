import { prisma } from "@/lib/prisma";

function makeRef(seedA: number, seedB: string) {
  const a = seedA.toString(36).toUpperCase().padStart(6, "0").slice(-6);
  const b = seedB.replace(/[^a-z0-9]/gi, "").slice(-6).toUpperCase();
  const raw = (a + b).slice(-8);
  return `BK-${raw.slice(0, 4)}-${raw.slice(4, 8)}`;
}

async function main() {
  const leads = await prisma.lead.findMany({
    where: { reference: null },
    select: { id: true, createdAt: true },
  });

  let ok = 0, fail = 0;
  for (const l of leads) {
    let ref = makeRef(Math.floor(l.createdAt.getTime() / 1000), l.id);
    try {
      await prisma.lead.update({ where: { id: l.id }, data: { reference: ref } });
      ok++;
    } catch {
      // try a jittered ref
      ref = makeRef(Math.floor(Date.now() / 1000) + Math.floor(Math.random() * 1000), l.id);
      try {
        await prisma.lead.update({ where: { id: l.id }, data: { reference: ref } });
        ok++;
      } catch {
        fail++;
        console.error("Failed reference for lead", l.id);
      }
    }
  }

  console.log(`Backfill complete. OK=${ok}, FAIL=${fail}`);
}

main().finally(async () => { await prisma.$disconnect(); });
