import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { service, postcode, urgency, details } = body || {};

    // Compose a richer prompt (your OpenAI client/config can live elsewhere)
    const prompt = `
You are an estimator for UK domestic building works. Provide a realistic price range in GBP for:
Service: ${service}
Postcode: ${postcode}
Timing: ${urgency}
Details: ${JSON.stringify(details || {}, null, 2)}
Guidelines: include labour, materials, VAT typical; note assumptions and exclusions in a short bullet list. Keep it concise.`;

    // Stub response to keep server running without external calls.
    // Replace with your OpenAI call if already implemented elsewhere.
    const estimate = {
      low: 5000,
      high: 12000,
      notes: [
        "Range varies by spec, access, and finishes.",
        "Final quote subject to site survey."
      ],
      promptUsed: prompt.trim()
    };

    return NextResponse.json(estimate, { status: 200 });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
