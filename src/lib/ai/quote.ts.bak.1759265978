type QuoteParams = {
  service: string;
  rooms?: number;
  areaSqm?: number;
  quality?: "basic" | "standard" | "premium";
  postcode?: string;
  notes?: string;
};

type QuoteRange = { low: number; high: number; currency: "GBP" };

function fallbackQuote(p: QuoteParams): QuoteRange {
  // very simple heuristic
  const base = p.areaSqm ? p.areaSqm * 1200 : 5000;
  const multiplier = p.quality === "premium" ? 1.4 : p.quality === "standard" ? 1.15 : 1.0;
  const low = Math.round(base * multiplier * 0.9);
  const high = Math.round(base * multiplier * 1.2);
  return { low, high, currency: "GBP" };
}

export async function getQuote(params: QuoteParams): Promise<QuoteRange> {
  if (!process.env.OPENAI_API_KEY) return fallbackQuote(params);

  try {
    const prompt = `
Act as a UK residential building estimator. Return ONLY a JSON object with keys: low, high, currency ("GBP").
Inputs: ${JSON.stringify(params)}
Consider UK labour/material rates and location if postcode provided. Be conservative and include contingency.
    `.trim();

    const r = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "authorization": `Bearer ${process.env.OPENAI_API_KEY!}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: prompt,
        temperature: 0.2,
      }),
    });

    if (!r.ok) throw new Error(`OpenAI error ${r.status}`);
    const data = await r.json();
    const text = data?.output_text || data?.content?.[0]?.text || "";
    const json = JSON.parse(text);
    const low = Number(json.low), high = Number(json.high);
    if (!Number.isFinite(low) || !Number.isFinite(high)) throw new Error("Invalid AI numbers");
    return { low: Math.round(low), high: Math.round(high), currency: "GBP" };
  } catch (e) {
    // graceful fallback
    return fallbackQuote(params);
  }
}
