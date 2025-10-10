/**
 * Lightweight, local copy generator for job Titles + Summaries.
 * - UK wording, varied but natural (no salesy AI tone)
 * - Banned phrases guard
 * - Deterministic randomness based on seed if provided
 *
 * Usage:
 *   import { genTitle, genSummary, pickTradeKey } from "./lib/copyGen";
 */

export type Tone = "neutral" | "friendly" | "urgent" | "pro";
export type CopyOpts = {
  postcode?: string | null;
  priceMin?: number | null;
  priceMax?: number | null;
  tradeKey?: string | null;     // e.g. "plumbing"
  seed?: number | string | null;
  tone?: Tone;
  sizeM2?: number | null;       // optional hint for surface/area jobs
  count?: number | null;        // optional hint for units (e.g., 5 doors)
  property?: "flat" | "terrace" | "semi" | "detached" | null;
  level?: "ground" | "first" | "second" | null;
};

// ---- taxonomy (compact but diverse) ----
const TRADES: Record<string, { nouns: string[]; verbs: string[]; details: string[] }> = {
  plumbing: {
    nouns: ["mixer tap", "toilet", "bath waste", "radiator valves", "stopcock", "pipework"],
    verbs: ["replace", "repair", "install", "isolate", "reseal"],
    details: ["leaking slowly", "access OK", "materials on site", "small job"]
  },
  electrics: {
    nouns: ["light fittings", "sockets", "cooker feed", "consumer unit", "outside lights"],
    verbs: ["install", "upgrade", "replace", "make safe"],
    details: ["EICR later", "RCD preferred", "surface run OK", "chasing minimal"]
  },
  bathroom: {
    nouns: ["bathroom refit", "shower enclosure", "vanity unit", "tiling", "extractor fan"],
    verbs: ["refit", "retile", "replace", "fit"],
    details: ["first-floor", "materials part-supplied", "stud walls", "standard finish"]
  },
  kitchen: {
    nouns: ["kitchen refresh", "worktop", "sink & tap", "appliance fit", "splashback"],
    verbs: ["install", "replace", "cut & fit", "seal"],
    details: ["uPVC windows nearby", "gas capped", "appliances on site", "L-shape run"]
  },
  roofing: {
    nouns: ["broken tiles", "chimney flashing", "gutter run", "soffit & fascia"],
    verbs: ["repair", "replace", "redo flashing", "clear"],
    details: ["single storey", "tower ok", "easy access", "minor leak"]
  },
  fencing: {
    nouns: ["fence panels", "post & gravel board", "garden gate"],
    verbs: ["replace", "install", "straighten", "reset posts"],
    details: ["approx 6m run", "standard panels", "timber posts", "waste removal needed"]
  },
  painting: {
    nouns: ["bedroom walls", "hall stairs & landing", "doors & frames", "exterior woodwork"],
    verbs: ["prep & paint", "undercoat & finish", "sand & paint"],
    details: ["standard white", "minor filling", "two coats", "sheeting required"]
  },
  flooring: {
    nouns: ["laminate", "engineered oak", "LVT", "skirting", "thresholds"],
    verbs: ["lay", "fit", "finish edges", "underlay"],
    details: ["~20 m²", "clear room", "old flooring lifted", "straight runs"]
  },
  glazing: {
    nouns: ["uPVC window", "double glazing unit", "patio door rollers"],
    verbs: ["replace", "fit", "service"],
    details: ["ground floor", "standard sizes", "toughened where needed"]
  },
  landscaping: {
    nouns: ["patio flags", "sleepers edge", "turf area", "path paving"],
    verbs: ["relay", "lay", "level & compact", "edge"],
    details: ["~25 m²", "skip space on drive", "sub-base present"]
  },
  brickwork: {
    nouns: ["repointing", "garden wall", "pier repair", "step rebuild"],
    verbs: ["repoint", "rebuild", "patch repair"],
    details: ["lime mortar", "front elevation", "low level", "tidy site"]
  },
  insulation: {
    nouns: ["loft insulation", "cavity check", "draught proofing"],
    verbs: ["top up", "assess", "install"],
    details: ["easy hatch", "boards partial", "pipes visible"]
  },
  smart: {
    nouns: ["cameras", "video doorbell", "thermostat", "smoke/heat alarms"],
    verbs: ["install", "integrate", "configure"],
    details: ["Wi-Fi solid", "IOS app", "mains powered"]
  },
  boiler: {
    nouns: ["combi boiler", "system flush", "thermostats", "TRVs"],
    verbs: ["service", "replace", "balance", "flush"],
    details: ["gas safe only", "book in mornings", "keys available"]
  }
};

// trades we’ll random-pick from if none provided
const TRADE_KEYS = Object.keys(TRADES);

// property & phrasing helpers
const PROPERTIES: Array<NonNullable<CopyOpts["property"]>> = ["flat", "terrace", "semi", "detached"];
const LEVELS: Array<NonNullable<CopyOpts["level"]>> = ["ground", "first", "second"];

// banned phrasing to avoid “AI salesy” tone
const BANNED = [
  "exciting opportunity",
  "showcase your expertise",
  "don’t miss out",
  "reach out",
  "world-class",
  "amazing",
  "fantastic",
  "!",
];

function seededRandom(seed: number | string | null | undefined) {
  let s = 0;
  if (typeof seed === "number") s = seed;
  else if (typeof seed === "string") s = Array.from(seed).reduce((a, c) => a + c.charCodeAt(0), 0);
  else s = Math.floor(Math.random() * 1e6);
  return () => {
    // xorshift-ish
    s ^= s << 13; s ^= s >> 17; s ^= s << 5;
    const out = (s >>> 0) / 2 ** 32;
    return out;
  };
}

function pick<T>(arr: T[], rnd: () => number) {
  return arr[Math.floor(rnd() * arr.length)];
}
function coin(rnd: () => number, p = 0.5) { return rnd() < p; }
function clamp(n: number, a: number, b: number) { return Math.max(a, Math.min(b, n)); }

function asRange(min?: number | null, max?: number | null) {
  if (min == null || max == null) return null;
  const a = Math.min(min, max), b = Math.max(min, max);
  return `£${a.toLocaleString()}–£${b.toLocaleString()}`;
}

function naturalJoin(parts: (string | null | undefined | false)[]) {
  return parts.filter(Boolean).join(" ");
}

function sanitize(s: string) {
  let out = s.replace(/\s+/g, " ").trim();
  for (const bad of BANNED) out = out.replace(new RegExp(bad, "ig"), "");
  return out.replace(/\s{2,}/g, " ").trim().replace(/\s+[.,]/g, m => m.trim());
}

function hintProperty(rnd: () => number, hint?: CopyOpts["property"]) {
  return hint ?? pick(PROPERTIES, rnd);
}
function hintLevel(rnd: () => number, hint?: CopyOpts["level"]) {
  return hint ?? pick(LEVELS, rnd);
}
function hintCount(rnd: () => number, given?: number | null) {
  if (given && given > 0) return given;
  return clamp(Math.round(rnd() * 4) + 1, 1, 5);
}
function hintM2(rnd: () => number, given?: number | null) {
  if (given && given > 0) return given;
  return clamp(Math.round(rnd() * 30) + 8, 6, 40);
}

/** Choose a sensible trade key if none provided */
export function pickTradeKey(preferred?: string | null): string {
  if (preferred && TRADES[preferred]) return preferred;
  return pick(TRADE_KEYS, seededRandom(null));
}

/** Generate a concise, specific job title */
export function genTitle(opts: CopyOpts): string {
  const rnd = seededRandom(opts.seed ?? `${opts.tradeKey ?? ""}-${opts.postcode ?? ""}`);
  const tradeKey = opts.tradeKey && TRADES[opts.tradeKey] ? opts.tradeKey : pick(TRADE_KEYS, rnd);
  const t = TRADES[tradeKey];

  const noun = pick(t.nouns, rnd);
  const verb = pick(t.verbs, rnd);

  const prop = hintProperty(rnd, opts.property || null);
  const lvl = coin(rnd, 0.6) ? hintLevel(rnd, opts.level || null) : null;

  const bits: string[] = [];

  // include minimal concrete detail based on trade
  if (["flooring", "landscaping", "painting", "insulation", "bathroom", "kitchen"].includes(tradeKey)) {
    const m2 = hintM2(rnd, opts.sizeM2 || null);
    bits.push(`${m2} m²`);
  } else if (["fencing", "glazing", "electrics", "plumbing", "painting"].includes(tradeKey)) {
    const c = hintCount(rnd, opts.count || null);
    if (c > 1) bits.push(`${c}×`);
  }

  // Base title
  let title = `${capitalize(verb)} ${bits.join(" ")} ${noun}`.replace(/\s+/g, " ").trim();

  // Qualifiers
  const q: string[] = [];
  if (prop) q.push(prop);
  if (lvl && prop === "flat") q.push(`${lvl}-floor`);
  if (coin(rnd, 0.5) && opts.postcode) q.push(opts.postcode);

  if (q.length) title += ` — ${q.join(", ")}`;

  // Tidy up spacing
  title = title.replace(/\s+—\s+$/, "").replace(/\s+—$/, ""); // no trailing em dash
  return sanitize(title);
}

/** Generate a human, non-salesy summary (1–2 sentences) */
export function genSummary(opts: CopyOpts): string {
  const rnd = seededRandom(opts.seed ?? `${opts.tradeKey ?? ""}-${opts.postcode ?? ""}-s`);
  const tradeKey = opts.tradeKey && TRADES[opts.tradeKey] ? opts.tradeKey : pick(TRADE_KEYS, rnd);
  const t = TRADES[tradeKey];

  const prop = hintProperty(rnd, opts.property || null);
  const lvl = coin(rnd, 0.5) ? hintLevel(rnd, opts.level || null) : null;
  const budget = asRange(opts.priceMin ?? null, opts.priceMax ?? null);

  const detail = pick(t.details, rnd);
  const extra = coin(rnd, 0.5) ? pick(generalDetails, rnd) : null;

  const tone: Tone = opts.tone ?? pick(["neutral", "friendly", "pro", "urgent"], rnd);

  const parts: string[] = [];

  // Sentence 1: the ask
  const lead = toneLead(tone, rnd);
  parts.push(
    sanitize(
      `${lead} ${describeTrade(tradeKey, rnd)}${prop ? ` in a ${prop}` : ""}${lvl ? ` (${lvl}-floor)` : ""}${opts.postcode ? `, ${opts.postcode}` : ""}.`
    )
  );

  // Sentence 2: brief practicals
  const p2 = naturalJoin([
    budget ? `Budget ${budget}.` : null,
    coin(rnd, 0.6) ? `${detail}.` : null,
    extra ? `${extra}.` : null,
  ]);
  if (p2) parts.push(sanitize(p2));

  // Keep it short (2 sentences max)
  const out = parts.join(" ").replace(/\s+/g, " ").trim();
  return out;
}

// ---- helpers ----
const generalDetails = [
  "Parking nearby",
  "Access straightforward",
  "Materials can be supplied",
  "Happy to discuss timings",
  "Weekday work preferred",
  "Photos available on request",
];

function toneLead(t: Tone, rnd: () => number): string {
  switch (t) {
    case "friendly": return pick([
      "Looking for help with",
      "Need a hand with",
      "We’re planning"
    ], rnd);
    case "urgent": return pick([
      "Urgent: need",
      "ASAP: require",
      "Quick turnaround for"
    ], rnd);
    case "pro": return pick([
      "Require experienced tradesperson for",
      "Seeking a professional to",
      "Qualified help needed for"
    ], rnd);
    case "neutral":
    default: return pick([
      "Request to",
      "Job to",
      "Work to"
    ], rnd);
  }
}

function describeTrade(tradeKey: string, rnd: () => number): string {
  const t = TRADES[tradeKey];
  const noun = pick(t.nouns, rnd);
  const verb = pick(t.verbs, rnd);
  // keep low-key language
  return `${verb} ${noun}`.replace(/\s+/g, " ");
}

function capitalize(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}
