'use client'
import { useEffect } from 'react'

export default function ConfettiBurst({ spread = 70, particleCount = 120, scalar = 1 }: { spread?: number; particleCount?: number; scalar?: number }) {
  useEffect(() => {
    (async () => {
      const confetti = (await import('canvas-confetti')).default
      const common = { spread, scalar, ticks: 140, origin: { y: 0.35 } }
      confetti({ ...common, particleCount, angle: 60, origin: { x: 0.2, y: 0.35 } })
      confetti({ ...common, particleCount, angle: 120, origin: { x: 0.8, y: 0.35 } })
    })()
  }, [spread, particleCount, scalar])
  return null
}
