import { NextRequest, NextResponse } from "next/server";

function normalizeUK(raw?: string | null) {
  if (!raw) return null;
  const d = raw.replace(/\D/g, "");
  if (!d) return null;
  if (d.startsWith("0")) return `44${d.slice(1)}`; // 0xxxx -> 44xxxx
  return d;
}

export async function GET(req: NextRequest) {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
  const n = normalizeUK(phone);
  const { searchParams } = new URL(req.url);
  const text = searchParams.get("text") || "Hi Brixel — I’d like to chat about a job.";
  const url = n ? `https://wa.me/${n}?text=${encodeURIComponent(text)}` : "https://wa.me/";
  return NextResponse.redirect(url, 302);
}
