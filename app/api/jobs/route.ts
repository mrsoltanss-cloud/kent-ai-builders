import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status') ?? 'open';
  const tradeKey = searchParams.get('trade');
  const q = searchParams.get('q')?.trim();
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const take = Math.min(100, Math.max(1, parseInt(searchParams.get('take') || '20', 10)));
  const skip = (page - 1) * take;

  const where: any = { status };
  if (q) {
    where.OR = [
      { title: { contains: q, mode: 'insensitive' } },
      { summary: { contains: q, mode: 'insensitive' } },
      { postcode: { contains: q, mode: 'insensitive' } },
    ];
  }
  if (tradeKey) {
    where.trades = {
      some: { trade: { key: tradeKey } }
    };
  }

  const [items, total] = await Promise.all([
    prisma.job.findMany({
      where,
      orderBy: [{ createdAt: 'desc' }],
      skip, take,
      include: { trades: { include: { trade: true } } }
    }),
    prisma.job.count({ where })
  ]);

  return NextResponse.json({
    ok: true,
    page, take, total,
    items: items.map(j => ({
      id: j.id,
      title: j.title,
      summary: j.summary,
      postcode: j.postcode,
      status: j.status,
      priceMin: j.priceMin,
      priceMax: j.priceMax,
      trades: j.trades.map(t => ({ key: t.trade.key, label: t.trade.label }))
    }))
  });
}
