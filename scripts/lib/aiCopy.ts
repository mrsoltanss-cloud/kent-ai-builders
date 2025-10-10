import OpenAI from "openai";

export type Tier = "STANDARD" | "QUICKWIN" | "PRIORITY";

const personas = [
  { key: "busy_parent",  lead: "Family bathroom needs a tidy refresh.", vibe: "friendly, practical" },
  { key: "landlord",     lead: "Rental bathroom refresh between lets.", vibe: "brief, cost-conscious" },
  { key: "meticulous",   lead: "Neat finish required — details matter.", vibe: "precise, quality-led" },
  { key: "developer",    lead: "Light refurb to standard spec.", vibe: "no-nonsense, schedule driven" },
  { key: "elderly",      lead: "Looking for patient, tidy workmanship.", vibe: "calm, considerate" },
  { key: "bargain",      lead: "Keep it sensible on budget.", vibe: "value-first, straightforward" },
  { key: "premium",      lead: "High-finish result preferred.", vibe: "polished, design-aware" },
];

const banned = [
  /exciting opportunity/i,
  /skilled tradespeople?/i,
  /showcase your expertise/i,
  /don'?t miss out/i,
  /we (are|re) (looking|seeking)/i,
  /amazing|unbeatable|exceptional|thrilled to/i,
];

function looksTooAI(text: string) {
  if (text.includes("!")) return true;
  if (banned.some((re) => re.test(text))) return true;
  return false;
}

function targetLength(tier: Tier) {
  if (tier === "QUICKWIN") return { min: 35, max: 70 };
  if (tier === "PRIORITY") return { min: 110, max: 160 };
  return { min: 70, max: 110 };
}

export async function generateHumanDescription(
  client: OpenAI,
  {
    title,
    postcode,
    priceMin,
    priceMax,
    tier,
  }: { title: string; postcode?: string | null; priceMin?: number | null; priceMax?: number | null; tier: Tier },
  tries = 3
): Promise<string> {
  const personasList = personas;
  const p = personasList[Math.floor(Math.random() * personasList.length)];
  const { min, max } = targetLength(tier);

  const sys = `You write short UK job briefs for trades. Keep it human, concrete, and natural.
Rules:
- British tone. No hype, no exclamation marks.
- 1–2 specifics (access, parking, materials supplied, work hours).
- Explain why the budget varies (finish/unknowns).
- Simple sentences. No emojis.`;

  const user = [
    `Job: ${title}`,
    postcode ? `Postcode: ${postcode}` : null,
    (priceMin && priceMax) ? `Budget range: £${priceMin.toLocaleString()}–£${priceMax.toLocaleString()}` : null,
    `Tier: ${tier}`,
    `Persona: ${p.key} (${p.vibe})`,
    `Open naturally; never "We're looking for..."`,
    `Target length: ${min}-${max} words.`,
    `Avoid phrases: ${banned.map(b=>b.source).join(", ")}`,
  ].filter(Boolean).join("\n");

  for (let i = 0; i < tries; i++) {
    const resp = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.8,
      messages: [
        { role: "system", content: sys },
        { role: "user", content: user },
      ],
    });
    let text = (resp.choices[0]?.message?.content || "").trim();
    text = text.replace(/\s+/g, " ").replace(/^"|"$/g, "");
    const wc = text.split(" ").filter(Boolean).length;

    if (!looksTooAI(text) && wc >= min && wc <= max) {
      return text.replace(/£\s*/g, "£");
    }
  }

  // Fallback: tight, neutral copy
  return `${title}. ${postcode ? `Location ${postcode}. ` : ""}${priceMin && priceMax ? `Budget £${priceMin?.toLocaleString()}–£${priceMax?.toLocaleString()}. ` : ""}Materials may be supplied; access and parking straightforward. Timing flexible.`;
}
