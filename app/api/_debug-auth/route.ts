import { NextResponse } from "next/server";

function parse(raw?: string|null) {
  if (!raw) return [];
  return raw.split(/[\n,]/g).map(s=>s.trim()).filter(Boolean);
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const probe = (url.searchParams.get("email") || "").trim().toLowerCase();

  const rawList = process.env.ADMIN_LOGIN_EMAILS || "";
  const list = parse(rawList).map(x => x.toLowerCase());
  const passLen = (process.env.ADMIN_PASSWORD || "").length;

  return NextResponse.json({
    runtime: process.env.VERCEL ? "vercel" : "local",
    nodeEnv: process.env.NODE_ENV || null,
    nextauthUrl: process.env.NEXTAUTH_URL || null,
    whitelistCount: list.length,
    whitelistPreview: list.slice(0, 5), // first few entries (not secret)
    adminPasswordConfigured: passLen > 0,
    adminPasswordLength: passLen,       // length only, no value
    probe: probe || null,
    probeIsWhitelisted: probe ? list.includes(probe) : null,
  });
}
