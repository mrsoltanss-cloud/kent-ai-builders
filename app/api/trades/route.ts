import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function GET() {
  const trades = await db.tradeTag.findMany({
    orderBy: { label: "asc" },
    select: { key: true, label: true },
  });
  return NextResponse.json({ items: trades });
}
