import { DateTime } from "luxon";
import { londonNow, weekStartLondon } from "./time";

// mulberry32 seeded PRNG
function mulberry32(seed: number) {
  return function() {
    let t = (seed += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const intBetween = (rnd: () => number, a: number, b: number) =>
  Math.floor(a + rnd() * (b - a + 1));

function buildHourlyWeights(seed: number) {
  const rnd = mulberry32(seed);
  const weights: number[] = [];
  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour++) {
      const isDay = hour >= 8 && hour <= 21;
      const dayBoost = (day >= 1 && day <= 4) ? 1.15 : (day === 0 || day === 6 ? 0.85 : 1.0);
      const base = isDay ? 1.0 : 0.25;
      const noise = 0.9 + rnd() * 0.2;
      weights.push(base * dayBoost * noise);
    }
  }
  const sum = weights.reduce((a, b) => a + b, 0);
  return weights.map(w => w / sum);
}

function cumulativeProportion(now: DateTime, weights: number[]) {
  const start = weekStartLondon(now);
  const diffHours = Math.floor(now.diff(start, "hours").hours);
  const hourIndex = Math.min(167, Math.max(0, diffHours));
  const hourStart = now.set({ minute: 0, second: 0, millisecond: 0 });
  const intoHour = now.diff(hourStart, "minutes").minutes / 60;

  let cum = 0;
  for (let i = 0; i < hourIndex; i++) cum += weights[i];
  cum += weights[hourIndex] * intoHour;

  return Math.min(1, Math.max(0, cum));
}

export type DemoTargets = { similarWeeklyTarget: number; surveysWeeklyTarget: number; };

const STORAGE_KEY = "brixel_demo_targets_v1";
const STORAGE_WEEK = "brixel_demo_week_v1";

export function getWeeklyTargets(): DemoTargets {
  if (typeof window === "undefined") return { similarWeeklyTarget: 220, surveysWeeklyTarget: 40 };
  const weekIso = weekStartLondon().toISO();
  const savedWeek = localStorage.getItem(STORAGE_WEEK);
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved && savedWeek === weekIso) { try { return JSON.parse(saved) as DemoTargets; } catch {} }

  const seedBase = Math.floor(weekStartLondon().toSeconds());
  const rnd = mulberry32(seedBase);
  const targets = {
    similarWeeklyTarget: intBetween(rnd, 160, 280),
    surveysWeeklyTarget: intBetween(rnd, 20, 60),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(targets));
  localStorage.setItem(STORAGE_WEEK, weekIso!);
  return targets;
}

export function demoCountsNow() {
  const now = londonNow();
  const start = weekStartLondon(now);
  const weightSeed = Math.floor(start.toSeconds());
  const weights = buildHourlyWeights(weightSeed);

  const p = cumulativeProportion(now, weights);
  const { similarWeeklyTarget, surveysWeeklyTarget } = getWeeklyTargets();

  const similar = Math.floor(similarWeeklyTarget * p);
  const surveys = Math.floor(surveysWeeklyTarget * p);

  return { similar, surveys, p };
}
