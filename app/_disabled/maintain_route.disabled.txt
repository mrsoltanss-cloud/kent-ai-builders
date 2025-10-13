import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

const HOURS = (n: number) => 1000 * 60 * 60 * n;

async function topUpJobs(target = 50) {
  const open = await db.job.count({ where: { status: "OPEN" } });
  const need = Math.max(0, target - open);
  if (!need) return 0;

  const tags = await db.tradeTag.findMany();
  const POSTCODES = ["SE1 1AA","BR3 2AD","CT2 1AB","ME14 1XX"];
  const TITLES = ["Kitchen refresh","Fence + gate replacement","Exterior painting 3-bed","Bathroom refit","Loft insulation top-up","Garden patio relaying"];

  for (let i = 0; i < need; i++) {
    const priceMin = 500 + Math.round(Math.random() * 2000);
    const priceMax = priceMin + 800 + Math.round(Math.random() * 2000);
    const tier = (["STANDARD","QUICKWIN","STANDARD","PRIORITY"] as const)[i % 4];

    const job = await db.job.create({
      data: {
        title: TITLES[i % TITLES.length],
        summary: "Everyday job. Join the shortlist to be put forward to the homeowner.",
        postcode: POSTCODES[i % POSTCODES.length],
        priceMin, priceMax,
        tier: tier as any,
        status: "OPEN",
        views: 0,
        contactUnlocks: 0,
        allocCap: [3,4,5][i % 3],
        aiSeeded: true,
      },
    });
    if (tags.length) {
      await db.jobTradeTag.create({ data: { jobId: job.id, tradeId: tags[i % tags.length].id } });
    }
  }
  return need;
}

async function markFilled() {
  const candidates = await db.job.findMany({
    where: { status: "OPEN" },
    select: { id: true, contactUnlocks: true, allocCap: true, filledAt: true }
  });
  let set = 0;
  for (const j of candidates) {
    const cap = j.allocCap ?? 3;
    const introduced = j.contactUnlocks ?? 0;
    if (introduced >= cap && !j.filledAt) {
      await db.job.update({ where: { id: j.id }, data: { filledAt: new Date() } });
      set++;
    }
  }
  return set;
}

async function closeOldFilled(hours = 72) {
  const cutoff = new Date(Date.now() - HOURS(hours));
  const old = await db.job.findMany({
    where: { status: "OPEN", filledAt: { lt: cutoff } },
    select: { id: true }
  });
  if (!old.length) return 0;
  await db.job.updateMany({ where: { id: { in: old.map(o => o.id) } }, data: { status: "CLOSED" } });
  return old.length;
}

async function dripViews(n = 10) {
  const open = await db.job.findMany({ where: { status: "OPEN" }, select: { id: true } });
  const pick = [...open].sort(() => Math.random() - 0.5).slice(0, Math.min(n, open.length));
  for (const p of pick) await db.job.update({ where: { id: p.id }, data: { views: { increment: 1 } } });
  return pick.length;
}

async function autoFillAiSlots(n = 2) {
  const open = await db.job.findMany({
    where: { status: "OPEN", aiSeeded: true },
    select: { id: true, contactUnlocks: true, allocCap: true }
  });
  const list = open.filter(j => (j.contactUnlocks ?? 0) < (j.allocCap ?? 3))
                   .sort(() => Math.random() - 0.5)
                   .slice(0, Math.min(n, open.length));
  for (const j of list) await db.job.update({ where: { id: j.id }, data: { contactUnlocks: { increment: 1 } } });
  return list.length;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") || url.searchParams.get("token") || "";
  if (!process.env.CRON_SECRET || token !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const toppedUp   = await topUpJobs(50);
  const autoFilled = await autoFillAiSlots(2);
  const newlyFilled= await markFilled();
  const closedOld  = await closeOldFilled(72);
  const viewsDripped = await dripViews(10);

  return NextResponse.json({ toppedUp, autoFilled, newlyFilled, closedOld, viewsDripped });
}
