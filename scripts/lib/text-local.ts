import crypto from "crypto";

type Inputs = {
  title?: string | null;
  postcode?: string | null;
  priceMin?: number | null;
  priceMax?: number | null;
  trades: string[];
};

// --- seeded randomness (stable variety per job) ---
function hashSeed(s: string) {
  return crypto.createHash("sha1").update(s).digest("hex").slice(0, 8);
}
function mulberry32(a: number) {
  return function() {
    let t = (a += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function prngFromKey(key: string) {
  const n = parseInt(hashSeed(key), 16) >>> 0;
  return mulberry32(n);
}
function pick<T>(rng: () => number, arr: T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}
function maybe(rng: () => number, p = 0.5) {
  return rng() < p;
}

function gbp(min?: number | null, max?: number | null) {
  const fmt = (n: number) => `£${n.toLocaleString("en-GB")}`;
  if (min && max) return `${fmt(min)}–${fmt(max)}`;
  if (min) return `from ${fmt(min)}`;
  if (max) return `up to ${fmt(max)}`;
  return undefined;
}

function clampChars(s: string, max = 180) {
  if (s.length <= max) return s;
  return s.slice(0, max - 1).replace(/\s+\S*$/, "") + "…";
}

// --- phrase banks (expand anytime) ---
const openers = [
  "Homeowner needs",
  "Customer is planning",
  "We’ve got a lead for",
  "Small project:",
  "Larger job:",
  "Local request:",
  "Looking for help with",
  "Quote needed for",
];

const tasks = [
  "a straight refit",
  "repair and make good",
  "supply & fit",
  "first fix then finish",
  "strip out and install",
  "remedial works",
  "upgrade and tidy",
  "remove and replace",
];

const niceties = [
  "Parking nearby.",
  "Easy access.",
  "Photos on request.",
  "Weekday visits preferred.",
  "Weekend option possible.",
  "Flexible on dates.",
  "Materials can be supplied.",
  "Trade to supply materials.",
];

const tones = [
  "friendly",
  "matter-of-fact",
  "punchy",
  "concise",
  "reassuring",
  "down-to-earth",
];

const closers = [
  "Shortlist is limited—introduce yourself.",
  "Happy to consider competitive quotes.",
  "Experienced trades only, please.",
  "Send a quick intro and availability.",
  "Looking to appoint soon.",
  "A clean, tidy finish is important.",
];

function sentenceCase(s: string) {
  return s.replace(/\s+/g, " ").trim().replace(/^./, c => c.toUpperCase());
}

// --- public generators ---
export function generateSummary(key: string, i: Inputs): string {
  const rng = prngFromKey(`summary|${key}|${i.title || ""}|${i.trades.join(",")}|${i.postcode || ""}|${i.priceMin || ""}|${i.priceMax || ""}`);
  const opener = pick(rng, openers);
  const task = pick(rng, tasks);
  const trade = (i.trades[0] || "works").toLowerCase();
  const budget = gbp(i.priceMin, i.priceMax);
  const loc = i.postcode ? ` ${i.postcode}` : "";

  const bits: string[] = [];
  bits.push(`${opener} ${trade}${loc} — ${task}.`);
  if (budget && maybe(rng, 0.8)) bits.push(`Budget ${budget}.`);
  if (maybe(rng, 0.6)) bits.push(pick(rng, niceties));
  // keep it quick (110–160 chars target)
  return clampChars(sentenceCase(bits.join(" ")), 165);
}

export function generateDescription(key: string, i: Inputs): string {
  const rng = prngFromKey(`descr|${key}|${i.title || ""}|${i.trades.join(",")}|${i.postcode || ""}|${i.priceMin || ""}|${i.priceMax || ""}`);
  const tone = pick(rng, tones);
  const tradeNoun = (i.trades[0] || "work").toLowerCase();
  const budget = gbp(i.priceMin, i.priceMax);
  const loc = i.postcode ? ` (${i.postcode})` : "";

  const lines: string[] = [];

  // intro
  const introChoices = [
    `A homeowner is looking for help with ${tradeNoun}${loc}.`,
    `We’re collecting quotes for ${tradeNoun}${loc}.`,
    `There’s a job available: ${tradeNoun}${loc}.`,
  ];
  lines.push(pick(rng, introChoices));

  // scope
  const scopeChoices = [
    "Scope includes site visit, confirming measurements, and agreeing the finish.",
    "Work includes removal where needed, tidy install, and full clean-up.",
    "Expect a neat, safe job with minimal disruption and a tidy finish.",
    "Please allow for protection, waste removal, and a clear handover.",
  ];
  lines.push(pick(rng, scopeChoices));

  // budget / timing / niceties
  const mids: string[] = [];
  if (budget && maybe(rng, 0.85)) mids.push(`Indicative budget: ${budget}.`);
  if (maybe(rng, 0.7)) mids.push(pick(rng, niceties));
  mids.push(maybe(rng, 0.5) ? "References or photos of similar work help." : "Proof of insurance welcomed.");
  lines.push(mids.join(" "));

  // tone-specific note
  const toneLine: Record<string, string[]> = {
    friendly: ["We’re easy to deal with—just honest timelines and good communication."],
    "matter-of-fact": ["Clear scope and straightforward decision-making."],
    punchy: ["Quick decisions, clean work, fair price."],
    concise: ["Keep it simple: scope, price, date."],
    reassuring: ["A tidy finish and reliable communication are key."],
    "down-to-earth": ["Nothing fancy—just good workmanship and a fair price."],
  };
  lines.push(pick(rng, toneLine[tone] || toneLine["friendly"]));

  // close
  lines.push(pick(rng, closers));

  // 120–200 words target; we’ll land roughly 80–140 by default
  return lines.join(" ");
}
