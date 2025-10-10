import { db } from "../lib/prisma";
import { aiTitle, titleHash } from "./lib/title-ai";

const BATCH = parseInt(process.env.TITLE_BATCH || "25", 10);
const FORCE = process.env.TITLE_FORCE === "1";

async function getTrades(jobId: string): Promise<string[]> {
  const links = await db.jobTradeTag.findMany({
    where: { jobId },
    include: { trade: true },
  });
  return links.map(l => l.trade.label);
}

async function main() {
  const now = new Date();
  const pick = await db.job.findMany({
    where: {
      OR: [
        { aiTitle: null },
        ...(FORCE ? [{ id: { not: "" } }] : []) // if FORCE, allow all
      ],
    },
    select: {
      id: true, title: true, postcode: true, priceMin: true, priceMax: true,
      aiTitle: true, aiTitleAt: true, aiTitleModel: true, aiTitleHash: true,
    },
    orderBy: { createdAt: "desc" },
    take: BATCH,
  });

  let updated = 0, skipped = 0;
  for (const j of pick) {
    const tradeLabels = await getTrades(j.id);
    const basis = { tradeLabels, postcode: j.postcode, priceMin: j.priceMin, priceMax: j.priceMax, existing: j.title };
    const h = titleHash(basis);

    if (!FORCE && j.aiTitleHash === h && j.aiTitle) {
      skipped++; continue;
    }

    const { title, model } = await aiTitle(basis);
    await db.job.update({
      where: { id: j.id },
      data: {
        title,                 // what users see
        aiTitle: title,        // cached
        aiTitleAt: now,
        aiTitleModel: model,
        aiTitleHash: h,
      },
    });
    updated++;
    console.log(`updated ${j.id}: "${title}"`);
  }

  console.log(JSON.stringify({ scanned: pick.length, updated, skipped, force: FORCE, batch: BATCH }));
}

main().finally(() => db.$disconnect());
