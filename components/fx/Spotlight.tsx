'use client'
import { useEffect, useState } from 'react'
export default function Spotlight({ className='', intensity=0.22 }: { className?: string; intensity?: number }) {
  const [p, setP] = useState({ x: 0, y: 0 })
  useEffect(() => {
    const h = (e: MouseEvent) => setP({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', h, { passive: true })
    return () => window.removeEventListener('mousemove', h)
  }, [])
  return (
    <div
      className={`pointer-events-none absolute inset-0 mix-blend-screen ${className}`}
      style={{
        background: `radial-gradient( circle at ${p.x}px ${p.y}px,
          rgba(6,182,212,${intensity}) 0%,
          rgba(6,182,212,${intensity * 0.6}) 18%,
          rgba(6,182,212,0.0) 60%)`
      }}
    />
  )
}
