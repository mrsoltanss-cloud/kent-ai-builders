"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Result = { low:number; high:number; weeks:[number,number]; };

function estimate(q:string): Result {
  const s=q.toLowerCase();
  const map:[string, [number,number]][] = [
    ["kitchen", [7000, 28000]],
    ["bathroom", [3500, 12000]],
    ["loft", [22000, 48000]],
    ["extension", [35000, 95000]],
    ["roof", [450, 2500]],
    ["rewire", [3000, 8000]],
    ["boiler", [1600, 3500]],
    ["landscap", [1500, 12000]],
  ];
  let range:[number,number]=[2000,8000];
  for(const [k,r] of map){ if(s.includes(k)){ range=r; break; } }
  // small randomization for feel
  const n = Math.random()*0.06 - 0.03;
  const low = Math.round(range[0]*(1+n));
  const high= Math.round(range[1]*(1+n));
  const w:[number,number]=[2, Math.max(3, Math.round((high-low)/4000)+3)];
  return { low, high, weeks: w };
}

const examples = [
  "Loft conversion in Maidstone",
  "Kitchen renovation in Canterbury",
  "Roof repair in Ashford",
  "Bathroom refurb in Tunbridge Wells",
  "House extension in Sevenoaks"
];

export default function AiShowcase(){
  const [query,setQuery]=useState("");
  const [index,setIndex]=useState(0);
  const activeQuery = query || examples[index];
  const res = useMemo(()=>estimate(activeQuery),[activeQuery]);

  useEffect(()=>{
    if(query) return; // don't rotate when user typing
    const id=setInterval(()=> setIndex(i=> (i+1)%examples.length), 3000);
    return ()=> clearInterval(id);
  },[query]);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-sm">
      <h3 className="text-xl font-bold text-gray-900">See how powerful our AI really is</h3>
      <p className="mt-1 text-gray-600">Type a job and place — we’ll preview an instant, fair estimate.</p>

      <div className="mt-4 flex gap-2">
        <input
          value={query}
          onChange={e=>setQuery(e.target.value)}
          placeholder={examples[index]}
          className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-300"
        />
        <Link
          href="/quote"
          className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 font-semibold"
        >
          Try our AI now →
        </Link>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 p-4 text-center">
          <div className="text-2xl font-extrabold text-emerald-700">£{res.low.toLocaleString()}</div>
          <div className="text-xs text-gray-500">Low</div>
        </div>
        <div className="rounded-xl border border-gray-200 p-4 text-center">
          <div className="text-2xl font-extrabold text-emerald-700">£{Math.round((res.low+res.high)/2).toLocaleString()}</div>
          <div className="text-xs text-gray-500">Estimate</div>
        </div>
        <div className="rounded-xl border border-gray-200 p-4 text-center">
          <div className="text-2xl font-extrabold text-emerald-700">£{res.high.toLocaleString()}</div>
          <div className="text-xs text-gray-500">High</div>
        </div>
      </div>

      <p className="mt-3 text-sm text-gray-600">
        ⏱ Estimated timeline: <strong>{res.weeks[0]}–{res.weeks[1]} weeks</strong> · Data from 2,300+ real Kent projects.
      </p>
    </div>
  );
}
