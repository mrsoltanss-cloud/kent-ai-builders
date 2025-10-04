"use client";
import { useEffect, useMemo, useState } from "react";

function mulberry32(a:number){return function(){var t=a+=0x6D2B79F5;t=Math.imul(t^t>>>15, t|1);t^=t+Math.imul(t^t>>>7, t|61);return ((t^t>>>14)>>>0)/4294967296;}}
const pick = <T,>(rng:()=>number, arr:T[]) => arr[Math.floor(rng()*arr.length)];
const toPrice = (rng:()=>number, [min,max]:[number,number]) => {
  const v = Math.round(min + rng()*(max-min));
  return "£" + v.toLocaleString();
};

const firstNames = ["Sarah","Ahmed","Emma","Jack","Maya","David","Olivia","Liam","Noah","Hannah","James","Ava","Leo","Isla","Zara","Arjun","Chloe","Megan","Ben","Tom"];
const towns = ["Canterbury","Maidstone","Ashford","Dartford","Gravesend","Sevenoaks","Tonbridge","Tunbridge Wells","Chatham","Gillingham","Faversham","Whitstable","Herne Bay","Sittingbourne","Ramsgate","Deal","Dover"];
const jobs: Array<{label:string; range:[number,number]}> = [
  {label:"Kitchen renovation", range:[7000,28000]},
  {label:"Bathroom refurbishment", range:[3500,12000]},
  {label:"Loft conversion", range:[22000,48000]},
  {label:"House extension", range:[35000,95000]},
  {label:"Roof repair", range:[450,2500]},
  {label:"Full rewire", range:[3000,8000]},
  {label:"Boiler replacement", range:[1600,3500]},
  {label:"Garden landscaping", range:[1500,12000]},
];

export default function SocialProofTicker(){
  // Render a stable shell on server; build dataset after mount
  const [mounted,setMounted] = useState(false);
  const [dataset,setDataset] = useState<{id:string;text:string}[]>([]);
  const [idx,setIdx]=useState(0);

  useEffect(()=>{
    setMounted(true);
    // deterministically refresh dataset each 48h bucket
    const bucket = Math.floor(Date.now()/(48*3600*1000));
    const rng = mulberry32(bucket);
    const list = [];
    for(let i=0;i<12;i++){
      const f=pick(rng, firstNames);
      const t=pick(rng, towns);
      const j=pick(rng, jobs);
      list.push({
        id: `${bucket}-${i}`,
        text: `${f} from ${t} just booked a ${j.label} for ${toPrice(rng, j.range)} ✅`,
      });
    }
    setDataset(list);
  },[]);

  useEffect(()=>{
    if(!mounted || dataset.length===0) return;
    const id=setInterval(()=> setIdx(i=> (i+1)%dataset.length), 3800);
    return ()=> clearInterval(id);
  },[mounted,dataset.length]);

  return (
    <div className="rounded-xl border border-amber-300 bg-amber-100 text-amber-900 px-4 py-3 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="text-lg" aria-hidden>📣</span>
        <div className="relative h-6 overflow-hidden w-full">
          {/* placeholder line on server to keep markup stable */}
          {!mounted || dataset.length===0 ? (
            <div className="h-6 leading-6 font-medium tracking-tight" suppressHydrationWarning>
              Recent bookings are loading…
            </div>
          ) : (
            <div
              className="transition-transform duration-500 will-change-transform"
              style={{ transform: `translateY(-${idx*1.65}rem)` }}
            >
              {dataset.map(item=>(
                <div key={item.id} className="h-6 leading-6 font-medium tracking-tight">
                  {item.text}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
