'use client'
import {useEffect,useMemo,useRef,useState} from 'react'

function ProgressRing({size=84, stroke=8, target=76, label="Profile strength"}:{
  size?:number; stroke?:number; target?:number; label?:string
}) {
  const [val,setVal]=useState(0)
  const r = (size-stroke)/2
  const C = 2*Math.PI*r
  useEffect(()=>{
    let raf:number; let t=0
    const run=()=>{ t=Math.min(1,t+0.025); const ease=1-Math.pow(1-t,3); setVal(Math.round(ease*target)); if(t<1) raf=requestAnimationFrame(run) }
    raf=requestAnimationFrame(run); return ()=>cancelAnimationFrame(raf)
  },[target])
  const dash = useMemo(()=>((val/100)*C).toFixed(2),[val,C])
  return (
    <div className="flex items-center gap-3 rounded-2xl px-3 py-2 bg-white/8 border border-white/15 text-white/95">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
        <circle cx={size/2} cy={size/2} r={r} stroke="rgba(255,255,255,.18)" strokeWidth={stroke} fill="none"/>
        <circle cx={size/2} cy={size/2} r={r}
          stroke="url(#g)" strokeWidth={stroke} fill="none"
          strokeLinecap="round" strokeDasharray={`${dash} ${C}`}
          transform={`rotate(-90 ${size/2} ${size/2})`}
          className="transition-[stroke-dasharray] duration-200" />
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#22d3ee"/><stop offset="100%" stopColor="#a7f3d0"/>
          </linearGradient>
        </defs>
      </svg>
      <div className="leading-tight">
        <div className="text-xs opacity-80">{label}</div>
        <div className="text-base font-semibold">{val}%</div>
      </div>
    </div>
  )
}

function TrustStrip(){
  const items = [
    {k:'verified',  text:'ID & insurance ready', icon:'🛡️'},
    {k:'response',  text:'Avg response under 2h', icon:'⚡'},
    {k:'visibility',text:'AI boosts top quality', icon:'✨'},
    {k:'payments',  text:'Secure payouts & ledger', icon:'💳'},
  ]
  return (
    <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-white/95">
      {items.map(it=>(
        <div key={it.k} className="rounded-2xl bg-white/8 border border-white/15 px-3 py-2.5 flex items-center gap-2">
          <span className="text-lg">{it.icon}</span>
          <span className="text-sm">{it.text}</span>
        </div>
      ))}
    </div>
  )
}

function Testimonials(){
  const quotes = [
    {n:'Lewis • Ashford',  q:'Joined on Monday, quoting by Friday. The profile made us look sharp.'},
    {n:'Amira • Canterbury',q:'The AI summaries are bang on. Homeowners “get” the scope quickly.'},
    {n:'Jon • Maidstone',   q:'Felt premium from the start. Uploading work with live previews = chef’s kiss.'},
  ]
  const [i,setI]=useState(0)
  const timer = useRef<ReturnType<typeof setInterval>|null>(null)
  useEffect(()=>{
    timer.current && clearInterval(timer.current)
    timer.current = setInterval(()=>setI(v=>(v+1)%quotes.length), 3000)
    return ()=>{ timer.current && clearInterval(timer.current) }
  },[])
  const cur = quotes[i]
  return (
    <div className="mt-6 rounded-2xl bg-white/8 border border-white/15 px-4 py-4 text-white/95 overflow-hidden">
      <div className="text-sm opacity-90">“{cur.q}”</div>
      <div className="mt-2 text-xs opacity-70">{cur.n}</div>
      <div className="mt-3 flex gap-1">
        {quotes.map((_,j)=>(
          <div key={j} className={`h-1.5 rounded-full transition-all ${j===i?'w-6 bg-white':'w-2 bg-white/40'}`}/>
        ))}
      </div>
    </div>
  )
}

export default function CoverAddons(){
  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-center gap-3">
        <ProgressRing target={78}/>
        <div className="rounded-2xl px-3 py-2 bg-white/8 border border-white/15 text-white/95">
          <span className="opacity-80 text-xs">Average setup time</span>
          <div className="font-semibold leading-tight">3–5 mins</div>
        </div>
        <div className="rounded-2xl px-3 py-2 bg-white/8 border border-white/15 text-white/95">
          <span className="opacity-80 text-xs">Typical approval</span>
          <div className="font-semibold leading-tight">Same day</div>
        </div>
      </div>
      <TrustStrip/>
      <Testimonials/>
    </div>
  )
}
