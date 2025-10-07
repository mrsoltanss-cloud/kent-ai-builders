export const dynamic = "force-dynamic";

export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const url = process.env.SHEETS_WEBHOOK_URL;
  if (!url) {
    return new Response(JSON.stringify({ ok: false, error: "SHEETS_WEBHOOK_URL missing" }), { status: 500 });
  }
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, ts: new Date().toISOString(), source: "brixel.uk" }),
    });
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: String(e) }), { status: 500 });
  }
}
