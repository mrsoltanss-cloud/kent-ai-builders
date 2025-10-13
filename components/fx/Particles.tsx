'use client'
import { useEffect, useRef } from 'react'
export default function Particles({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement | null>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1))
    const ctx = canvas.getContext('2d')!
    let raf = 0
    let w = 0, h = 0
    const COUNT = 42
    const dots = Array.from({ length: COUNT }, () => ({
      x: Math.random(), y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0006,
      vy: (Math.random() - 0.5) * 0.0006,
      r: 1 + Math.random() * 1.2
    }))
    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      w = Math.floor(rect.width); h = Math.floor(rect.height)
      canvas.width = Math.floor(w * dpr); canvas.height = Math.floor(h * dpr)
      ctx.scale(dpr, dpr)
    }
    const step = () => {
      ctx.clearRect(0, 0, w, h)
      for (const p of dots) {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > 1) p.vx *= -1
        if (p.y < 0 || p.y > 1) p.vy *= -1
        const x = p.x * w, y = p.y * h
        ctx.beginPath()
        ctx.arc(x, y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(56,189,248,0.35)'
        ctx.fill()
      }
      raf = requestAnimationFrame(step)
    }
    resize(); step()
    const ro = new ResizeObserver(resize); ro.observe(canvas)
    return () => { cancelAnimationFrame(raf); ro.disconnect() }
  }, [])
  return <canvas ref={ref} className={`pointer-events-none absolute inset-0 ${className}`} />
}
