"use client";
import { useEffect, useMemo, useRef, useState } from "react";

function hourBand(d=new Date()){
  const h=d.getHours();
  if ((h>=7 && h<10) || (h>=12 && h<14) || (h>=17 && h<21)) return "peak";
  if ((h>=10 && h<12) || (h>=14 && h<17)) return "shoulder";
  return "off";
}
function bandRange(b:"peak"|"shoulder"|"off"){
  if(b==="peak") return [300,500] as const;
  if(b==="shoulder") return [150,300] as const;
  return [50,150] as const;
}
const clamp=(n:number,min:number,max:number)=>Math.max(min,Math.min(max,n));

export default function LiveCounter({ className="" }: { className?: string }){
  const band = useMemo(()=>hourBand(),[]);
  const [min,max] = bandRange(band);
  const seed = useMemo(()=>{
    const mid=(min+max)/2;
    return clamp(Math.round(mid + (Math.random()-0.5)*(max-min)*0.2),min,max);
  },[min,max]);
  const [value,setValue]=useState(seed);
  const t=useRef<number|undefined>();

  useEffect(()=>{
    const center=(min+max)/2;
    const tick=()=>{
      setValue(v=>{
        const pull=(center - v)*0.05;           // gentle pull to center
        const noise=(Math.random()-0.5)*(max-min)*0.02; // small wiggle
        return clamp(Math.round(v + pull + noise), min, max);
      });
      t.current = window.setTimeout(tick, 1000 + Math.random()*1000);
    };
    t.current = window.setTimeout(tick, 1000);
    return ()=> t.current && clearTimeout(t.current);
  },[min,max]);

  return (
    <div className={className}>
      <div className="inline-flex items-baseline gap-2 rounded-xl bg-emerald-50 text-emerald-800 px-3 py-1.5 border border-emerald-200">
        <span className="text-lg">👀</span>
        <span className="text-sm">Live right now:</span>
        <strong className="text-xl tabular-nums">{value}</strong>
        <span className="text-sm">people filling the form</span>
      </div>
    </div>
  );
}
