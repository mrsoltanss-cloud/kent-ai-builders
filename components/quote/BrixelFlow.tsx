"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight, BadgeCheck, Camera, CheckCircle2, ChevronLeft, ChevronRight, Clock, Loader2,
  MapPin, Mic, MicOff, ShieldCheck, Star, Upload, X
} from "lucide-react";
import confetti from "canvas-confetti";
import FlowBackground from "./FlowBackground";
import FlowAssistant from "./FlowAssistant";
import FlowStep from "./FlowStep";
import { useDebounce } from "./useDebounce";

type Band = "under1k" | "1-3k" | "3-6k" | "6-10k" | "10-15k" | "15k+" | "not_sure";
const BAND_TO_RANGE: Record<Band, [number|null, number|null]> = {
  under1k: [0, 1000], "1-3k": [1000, 3000], "3-6k": [3000, 6000], "6-10k": [6000, 10000],
  "10-15k": [10000, 15000], "15k+": [15000, null], not_sure: [null, null],
};

const SERVICES = ["Kitchen renovation","Bathroom refurbishment","Loft conversion","House extension","Roofing","Electrical","Plumbing","Plastering","Painting","Flooring","General"];
const PROPERTY_TYPES = ["House","Flat","Bungalow","Commercial","Other"];
const AREAS = ["Kitchen","Bathroom","Bedroom","Living room","Hallway","Exterior","Roof","Garden","Other"];
const ACCESS = ["Parking available","Stairs only","Lift","Restricted hours","Pets at home","Occupied property","Empty property"];
const URGENCY = ["FLEXIBLE","SOON","URGENT"] as const;

type Wizard = {
  service: string;
  postcode: string;
  propertyType: string;
  areas: string[];
  scope: string;
  sizeSqm?: number | null;
  materialsBy?: "Homeowner"|"Builder"|"Mixed"|null;
  finish?: "Basic"|"Standard"|"Premium"|null;
  start?: "ASAP"|"2–4 weeks"|"1–3 months"|"Flexible"|"Pick a date"|null;
  urgency: typeof URGENCY[number] | null;
  budget: Band | null;
  access: string[];
  contactPref?: "Phone"|"Email"|"WhatsApp"|null;
  contactTime?: "Morning"|"Afternoon"|"Evening"|null;
  photos: string[];
};

const INITIAL: Wizard = {
  service: "", postcode: "", propertyType: "", areas: [], scope: "",
  urgency: null, budget: null, access: [], photos: [],
};

function LiveBelt() {
  return (
    <div className="sticky top-3 z-30 mx-auto max-w-6xl px-4">
      <div className="relative overflow-hidden rounded-2xl border border-emerald-100 bg-white/80 p-4 backdrop-blur">
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
  );
}

function Chip({ active, onClick, children }: { active?: boolean; onClick?: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-sm transition ${active ? "border-emerald-300 bg-emerald-50" : "border-gray-300 hover:bg-gray-50"}`}
    >
      {children}
    </button>
  );
}

function useVoiceInput() {
  const recRef = useRef<any>(null);
  const [listening, setListening] = useState(false);

  function start(setter: (v: string) => void) {
    // @ts-ignore
    const SR = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.lang = "en-GB";
    rec.interimResults = true;
    rec.onresult = (e: any) => {
      let text = "";
      for (let i = e.resultIndex; i < e.results.length; i++) text += e.results[i][0].transcript;
      setter(text);
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    rec.start();
    recRef.current = rec;
    setListening(true);
  }
  function stop() { recRef.current?.stop?.(); setListening(false); }
  return { listening, start, stop };
}

export default function BrixelFlow() {
  const [step, setStep] = useState(0);
  const [hue, setHue] = useState(150);
  const [w, setW] = useState<Wizard>(INITIAL);

  const { listening, start, stop } = useVoiceInput();

  // photo previews (local only)
  async function addPhotos(files: FileList | null) {
    if (!files) return;
    const arr = await Promise.all(Array.from(files).slice(0, 6 - w.photos.length).map(f => new Promise<string>((res) => {
      const r = new FileReader(); r.onload = () => res(String(r.result)); r.readAsDataURL(f);
    })));
    setW(s => ({ ...s, photos: [...s.photos, ...arr].slice(0, 6) }));
  }
  const removePhoto = (i: number) => setW(s => ({ ...s, photos: s.photos.filter((_, idx) => idx !== i) }));

  // dynamic hue per service (subtle mood)
  useEffect(() => {
    const idx = Math.max(0, SERVICES.indexOf(w.service));
    setHue(120 + idx * 12);
  }, [w.service]);

  // Live estimate
  const debounced = useDebounce(w, 400);
  const [estimating, setEstimating] = useState(false);
  const [estimate, setEstimate] = useState<{ low: number; high: number; rationale?: string } | null>(null);
  useEffect(() => {
    if (!debounced.service || !debounced.urgency) { setEstimate(null); return; }
    let ignore = false;
    (async () => {
      setEstimating(true);
      try {
        const r = await fetch("/api/aiQuote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            service: debounced.service,
            details: debounced.scope,
            sqm: debounced.sizeSqm ?? undefined,
            urgency: debounced.urgency,
            budget: debounced.budget ?? undefined,
          }),
        });
        const j = await r.json().catch(() => null);
        if (!ignore && j?.estimate) setEstimate(j.estimate);
      } catch {}
      finally { if (!ignore) setEstimating(false); }
    })();
    return () => { ignore = true; };
  }, [debounced.service, debounced.scope, debounced.sizeSqm, debounced.urgency, debounced.budget]);

  // Validations per step
  const canNext = useMemo(() => {
    if (step === 0) return !!w.service && !!w.postcode && !!w.propertyType;
    if (step === 1) return w.scope.trim().length > 5;
    if (step === 2) return !!w.urgency && !!w.budget;
    if (step === 3) return !!w.contactPref;
    return true;
  }, [step, w]);

  // Summary sentence for media-level polish
  const summary = useMemo(() => {
    const bits = [
      w.service || "Project",
      w.sizeSqm ? `(~${w.sizeSqm} sqm)` : "",
      w.finish ? `${w.finish.toLowerCase()} finish` : "",
      w.postcode ? `in ${w.postcode}` : "",
      w.start ? `starting ${w.start.toLowerCase()}` : "",
      w.budget ? `budget ${w.budget.replace("under1k", "<£1k")}` : "",
    ].filter(Boolean);
    return bits.join(", ");
  }, [w]);

  // Submit → create lead
  async function submit() {
    const [priceMin, priceMax] = w.budget ? BAND_TO_RANGE[w.budget] : [null, null];
    const meta = {
      propertyType: w.propertyType,
      areas: w.areas,
      sizeSqm: w.sizeSqm ?? null,
      materialsBy: w.materialsBy ?? null,
      finish: w.finish ?? null,
      start: w.start ?? null,
      contactPref: w.contactPref ?? null,
      contactTime: w.contactTime ?? null,
      access: w.access,
      photos: w.photos.map((p) => ({ url: p })),
      summary,
    };
    const res = await fetch("/api/lead", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service: w.service, details: w.scope, postcode: w.postcode,
        urgency: w.urgency, priceMin, priceMax, meta,
      }),
    });
    if (res.ok) {
      confetti({ particleCount: 140, spread: 70, origin: { y: 0.25 } });
      setTimeout(() => { window.location.href = "/quote#thanks"; }, 650);
    } else {
      alert("Couldn't submit your request. Please try again.");
    }
  }

  // Assistant tips per step
  const tip = [
    "Tip: Pick the closest service — you can refine the scope next.",
    "Photos boost accuracy. Try 3–5 wide shots with good light.",
    "Budget isn't a commitment — it helps filter the right pros.",
    "Prefer WhatsApp? Builders tend to reply faster there.",
  ][Math.min(step, 3)];

  return (
    <>
      <FlowBackground hue={hue} />
      <LiveBelt />
      <div className="mx-auto mt-4 max-w-6xl px-4 pb-24">
        <div className="grid gap-6 md:grid-cols-3">
          {/* Left: steps */}
          <div className="md:col-span-2 space-y-6">
            <AnimatePresence mode="wait">
              {step === 0 && (
                <FlowStep k={1} title="What are we building?" subtitle="Type or speak, then add location and property.">
                  <div className="grid gap-4">
                    <div>
                      <div className="mb-2 text-sm font-medium">Select a service</div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {SERVICES.map((s) => (
                          <Chip key={s} active={w.service === s} onClick={() => setW(v => ({ ...v, service: s }))}>{s}</Chip>
                        ))}
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-sm font-medium">Postcode</label>
                        <div className="relative">
                          <input
                            value={w.postcode}
                            onChange={(e) => setW(v => ({ ...v, postcode: e.target.value.trim().toUpperCase() }))}
                            placeholder="ME14"
                            className="w-full rounded-xl border border-gray-300 px-3 py-2.5 pl-9 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                          />
                          <MapPin className="absolute left-2.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-gray-400" />
                        </div>
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium">Property</label>
                        <div className="flex flex-wrap gap-2">
                          {PROPERTY_TYPES.map(p => (
                            <Chip key={p} active={w.propertyType === p} onClick={() => setW(v => ({ ...v, propertyType: p }))}>{p}</Chip>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="mb-1 flex items-center justify-between">
                        <label className="block text-sm font-medium">Tell us briefly what needs doing</label>
                        <button
                          type="button"
                          onClick={() => (listening ? stop() : start((t) => setW(v => ({ ...v, scope: t }))))}
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs ${listening ? "border-emerald-300 bg-emerald-50 text-emerald-700" : "border-gray-300 text-gray-600 hover:bg-gray-50"}`}
                        >
                          {listening ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />} {listening ? "Listening…" : "Voice"}
                        </button>
                      </div>
                      <textarea
                        value={w.scope}
                        onChange={(e) => setW(v => ({ ...v, scope: e.target.value }))}
                        rows={4}
                        className="w-full rounded-xl border border-gray-300 px-3 py-2.5 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                        placeholder="E.g., Full bathroom refurb with walk-in shower, tile 12 sqm walls, tile 6 sqm floor, move 2 sockets."
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium">Rooms/areas (optional)</label>
                      <div className="flex flex-wrap gap-2">
                        {AREAS.map(a => {
                          const active = w.areas.includes(a);
                          return (
                            <Chip
                              key={a}
                              active={active}
                              onClick={() => setW(v => ({ ...v, areas: active ? v.areas.filter(x => x !== a) : [...v.areas, a] }))}
                            >
                              {a}
                            </Chip>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </FlowStep>
              )}

              {step === 1 && (
                <FlowStep k={2} title="Show me your space" subtitle="Add a few photos — our AI will scan and guide.">
                  <div className="grid gap-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-2 text-sm hover:bg-gray-100">
                        <Upload className="h-4 w-4" /> Add photos
                        <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => addPhotos(e.target.files)} />
                      </label>
                      <span className="text-xs text-gray-500">3–5 wide shots are perfect.</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {w.photos.map((src, i) => (
                        <div key={i} className="relative h-24 w-full overflow-hidden rounded-lg border bg-white">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={src} alt={`photo-${i}`} className="h-full w-full object-cover" />
                          <button type="button" onClick={() => removePhoto(i)} className="absolute right-1 top-1 rounded bg-black/60 p-0.5 text-white">
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                      <div>
                        <label className="mb-1 block text-sm font-medium">Approx. size (sqm)</label>
                        <input
                          type="number"
                          min={0}
                          inputMode="decimal"
                          value={w.sizeSqm ?? ""}
                          onChange={(e) => setW(v => ({ ...v, sizeSqm: e.target.value ? Number(e.target.value) : null }))}
                          className="w-full rounded-xl border border-gray-300 px-3 py-2.5 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium">Materials by</label>
                        <div className="flex flex-wrap gap-2">
                          {["Homeowner", "Builder", "Mixed"].map((m) => (
                            <Chip key={m} active={w.materialsBy === m} onClick={() => setW(v => ({ ...v, materialsBy: m as any }))}>{m}</Chip>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium">Finish level</label>
                        <div className="flex flex-wrap gap-2">
                          {["Basic", "Standard", "Premium"].map((m) => (
                            <Chip key={m} active={w.finish === m} onClick={() => setW(v => ({ ...v, finish: m as any }))}>{m}</Chip>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </FlowStep>
              )}

              {step === 2 && (
                <FlowStep k={3} title="Let’s get practical" subtitle="When, budget, and how urgent?">
                  <div className="grid gap-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium">Start window</label>
                      <div className="flex flex-wrap gap-2">
                        {["ASAP","2–4 weeks","1–3 months","Flexible","Pick a date"].map(t => (
                          <Chip key={t} active={w.start === t} onClick={() => setW(v => ({ ...v, start: t as any }))}>{t}</Chip>
                        ))}
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-sm font-medium">Urgency</label>
                        <div className="flex gap-2">
                          {URGENCY.map(u => <Chip key={u} active={w.urgency === u} onClick={() => setW(v => ({ ...v, urgency: u }))}>{u}</Chip>)}
                        </div>
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium">Budget band</label>
                        <div className="flex flex-wrap gap-2">
                          {(["under1k","1-3k","3-6k","6-10k","10-15k","15k+","not_sure"] as Band[]).map(b => (
                            <Chip key={b} active={w.budget === b} onClick={() => setW(v => ({ ...v, budget: b }))}>
                              {b.replace("under1k","<£1k").replace("not_sure","Not sure")}
                            </Chip>
                          ))}
                        </div>
                        <p className="mt-1 text-xs text-gray-500">Not a commitment — helps filter the right pros.</p>
                      </div>
                    </div>
                  </div>
                </FlowStep>
              )}

              {step === 3 && (
                <FlowStep k={4} title="Access & contact" subtitle="Reality checks save time for everyone.">
                  <div className="grid gap-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium">Access</label>
                      <div className="flex flex-wrap gap-2">
                        {ACCESS.map(a => {
                          const active = w.access.includes(a);
                          return <Chip key={a} active={active} onClick={() => setW(v => ({ ...v, access: active ? v.access.filter(x => x !== a) : [...v.access, a] }))}>{a}</Chip>;
                        })}
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-sm font-medium">Preferred contact</label>
                        <div className="flex flex-wrap gap-2">
                          {["Phone","Email","WhatsApp"].map(c => <Chip key={c} active={w.contactPref === c} onClick={() => setW(v => ({ ...v, contactPref: c as any }))}>{c}</Chip>)}
                        </div>
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium">Best time</label>
                        <div className="flex flex-wrap gap-2">
                          {["Morning","Afternoon","Evening"].map(t => <Chip key={t} active={w.contactTime === t} onClick={() => setW(v => ({ ...v, contactTime: t as any }))}>{t}</Chip>)}
                        </div>
                      </div>
                    </div>
                  </div>
                </FlowStep>
              )}
            </AnimatePresence>

            <div className="flex items-center justify-between">
              <button
                onClick={() => setStep(s => Math.max(0, s - 1))}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-70"
                disabled={step === 0}
              >
                <ChevronLeft className="h-4 w-4" /> Back
              </button>
              {step < 3 ? (
                <button
                  onClick={() => setStep(s => Math.min(3, s + 1))}
                  disabled={!canNext}
                  className="group inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 font-medium text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-70"
                >
                  Continue <ChevronRight className="h-4 w-4 transition group-active:translate-x-0.5" />
                </button>
              ) : (
                <button
                  onClick={submit}
                  disabled={!canNext}
                  className="group inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 font-medium text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-70"
                >
                  Get my quote <ArrowRight className="h-4 w-4 transition group-active:translate-x-0.5" />
                </button>
              )}
            </div>
          </div>

          {/* Right: live AI + trust */}
          <div className="space-y-4">
            <div className="rounded-xl border border-emerald-100 bg-white/90 p-4 shadow-sm backdrop-blur">
              <div className="flex items-center gap-2 text-sm font-semibold text-emerald-800">
                <BadgeCheck className="h-4 w-4" /> AI guide price
              </div>
              <div className="mt-2 text-2xl font-semibold">
                {estimating ? (
                  <span className="inline-flex items-center gap-2 text-gray-500"><Loader2 className="h-5 w-5 animate-spin" /> Calculating…</span>
                ) : estimate ? (
                  <>£{estimate.low.toLocaleString()}–£{estimate.high.toLocaleString()}</>
                ) : (
                  <span className="text-gray-500">Add details to see a range</span>
                )}
              </div>
              {estimate?.rationale && <p className="mt-1 text-sm text-gray-600">{estimate.rationale}</p>}
              <p className="mt-2 text-xs text-gray-500">Typical for similar projects nearby (not a quote).</p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white/90 p-4 shadow-sm backdrop-blur">
              <div className="mb-2 text-sm font-semibold">Your brief (live)</div>
              <ul className="space-y-1 text-sm text-gray-700">
                <li><span className="text-gray-500">Summary:</span> {summary || "—"}</li>
                <li><span className="text-gray-500">Service:</span> {w.service || "—"}</li>
                <li><span className="text-gray-500">Property:</span> {w.propertyType || "—"}</li>
                <li><span className="text-gray-500">Areas:</span> {w.areas.length ? w.areas.join(", ") : "—"}</li>
                <li><span className="text-gray-500">Access:</span> {w.access.length ? w.access.join(", ") : "—"}</li>
                <li><span className="text-gray-500">Contact:</span> {w.contactPref || "—"} {w.contactTime ? `(${w.contactTime})` : ""}</li>
              </ul>
              {w.photos.length > 0 && (
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {w.photos.slice(0, 3).map((src, i) => <img key={i} src={src} alt={`p-${i}`} className="h-20 w-full rounded-md object-cover" />)}
                </div>
              )}
            </div>

            <div className="rounded-xl border border-gray-200 bg-white/90 p-4 text-sm text-gray-700 shadow-sm backdrop-blur">
              <div className="mb-1 font-semibold">Why homeowners choose us</div>
              <ul className="list-inside list-disc space-y-1 text-gray-600">
                <li>2,300+ successful projects</li>
                <li>4.9/5 rating</li>
                <li>£5m Public Liability cover</li>
                <li>12-month workmanship guarantee</li>
                <li>Verified & DBS-checked teams</li>
              </ul>
              <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                <Star className="h-3.5 w-3.5" /> Media-loved experience
              </div>
            </div>
          </div>
        </div>
      </div>

      <FlowAssistant tip={tip} />
    </>
  );
}
