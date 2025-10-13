// app/api/jobs/route.ts
import { NextResponse } from 'next/server'
import { db } from '@/lib/prisma'

type JobState = 'NEW' | 'BIDDING' | 'HOT' | 'FILLED_CLOSING' | 'EXPIRING' | 'OPEN'

function priceForBid(job: any, meta: { slotsLeft: number; heatScore: number }) {
  // Base by tier
  let base =
    job.tier === 'PREMIUM' ? 5 :
    job.tier === 'QUICKWIN' ? 2 :
    3 // STANDARD/default

  // Heat/urgency nudges
  if (meta.heatScore >= 80) base += 2
  else if (meta.heatScore >= 50) base += 1

  // Scarcity nudges
  if (meta.slotsLeft <= 1) base += 1

  // Early-bird nudge down if no bids
  const bids = Number.isFinite(job.contactUnlocks) ? job.contactUnlocks : 0
  if (bids === 0) base -= 1

  // Clamp 1..9 for now
  return Math.max(1, Math.min(9, base))
}

function decorate(job: any) {
  const allocCap = Number.isFinite(job.allocCap) ? job.allocCap : 0
  const bids = Number.isFinite(job.contactUnlocks) ? job.contactUnlocks : 0
  const rawViews = Number.isFinite(job.views) ? job.views : 0
  const jitter = Math.random() < 0.35 ? 1 : 0
  const views = rawViews + jitter
  const slotsLeft = Math.max(0, allocCap - bids)

  const now = Date.now()
  const expiresInMs = job.visibleUntil
    ? Math.max(0, new Date(job.visibleUntil).getTime() - now)
    : null
  const expiresInHours = typeof expiresInMs === 'number' ? Math.ceil(expiresInMs / 36e5) : null

  let state: JobState = 'OPEN'
  let label = 'Open'
  let emoji = '🟢'

  if (bids === 0) { state = 'NEW'; label = 'NEW — be the first to contact'; emoji = '💥' }
  else if (bids > 0 && slotsLeft > 0) { state = 'BIDDING'; label = `${bids} trades in discussion`; emoji = '⚡' }
  if (views >= 150 || (bids >= 2 && slotsLeft > 0)) { state = 'HOT'; label = 'Popular — multiple trades bidding'; emoji = '🔥' }
  if (slotsLeft === 0) { state = 'FILLED_CLOSING'; label = 'Job filled — will be removed in 24h'; emoji = '🚫' }
  if (expiresInHours !== null && expiresInHours <= 24) { state = 'EXPIRING'; label = 'Expiring soon'; emoji = '⏳' }

  const heatScore = Number.isFinite(job.heatScore) ? job.heatScore : Math.round((views + bids * 50) / 10)
  const matchConfidence = Math.max(40, Math.min(98, 45 + bids * 12 + Math.floor(heatScore / 6)))
  const verifiedHomeowner = (job.tier === 'PREMIUM') || (bids >= 1 && views >= 20) || (heatScore >= 20)

  const aiSummary =
    job.aiSummary
      ? String(job.aiSummary)
      : job.summary
        ? `🤖 AI summary: ${job.summary}`
        : '🤖 AI summary: Estimated medium complexity with standard prep and typical allowances. Suitable for a small crew within 2–3 days.'

  const meta = {
    state,
    label,
    emoji,
    slotsLeft,
    expiresInHours,
    heatScore,
    matchConfidence,
    verifiedHomeowner,
  }

  const bidPrice = priceForBid(job, meta)

  return {
    ...job,
    aiSummary,
    meta: { ...meta, bidPrice },
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const sort = searchParams.get('sort') ?? 'new'
  const mode = searchParams.get('mode')
  const q = searchParams.get('q')?.trim() || ''
  const premiumOnly = searchParams.get('premiumOnly') === '1'
  const newOnly = searchParams.get('newOnly') === '1'
  const hotOnly = searchParams.get('hotOnly') === '1'
  const expiringOnly = searchParams.get('expiringOnly') === '1'
  const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '24', 10) || 24, 1), 100)
  const cursor = searchParams.get('cursor') || null
  const now = new Date()

  let orderBy: any = { createdAt: 'desc' as const }
  if (sort === 'price') orderBy = { priceMin: 'asc' as const }
  else if (sort === 'slots') orderBy = { contactUnlocks: 'asc' as const }

  const where: any = {}
  if (mode !== 'all') {
    where.OR = [
      { status: 'OPEN' },
      { AND: [{ status: 'CLOSED' }, { visibleUntil: { gt: now } }] },
    ]
  }
  if (q) {
    where.AND = (where.AND || []).concat({
      OR: [
        { title: { contains: q, mode: 'insensitive' } },
        { summary: { contains: q, mode: 'insensitive' } },
        { postcode: { contains: q, mode: 'insensitive' } },
      ],
    })
  }
  if (premiumOnly) where.AND = (where.AND || []).concat({ tier: 'PREMIUM' })

  const headers = { 'Cache-Control': 'no-store' }
  const shape = (rows: any[]) => {
    let items = (rows ?? []).map(decorate)
    if (newOnly) items = items.filter((j) => j.meta.state === 'NEW')
    if (hotOnly) items = items.filter((j) => j.meta.state === 'HOT')
    if (expiringOnly) items = items.filter((j) => j.meta.state === 'EXPIRING' || j.meta.state === 'FILLED_CLOSING')
    const nextCursor = items.length ? items[items.length - 1].id : null
    return { jobs: items, items, total: items.length, nextCursor }
  }

  try {
    const rows = await db.job.findMany({
      where,
      orderBy,
      take: limit,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    })
    if (!rows?.length && mode !== 'all' && !cursor) {
      const any = await db.job.findMany({ orderBy, take: limit })
      return NextResponse.json(shape(any), { headers })
    }
    return NextResponse.json(shape(rows), { headers })
  } catch {
    try {
      const any = await db.job.findMany({ orderBy, take: limit })
      return NextResponse.json(shape(any), { headers })
    } catch {
      return NextResponse.json({ error: 'Failed to load jobs' }, { status: 500, headers })
    }
  }
}
