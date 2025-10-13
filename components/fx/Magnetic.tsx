'use client'
import { useRef } from 'react'
export default function Magnetic({ strength=0.18, children, className='' }:{strength?:number,children:any,className?:string}){
  const ref = useRef<HTMLDivElement>(null)
  function move(e: React.MouseEvent){ const b=ref.current?.getBoundingClientRect(); if(!b) return; const x=(e.clientX-(b.left+b.width/2))*strength; const y=(e.clientY-(b.top+b.height/2))*strength; ref.current!.style.transform=`translate3d(${x}px,${y}px,0)` }
  function leave(){ if(ref.current) ref.current.style.transform='' }
  return <div className={className} onMouseMove={move} onMouseLeave={leave} ref={ref}>{children}</div>
}
