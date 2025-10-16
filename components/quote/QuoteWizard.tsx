"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDebounce } from "./useDebounce";
import {
  Camera, CheckCircle2, ChevronLeft, ChevronRight, Clock, Loader2,
  MapPin, ShieldCheck, Sparkles, Star, Upload, X
} from "lucide-react";

type BudgetBand =
  | "1-3k" | "3-6k" | "6-10k" | "10-15k" | "15k+"
  | "under1k" | "not_sure";

const BUDGET_TO_RANGE: Record<BudgetBand, [number|null, number|null]> = {
  "under1k": [0, 1000],
  "1-3k": [1000, 3000],
  "3-6k": [3000, 6000],
  "6-10k": [6000, 10000],
  "10-15k": [10000, 15000],
  "15k+": [15000, null],
  "not_sure": [null, null],
};

const SERVICES = [
  "Kitchen renovation","Bathroom refurbishment","Loft conversion","House extension",
  "Roofing","Electrical","Plumbing","Plastering","Painting","Flooring","General"
];

const PROPERTY_TYPES = ["House","Flat","Bungalow","Commercial","Other"];
const AREAS = ["Kitchen","Bathroom","Bedroom","Living room","Hallway","Exterior","Roof","Garden","Other"];
const URGENCY = ["FLEXIBLE","SOON","URGENT"] as const;

type WizardState = {
  service: string;
  postcode: string;
  propertyType: string;
  areas: string[];
  sizeSqm?: number | null;
  sizeBand?: "Small"|"Medium"|"Large"|null;

  scopeSummary: string;
  materialsBy?: "Homeowner"|"Builder"|"Mixed"|null;
  finishLevel?: "Basic"|"Standard"|"Premium"|null;

  startWindow?: "ASAP"|"2–4 weeks"|"1–3 months"|"Flexible"|"Pick a date"|null;
  urgency: typeof URGENCY[number] | null;
  budgetBand: BudgetBand | null;

  access: string[];
  contactPref?: "Phone"|"Email"|"WhatsApp"|null;
  contactTime?: "Morning"|"Afternoon"|"Evening"|null;

  photos: string[]; // local preview data URLs
};

const INITIAL: WizardState = {
  service: "",
  postcode: "",
  propertyType: "",
  areas: [],
  scopeSummary: "",
  urgency: null,
  budgetBand: null,
  access: [],
  photos: [],
};

function LiveBadge() {
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-emerald-700 ring-1 ring-emerald-200">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-emerald-500 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-600" />
      </span>
      <span className="text-sm font-medium">Live now</span>
      <span className="mx-1 text-emerald-300">•</span>
      <span className="flex items-center gap-1 text-xs text-emerald-700/90">
        <Clock className="h-3.5 w-3.5" /> avg response ~6 min
      </span>
    </div>
  );
}

function Belt() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-emerald-100 bg-white/80 p-5 md:p-6 backdrop-blur">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_0%_0%,rgba(16,185,129,0.10),transparent_60%),radial-gradient(60%_50%_at_100%_0%,rgba(16,185,129,0.08),transparent_60%)]" />
        <svg className="absolute inset-0 h-full w-full opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
          <defs><pattern id="grid-q" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M32 0H0V32" fill="none" stroke="currentColor" strokeWidth=".5" />
          </pattern></defs>
          <rect width="100%" height="100%" fill="url(#grid-q)" className="text-emerald-700" />
        </svg>
      </div>

      <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold leading-snug md:text-3xl">
            Your instant, AI-powered quote — <span className="text-emerald-700">fair, fast, and guaranteed.</span>
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            No pushy sales calls. No guesswork. Just trusted local builders with 10+ years experience.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Chip icon={<Star className="h-4 w-4" />} text="4.9★ average" />
            <Chip icon={<ShieldCheck className="h-4 w-4" />} text="£5m insured" />
            <Chip icon={<CheckCircle2 className="h-4 w-4" />} text="DBS-checked teams" />
          </div>
        </div>
        <LiveBadge />
      </div>

      <div className="relative mt-5 grid gap-2 text-[13px] text-gray-600 md:grid-cols-3">
        <div className="rounded-lg border border-gray-200/70 bg-white/70 px-3 py-2">1. Job & postcode</div>
        <div className="rounded-lg border border-gray-200/70 bg-white/70 px-3 py-2">2. Scope & size</div>
        <div className="rounded-lg border border-gray-200/70 bg-white/70 px-3 py-2">3. Timing & access</div>
      </div>
    </div>
  );
}

function Chip({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-100 bg-white/70 px-3 py-2 text-sm text-gray-700 backdrop-blur">
      <span className="text-emerald-700">{icon}</span><span>{text}</span>
    </div>
  );
}

function useLocalPhotos() {
  const [photos, setPhotos] = useState<string[]>([]);
  async function onFiles(files: FileList | null) {
    if (!files) return;
    const list = await Promise.all(
      Array.from(files).slice(0, 6).map(
        f =>
          new Promise<string>((res) => {
            const reader = new FileReader();
            reader.onload = () => res(String(reader.result));
            reader.readAsDataURL(f);
          }),
      ),
    );
    setPhotos(prev => [...prev, ...list].slice(0, 6));
  }
  function removeAt(i: number) { setPhotos(p => p.filter((_, idx) => idx !== i)); }
  return { photos, onFiles, removeAt, setPhotos };
}

function StepHeader({ k, title, subtitle }: { k: number; title: string; subtitle: string }) {
  return (
    <div className="mb-4">
      <div className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Step {k}</div>
      <h2 className="mt-1 text-xl font-semibold">{title}</h2>
      <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
    </div>
  );
}

function EstimateCard({ estimate, loading }: { estimate: { low:number, high:number, rationale?:string } | null; loading:boolean }) {
  return (
    <div className="rounded-xl border border-emerald-100 bg-white/80 p-4 shadow-sm backdrop-blur">
      <div className="flex items-center gap-2 text-sm font-semibold text-emerald-800">
        <Sparkles className="h-4 w-4" /> AI estimate (guide)
      </div>
      <div className="mt-2 text-2xl font-semibold">
        {loading ? <span className="inline-flex items-center gap-2 text-gray-500"><Loader2 className="h-5 w-5 animate-spin" /> Calculating…</span>
        : estimate ? <>£{estimate.low.toLocaleString()}–£{estimate.high.toLocaleString()}</>
        : <span className="text-gray-500">Add details to see a range</span>}
      </div>
      {estimate?.rationale && <p className="mt-1 text-sm text-gray-600">{estimate.rationale}</p>}
      <p className="mt-2 text-xs text-gray-500">Not a quote, but typical for similar projects nearby.</p>
    </div>
  );
}

function Button({ children, onClick, variant="primary", disabled=false, type="button" }:{
  children: React.ReactNode, onClick?: ()=>void, variant?: "primary"|"ghost", disabled?: boolean, type?: "button"|"submit"
}) {
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className={
        variant==="primary"
        ? "inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 font-medium text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-70"
        : "inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-70"
      }>
      {children}
    </button>
  );
}

const card = { initial:{opacity:0,y:10}, animate:{opacity:1,y:0}, exit:{opacity:0,y:10} };

export default function QuoteWizard() {
  const [step, setStep] = useState(0);
  const [state, setState] = useState<WizardState>(INITIAL);
  const { photos, onFiles, removeAt, setPhotos } = useLocalPhotos();
  // bind photos to state
  useEffect(()=>{ setState(s => ({...s, photos})); },[photos]);

  // live estimate
  const debounced = useDebounce(state, 400);
  const [estLoading, setEstLoading] = useState(false);
  const [estimate, setEstimate] = useState<{low:number, high:number, rationale?:string} | null>(null);

  useEffect(() => {
    // only call when we have bare minimum
    if (!debounced.service || !debounced.urgency) { setEstimate(null); return; }
    let ignore=false;
    (async ()=>{
      setEstLoading(true);
      try {
        const r = await fetch("/api/aiQuote", {
          method: "POST",
          headers: {"Content-Type":"application/json"},
          body: JSON.stringify({
            service: debounced.service,
            details: debounced.scopeSummary || "",
            sqm: debounced.sizeSqm || undefined,
            urgency: debounced.urgency,
            budget: debounced.budgetBand || undefined,
          }),
        });
        const j = await r.json().catch(()=>null);
        if (!ignore && j?.estimate) setEstimate(j.estimate);
      } catch {}
      finally { if (!ignore) setEstLoading(false); }
    })();
    return ()=>{ ignore=true; };
  }, [debounced.service, debounced.scopeSummary, debounced.sizeSqm, debounced.urgency, debounced.budgetBand]);

  const canNext = useMemo(() => {
    if (step===0) return !!state.service && !!state.postcode && !!state.propertyType;
    if (step===1) return state.scopeSummary.trim().length > 5;
    if (step===2) return !!state.urgency && !!state.budgetBand;
    if (step===3) return !!state.contactPref;
    return true;
  }, [step, state]);

  async function submitLead() {
    const [priceMin, priceMax] = state.budgetBand ? BUDGET_TO_RANGE[state.budgetBand] : [null,null];
    const meta = {
      propertyType: state.propertyType,
      areas: state.areas,
      sizeSqm: state.sizeSqm ?? null,
      sizeBand: state.sizeBand ?? null,
      materialsBy: state.materialsBy ?? null,
      finishLevel: state.finishLevel ?? null,
      startWindow: state.startWindow ?? null,
      contactPref: state.contactPref ?? null,
      contactTime: state.contactTime ?? null,
      access: state.access,
      photos: state.photos?.map((p)=>({url:p})) ?? [],
    };
    const res = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service: state.service,
        details: state.scopeSummary,
        postcode: state.postcode,
        urgency: state.urgency,
        priceMin, priceMax,
        meta,
      }),
    });
    if (res.ok) {
      window.location.href = "/quote#thanks";
    } else {
      alert("Couldn't submit your request. Please try again.");
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
      <Belt />
      <div className="grid gap-6 md:grid-cols-3">
        {/* Left: steps */}
        <div className="md:col-span-2 space-y-6">
          <AnimatePresence mode="wait">
            {step===0 && (
              <motion.div key="s0" {...card} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <StepHeader k={1} title="Job & location" subtitle="Tell us what you need and where." />
                <div className="grid gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium">Select service type</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {SERVICES.map(s => (
                        <button key={s} onClick={()=>setState(v=>({...v, service:s}))}
                          className={`rounded-lg border px-3 py-2 text-sm text-left hover:bg-gray-50 ${state.service===s ? "border-emerald-300 bg-emerald-50" : "border-gray-300"}`}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium">Postcode</label>
                      <div className="relative">
                        <input value={state.postcode} onChange={e=>setState(v=>({...v, postcode:e.target.value.trim().toUpperCase()}))}
                          placeholder="ME14" className="w-full rounded-xl border border-gray-300 px-3 py-2.5 pl-9 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100" />
                        <MapPin className="absolute left-2.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-gray-400" />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">Property type</label>
                      <div className="flex flex-wrap gap-2">
                        {PROPERTY_TYPES.map(p => (
                          <button key={p} onClick={()=>setState(v=>({...v, propertyType:p}))}
                            className={`rounded-full border px-3 py-1.5 text-sm ${state.propertyType===p ? "border-emerald-300 bg-emerald-50" : "border-gray-300"}`}>{p}</button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">Rooms/areas (optional)</label>
                    <div className="flex flex-wrap gap-2">
                      {AREAS.map(a => {
                        const active = state.areas.includes(a);
                        return (
                          <button key={a} onClick={()=>setState(v=>({...v, areas: active ? v.areas.filter(x=>x!==a) : [...v.areas,a]}))}
                            className={`rounded-full border px-3 py-1.5 text-sm ${active ? "border-emerald-300 bg-emerald-50" : "border-gray-300"}`}>{a}</button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step===1 && (
              <motion.div key="s1" {...card} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <StepHeader k={2} title="Scope & size" subtitle="Help our AI and builders understand the work." />
                <div className="grid gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium">Describe the work</label>
                    <textarea value={state.scopeSummary}
                      onChange={e=>setState(v=>({...v, scopeSummary:e.target.value}))}
                      rows={4} className="w-full rounded-xl border border-gray-300 px-3 py-2.5 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                      placeholder="E.g., remove old suite, install walk-in shower, tile 12 sqm walls and 6 sqm floor, move 2 sockets." />
                    <p className="mt-1 text-xs text-gray-500">Clear scope = sharper quotes. Mention inclusions/exclusions.</p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <label className="mb-1 block text-sm font-medium">Approx. size (sqm)</label>
                      <input type="number" min={0} inputMode="decimal" value={state.sizeSqm ?? ""} onChange={e=>setState(v=>({...v, sizeSqm: e.target.value? Number(e.target.value): null}))}
                        className="w-full rounded-xl border border-gray-300 px-3 py-2.5 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100" />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">Materials supplied by</label>
                      <div className="flex flex-wrap gap-2">
                        {["Homeowner","Builder","Mixed"].map(m=>(
                          <button key={m} onClick={()=>setState(v=>({...v, materialsBy: m as any}))}
                            className={`rounded-full border px-3 py-1.5 text-sm ${state.materialsBy===m ? "border-emerald-300 bg-emerald-50" : "border-gray-300"}`}>{m}</button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">Finish level</label>
                      <div className="flex flex-wrap gap-2">
                        {["Basic","Standard","Premium"].map(m=>(
                          <button key={m} onClick={()=>setState(v=>({...v, finishLevel: m as any}))}
                            className={`rounded-full border px-3 py-1.5 text-sm ${state.finishLevel===m ? "border-emerald-300 bg-emerald-50" : "border-gray-300"}`}>{m}</button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">Photos (optional)</label>
                    <div className="flex flex-wrap items-center gap-3">
                      <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-2 text-sm hover:bg-gray-100">
                        <Upload className="h-4 w-4" /> Add photos
                        <input type="file" accept="image/*" multiple className="hidden" onChange={e=>onFiles(e.target.files)} />
                      </label>
                      {photos.map((src, i)=>(
                        <div key={i} className="relative h-16 w-20 overflow-hidden rounded-lg border bg-white">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={src} alt={`photo-${i}`} className="h-full w-full object-cover" />
                          <button type="button" onClick={()=>removeAt(i)}
                            className="absolute right-1 top-1 rounded bg-black/60 p-0.5 text-white"><X className="h-3.5 w-3.5" /></button>
                        </div>
                      ))}
                    </div>
                    <p className="mt-1 text-xs text-gray-500">3–5 wide shots are perfect. Close-ups for issues.</p>
                  </div>
                </div>
              </motion.div>
            )}

            {step===2 && (
              <motion.div key="s2" {...card} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <StepHeader k={3} title="Timing & budget" subtitle="Set expectations so we can match the right pros." />
                <div className="grid gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium">When do you want to start?</label>
                    <div className="flex flex-wrap gap-2">
                      {["ASAP","2–4 weeks","1–3 months","Flexible","Pick a date"].map(t=>(
                        <button key={t} onClick={()=>setState(v=>({...v, startWindow: t as any}))}
                          className={`rounded-full border px-3 py-1.5 text-sm ${state.startWindow===t ? "border-emerald-300 bg-emerald-50" : "border-gray-300"}`}>{t}</button>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium">Urgency</label>
                      <div className="flex gap-2">
                        {URGENCY.map(u=>(
                          <button key={u} onClick={()=>setState(v=>({...v, urgency: u}))}
                            className={`rounded-full border px-3 py-1.5 text-sm ${state.urgency===u ? "border-emerald-300 bg-emerald-50" : "border-gray-300"}`}>{u}</button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">Budget</label>
                      <div className="flex flex-wrap gap-2">
                        {(["under1k","1-3k","3-6k","6-10k","10-15k","15k+","not_sure"] as BudgetBand[]).map(b=>(
                          <button key={b} onClick={()=>setState(v=>({...v, budgetBand: b}))}
                            className={`rounded-full border px-3 py-1.5 text-sm ${state.budgetBand===b ? "border-emerald-300 bg-emerald-50" : "border-gray-300"}`}>{b.replace("k","+k").replace("under1k","<£1k").replace("not_sure","Not sure")}</button>
                        ))}
                      </div>
                      <p className="mt-1 text-xs text-gray-500">A band helps filter the right pros — it’s not a commitment.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step===3 && (
              <motion.div key="s3" {...card} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <StepHeader k={4} title="Access & contact" subtitle="Reality checks save time for everyone." />
                <div className="grid gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium">Access</label>
                    <div className="flex flex-wrap gap-2">
                      {["Parking available","Stairs only","Lift","Restricted hours","Pets at home","Occupied property","Empty property"].map(a=>{
                        const active = state.access.includes(a);
                        return (
                          <button key={a} onClick={()=>setState(v=>({...v, access: active ? v.access.filter(x=>x!==a) : [...v.access,a]}))}
                            className={`rounded-full border px-3 py-1.5 text-sm ${active ? "border-emerald-300 bg-emerald-50" : "border-gray-300"}`}>{a}</button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium">Preferred contact</label>
                      <div className="flex flex-wrap gap-2">
                        {["Phone","Email","WhatsApp"].map(c=>(
                          <button key={c} onClick={()=>setState(v=>({...v, contactPref: c as any}))}
                            className={`rounded-full border px-3 py-1.5 text-sm ${state.contactPref===c ? "border-emerald-300 bg-emerald-50" : "border-gray-300"}`}>{c}</button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">Best time</label>
                      <div className="flex flex-wrap gap-2">
                        {["Morning","Afternoon","Evening"].map(t=>(
                          <button key={t} onClick={()=>setState(v=>({...v, contactTime: t as any}))}
                            className={`rounded-full border px-3 py-1.5 text-sm ${state.contactTime===t ? "border-emerald-300 bg-emerald-50" : "border-gray-300"}`}>{t}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={()=>setStep(s=>Math.max(0,s-1))} disabled={step===0}>
              <ChevronLeft className="h-4 w-4" /> Back
            </Button>
            {step<3 ? (
              <Button onClick={()=>setStep(s=>Math.min(3,s+1))} disabled={!canNext}>
                Continue <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={submitLead} disabled={!canNext}>
                Get my quote <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Right: live AI estimate + summary */}
        <div className="space-y-4">
          <EstimateCard estimate={estimate} loading={estLoading} />
          <div className="rounded-xl border border-gray-200 bg-white/80 p-4 shadow-sm backdrop-blur">
            <div className="mb-2 text-sm font-semibold">Your brief</div>
            <ul className="space-y-1 text-sm text-gray-700">
              <li><span className="text-gray-500">Service:</span> {state.service || "—"}</li>
              <li><span className="text-gray-500">Postcode:</span> {state.postcode || "—"}</li>
              <li><span className="text-gray-500">Property:</span> {state.propertyType || "—"}</li>
              <li><span className="text-gray-500">Areas:</span> {state.areas.length? state.areas.join(", "): "—"}</li>
              <li><span className="text-gray-500">Size:</span> {state.sizeSqm? `${state.sizeSqm} sqm` : "—"}</li>
              <li><span className="text-gray-500">Materials:</span> {state.materialsBy || "—"}</li>
              <li><span className="text-gray-500">Finish:</span> {state.finishLevel || "—"}</li>
              <li><span className="text-gray-500">Urgency:</span> {state.urgency || "—"}</li>
              <li><span className="text-gray-500">Budget:</span> {state.budgetBand ? state.budgetBand.replace("under1k","<£1k") : "—"}</li>
              <li><span className="text-gray-500">Contact:</span> {state.contactPref || "—"} {state.contactTime ? `(${state.contactTime})` : ""}</li>
            </ul>
            {state.photos?.length ? (
              <div className="mt-3 grid grid-cols-3 gap-2">
                {state.photos.slice(0,3).map((src,i)=>(
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={i} src={src} alt={`preview-${i}`} className="h-20 w-full rounded-md object-cover" />
                ))}
              </div>
            ): null}
          </div>

          <div className="rounded-xl border border-gray-200 bg-white/80 p-4 text-sm text-gray-700 shadow-sm backdrop-blur">
            <div className="mb-1 font-semibold">Why homeowners choose us</div>
            <ul className="list-inside list-disc space-y-1 text-gray-600">
              <li>2,300+ successful projects</li>
              <li>4.9/5 rating</li>
              <li>£5m Public Liability cover</li>
              <li>12-month workmanship guarantee</li>
              <li>Verified & DBS-checked teams</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
