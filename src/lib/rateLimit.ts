const buckets = new Map<string, { tokens: number; ts: number }>()
const WINDOW_MS = 10_000
const CAP = 30

export function rateLimit(key: string) {
  const now = Date.now()
  const b = buckets.get(key) ?? { tokens: CAP, ts: now }
  const refill = Math.floor((now - b.ts) / WINDOW_MS) * CAP
  const tokens = Math.min(CAP, b.tokens + Math.max(0, refill))
  const ok = tokens > 0
  buckets.set(key, { tokens: ok ? tokens - 1 : 0, ts: ok ? now : b.ts })
  return ok
}
