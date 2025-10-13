'use client'
import { useRef } from 'react'

export default function Tilt({
  children,
  max = 12,
  className = ''
}: {
  children: React.ReactNode
  max?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement | null>(null)

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    const rx = (0.5 - py) * max // rotateX
    const ry = (px - 0.5) * max // rotateY
    el.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`
  }
  function onLeave() {
    const el = ref.current
    if (!el) return
    el.style.transform = 'rotateX(0deg) rotateY(0deg)'
  }

  return (
    <div style={{ perspective: '1200px' }} className={className}>
      <div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="transition-transform duration-200 will-change-transform"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {children}
      </div>
    </div>
  )
}
