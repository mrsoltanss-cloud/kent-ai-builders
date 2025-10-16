"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowRight, BadgeCheck, Calendar, ChevronLeft, ChevronRight, Clock,
  Loader2, MapPin, Mic, MicOff, Upload, X, MessageCircle, Search
} from "lucide-react";
import confetti from "canvas-confetti";

/** ---- Minimal helpers ---- */

function Chip({ active, onClick, children }: { active?: boolean; onClick?: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-sm transition ${
        active ? "border-emerald-300 bg-emerald-50" : "border-gray-300 hover:bg-gray-50"
      }`}
    >
      {children}
    </button>
  );
}

type CommandProps = {
  open: boolean;
  onClose: () => void;
  services: string[];
  onSelect: (service: string) => void;
};
function fuzzyScore(q: string, s: string) {
  const t = s.toLowerCase();
  let score = 0, i = 0;
  if (t.startsWith(q)) score += 100;
  for (const c of q) {
    const j = t.indexOf(c, i);
    if (j === -1) return -1;
    score += Math.max(1, 10 - (j - i));
    i = j + 1;
  }
  return score;
}
function CommandSearch({ open, onClose, services, onSelect }: CommandProps) {
  const [query, setQuery] = useState("");
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowDown") { e.preventDefault(); setIdx(i => Math.min(i + 1, 9)); }
      if (e.key === "ArrowUp") { e.preventDefault(); setIdx(i => Math.max(i - 1, 0)); }
      if (e.key === "Enter") { e.preventDefault(); onSelect(results[idx]?.text); onClose(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, idx]); // eslint-disable-line

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return services.slice(0, 10).map((s) => ({ text: s, score: 0 }));
    return services
      .map((s) => ({ text: s, score: fuzzyScore(q, s) }))
      .filter((r) => r.score >= 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  }, [query, services]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80] bg-black/40 backdrop-blur-sm">
      <div className="absolute inset-0 grid place-items-start md:place-items-center pt-12 md:pt-0">
        <div className="w-[min(680px,92vw)] overflow-hidden rounded-3xl border border-white/40 bg-white/90 shadow-[0_30px_120px_rgba(0,0,0,0.25)]">
          <div className="border-b border-white/60">
            <div className="relative flex items-center gap-2 px-4 py-3">
              <Search className="h-5 w-5 text-emerald-700" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search services…  (Try “kitchen”, “roof”, “solar”…)"
                className="h-10 w-full bg-transparent text-base outline-none placeholder:text-gray-500"
              />
              <button onClick={onClose} className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100" aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
          <ul className="max-h-[56vh] overflow-auto p-2">
            {results.map((r, i) => (
              <li key={r.text}>
                <button
                  onMouseEnter={() => setIdx(i)}
                  onClick={() => { onSelect(r.text); onClose(); }}
                  className={`group flex w-full items-center justify-between rounded-2xl px-3 py-3 text-left ${
                    i === idx ? "bg-emerald-50 ring-1 ring-emerald-200" : "hover:bg-gray-50"
                  }`}
                >
                  <span className="text-sm text-gray-800">{r.text}</span>
                </button>
              </li>
            ))}
            {results.length === 0 && <li className="px-4 py-6 text-sm text-gray-500">No matches. Try a broader term.</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}

/** ---- Flow ---- */

type Band = "under1k" | "1-3k" | "3-6k" | "6-10k" | "10-15k" | "15k+" | "not_sure";
const BAND_TO_RANGE: Record<Band, [number|null, number|null]> = {
  under1k: [0, 1000], "1-3k": [1000, 3000], "3-6k": [3000, 6000], "6-10k": [6000, 10000],
  "10-15k": [10000, 15000], "15k+": [15000, null], not_sure: [null, null],
};

const SERVICES = [
  "Kitchen renovation","Bathroom refurbishment","Roofing","Electrical","Plumbing","House extension",
  "Loft conversion","Plastering","Painting","Flooring","Windows & doors","Decking","Landscaping",
  "Driveway","Fencing","Bricklaying","Carpentry & joinery","Garage conversion","Solar PV","EV charger",
  "Boiler & heating","Underfloor heating","Tiling","Rendering","Insulation","Soundproofing","Smart home",
  "CCTV & alarms","Guttering","Flat roof","Pitched roof","Skylights","Wet room","Sauna/steam","Swimming pool",
  "Garden office","Shed build","Garden lighting","Irrigation","Tree surgery","Pond/water feature",
  "Basement conversion","Damp proofing","Structural engineer","Architectural design","Planning consultancy",
  "Removals","Cleaning (builders)","Waste removal","Scaffolding","Glazing","Steel fabrication",
  "Stonework","Thatched roofing","Heritage restoration","Floor sanding","Polished concrete","Resin flooring"
];

const PROPERTY_TYPES = ["House","Flat","Bungalow","Commercial","Other"];
const AREAS = ["Kitchen","Bathroom","Bedroom","Living room","Hallway","Exterior","Roof","Garden","Other"];
const ACCESS = ["Parking available","Stairs only","Lift","Restricted hours","Pets at home","Occupied property","Empty property"];
const URGENCY = ["FLEXIBLE","SOON","URGENT"] as const;

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

type Wizard = {
  service: string; postcode: string; propertyType: string; areas: string[];
  scope: string; sizeSqm?: number | null; materialsBy?: "Homeowner"|"Builder"|"Mixed"|null;
  finish?: "Basic"|"Standard"|"Premium"|null; start?: "ASAP"|"2–4 weeks"|"1–3 months"|"Flexible"|"Pick a date"|null;
  startDate?: string | null;
  urgency: typeof URGENCY[number] | null; budget: Band | null; access: string[];
  contactPref?: "WhatsApp"|null; contactTime?: "Morning"|"Afternoon"|"Evening"|null;
  whatsappAck?: boolean;
  photos: string[];
};
const INITIAL: Wizard = {
  service:"", postcode:"", propertyType:"", areas:[], scope:"", urgency:null, budget:null, access:[],
  contactPref: "WhatsApp", whatsappAck: false, startDate: null, photos:[]
};

export default function BrixelFlowV2() {
  const [step, setStep] = useState(0);
  const [w, setW] = useState<Wizard>(INITIAL);
  const [listening, setListening] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  // lightweight voice toggle (no Web Speech dependency)
  const toggleVoice = () => setListening(v => !v);

  // photos
  async function addPhotos(files: FileList | null) {
    if (!files) return;
    const list = await Promise.all(Array.from(files).slice(0, 6 - w.photos.length).map(f => new Promise<string>((res) => {
      const r = new FileReader(); r.onload = () => res(String(r.result)); r.readAsDataURL(f);
    })));
    setW(s => ({ ...s, photos: [...s.photos, ...list].slice(0,6)}));
  }
  const removePhoto = (i: number) => setW(s => ({ ...s, photos: s.photos.filter((_, idx) => idx !== i) }));

  // AI estimate
  const [estimating, setEstimating] = useState(false);
  const [estimate, setEstimate] = useState<{ low: number; high: number; rationale?: string } | null>(null);
  useEffect(() => {
    const t = setTimeout(async () => {
      if (!w.service || !w.urgency) { setEstimate(null); return; }
      setEstimating(true);
      try {
        const r = await fetch("/api/aiQuote", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            service: w.service, details: w.scope,
            sqm: w.sizeSqm ?? undefined, urgency: w.urgency, budget: w.budget ?? undefined,
          }),
        });
        const j = await r.json().catch(() => null);
        if (j?.estimate) setEstimate(j.estimate);
      } catch {}
      setEstimating(false);
    }, 420);
    return () => clearTimeout(t);
  }, [w.service, w.scope, w.sizeSqm, w.urgency, w.budget]);

  const trio = useMemo(() => {
    if (!estimate) return null;
    const low = Math.max(0, estimate.low);
    const high = Math.max(low, estimate.high);
    const mid = Math.round((low + high) / 2);
    return { essential: low, standard: mid, premium: Math.round(high * 1.1) };
  }, [estimate]);

  const canNext = useMemo(() => {
    if (step===0) return !!w.service && !!w.postcode && !!w.propertyType;
    if (step===1) return w.scope.trim().length > 5;
    if (step===2) return !!w.urgency && !!w.budget && (w.start==="Pick a date" ? !!w.startDate : true);
    if (step===3) return !!w.contactPref && (!!w.whatsappAck || false);
    return true;
  }, [step, w]);

  const summary = useMemo(() => {
    const bits = [
      w.service || "Project",
      w.sizeSqm ? `(~${w.sizeSqm} sqm)` : "",
      w.finish ? `${w.finish.toLowerCase()} finish` : "",
      w.postcode ? `in ${w.postcode}` : "",
      w.start ? `starting ${w.start.toLowerCase()}${w.start==="Pick a date"&&w.startDate?` (${w.startDate})`:""}` : "",
      w.budget ? `budget ${w.budget.replace("under1k","<£1k")}` : "",
    ].filter(Boolean);
    return bits.join(", ");
  }, [w]);

  function openWhatsApp() {
    if (!WA_NUMBER) return;
    const msg = `Hi Brixel — I just submitted a ${w.service || "project"} in ${w.postcode || "my area"}. Can you help me next steps?`;
    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  
  async function submit() {
    // Guard: WhatsApp consent required on step 3 (per your flow logic)
    if (w.contactPref === "WhatsApp" && !w.whatsappAck) {
      alert("Please tick the WhatsApp consent to continue.");
      return;
    }

    const BAND_TO_RANGE = {
      under1k: [0, 1000], "1-3k": [1000, 3000], "3-6k": [3000, 6000],
      "6-10k": [6000, 10000], "10-15k": [10000, 15000], "15k+": [15000, null], not_sure: [null, null],
    } as const;
    const [priceMin, priceMax] = w.budget ? (BAND_TO_RANGE as any)[w.budget] : [null, null];

    const meta = {
      propertyType: w.propertyType, areas: w.areas, sizeSqm: w.sizeSqm ?? null,
      materialsBy: w.materialsBy ?? null, finish: w.finish ?? null, start: w.start ?? null, startDate: w.startDate ?? null,
      contactPref: w.contactPref ?? null, contactTime: w.contactTime ?? null, access: w.access,
      photos: w.photos.map((p)=>({url:p})),
      summary,
    };

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service: w.service,
          details: w.scope,
          postcode: w.postcode,
          urgency: w.urgency,
          priceMin, priceMax,
          meta,
        }),
      });

      if (!res.ok) {
        alert("Couldn't submit your request. Please try again.");
        return;
      }

      // If WhatsApp consented and number configured, open chat in a new tab
      if (w.whatsappAck) {
        const msg = `Hi Brixel — my ${w.service || "project"} in ${w.postcode || "my area"}.
` +
                    `Summary: ${summary || "See details in my request."}
` +
                    `Can you help with next steps?`;
        openWhatsApp(msg);
      }

      // Redirect THIS tab to your success page (keep your existing route)
      const qp = new URLSearchParams({
        service: w.service || "",
        postcode: w.postcode || "",
        urgency: String(w.urgency || ""),
      });
      window.location.href = `/quote/success?${qp.toString()}#thanks`;
    } catch (e) {
      console.error(e);
      alert("Something went wrong. Please try again.");
    }
  }


  /** ---- UI ---- */

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-emerald-50 to-white">
      {/* Top belt */}
      <div className="sticky top-0 z-30 mx-auto max-w-6xl px-4 pt-4">
        <div className="rounded-2xl border border-emerald-100 bg-white/80 p-4 backdrop-blur">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="text-sm">
              <div className="text-gray-800 font-medium">Brixel Flow — conversational quotes</div>
              <div className="text-gray-600">Describe your project. Watch AI build a quote-ready brief.</div>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-emerald-700 ring-1 ring-emerald-200">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-600" />
              </span>
              <span className="text-sm font-medium">Live now</span>
              <span className="mx-1 text-emerald-300">•</span>
              <span className="flex items-center gap-1 text-xs text-emerald-700/90"><Clock className="h-3.5 w-3.5" /> avg response ~6 min</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-6 grid gap-6 md:grid-cols-3">
        {/* Left panels */}
        <div className="md:col-span-2 space-y-6">
          {step===0 && (
            <div className="rounded-3xl border bg-white/85 backdrop-blur p-5 shadow-sm">
              <div className="mb-1 text-lg font-semibold">What are we building?</div>
              <p className="mb-4 text-sm text-gray-600">Choose a service, add location & property.</p>

              <div className="grid gap-4">
                <div>
                  <button
                    type="button"
                    onClick={() => setShowPicker(true)}
                    className="group relative w-full overflow-hidden rounded-3xl border border-emerald-200/70 bg-white/80 p-5 text-left shadow-[0_10px_60px_rgba(16,185,129,0.08)] backdrop-blur hover:bg-white"
                  >
                    <div className="relative">
                      <div className="text-sm font-medium text-gray-700">Service</div>
                      <div className="mt-1 text-[22px] font-semibold text-gray-900">
                        {w.service ? w.service : "Search services…"}
                      </div>
                      <p className="mt-1 text-sm text-gray-500">Type to find anything — kitchens, roofing, solar, decking…</p>
                    </div>
                  </button>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {["Kitchen renovation","Bathroom refurbishment","Roofing","House extension","Plumbing","Electrical"].map((p)=>(
                      <button key={p} onClick={()=>setW(v=>({...v, service:p}))}
                        className="rounded-full border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50">{p}</button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium">Postcode</label>
                    <div className="relative">
                      <input value={w.postcode} onChange={e=>setW(v=>({...v, postcode:e.target.value.trim().toUpperCase()}))}
                        placeholder="ME14" className="w-full rounded-2xl border border-gray-300 px-3 py-2.5 pl-9 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100" />
                      <MapPin className="absolute left-2.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">Property</label>
                    <div className="flex flex-wrap gap-2">{PROPERTY_TYPES.map(p=>(
                      <Chip key={p} active={w.propertyType===p} onClick={()=>setW(v=>({...v, propertyType:p}))}>{p}</Chip>
                    ))}</div>
                  </div>
                </div>

                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <label className="block text-sm font-medium">Describe briefly</label>
                    <button type="button"
                      onClick={toggleVoice}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs ${listening?"border-emerald-300 bg-emerald-50 text-emerald-700":"border-gray-300 text-gray-600 hover:bg-gray-50"}`}>
                      {listening ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />} {listening ? "Listening…" : "Voice"}
                    </button>
                  </div>
                  <textarea value={w.scope} onChange={e=>setW(v=>({...v, scope:e.target.value}))} rows={4}
                    className="w-full rounded-2xl border border-gray-300 px-3 py-2.5 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                    placeholder="E.g., Full bathroom refurb with walk-in shower, tile 12 sqm walls and 6 sqm floor, move 2 sockets." />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">Rooms/areas (optional)</label>
                  <div className="flex flex-wrap gap-2">
                    {AREAS.map(a=>{
                      const active = w.areas.includes(a);
                      return <Chip key={a} active={active} onClick={()=>setW(v=>({...v, areas: active ? v.areas.filter(x=>x!==a) : [...v.areas,a]}))}>{a}</Chip>;
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step===1 && (
            <div className="rounded-3xl border bg-white/85 backdrop-blur p-5 shadow-sm">
              <div className="mb-1 text-lg font-semibold">Show me your space</div>
              <p className="mb-4 text-sm text-gray-600">Add a few photos — our AI will scan and guide.</p>

              <div className="grid gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-4 py-2 text-sm hover:bg-gray-100">
                    <Upload className="h-4 w-4" /> Add photos
                    <input type="file" accept="image/*" multiple className="hidden" onChange={e=>addPhotos(e.target.files)} />
                  </label>
                  <span className="text-xs text-gray-500">3–5 wide shots are perfect.</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {w.photos.map((src,i)=>(
                    <div key={i} className="relative h-24 w-full overflow-hidden rounded-xl border bg-white">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt={`photo-${i}`} className="h-full w-full object-cover" />
                      <button type="button" onClick={()=>removePhoto(i)} className="absolute right-1 top-1 rounded bg-black/60 p-0.5 text-white"><X className="h-3.5 w-3.5" /></button>
                    </div>
                  ))}
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="mb-1 block text-sm font-medium">Approx. size (sqm)</label>
                    <input type="number" min={0} inputMode="decimal" value={w.sizeSqm ?? ""} onChange={e=>setW(v=>({...v, sizeSqm: e.target.value ? Number(e.target.value) : null}))}
                      className="w-full rounded-2xl border border-gray-300 px-3 py-2.5 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">Materials by</label>
                    <div className="flex flex-wrap gap-2">{["Homeowner","Builder","Mixed"].map(m=>(
                      <Chip key={m} active={w.materialsBy===m} onClick={()=>setW(v=>({...v, materialsBy:m as any}))}>{m}</Chip>
                    ))}</div>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">Finish level</label>
                    <div className="flex flex-wrap gap-2">{["Basic","Standard","Premium"].map(m=>(
                      <Chip key={m} active={w.finish===m} onClick={()=>setW(v=>({...v, finish:m as any}))}>{m}</Chip>
                    ))}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step===2 && (
            <div className="rounded-3xl border bg-white/85 backdrop-blur p-5 shadow-sm">
              <div className="mb-1 text-lg font-semibold">Let’s get practical</div>
              <p className="mb-4 text-sm text-gray-600">When, budget, and how urgent?</p>

              <div className="grid gap-4">
                <div className="grid gap-3">
                  <label className="mb-1 block text-sm font-medium">Start window</label>
                  <div className="flex flex-wrap gap-2">
                    {["ASAP","2–4 weeks","1–3 months","Flexible","Pick a date"].map(t=>(
                      <Chip key={t} active={w.start===t} onClick={()=>setW(v=>({...v, start:t as any, startDate: t==="Pick a date" ? (v.startDate ?? "") : null}))}>{t}</Chip>
                    ))}
                  </div>
                  {w.start==="Pick a date" && (
                    <div className="relative w-64">
                      <input
                        type="date"
                        value={w.startDate ?? ""}
                        onChange={(e)=>setW(v=>({...v, startDate: e.target.value }))}
                        className="w-full rounded-2xl border border-gray-300 px-3 py-2.5 pl-10 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                      />
                      <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium">Urgency</label>
                    <div className="flex gap-2">
                      {URGENCY.map(u=> (
                        <Chip key={u} active={w.urgency===u} onClick={()=>setW(v=>({...v, urgency:u}))}>
                          {u === "FLEXIBLE" ? "Flexible" : u === "SOON" ? "Soon" : "Urgent"}
                        </Chip>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">Budget band</label>
                    <div className="flex flex-wrap gap-2">
                      {(["under1k","1-3k","3-6k","6-10k","10-15k","15k+","not_sure"] as Band[]).map(b=>(
                        <Chip key={b} active={w.budget===b} onClick={()=>setW(v=>({...v, budget:b}))}>
                          {b.replace("under1k","<£1k").replace("not_sure","Not sure")}
                        </Chip>
                      ))}
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Not a commitment — helps filter the right pros.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step===3 && (
            <div className="rounded-3xl border bg-white/85 backdrop-blur p-5 shadow-sm">
              <div className="mb-1 text-lg font-semibold">Access & contact</div>
              <p className="mb-4 text-sm text-gray-600">We don’t cold call — you control the conversation via WhatsApp.</p>

              <div className="grid gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">Access</label>
                  <div className="flex flex-wrap gap-2">
                    {ACCESS.map(a=>{
                      const active = w.access.includes(a);
                      return <Chip key={a} active={active} onClick={()=>setW(v=>({...v, access: active ? v.access.filter(x=>x!==a) : [...v.access,a]}))}>{a}</Chip>;
                    })}
                  </div>
                </div>

                <div className="rounded-2xl border border-emerald-200/70 bg-emerald-50/60 p-4">
                  <div className="mb-2 flex items-center gap-2 text-emerald-800">
                    <MessageCircle className="h-4 w-4" />
                    <strong className="text-sm">WhatsApp to continue</strong>
                  </div>
                  <p className="text-sm text-emerald-900/90">We never cold call. You’ll start the chat so you stay in control.</p>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <label className="inline-flex items-center gap-2 text-sm text-emerald-900/90">
                      <input
                        type="checkbox"
                        checked={w.whatsappAck ?? false}
                        onChange={(e)=>setW(v=>({...v, whatsappAck: e.target.checked, contactPref: "WhatsApp"}))}
                        className="h-4 w-4 rounded border-emerald-300 text-emerald-600 focus:ring-emerald-200"
                      />
                      I’ll message on WhatsApp to proceed.
                    </label>
                    {WA_NUMBER && (
                      <button
                        type="button"
                        onClick={openWhatsApp}
                        className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                      >
                        <MessageCircle className="h-4 w-4" /> Open WhatsApp
                      </button>
                    )}
                    {!WA_NUMBER && <span className="text-xs text-emerald-900/70">Set NEXT_PUBLIC_WHATSAPP_NUMBER to show a WhatsApp CTA</span>}
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">Best time (optional)</label>
                  <div className="flex flex-wrap gap-2">{["Morning","Afternoon","Evening"].map(t=>(
                    <Chip key={t} active={w.contactTime===t} onClick={()=>setW(v=>({...v, contactTime:t as any}))}>{t}</Chip>
                  ))}</div>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <button onClick={()=>setStep(s=>Math.max(0,s-1))}
              className="inline-flex items-center gap-2 rounded-2xl border border-gray-300 bg-white px-4 py-2.5 font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-70"
              disabled={step===0}>
              <ChevronLeft className="h-4 w-4" /> Back
            </button>
            {step<3 ? (
              <button onClick={()=>setStep(s=>Math.min(3,s+1))} disabled={!canNext}
                className="group inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2.5 font-medium text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-70">
                Continue <ChevronRight className="h-4 w-4 transition group-active:translate-x-0.5" />
              </button>
            ) : (
              <button onClick={submit} disabled={!canNext}
                className="group inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2.5 font-medium text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-70">
                Get my quote <ArrowRight className="h-4 w-4 transition group-active:translate-x-0.5" />
              </button>
            )}
          </div>
        </div>

        {/* Right rail: prices + brief */}
        <div className="space-y-4">
          <div className="rounded-3xl border border-emerald-100 bg-white/85 p-4 shadow-sm backdrop-blur">
            <div className="flex items-center gap-2 text-sm font-semibold text-emerald-800">
              <BadgeCheck className="h-4 w-4" /> AI guide price
            </div>

            {trio ? (
              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-2xl border border-gray-200 bg-white px-2 py-3">
                  <div className="text-[11px] uppercase tracking-wide text-gray-500">Essential</div>
                  <div className="text-lg font-semibold">£{trio.essential.toLocaleString()}</div>
                </div>
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-2 py-3">
                  <div className="text-[11px] uppercase tracking-wide text-emerald-700">Standard</div>
                  <div className="text-lg font-semibold text-emerald-800">£{trio.standard.toLocaleString()}</div>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-white px-2 py-3">
                  <div className="text-[11px] uppercase tracking-wide text-gray-500">Premium</div>
                  <div className="text-lg font-semibold">£{trio.premium.toLocaleString()}</div>
                </div>
              </div>
            ) : (
              <div className="mt-2 text-2xl font-semibold">
                {estimating ? (
                  <span className="inline-flex items-center gap-2 text-gray-500"><Loader2 className="h-5 w-5 animate-spin" /> Calculating…</span>
                ) : <span className="text-gray-500">Add details to see a range</span>}
              </div>
            )}

            {estimate?.rationale && <p className="mt-2 text-xs text-gray-600">{estimate.rationale}</p>}
            <p className="mt-2 text-[11px] text-gray-500">Typical for similar projects nearby (not a quote).</p>
          </div>

          <div className="rounded-3xl border border-white/60 bg-white/85 p-4 shadow-sm backdrop-blur">
            <div className="mb-2 text-sm font-semibold">Your brief (live)</div>
            <ul className="space-y-1 text-sm text-gray-700">
              <li><span className="text-gray-500">Summary:</span> {summary || "—"}</li>
              <li><span className="text-gray-500">Service:</span> {w.service || "—"}</li>
              <li><span className="text-gray-500">Property:</span> {w.propertyType || "—"}</li>
              <li><span className="text-gray-500">Areas:</span> {w.areas.length ? w.areas.join(", ") : "—"}</li>
              <li><span className="text-gray-500">Access:</span> {w.access.length ? w.access.join(", ") : "—"}</li>
              <li><span className="text-gray-500">Start:</span> {w.start || "—"}{w.start==="Pick a date"&&w.startDate?` (${w.startDate})`:""}</li>
              <li><span className="text-gray-500">Contact:</span> WhatsApp {w.whatsappAck ? "(acknowledged)" : "(to confirm)"}</li>
            </ul>
            {w.photos.length>0 && (
              <div className="mt-3 grid grid-cols-3 gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {w.photos.slice(0,3).map((src,i)=> <img key={i} src={src} alt={`p-${i}`} className="h-20 w-full rounded-md object-cover" />)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Spotlight */}
      <CommandSearch
        open={showPicker}
        onClose={() => setShowPicker(false)}
        services={SERVICES}
        onSelect={(s) => setW((v)=>({...v, service: s}))}
      />
    </div>
  );
}
