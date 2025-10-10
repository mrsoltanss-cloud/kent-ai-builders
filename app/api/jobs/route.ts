import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

const toInt = (v?: string | null) => (v && v.trim() ? Number(v) : null);

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q          = url.searchParams.get("q") || "";
  const tradeKey   = url.searchParams.get("trade") || "";
  const tier       = url.searchParams.get("tier") || "";
  const onlyNew    = url.searchParams.get("new") === "1";
  const minBudget  = toInt(url.searchParams.get("min"));
  const maxBudget  = toInt(url.searchParams.get("max"));
  const sort       = (url.searchParams.get("sort") || "new").toLowerCase(); // new|budget|slots
  const limit      = Math.min(Number(url.searchParams.get("limit") || 50), 100);

  const where: any = { status: "OPEN" as const };
  if (tier) where.tier = tier;
  if (minBudget != null || maxBudget != null) {
    where.AND = [
      minBudget != null ? { priceMin: { gte: minBudget } } : {},
      maxBudget != null ? { priceMax: { lte: maxBudget } } : {},
    ];
  }
  if (q) {
    where.OR = [
      { title:   { contains: q, mode: "insensitive" } },
      { summary: { contains: q, mode: "insensitive" } },
      { postcode:{ contains: q, mode: "insensitive" } },
    ];
  }
  if (tradeKey) where.trades = { some: { trade: { key: tradeKey } } };

  const jobs = await db.job.findMany({
    where,
    orderBy: [{ createdAt: "desc" }], // default backing order
    take: limit,
    include: { trades: { include: { trade: true } } },
  });

  let items = jobs.map(j => {
    const cap = j.allocCap ?? 3;
    const introduced = j.contactUnlocks ?? 0;
    return {
      id: j.id,
      title: j.title,
      summary: j.summary,
      postcode: j.postcode,
      priceMin: j.priceMin,
      priceMax: j.priceMax,
      tier: j.tier,
      status: j.status,
      views: j.views,
      contactUnlocks: introduced,
      allocCap: cap,
      isNew: introduced === 0,
      allocationFull: introduced >= cap,
      trades: j.trades.map(t => t.trade.label),
      createdAt: j.createdAt, // Date ok; we cast when sorting
    };
  });

  if (onlyNew) items = items.filter(i => i.isNew);

  // client-friendly sorts
  if (sort === "budget") {
    items.sort((a, b) => (b.priceMax ?? 0) - (a.priceMax ?? 0));
  } else if (sort === "slots") {
    const slots = (x: any) => (x.allocCap ?? 0) - (x.contactUnlocks ?? 0);
    items.sort((a, b) => slots(b) - slots(a));
  } else {
    items.sort((a, b) => new Date(b.createdAt as any).getTime() - new Date(a.createdAt as any).getTime());
  }

  return NextResponse.json({ items });
}
