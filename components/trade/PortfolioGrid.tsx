'use client'
import { useRef, useState } from 'react'
import ConfettiTiny from '@/components/fx/ConfettiTiny'

type Item = { id: string; url: string; caption?: string }
export default function PortfolioGrid({ value=[], onChange }:{ value?:Item[]; onChange?:(v:Item[])=>void }) {
  const [fire, setFire] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function pick(i:number){ inputRef.current?.click(); (inputRef.current as any)._slot = i }
  function onFiles(e: React.ChangeEvent<HTMLInputElement>){
    const files = e.target.files; if(!files || !files.length) return
    const i = (e.target as any)._slot ?? 0
    const f = files[0]; const id = crypto.randomUUID(); const url = URL.createObjectURL(f)
    const next = [...value]; next[i] = { id, url, caption: '' }; onChange?.(next); setFire(true); setTimeout(()=>setFire(false),400)
  }

  return (
    <div>
      <div className="grid grid-cols-3 gap-3">
        {[0,1,2].map(i=>{
          const it = value[i]
          return (
            <button key={i} onClick={()=>pick(i)}
              className="relative aspect-[4/3] rounded-xl border border-slate-300 overflow-hidden bg-slate-50 hover:bg-slate-100">
              {it ? (
                <img src={it.url} alt="" className="absolute inset-0 h-full w-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-slate-500">+ Add photo</div>
              )}
            </button>
          )
        })}
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onFiles}/>
      <ConfettiTiny fire={fire}/>
    </div>
  )
}
