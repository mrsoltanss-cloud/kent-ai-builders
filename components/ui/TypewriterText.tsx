'use client'
import { useEffect, useState } from 'react'

export default function TypewriterText({
  phrases = [
    'AI job matching that favours quality builders.',
    'Instant estimates that convert serious homeowners.',
    'Smart reputation that grows with every project.',
    'Verified profiles that signal trust at a glance.',
    'Portfolio-first profiles that showcase real craft.',
    'Coverage radius so the right jobs find you fast.',
    'Pro response tools that save hours per week.',
    'A network built for modern, professional trades.'
  ],
  speed = 28,
  pause = 1400,
  className = 'text-slate-300'
}: {
  phrases?: string[]
  speed?: number
  pause?: number
  className?: string
}) {
  const [idx, setIdx] = useState(0)
  const [text, setText] = useState('')
  const [dir, setDir] = useState<'typing' | 'pausing' | 'deleting'>('typing')

  useEffect(() => {
    const phrase = phrases[idx % phrases.length]
    let timer: number | undefined

    if (dir === 'typing') {
      if (text.length < phrase.length) {
        timer = window.setTimeout(() => setText(phrase.slice(0, text.length + 1)), speed)
      } else {
        setDir('pausing') // do NOT set a timer here; it gets cleared on re-render
      }
    } else if (dir === 'pausing') {
      timer = window.setTimeout(() => setDir('deleting'), pause)
    } else if (dir === 'deleting') {
      if (text.length > 0) {
        timer = window.setTimeout(() => setText(phrase.slice(0, text.length - 1)), speed * 0.6)
      } else {
        setDir('typing')
        setIdx((i) => (i + 1) % phrases.length)
      }
    }

    return () => { if (timer) window.clearTimeout(timer) }
  }, [text, dir, idx, phrases, speed, pause])

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <span className="whitespace-pre leading-relaxed">{text}</span>
      <span className="h-5 w-[2px] bg-cyan-300 animate-pulse translate-y-[1px]" />
    </div>
  )
}
