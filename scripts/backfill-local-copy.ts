import { db } from "../lib/prisma";
import { generateSummary, generateDescription } from "./lib/text-local";

const BATCH = parseInt(process.env.COPY_BATCH || "50", 10);
// Comma list of fields to (re)build: summary,description
const FIELDS = (process.env.COPY_FIELDS || "summary,description")
  .split(",")
  .map(s => s.trim().toLowerCase())
  .filter(Boolean);
const FORCE = process.env.COPY_FORCE === "1";

async function tradesFor(jobId: string): Promise<string[]> {
  const links = await db.jobTradeTag.findMany({
    where: { jobId },
    include: { trade: true },
  });
  return links.map(l => l.trade.label);
}

async function main() {
  const needAny = await db.job.findMany({
    where: {
      OR: [
        FIELDS.includes("summary") ? { summary: FORCE ? { not: undefined } : null } : undefined,
        FIELDS.includes("description") ? { description: FORCE ? { not: undefined } : null } : undefined,
      ].filter(Boolean) as any,
    },
    select: {
      id: true, title: true, postcode: true, priceMin: true, priceMax: true,
      summary: true, description: true,
    },
    orderBy: { createdAt: "desc" },
    take: BATCH,
  });

  let updated = 0, skipped = 0;

  for (const j of needAny) {
    const trades = await tradesFor(j.id);
    const inputs = { title: j.title, postcode: j.postcode, priceMin: j.priceMin, priceMax: j.priceMax, trades };
    const data: any = {};

    if (FIELDS.includes("summary") && (FORCE || !j.summary)) {
      data.summary = generateSummary(j.id, inputs);
    }
    if (FIELDS.includes("description") && (FORCE || !j.description)) {
      data.description = generateDescription(j.id, inputs);
    }

    if (Object.keys(data).length) {
      await db.job.update({ where: { id: j.id }, data });
      updated++;
    } else {
      skipped++;
    }
  }

  console.log(JSON.stringify({ scanned: needAny.length, updated, skipped, fields: FIELDS, batch: BATCH, force: FORCE }));
}

main().finally(() => db.$disconnect());
