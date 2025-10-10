import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

const now = () => new Date();
const addHours = (d: Date, h: number) => new Date(d.getTime() + h * 3600_000);

/** Kent postcode generator (CT, ME, DA, TN + BR8 edge) */
const KENT_AREAS: Record<string, number[]> = {
  CT: [1,2,3,4,5,6,7,8,9,10,11,12,14,15,16,17,18,19,20,21],
  ME: [1,2,3,4,5,6,7,8,9,10,14,15,16,17,18,19,20],
  DA: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18],
  TN: [1,2,3,4,8,9,10,11,12,13,14,15,16,17,23,24,27,28,29,30],
  BR: [8], // Swanley/BR8 touches Kent
};
function randomKentPostcode() {
  const entries = Object.entries(KENT_AREAS);
  const [area, districts] = entries[Math.floor(Math.random() * entries.length)];
  const d = districts[Math.floor(Math.random() * districts.length)];
  const sector = Math.floor(Math.random() * 9) + 1;  // 1-9
  const unit = String.fromCharCode(65 + Math.floor(Math.random() * 26))
             + String.fromCharCode(65 + Math.floor(Math.random() * 26));
  return `${area}${d} ${sector}${unit}`;
}

const TITLES = [
  "Driveway pressure wash",
  "Bathroom refit",
  "Radiator swap & bleed",
  "Patio + landscaping",
  "Kitchen refresh",
  "Exterior painting 3-bed",
  "Rear extension 3m",
  "Loft dormer + ensuite",
  "Garden fencing repair",
  "New consumer unit",
];
const SUMMARIES = [
  "Standard spec — tidy finish important.",
  "Straightforward job with clear scope. Join shortlist for details.",
  "30sqm patio + borders.",
  "Units, worktops, light electrics.",
  "Prep and repaint front + back.",
  "Foundations, brick/block, roof, bi-fold.",
  "Structural, first/second fix.",
  "Replace broken panels, reset posts.",
  "EICR follow-up; CU upgrade.",
];

async function topUpOpenJobs(target = 100) {
  const count = await db.job.count({ where: {
    OR: [
      { status: "OPEN" },
      { AND: [{ status: "CLOSED" }, { visibleUntil: { gt: now() } }] }
    ]
  }});
  const toCreate = Math.max(0, target - count);
  if (toCreate === 0) return 0;

  for (let i = 0; i < toCreate; i++) {
    const title = TITLES[i % TITLES.length];
    const summary = SUMMARIES[i % SUMMARIES.length];
    const priceMin = 800 + Math.round(Math.random() * 2200);
    const priceMax = priceMin + 800 + Math.round(Math.random() * 2200);
    const tier = (["STANDARD","QUICKWIN","STANDARD","PRIORITY"] as const)[i % 4];
    const cap = [3,4,5][i % 3];

    await db.job.create({
      data: {
        title,
        summary,
        postcode: randomKentPostcode(),
        priceMin,
        priceMax,
        tier: tier as any,
        status: "OPEN",
        views: Math.round(Math.random() * 6),
        contactUnlocks: 0,
        allocCap: cap,
        aiSeeded: true,
        createdAt: new Date(Date.now() - Math.round(Math.random() * 36) * 3600 * 1000),
        visibleUntil: null,
        filledAt: null,
      },
    });
  }
  return toCreate;
}

async function autoFillAiSlots(n = 2) {
  const open = await db.job.findMany({
    where: { status: "OPEN", aiSeeded: true },
    select: { id: true, contactUnlocks: true, allocCap: true }
  });
  const list = open
    .filter(j => (j.contactUnlocks ?? 0) < (j.allocCap ?? 3))
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.min(n, open.length));
  for (const j of list) {
    await db.job.update({ where: { id: j.id }, data: { contactUnlocks: { increment: 1 } } });
  }
  return list.length;
}

async function markFilled() {
  const fullOpen = await db.job.findMany({
    where: { status: "OPEN", contactUnlocks: { gte: 1 }, allocCap: { gt: 0 } },
    select: { id: true, contactUnlocks: true, allocCap: true },
  });
  let updated = 0;
  for (const j of fullOpen) {
    const cap = j.allocCap ?? 3;
    const introduced = j.contactUnlocks ?? 0;
    if (introduced >= cap) {
      const f = now();
      await db.job.update({
        where: { id: j.id },
        data: { status: "CLOSED", filledAt: f, visibleUntil: addHours(f, 72) },
      });
      updated++;
    }
  }
  return updated;
}

async function dripViews(max = 12) {
  // probabilistic, capped; looks like real browsing
  const CAP = 65;
  const pool = await db.job.findMany({
    where: {
      OR: [
        { status: "OPEN" },
        { AND: [{ status: "CLOSED" }, { visibleUntil: { gt: now() } }] },
      ],
    },
    select: { id: true, views: true },
    take: max * 3,
    orderBy: { createdAt: "desc" },
  });

  let bumped = 0;
  for (const j of pool.sort(() => Math.random() - 0.5).slice(0, max)) {
    if (Math.random() < 0.6) { // 60% chance to bump
      const next = Math.min((j.views ?? 0) + 1, CAP);
      if (next !== j.views) {
        await db.job.update({ where: { id: j.id }, data: { views: next } });
        bumped++;
      }
    }
  }
  return bumped;
}

async function closeExpired() {
  // nothing to do: UI hides CLOSED after visibleUntil
  return 0;
}

async function main() {
  const a = await topUpOpenJobs();
  const b = await autoFillAiSlots(2);
  const c = await markFilled();
  const d = await closeExpired();
  const e = await dripViews(12);
  console.log(JSON.stringify({ toppedUp:a, autoFilled:b, newlyFilled:c, expiredClosed:d, viewsDripped:e }));
}
main().finally(() => db.$disconnect());
