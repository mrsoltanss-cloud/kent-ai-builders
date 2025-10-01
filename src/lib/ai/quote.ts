export type QuoteParams = {
  service: string;
  rooms?: number;
  areaSqm?: number;
  quality?: "basic" | "standard" | "premium"; // kept for backward compat
  postcode?: string;

  // New structured inputs
  propertyType?: "DETACHED" | "SEMI" | "TERRACE" | "FLAT" | "BUNGALOW" | "OTHER";
  ageBand?: "PRE_1950" | "Y1950_2000" | "POST_2000" | "UNKNOWN";
  structuralChanges?: boolean;
  finishLevel?: "BASIC" | "STANDARD" | "PREMIUM";
  accessLevel?: "GOOD" | "LIMITED" | "SCAFFOLD_LIKELY";
  parking?: boolean;
  planning?: "APPROVED" | "PENDING" | "NOT_REQUIRED" | "UNSURE";
  urgency?: "ASAP" | "M1_3" | "M3_6" | "FLEXIBLE";

  notes?: string;
};

type QuoteRange = { low: number; high: number; currency: "GBP" };

/** Heuristic fallback (tuned with new signals) */
function fallbackQuote(p: QuoteParams): QuoteRange {
  // Base by area or room count or flat base
  let base =
    (p.areaSqm ? p.areaSqm * 1200 : 0) ||
    (p.rooms ? p.rooms * 6000 : 0) ||
    6000;

  // Service coarse adjustments
  const s = (p.service || "").toLowerCase();
  if (s.includes("loft")) base *= 1.15;
  if (s.includes("extension")) base *= 1.2;
  if (s.includes("repoint")) base *= 0.6;
  if (s.includes("bathroom")) base *= 0.9;
  if (s.includes("kitchen")) base *= 1.05;

  // Finish level / quality
  const finish = p.finishLevel || (p.quality
    ? (p.quality.toUpperCase() as QuoteParams["finishLevel"])
    : undefined);
  if (finish === "STANDARD") base *= 1.12;
  if (finish === "PREMIUM") base *= 1.35;

  // Property complexity
  if (p.propertyType === "DETACHED") base *= 1.05;
  if (p.propertyType === "FLAT") base *= 0.95; // typically smaller scope

  // Age band risk
  if (p.ageBand === "PRE_1950") base *= 1.12;
  if (p.ageBand === "Y1950_2000") base *= 1.05;

  // Structural changes
  if (p.structuralChanges) base *= 1.18;

  // Access & parking overhead
  if (p.accessLevel === "LIMITED") base *= 1.05;
  if (p.accessLevel === "SCAFFOLD_LIKELY") base *= 1.12;
  if (p.parking === false) base *= 1.03;

  // Urgency premium
  if (p.urgency === "ASAP") base *= 1.06;
  if (p.urgency === "M1_3") base *= 1.03;

  const low = Math.round(base * 0.9);
  const high = Math.round(base * 1.22);
  return { low, high, currency: "GBP" };
}

export async function getQuote(params: QuoteParams): Promise<QuoteRange> {
  if (!process.env.OPENAI_API_KEY) return fallbackQuote(params);

  try {
    const prompt = `
Act as a UK residential building estimator. Return ONLY JSON { low, high, currency:"GBP" }.
Weigh cost drivers: service, area, finish level, structural changes, access/logistics, property type/age, urgency, postcode (regional deltas).
Inputs: ${JSON.stringify(params)}
Be conservative, include typical UK labour/material rates and contingency.
`.trim();

    const r = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${process.env.OPENAI_API_KEY!}`,
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
  } catch {
    return fallbackQuote(params);
  }
}
