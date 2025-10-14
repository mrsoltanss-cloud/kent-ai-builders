'use client'
import { useEffect, useMemo, useState } from 'react'

/**
 * Rotates through real Kent postcodes + a lively lead count.
 * Safe, zero-dependency, and motion-respectful.
 */
const KENT_POSTCODES = [
  'ME1','ME2','ME4','ME5','ME7','ME8','ME10','ME14','ME15','ME16','ME19','ME20',
  'CT1','CT2','CT3','CT4','CT5','CT6','CT7','CT9','CT10','CT11','CT12','CT13','CT14','CT16','CT17',
  'TN9','TN10','TN11','TN12','TN13','TN14','TN15','TN16','TN23','TN24','TN25','TN26','TN27','TN30',
  'DA1','DA2','DA3','DA4','DA11','DA12','BR8'
]

// Tiny deterministic pseudo-random so the count looks alive but not jumpy
function prand(seed: number) {
  let x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

export default function CoverFX() {
  const [tick, setTick] = useState(0)

  // Respect reduced motion: rotate slower or freeze
  const prefersReduced = useMemo(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
  }, [])

  useEffect(() => {
    const every = prefersReduced ? 6000 : 2800
    const t = setInterval(() => setTick(t => t + 1), every)
    return () => clearInterval(t)
  }, [prefersReduced])

  const idx = tick % KENT_POSTCODES.length
  const pc = KENT_POSTCODES[idx]

  // Lead count: stable-ish around 6–18, varies with postcode + tick
  const count = 6 + Math.floor(prand(idx * 7 + tick * 1.3) * 13)

  return (
    <div
      className="mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1.5
                 bg-white/8 text-white/95 border border-white/15
                 shadow-[0_6px_30px_rgba(0,0,0,.25)]"
      aria-live="polite"
    >
      <span role="img" aria-label="fire">🔥</span>
      <span className="tabular-nums">{count}</span>
      <span className="opacity-90">hot leads posted near</span>
      <span className="font-semibold tracking-wide">{pc}</span>
      <span className="opacity-90">today</span>
    </div>
  )
}
