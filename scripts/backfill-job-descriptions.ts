import "dotenv/config";
import { db } from "../lib/prisma";
import OpenAI from "openai";
import { generateHumanDescription, type Tier } from "./lib/aiCopy";

const FIELD = (process.env.JOB_DESCRIPTION_FIELD || "description").toLowerCase(); // "description" or "summary"
const BATCH = Number(process.env.DESCR_BATCH || "25");
const FORCE  = String(process.env.DESCR_FORCE || "false").toLowerCase() === "true";

function whereForField() {
  if (FIELD === "summary") {
    return FORCE
      ? { status: "OPEN" as const, aiSeeded: true }
      : { status: "OPEN" as const, aiSeeded: true, OR: [{ summary: null }, { summary: "" }] };
  }
  return FORCE
    ? { status: "OPEN" as const, aiSeeded: true }
    : { status: "OPEN" as const, aiSeeded: true, OR: [{ description: null }, { description: "" }] };
}

async function main() {
  if (!process.env.OPENAI_API_KEY) {
    console.error("OPENAI_API_KEY not set.");
    process.exit(1);
  }
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const jobs = await db.job.findMany({
    where: whereForField(),
    orderBy: { createdAt: "desc" },
    take: BATCH,
    select: {
      id: true, title: true, postcode: true, priceMin: true, priceMax: true, tier: true,
      summary: true, description: true,
    },
  });

  if (!jobs.length) {
    console.log(JSON.stringify({ processed: 0, note: "nothing to do", field: FIELD, force: FORCE }));
    return;
  }

  let updated = 0, failed = 0;
  for (const j of jobs) {
    try {
      if (!FORCE) {
        if (FIELD === "summary" && j.summary?.trim()) continue;
        if (FIELD === "description" && j.description?.trim()) continue;
      }
      const text = await generateHumanDescription(client, {
        title: j.title,
        postcode: j.postcode,
        priceMin: j.priceMin ?? undefined,
        priceMax: j.priceMax ?? undefined,
        tier: (j.tier as Tier) || "STANDARD",
      });
      await db.job.update({ where: { id: j.id }, data: { [FIELD]: text } as any });
      updated++; console.log("update-ok", j.id);
    } catch (err: any) {
      failed++; console.error("update-failed", j.id, err?.name || "Error", err?.message || String(err));
    }
  }
  console.log(JSON.stringify({ picked: jobs.length, updated, failed, field: FIELD, force: FORCE }));
}

main().finally(() => db.$disconnect());
