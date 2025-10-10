import { db } from "../lib/prisma";

const now = () => new Date();
const addHours = (d: Date, h: number) => new Date(d.getTime() + h * 3600 * 1000);

const JOBS_MIN = Number(process.env.JOBS_MIN ?? 50);
const JOBS_MAX = Number(process.env.JOBS_MAX ?? 100);

// --- simple random content used for top-ups ---
const TITLES = [
  "Kitchen refresh","Fence + gate replacement","Exterior painting 3-bed","Bathroom refit",
  "Loft insulation top-up","Garden patio relaying","Radiator swap & bleed",
  "Laminate flooring install","Internal doors hanging","Garden shed rebuild",
  "Plaster patching & paint","Driveway pressure wash",
];
const SUMMARIES = [
  "Straightforward job with clear scope. Join shortlist for details.",
  "Quick turnaround. Materials available on request.",
  "Standard spec — tidy finish important.",
];
const POSTCODES = ["SE1 1AA","BR3 2AD","CT2 1AB","ME14 1XX"];

async function topUpOpenJobs(min = JOBS_MIN, max = JOBS_MAX) {
  const openCount = await db.job.count({ where: { status: "OPEN" } });

  // Only top up when we're below the floor; keep the pool between [min, max]
  if (openCount >= min) return 0;

  // Target the floor (simple + predictable). Change to random in [min,max] if you want variance.
  const target = min;
  const toCreate = Math.max(0, target - openCount);
  if (toCreate === 0) return 0;

  const trades = [
    { key: "kitchen",  label: "Kitchen" },
    { key: "fencing",  label: "Fencing" },
    { key: "painting", label: "Painting" },
    { key: "bathroom", label: "Bathroom" },
    { key: "garden",   label: "Gardening" },
  ];
  for (const t of trades) {
    await db.tradeTag.upsert({ where: { key: t.key }, update: {}, create: t });
  }
  const tags = await db.tradeTag.findMany();

  for (let i = 0; i < toCreate; i++) {
    const title = TITLES[i % TITLES.length];
    const summary = SUMMARIES[i % SUMMARIES.length];
    const priceMin = 800 + Math.round(Math.random() * 2200);
    const priceMax = priceMin + 800 + Math.round(Math.random() * 2200);
    const tier = (["STANDARD","QUICKWIN","STANDARD","PRIORITY"] as const)[i % 4];
    const cap = [3,4,5][i % 3];

    const job = await db.job.create({
      data: {
        title,
        summary,
        postcode: POSTCODES[i % POSTCODES.length],
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

    const tag = tags[i % tags.length];
    await db.jobTradeTag.create({ data: { jobId: job.id, tradeId: tag.id } });
  }
  return toCreate;
}

function hoursSince(d: Date) {
  return (now().getTime() - d.getTime()) / 3600000;
}

// Return true if this job is allowed to receive *another* intro at this age,
// so we roughly pace to a max of ~72h to fill
function allowIntroByAge(ageHrs: number, currentIntros: number, cap: number) {
  // Gentle ramp: 0h-1h none, 1-8h allow up to 1, 8-24h up to 2, 24-48h up to 3, 48-72h up to cap
  const maxAllowed =
    ageHrs < 1 ? 0 :
    ageHrs < 8 ? 1 :
    ageHrs < 24 ? 2 :
    ageHrs < 48 ? 3 :
    cap;

  return currentIntros < Math.min(maxAllowed, cap);
}

async function autoFillAiSlots() {
  // Oldest first so older jobs get filled before newer ones
  const open = await db.job.findMany({
    where: { status: "OPEN", aiSeeded: true },
    select: { id: true, contactUnlocks: true, allocCap: true, createdAt: true, tier: true },
    orderBy: { createdAt: "asc" },
    take: 100, // look at a reasonable window
  });

  // Pick exactly ONE candidate per run (trickle)
  let picked: string | null = null;

  for (const j of open) {
    const cap = (j.allocCap ?? 3);
    const intros = (j.contactUnlocks ?? 0);
    if (intros >= cap) continue;
    const age = hoursSince(j.createdAt);
    if (!allowIntroByAge(age, intros, cap)) continue;

    picked = j.id;
    break;
  }

  if (picked) {
    await db.job.update({ where: { id: picked }, data: { contactUnlocks: { increment: 1 } } });
    return 1;
  }
  return 0;
}

async function markFilled() {
  // any OPEN with at least 1 intro and a positive cap (close when at cap)
  const fullOpen = await db.job.findMany({
    where: {
      status: "OPEN",
      contactUnlocks: { gte: 1 },
      allocCap: { gt: 0 },
    },
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
        data: {
          status: "CLOSED",
          filledAt: f,
          visibleUntil: addHours(f, 72),
        },
      });
      updated++;
    }
  }
  return updated;
}

async function closeExpired() {
  // Listing already hides CLOSED with visibleUntil <= now(); keep for archival
  return 0;
}

async function dripViews(max = 10) {
  const sample = await db.job.findMany({
    where: {
      OR: [
        { status: "OPEN" },
        { AND: [{ status: "CLOSED" }, { visibleUntil: { gt: now() } }] },
      ],
    },
    select: { id: true },
    orderBy: { createdAt: "desc" },
    take: max,
  });
  for (const j of sample) {
    await db.job.update({ where: { id: j.id }, data: { views: { increment: 1 } } });
  }
  return sample.length;
}

async function main() {
  const a = await topUpOpenJobs();
  const b = await autoFillAiSlots();
  const c = await markFilled();
  const d = await closeExpired();
  const e = await dripViews(15);
  console.log(JSON.stringify({ toppedUp:a, autoFilled:b, newlyFilled:c, expiredClosed:d, viewsDripped:e }));
}

main().finally(() => db.$disconnect());
