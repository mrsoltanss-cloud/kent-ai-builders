"use client"
import AboutBusiness from "@/components/trade/AboutBusiness"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import RippleButton from "@/components/ui/RippleButton"
import TradeChips from "@/components/trade/TradeChips"
import PortfolioGrid from "@/components/trade/PortfolioGrid"

type Step = 0|1|2|3|4|5|6
const STEPS: string[] = [
  "Company details",
  "Trades & services",
  "Coverage area",
  "Portfolio",
  "Trust & verification",
  "Notifications",
  "Review & publish"
]

export default function OnboardingPage() {
  const [step,setStep]=useState<Step>(0)
  const [data,setData]=useState<any>({ radius: 15, trades: [], portfolio: [] })
  const percent = Math.round(((step+1)/STEPS.length)*100)
  const next = () => setStep(s => Math.min((STEPS.length-1) as Step, (s+1) as Step))
  const prev = () => setStep(s => Math.max(0 as Step, (s-1) as Step))
  const isReview = step === 6

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="mx-auto w-[min(1200px,96vw)] rounded-2xl bg-white text-slate-900 ring-1 ring-slate-200 shadow-[0_20px_60px_rgba(2,6,23,.08)] p-6 md:p-8">
        {/* Header + progress */}
        <div className="mb-6 flex items-center gap-4">
          <div className="relative grid place-items-center h-12 w-12">
            <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
              <path d="M18 2 a 16 16 0 1 1 0 32 a 16 16 0 1 1 0 -32" stroke="#e2e8f0" strokeWidth="4" fill="none"/>
              <path
                d="M18 2 a 16 16 0 1 1 0 32 a 16 16 0 1 1 0 -32"
                stroke="#22d3ee" strokeWidth="4" fill="none" strokeLinecap="round"
                strokeDasharray={`${percent},100`}
              />
            </svg>
            <div className="absolute text-xs font-semibold">{percent}%</div>
          </div>
          <div>
            <div className="text-sm text-slate-500">Builder onboarding</div>
            <div className="text-lg md:text-xl font-semibold">{STEPS[step]}</div>
          </div>
          <div className="ml-auto hidden md:block text-sm text-slate-500">
            {step+1} / {STEPS.length}
          </div>
        </div>

        {/* Body */}
        <div className={isReview ? "grid grid-cols-1 gap-6" : "grid md:grid-cols-[1fr,360px] gap-6"}>
          {/* LEFT: Step content */}
          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{opacity:0,y:12}}
                animate={{opacity:1,y:0}}
                exit={{opacity:0,y:-12}}
                transition={{duration:.35,ease:[0.25,0.1,0.25,1]}}
                className="rounded-xl border border-slate-200 p-5 bg-white"
              >
                {/* STEP 0: Company */}
                {step===0 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm mb-1 text-slate-700">Company name</label>
                      <input
                        className="w-full rounded-lg px-3 py-2 bg-white border border-slate-300 outline-none focus:ring-2 focus:ring-cyan-300"
                        value={data.companyName||''}
                        onChange={e=>setData({...data,companyName:e.target.value})}
                        placeholder="e.g. Kent Craft Builders Ltd"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm mb-1 text-slate-700">Phone</label>
                        <input
                          className="w-full rounded-lg px-3 py-2 bg-white border border-slate-300 outline-none focus:ring-2 focus:ring-cyan-300"
                          value={data.phone||''}
                          onChange={e=>setData({...data,phone:e.target.value})}
                          placeholder="07… / 01622…"
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-1 text-slate-700">Website (optional)</label>
                        <input
                          className="w-full rounded-lg px-3 py-2 bg-white border border-slate-300 outline-none focus:ring-2 focus:ring-cyan-300"
                          value={data.website||''}
                          onChange={e=>setData({...data,website:e.target.value})}
                          placeholder="https://…"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 1: Trades */}
                {step===1 && (
                  <div className="space-y-3">
                    <label className="block text-sm text-slate-700">Select your trades</label>
                    <TradeChips
                      value={data.trades||[]}
                      onChange={(v)=>setData({...data,trades:v})}
                      max={12}
                    />
                    <div className="text-xs text-slate-500">
                      Tip: pick the work you **love** to do — our matching favours quality & focus.
                    </div>
                  </div>
                )}

                {/* STEP 2: Coverage */}
                {step===2 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm mb-1 text-slate-700">Base postcode</label>
                      <input
                        className="w-full rounded-lg px-3 py-2 bg-white border border-slate-300 outline-none focus:ring-2 focus:ring-cyan-300 uppercase"
                        value={data.postcode||''}
                        onChange={e=>setData({...data,postcode:e.target.value.toUpperCase()})}
                        placeholder="e.g. ME14"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1 text-slate-700">Coverage radius (miles)</label>
                      <input
                        type="range" min={5} max={60} step={5}
                        value={data.radius||15}
                        onChange={e=>setData({...data,radius:parseInt(e.target.value)})}
                        className="w-full"
                      />
                      <div className="text-sm text-slate-600 mt-1">{data.radius||15} miles</div>
                    </div>
                  </div>
                )}

                {/* STEP 3: Portfolio */}
                {step===3 && (
                  <div className="space-y-4">
                    <div className="text-sm text-slate-700">
                      Add your first 3 showcase photos — recent work wins trust fast.
                    </div>
                    <PortfolioGrid
                      value={data.portfolio||[]}
                      onChange={(v)=>setData({...data, portfolio: v})}
                    />
                    <div className="text-xs text-slate-500">
                      Captions & AI suggestions coming next (e.g. “Loft dormer, Maidstone — £28k”).
                    </div>
                  </div>
                )}

                {/* STEP 4: Trust */}
                {step===4 && (
                  <div className="space-y-3 text-sm text-slate-700">
                    <div className="rounded-lg border border-slate-200 p-4 bg-slate-50">
                      <div className="font-medium">Verification steps (soon)</div>
                      <ul className="mt-2 list-disc pl-5 text-slate-600">
                        <li>ID check</li>
                        <li>Insurance proof</li>
                        <li>Trading history</li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* STEP 5: Notifications */}
                {step===5 && (
                  <div className="space-y-4">
                    <label className="block text-sm text-slate-700">Notifications</label>
                    {["New lead matches","Messages","Weekly tips"].map(k=>(
                      <label key={k} className="flex items-center gap-2 text-slate-700">
                        <input type="checkbox" defaultChecked onChange={()=>{}}/>
                        <span>{k}</span>
                      </label>
                    ))}
                  </div>
                )}

                {/* STEP 6: Review — full page, premium layout */}
                {isReview && (
                  <div className="space-y-6">
                    <div className="rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 text-white p-5 ring-1 ring-slate-700">
                      <div className="text-sm opacity-80">Publish overview</div>
                      <div className="mt-1 text-xl font-semibold">Everything looks good.</div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm">
                          📍 {data.postcode || "No postcode"} · {data.radius||15}mi
                        </span>
                        <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm">
                          🧰 {(data.trades||[]).length} trades
                        </span>
                        <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm">
                          🖼️ {(data.portfolio||[]).length} photos
                        </span>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="rounded-xl border border-slate-200 p-4">
                        <div className="text-sm font-medium mb-3">Company</div>
                        <dl className="text-sm text-slate-700 grid grid-cols-3 gap-y-2">
                          <dt className="col-span-1 text-slate-500">Name</dt>
                          <dd className="col-span-2">{data.companyName || "—"}</dd>

                          <dt className="col-span-1 text-slate-500">Phone</dt>
                          <dd className="col-span-2">{data.phone || "—"}</dd>

                          <dt className="col-span-1 text-slate-500">Website</dt>
                          <dd className="col-span-2">{data.website || "—"}</dd>
                        </dl>
                      </div>

                      <div className="rounded-xl border border-slate-200 p-4">
                        <div className="text-sm font-medium mb-3">Trades</div>
                        <div className="flex flex-wrap gap-2">
                          {(data.trades||[]).length
                            ? (data.trades||[]).map((t:string)=>(
                                <span key={t} className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-sm ring-1 ring-slate-200">{t}</span>
                              ))
                            : <span className="text-slate-500 text-sm">No trades selected</span>
                          }
                        </div>
                      </div>

                      <div className="rounded-xl border border-slate-200 p-4 md:col-span-2">
                        <div className="text-sm font-medium mb-3">Public profile preview</div>
                        <div className="rounded-xl bg-white ring-1 ring-slate-200 p-4">
                          <div className="text-lg font-semibold">{data.companyName || "Your company name"}</div>
                          <div className="text-sm text-slate-600">{(data.trades||[]).join(" · ") || "Select trades"}</div>
                          <div className="text-xs text-slate-500 mt-1">Based in {data.postcode || "—"} · {data.radius||15}mi radius</div>
                          {Boolean((data.portfolio||[]).length) && (
                            <div className="mt-3 grid grid-cols-3 gap-2">
                              {(data.portfolio||[]).slice(0,3).map((p:any)=>(
                                <img key={p.id} src={p.url} alt="" className="aspect-[4/3] object-cover rounded-md ring-1 ring-slate-200" />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="mt-6 flex gap-3">
          {step === 1 && (
            <AboutBusiness value={data as any} onChange={(patch)=>setData((d:any)=>({ ...d, ...patch }))} />
          )}
              <button onClick={prev} disabled={step===0} className="h-11 px-4 rounded-lg border border-slate-300 disabled:opacity-40">Back</button>
              <div className="flex-1" />
              {step<STEPS.length-1 ? (
                <RippleButton onClick={next} className="h-11 px-4 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-white">Next</RippleButton>
              ) : (
                <RippleButton onClick={()=>window.location.href='/trade/onboarding/success'} className="h-11 px-5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white text-base">
                  Publish profile
                </RippleButton>
              )}
            </div>
          </div>

          {/* RIGHT preview (hidden on Review step to go full-width) */}
          {!isReview && (
            <div className="rounded-xl border border-slate-200 p-5 bg-slate-50">
              <div className="text-sm text-slate-600 mb-2">Public profile preview</div>
              <div className="rounded-xl bg-white ring-1 ring-slate-200 p-4">
                <div className="text-lg font-semibold">{data.companyName || "Your company name"}</div>
                <div className="text-sm text-slate-600">{(data.trades||[]).join(" · ") || "Select trades"}</div>
                <div className="text-xs text-slate-500 mt-1">Based in {data.postcode || "—"} · {data.radius||15}mi radius</div>
                {Boolean((data.portfolio||[]).length) && (
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {(data.portfolio||[]).slice(0,3).map((p:any)=>(
                      <img key={p.id} src={p.url} alt="" className="aspect-[4/3] object-cover rounded-md ring-1 ring-slate-200" />
                    ))}
                  </div>
                )}
              </div>
              <div className="mt-3 text-xs text-slate-500">
                Profile strength improves with trades + photos + verification.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
