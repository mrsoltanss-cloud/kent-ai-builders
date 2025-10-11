import { PrismaClient } from "@prisma/client";
import { randomKentPostcode } from "./lib/postcodes";
const db = new PrismaClient();

const KENT_AREAS: Record<string, number[]> = {
  CT: [1,2,3,4,5,6,7,8,9,10,11,12,14,15,16,17,18,19,20,21],
  ME: [1,2,3,4,5,6,7,8,9,10,14,15,16,17,18,19,20],
  DA: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18],
  TN: [1,2,3,4,8,9,10,11,12,13,14,15,16,17,23,24,27,28,29,30],
  BR: [8],
};
function randomKentPostcode() {
  const entries = Object.entries(KENT_AREAS);
  const [area, districts] = entries[Math.floor(Math.random() * entries.length)];
  const d = districts[Math.floor(Math.random() * districts.length)];
  const sector = Math.floor(Math.random() * 9) + 1;
  const unit = String.fromCharCode(65 + Math.floor(Math.random() * 26))
             + String.fromCharCode(65 + Math.floor(Math.random() * 26));
  return `${area}${d} ${sector}${unit}`;
}

const TITLES = [
  "Driveway pressure wash","Bathroom refit","Radiator swap & bleed","Patio + landscaping",
  "Kitchen refresh","Exterior painting 3-bed","Rear extension 3m","Loft dormer + ensuite",
  "Garden fencing repair","New consumer unit",
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

async function main() {
  const trades = [
    { key: "kitchen",  label: "Kitchen" },
    { key: "fencing",  label: "Fencing" },
    { key: "painting", label: "Painting" },
    { key: "bathroom", label: "Bathroom" },
    { key: "garden",   label: "Gardening" },
  ];
  for (const t of trades) await db.tradeTag.upsert({ where: { key: t.key }, update: {}, create: t });
  const tags = await db.tradeTag.findMany();

  const toCreate = 50;
  for (let i = 0; i < toCreate; i++) {
    const title = TITLES[i % TITLES.length];
    const summary = SUMMARIES[i % SUMMARIES.length];
    const priceMin = 800 + Math.round(Math.random() * 2200);
    const priceMax = priceMin + 800 + Math.round(Math.random() * 2200);
    const tier = (["STANDARD","QUICKWIN","STANDARD","PRIORITY"] as const)[i % 4];
    const cap = [3,4,5][i % 3];

    const job = await db.job.create({
      data: {
        title, summary,
        postcode: randomKentPostcode(),
        priceMin, priceMax, tier: tier as any,
        status: "OPEN", views: Math.round(Math.random() * 6),
        contactUnlocks: 0, allocCap: cap, aiSeeded: true,
        createdAt: new Date(Date.now() - Math.round(Math.random() * 36) * 3600 * 1000),
        visibleUntil: null, filledAt: null,
      },
    });

    const tag = tags[i % tags.length];
    await db.jobTradeTag.create({ data: { jobId: job.id, tradeId: tag.id } });
  }
  console.log(`Seed complete. Added ${toCreate} jobs with Kent postcodes.`);
}
main().finally(() => db.$disconnect());
