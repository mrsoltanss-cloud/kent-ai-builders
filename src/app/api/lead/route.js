export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const body = await req.json();
    if (!body?.name || !body?.phone) {
      return new Response(JSON.stringify({ ok: false, error: "Missing name or phone" }), { status: 400 });
    }

    const webhook = process.env.SHEETS_WEBHOOK_URL;
    if (!webhook) {
      return new Response(JSON.stringify({ ok: false, error: "Missing SHEETS_WEBHOOK_URL" }), { status: 500 });
    }

    const payload = {
      ...body,
      ua: req.headers.get("user-agent") || "",
      ref: req.headers.get("referer") || "",
    };

    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();
      return new Response(JSON.stringify({ ok: false, error: "Webhook failed", details: text }), { status: 500 });
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: err?.message || "Unknown error" }), { status: 500 });
  }
}
