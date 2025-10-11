import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

/** phrases we never want to see */
const BANNED = [
  "Straightforward job with clear scope",
  "Join shortlist for details",
  "click here",
  "apply now",
];

/** Simple quality checks */
function isBad(summary: string, minWords = 90) {
  const words = summary.trim().split(/\s+/g).filter(Boolean).length;
  if (words < minWords) return `too_short_${words}`;
  if (BANNED.some(p => summary.toLowerCase().includes(p.toLowerCase())))
    return "banned_phrase";
  // penalize empty marketing buzz
  if (/exciting opportunity|dynamic environment/i.test(summary)) return "cliché";
  return null;
}

/** Light post-processing: normalize whitespace + cap hard max words */
function tidy(summary: string, maxWords = 160) {
  const clean = summary.replace(/\s+/g, " ").trim();
  const words = clean.split(" ");
  return words.length > maxWords ? words.slice(0, maxWords).join(" ") + "…" : clean;
}

/** Build a strong prompt that forces specificity + length */
function buildPrompt(job: {
  title?: string;
  company?: string;
  location?: string;
  scope?: string;
  requirements?: string[];
  tools?: string[];
  salary?: string;
  contractType?: string; // e.g., Full-time, Contract
  perks?: string[];
}) {
  const {
    title = "Role",
    company = "the company",
    location = "UK",
    scope = "",
    requirements = [],
    tools = [],
    salary = "",
    contractType = "",
    perks = [],
  } = job;

  // nudge the model toward concrete, verifiable facts from your fields
  return `
You are writing a concise, *human-sounding* job summary for a public listing.
Write **one paragraph** of **90–150 words** that sounds natural and specific.

Required:
- Mention: job title (“${title}”), company (“${company}”), location (“${location}”).
- 2–3 concrete responsibilities or outcomes (what impact will be delivered).
- 2–3 specifics from scope/requirements/tools if available.
- If present, include salary like “£${salary}” (or a range) and the contract type (${contractType}).
- End with a gentle CTA like: “Shortlisted applicants get the full brief.”

Style rules (must follow):
- Plain English, no fluff, no clichés, no “Straightforward job with clear scope”, no “Join shortlist for details”.
- Vary sentence length. Prefer verbs that show action (build, ship, automate, reduce).
- No bullet points, no headings, one paragraph only.

Facts you can use:
- Scope: ${scope || "N/A"}
- Requirements: ${requirements.join(", ") || "N/A"}
- Tools/Stack: ${tools.join(", ") || "N/A"}
- Salary: ${salary || "N/A"}
- Contract: ${contractType || "N/A"}
- Perks: ${perks.join(", ") || "N/A"}
`;
}

/** Generate with retries until it passes checks */
export async function generateJobSummary(job: Parameters<typeof buildPrompt>[0]) {
  const prompt = buildPrompt(job);
  let attempts = 0;
  while (attempts < 3) {
    attempts++;
    const res = await client.chat.completions.create({
      // pick your model
      model: process.env.OPENAI_SUMMARY_MODEL || "gpt-4o-mini",
      temperature: 0.7,
      top_p: 0.9,
      presence_penalty: 0.2,
      frequency_penalty: 0.2,
      messages: [
        { role: "system", content: "You write concise, specific job summaries that sound human." },
        { role: "user", content: prompt },
      ],
    });

    const raw = res.choices[0]?.message?.content?.trim() || "";
    const summary = tidy(raw);
    const bad = isBad(summary);
    if (!bad) return { summary, attempts, rejected: false };
    // if first try fails for “too_short”, bump temperature slightly
    if (bad.startsWith("too_short_")) {
      // no API change here; retry loop handles it; you could vary temperature if you want
    }
  }
  // last resort: return the final tidy attempt even if short, but flagged
  return { summary: "Shortlisted applicants get the full brief.", attempts, rejected: true };
}

/** quick helper for batch scripts */
export function needsRewrite(text: string | null | undefined) {
  if (!text) return true;
  return Boolean(isBad(text, 90));
}
