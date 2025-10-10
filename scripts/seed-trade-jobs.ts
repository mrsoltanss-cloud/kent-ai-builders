import { db } from "../lib/prisma";

const TITLES = [
  "Kitchen refresh",
  "Fence + gate replacement",
  "Exterior painting 3-bed",
  "Bathroom refit",
  "Loft insulation top-up",
  "Garden patio relaying",
];

const SUMMARIES = [
  "Short, fast-turnaround task. Join the shortlist to be put forward to the homeowner.",
  "Everyday job. Join the shortlist to be put forward to the homeowner.",
];

const POSTCODES = ["SE1 1AA", "BR3 2AD", "CT2 1AB", "ME14 1XX"];

async function main() {
  // seed trades idempotently
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

  // top up to 50 OPEN jobs
  const existing = await db.job.count({ where: { status: "OPEN" } });
  const toCreate = Math.max(0, 50 - existing);

  for (let i = 0; i < toCreate; i++) {
    const title = TITLES[i % TITLES.length];
    const summary = SUMMARIES[i % SUMMARIES.length];
    const priceMin = 800 + Math.round(Math.random() * 2200);
    const priceMax = priceMin + 800 + Math.round(Math.random() * 2200);
    const tier = (["STANDARD", "QUICKWIN", "STANDARD", "PRIORITY"] as const)[i % 4];
    const cap = [3, 4, 5][i % 3];

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
      },
    });

    const tag = tags[i % tags.length];
    await db.jobTradeTag.create({ data: { jobId: job.id, tradeId: tag.id } });
  }

  console.log(`Seed complete. Added ${toCreate} job(s).`);
}

main().finally(() => db.$disconnect());
