import OpenAI from "openai";
import crypto from "crypto";

const MODEL = process.env.OPENAI_TITLE_MODEL || "gpt-4o-mini";

export type TitleInputs = {
  tradeLabels: string[];
  postcode?: string | null;
  priceMin?: number | null;
  priceMax?: number | null;
  existing?: string | null;
};

export function titleHash(basis: TitleInputs) {
  const key = [
    (basis.tradeLabels || []).join(","),
    basis.postcode || "",
    basis.priceMin ?? "",
    basis.priceMax ?? "",
  ].join("|");
  return crypto.createHash("sha1").update(key).digest("hex").slice(0, 16);
}

function postProcess(raw: string, tradeLabels: string[]): string {
  let t = (raw || "").trim();

  // one line only
  t = t.split("\n")[0].trim();

  // strip quotes / emojis / trailing punctuation
  t = t.replace(/^["'‘’”“]/, "").replace(/["'‘’”“]$/, "");
  t = t.replace(/[\u{1F300}-\u{1FAFF}]/gu, "");

  // no budget in title
  t = t.replace(/£[\d,\.kK]+(?:\s*–\s*£[\d,\.kK]+)?/g, "");

  // trim length
  if (t.length > 60) t = t.slice(0, 57).replace(/\s+\S*$/, "") + "…";

  // ensure a trade hint remains
  if (!tradeLabels.some(lbl => new RegExp(lbl, "i").test(t))) {
    // append a short trade hint softly if needed
    if (tradeLabels[0]) t = `${t} – ${tradeLabels[0]}`;
  }
  return t.trim().replace(/\s{2,}/g, " ");
}

export async function aiTitle(inputs: TitleInputs): Promise<{ title: string; model: string }> {
  const { tradeLabels, postcode } = inputs;
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const sys = `You write short, natural UK job titles for a trades marketplace.
Rules:
- 3–6 words, no puffery, no emojis, no all-caps.
- British spelling.
- Avoid prices, avoid "exciting opportunity", avoid "skilled tradespeople".
- Prefer concrete phrasing: e.g., "Bathroom refit, BR3" / "Fence & gate replacement".
- Keep it human, not salesy.`;

  const user = [
    `Trade(s): ${tradeLabels.join(", ") || "General"}`,
    postcode ? `Postcode: ${postcode}` : null,
    inputs.existing ? `Current title (if any): ${inputs.existing}` : null,
    `Return ONLY the title text.`,
  ].filter(Boolean).join("\n");

  try {
    const r = await client.chat.completions.create({
      model: MODEL,
      temperature: 0.5,
      messages: [
        { role: "system", content: sys },
        { role: "user", content: user },
      ],
    });
    const raw = r.choices?.[0]?.message?.content || "";
    return { title: postProcess(raw, tradeLabels), model: MODEL };
  } catch (e) {
    // Fallback: deterministic, simple
    const base = tradeLabels[0] || "Home improvement";
    const hint = postcode ? `, ${postcode}` : "";
    return { title: `${base}${hint}`.replace(/\s+/g, " ").trim(), model: "fallback" };
  }
}
