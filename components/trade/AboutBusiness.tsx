'use client'
import { useId } from 'react'

type Data = {
  tagline?: string
  about?: string
  teamSize?: 'SOLO'|'SMALL'|'CREW'|'LARGE'
  years?: number
}

export default function AboutBusiness({
  value, onChange
}: { value: Data; onChange: (patch: Partial<Data>) => void }) {
  const id = useId()
  return (
    <section className="mt-6 space-y-4">
      <h3 className="text-base font-semibold text-slate-800">About your business</h3>

      {/* Tagline */}
      <div className="grid gap-2">
        <label htmlFor={id+'tag'} className="text-sm text-slate-600">Tagline (short)</label>
        <input
          id={id+'tag'}
          className="h-11 rounded-xl border border-slate-300 px-3 outline-none focus:ring-2 ring-cyan-300"
          placeholder="e.g. Turning tired homes into showpieces since 2008"
          defaultValue={value.tagline ?? ''}
          onChange={(e)=>onChange({tagline: e.target.value})}
        />
      </div>

      {/* About */}
      <div className="grid gap-2">
        <label htmlFor={id+'about'} className="text-sm text-slate-600">What makes your work stand out?</label>
        <textarea
          id={id+'about'}
          rows={5}
          className="rounded-xl border border-slate-300 px-3 py-2 outline-none focus:ring-2 ring-cyan-300"
          placeholder="Talk about your craftsmanship, not just your tools. Materials you love, finish quality, aftercare…"
          defaultValue={value.about ?? ''}
          onChange={(e)=>onChange({about: e.target.value})}
        />
        <div className="text-xs text-slate-500">Tip: 2–4 sentences is perfect.</div>
      </div>

      {/* Team & Experience */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="grid gap-2">
          <span className="text-sm text-slate-600">Team size</span>
          <div className="grid grid-cols-4 gap-2">
            {([
              ['SOLO','Solo'],
              ['SMALL','2–5'],
              ['CREW','6–15'],
              ['LARGE','16+'],
            ] as const).map(([key,label])=>(
              <button
                key={key}
                type="button"
                onClick={()=>onChange({teamSize: key})}
                className={[
                  "h-10 rounded-xl border text-sm",
                  value.teamSize===key
                    ? "border-cyan-400 bg-cyan-50 text-cyan-700"
                    : "border-slate-300 hover:bg-slate-50 text-slate-700"
                ].join(' ')}
              >{label}</button>
            ))}
          </div>
        </div>
        <div className="grid gap-2">
          <label htmlFor={id+'years'} className="text-sm text-slate-600">Years in trade</label>
          <input
            id={id+'years'} type="range" min={0} max={40}
            defaultValue={value.years ?? 5}
            onChange={(e)=>onChange({years: Number(e.target.value)})}
          />
          <div className="text-sm text-slate-600">
            {value.years ?? 5} years
          </div>
        </div>
      </div>
    </section>
  )
}
