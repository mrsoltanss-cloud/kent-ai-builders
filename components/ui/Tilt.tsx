'use client'
import { useRef } from 'react'

type Props = {
  children: React.ReactNode
  className?: string
  max?: number           // max tilt in degrees
  glare?: boolean        // not used yet, placeholder
}

export default function Tilt({ children, className='', max=12 }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  let raf = 0

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width  - 0.5
    const py = (e.clientY - r.top)  / r.height - 0.5
    const rotX = +(py * -max).toFixed(2)
    const rotY = +(px *  max).toFixed(2)
    cancelAnimationFrame(raf)
    raf = requestAnimationFrame(() => {
      el.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(0)`
    })
  }

  function onLeave() {
    const el = ref.current
    if (!el) return
    cancelAnimationFrame(raf)
    el.style.transform = ''
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={className}
      style={{ willChange: 'transform' }}
    >
      {children}
    </div>
  )
}
