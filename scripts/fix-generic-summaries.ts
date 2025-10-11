/* eslint-disable no-console */
import "dotenv/config";
import { prisma } from "@/src/lib/prisma";
import OpenAI from "openai";

const DRY_RUN = process.argv.includes("--dry");
const LIMIT = Number(process.env.FIX_LIMIT ?? 50);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

function looksBad(s: string) {
  if (!s) return true;
  const trimmed = s.trim();
  if (trimmed.length < 30) return true;
  if (/^straightforward job with clear scope/i.test(trimmed)) return true;
  return false;
}

function fallbackSummary(job: any) {
  const svc = job.title ?? job.service ?? "trade job";
  const area = job.postcode ? ` (${job.postcode})` : "";
  return `Thanks! We’ve recorded your ${svc}${area}. A pro will review details and contact you shortly to confirm scope, timings, and pricing.`;
}

function buildPrompt(job: any) {
  const lines: string[] = [];
  lines.push("You are an expert copywriter for a home-services marketplace.");
  lines.push("Write ONE short, friendly paragraph summarizing the customer’s job request.");
  lines.push("Avoid generic boilerplate. Be specific, concise, and natural.");
  lines.push("");
  const add = (k: string, v: any) => {
    if (v === undefined || v === null || v === "") return;
    lines.push(`${k}: ${v}`);
  };
  add("Title", job.title);
  add("Postcode", job.postcode);
  add("PayRange", `${job.priceMin ?? ""}${job.priceMax ? `–${job.priceMax}` : ""}`);
  add("Description", job.description ?? job.summary ?? "");
  lines.push("");
  lines.push("Return only the single paragraph.");
  return lines.join("\n");
}

async function callOpenAI(prompt: string) {
  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2,
  });
  return res.choices[0]?.message?.content ?? "";
}

async function regenerateForJob(job: any): Promise<string> {
  let attempt = 0;
  let lastErr: any = null;

  while (attempt < 2) {
    try {
      const draft = await callOpenAI(buildPrompt(job));
      if (!looksBad(draft)) return draft;
    } catch (e) {
      lastErr = e;
      break;
    }
    attempt++;
  }

  if (process.env.DEBUG_FALLBACK && lastErr) {
    console.warn("LLM fallback:", (lastErr as any)?.message ?? lastErr);
  }
  return fallbackSummary(job);
}

async function main() {
  const badPhrase = "Straightforward job with clear scope";

  // Candidates: phrase OR null/empty
  const candidates = await prisma.job.findMany({
    where: {
      OR: [
        { summary: { contains: badPhrase, mode: "insensitive" } },
        { summary: { equals: null } },
        { summary: { equals: "" } },
      ],
    },
    orderBy: { updatedAt: "desc" },
    take: LIMIT,
    select: {
      id: true,
      title: true,
      description: true,
      summary: true,
      postcode: true,
      priceMin: true,
      priceMax: true,
      filledAt: true,
      updatedAt: true,
      visibleUntil: true,
      status: true,
      tier: true,
    },
  });

  // Also pick very short summaries
  const shorties = await prisma.job.findMany({
    where: {
      summary: { not: null },
      AND: [{ summary: { lt: "                              " } }],
    },
    orderBy: { updatedAt: "desc" },
    take: Math.max(0, LIMIT - candidates.length),
    select: {
      id: true,
      title: true,
      description: true,
      summary: true,
      postcode: true,
      priceMin: true,
      priceMax: true,
    },
  });

  const seen = new Set<string>();
  const jobs: any[] = [];
  [...candidates, ...shorties].forEach((j) => {
    if (!seen.has(j.id)) {
      seen.add(j.id);
      jobs.push(j);
    }
  });

  if (jobs.length === 0) {
    console.log(JSON.stringify({ scanned: 0, updated: 0, reason: "no-candidates" }));
    return;
  }

  let updated = 0;
  for (const job of jobs) {
    const newSummary = await regenerateForJob(job);
    if (DRY_RUN) {
      console.log(JSON.stringify({ dryRun: true, id: job.id, preview: newSummary.slice(0, 160) }));
      continue;
    }
    await prisma.job.update({
      where: { id: job.id },
      data: { summary: newSummary, updatedAt: new Date() },
    });
    updated++;
    console.log(JSON.stringify({ id: job.id, updated: true }));
  }

  console.log(JSON.stringify({ scanned: jobs.length, updated, limit: LIMIT }));
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
