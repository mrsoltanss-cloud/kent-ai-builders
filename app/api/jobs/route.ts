import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

function num(v: string | null) {
  if (!v) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = (url.searchParams.get("q") || "").trim();
  const tradeKey = (url.searchParams.get("trade") || "").trim().toLowerCase();
  const tier = (url.searchParams.get("tier") || "").trim().toUpperCase();
  const min = num(url.searchParams.get("min"));
  const max = num(url.searchParams.get("max"));
  const notBid = url.searchParams.get("notBid") === "1";
  const fp = (url.searchParams.get("fp") || "").trim();

  const limit = Math.min(Math.max(Number(url.searchParams.get("limit") || "50"), 1), 200);
  const sort = (url.searchParams.get("sort") || "new").toLowerCase();

  // Base: OPEN + CLOSED but still visible (72h window you added)
  const now = new Date();

  // Pull a slightly larger working set to allow server-side filtering without missing entries.
  const baseTake = Math.max(limit * 2, 200);

  // Sort mapping
  let orderBy:
    | { createdAt: "desc" | "asc" }
    | { priceMax: "desc" | "asc" }
    | { contactUnlocks: "asc" | "desc" } = { createdAt: "desc" };

  if (sort === "budget") orderBy = { priceMax: "desc" };
  else if (sort === "slots") orderBy = { contactUnlocks: "asc" };

  const jobs = await db.job.findMany({
    where: {
      OR: [
        { status: "OPEN" },
        { AND: [{ status: "CLOSED" }, { visibleUntil: { gt: now } }] },
      ],
    },
    orderBy,
    take: baseTake,
    select: {
      id: true,
      title: true,
      summary: true,
      description: true,
      postcode: true,
      priceMin: true,
      priceMax: true,
      tier: true,
      status: true,
      views: true,
      contactUnlocks: true,
      allocCap: true,
      createdAt: true,
      visibleUntil: true,
    },
  });

  const ids = jobs.map(j => j.id);

  // Load job->trade keys (via join table)
  // We avoid assuming field names on the Job model; we query the join table directly.
  const jt = await db.jobTradeTag.findMany({
    where: { jobId: { in: ids } },
    select: { jobId: true, trade: { select: { key: true, label: true, id: true } } },
  });

  const jobToTrades = new Map<string, { key: string; label: string }[]>();
  for (const r of jt) {
    if (!r.trade) continue;
    const arr = jobToTrades.get(r.jobId) || [];
    arr.push({ key: r.trade.key, label: r.trade.label });
    jobToTrades.set(r.jobId, arr);
  }

  // If notBid is requested, collect jobIds already introduced by this fingerprint and exclude.
  let bidJobIds = new Set<string>();
  if (notBid && fp) {
    const intros = await db.jobIntro.findMany({
      where: { fingerprint: fp, jobId: { in: ids } },
      select: { jobId: true },
    });
    bidJobIds = new Set(intros.map(i => i.jobId));
  }

  // Optional trade filter -> resolve tradeId(s) by key so we filter precisely
  let allowedJobIdsByTrade: Set<string> | null = null;
  if (tradeKey) {
    const t = await db.tradeTag.findUnique({ where: { key: tradeKey }, select: { id: true } });
    if (t?.id) {
      const rows = await db.jobTradeTag.findMany({
        where: { tradeId: t.id, jobId: { in: ids } },
        select: { jobId: true },
      });
      allowedJobIdsByTrade = new Set(rows.map(r => r.jobId));
    } else {
      // no matching trade -> no results
      return NextResponse.json({ items: [] });
    }
  }

  // In-memory filter pass (cheap: we already have a trimmed working set)
  const filtered = jobs.filter(j => {
    if (notBid && fp && bidJobIds.has(j.id)) return false;

    if (tradeKey && allowedJobIdsByTrade && !allowedJobIdsByTrade.has(j.id)) return false;

    if (tier && j.tier !== tier) return false;

    if (min != null && (j.priceMax ?? 0) < min) return false;
    if (max != null && (j.priceMin ?? 0) > max) return false;

    if (q) {
      const hay = [
        j.title || "",
        j.summary || "",
        j.description || "",
        j.postcode || "",
        ...(jobToTrades.get(j.id)?.map(t => `${t.key} ${t.label}`) || []),
      ]
        .join(" ")
        .toLowerCase();
      if (!hay.includes(q.toLowerCase())) return false;
    }

    return true;
  });

  // Decorate with trade tags
  const items = filtered.slice(0, limit).map(j => ({
    ...j,
    trades: jobToTrades.get(j.id) || [],
    slotsLeft: Math.max(0, (j.allocCap ?? 3) - (j.contactUnlocks ?? 0)),
    isFirstContact: (j.contactUnlocks ?? 0) === 0 && j.status === "OPEN",
  }));

  return NextResponse.json({ items });
}
