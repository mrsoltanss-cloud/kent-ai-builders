'use client'
import { useMemo, useState } from 'react'
import { TRADES } from '@/data/trades'

type Props = {
  value?: string[]
  onChange?: (next: string[]) => void
  max?: number
}

export default function TradeChips({ value = [], onChange, max = 12 }: Props) {
  const [q, setQ] = useState('')
  const selected = new Set(value)
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase()
    return TRADES.filter(t => !s || t.toLowerCase().includes(s))
  }, [q])

  function toggle(t: string) {
    const next = new Set(selected)
    if (next.has(t)) next.delete(t)
    else {
      if (next.size >= max) return
      next.add(t)
    }
    onChange?.([...next])
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search trades (e.g. roofing, carpentry)…"
          className="w-full rounded-lg px-3 py-2 bg-white border border-slate-300 outline-none focus:ring-2 focus:ring-cyan-300"
        />
        <div className="text-xs text-slate-500 whitespace-nowrap">
          {value.length}/{max} selected
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {filtered.map((t) => {
          const active = selected.has(t)
          return (
            <button
              key={t}
              onClick={() => toggle(t)}
              className={
                'px-3 py-1 rounded-full border transition text-sm ' +
                (active
                  ? 'bg-cyan-50 border-cyan-300 text-cyan-700'
                  : 'border-slate-300 text-slate-700 hover:bg-slate-50')
              }
              aria-pressed={active}
            >
              {t}
            </button>
          )
        })}
        {!filtered.length && (
          <div className="text-sm text-slate-500">No results for “{q}”.</div>
        )}
      </div>
    </div>
  )
}
