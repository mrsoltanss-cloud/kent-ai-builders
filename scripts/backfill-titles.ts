import { PrismaClient } from "@prisma/client";
import { generateJobSummary, needsRewrite } from "./summary-utils";

const prisma = new PrismaClient();
const BATCH = Number(process.env.TITLE_BATCH || 25);

async function main() {
  const jobs = await prisma.job.findMany({
    where: {
      // tweak to your schema/flags as needed:
      OR: [
        { summary: null },
        { summary: "" },
      ],
    },
    orderBy: { updatedAt: "desc" },
    take: BATCH,
  });

  let scanned = 0, updated = 0, skipped = 0;

  for (const job of jobs) {
    scanned++;
    const shouldRewrite = needsRewrite(job.summary);
    if (!shouldRewrite) { skipped++; continue; }

    const payload = {
      title: job.title ?? "Role",
      company: job.company ?? "Company",
      location: job.postcode ?? job.location ?? "UK",
      scope: job.description ?? "",
      requirements: [],    // map from your fields if you have them
      tools: [],           // map from your fields if you have them
      salary: (job as any).salary ?? "",       // adjust to your schema
      contractType: (job as any).contractType ?? "",
      perks: [],           // e.g. benefits array
    };

    const { summary, rejected } = await generateJobSummary(payload);
    if (!rejected) {
      await prisma.job.update({
        where: { id: job.id },
        data: { summary, updatedAt: new Date() },
      });
      updated++;
    } else {
      skipped++;
    }
  }

  console.log(JSON.stringify({ scanned, updated, skipped, batch: BATCH, force: false }));
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
