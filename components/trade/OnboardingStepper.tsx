'use client'
import { useEffect, useMemo, useState } from "react"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import { Manrope, Inter } from 'next/font/google'
import RippleButton from '@/components/ui/RippleButton'

const manrope = Manrope({ subsets: ['latin'], weight: ['600','700'] })
const inter = Inter({ subsets: ['latin'], weight: ['400','500'] })

type StepId = "company"|"trades"|"coverage"|"portfolio"|"trust"|"notifications"|"review"
type Draft = {
  companyName?: string
  contactEmail?: string
  phone?: string
  trades?: string[]
  services?: string[]
  coverage?: string[]
  bio?: string
  logoUrl?: string
  portfolio?: any
  trust?: any
  notifications?: any
}

const ORDER: StepId[] = ["company","trades","coverage","portfolio","trust","notifications","review"]
const LS_KEY = "builder-onboarding-draft"

export default function OnboardingStepper() {
  const [step, setStep] = useState<StepId>("company")
  const [busy, setBusy] = useState(false)
  const [saved, setSaved] = useState(false)
  const [draft, setDraft] = useState<Draft>({})
  const pct = useMemo(() => Math.round(((ORDER.indexOf(step)+1)/ORDER.length)*100), [step])

  // parallax for preview
  const { scrollY } = useScroll()
  const previewY = useTransform(scrollY, [0, 300], [0, 20])

  useEffect(() => { try { const raw = localStorage.getItem(LS_KEY); if (raw) setDraft(JSON.parse(raw)) } catch {} }, [])
  useEffect(() => { try { localStorage.setItem(LS_KEY, JSON.stringify(draft)) } catch {} }, [draft])

  useEffect(() => {
    const t = setTimeout(async () => {
      try {
        await fetch("/api/trade/profile", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(draft) })
        setSaved(true); setTimeout(()=>setSaved(false), 1200)
      } catch {}
    }, 500)
    return () => clearTimeout(t)
  }, [draft])

  function gotoNext(){ const i = ORDER.indexOf(step); if (i < ORDER.length-1) setStep(ORDER[i+1]) }
  function gotoPrev(){ const i = ORDER.indexOf(step); if (i > 0) setStep(ORDER[i-1]) }

  async function publish() {
    setBusy(true)
    try {
      const res = await fetch("/api/trade/profile", {
        method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify(draft)
      })
      if (!res.ok) throw new Error("Publish failed")
      const { profile } = await res.json()
      localStorage.removeItem(LS_KEY)
      window.location.href = `/trade/onboarding/success?slug=${encodeURIComponent(profile.slug)}`
    } finally { setBusy(false) }
  }

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-white to-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-10 md:py-14 grid gap-8 md:grid-cols-[240px_1fr_360px]">
        {/* Sidebar */}
        <aside className="hidden md:block">
          <div className="sticky top-6">
            <div className={`${manrope.className} text-xs uppercase tracking-wide text-slate-500`}>Onboarding</div>
            <div className="mt-2 h-2 w-full rounded bg-slate-200 overflow-hidden">
              <motion.div
                className="h-2 bg-cyan-500"
                initial={false}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.35, ease: [0.25,0.1,0.25,1] }}
              />
            </div>
            <ul className="mt-4 space-y-1">
              {ORDER.map(s => (
                <li key={s} className={`text-sm ${s===step ? 'text-slate-900 font-medium' : 'text-slate-500'}`}>
                  {s.charAt(0).toUpperCase()+s.slice(1)}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Step content */}
        <section>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -12, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.25,0.1,0.25,1] }}
              className="rounded-2xl border border-slate-200 bg-white shadow-[0_8px_24px_rgba(0,0,0,0.06)] p-6"
            >
              {step === "company" && (
                <div>
                  <h2 className={`${manrope.className} text-xl font-semibold text-slate-900`}>Company details</h2>
                  <p className={`${inter.className} mt-1 text-slate-500 text-sm`}>Clear contact details build trust.</p>
                  <div className="mt-4 grid gap-3">
                    <input className="input input-bordered h-11" placeholder="Company name"
                      value={draft.companyName ?? ""} onChange={e => setDraft(d => ({...d, companyName: e.target.value}))} />
                    <input className="input input-bordered h-11" placeholder="Contact email"
                      value={draft.contactEmail ?? ""} onChange={e => setDraft(d => ({...d, contactEmail: e.target.value}))} />
                    <input className="input input-bordered h-11" placeholder="Phone"
                      value={draft.phone ?? ""} onChange={e => setDraft(d => ({...d, phone: e.target.value}))} />
                    <textarea className="textarea textarea-bordered" placeholder="Short bio"
                      value={draft.bio ?? ""} onChange={e => setDraft(d => ({...d, bio: e.target.value}))} />
                  </div>
                </div>
              )}

              {step === "trades" && (
                <div>
                  <h2 className={`${manrope.className} text-xl font-semibold text-slate-900`}>Trades & services</h2>
                  <p className={`${inter.className} mt-1 text-slate-500 text-sm`}>Pick what you actually want to win.</p>
                  <div className="mt-4 grid gap-3">
                    <input className="input input-bordered h-11" placeholder="Trades (comma-separated)"
                      value={(draft.trades ?? []).join(", ")} onChange={e => setDraft(d => ({...d, trades: e.target.value.split(",").map(s=>s.trim()).filter(Boolean)}))} />
                    <input className="input input-bordered h-11" placeholder="Services (comma-separated)"
                      value={(draft.services ?? []).join(", ")} onChange={e => setDraft(d => ({...d, services: e.target.value.split(",").map(s=>s.trim()).filter(Boolean)}))} />
                  </div>
                </div>
              )}

              {step === "coverage" && (
                <div>
                  <h2 className={`${manrope.className} text-xl font-semibold text-slate-900`}>Coverage</h2>
                  <p className={`${inter.className} mt-1 text-slate-500 text-sm`}>Focus equals faster responses.</p>
                  <div className="mt-4 grid gap-3">
                    <input className="input input-bordered h-11" placeholder="Towns/postcodes (comma-separated)"
                      value={(draft.coverage ?? []).join(", ")} onChange={e => setDraft(d => ({...d, coverage: e.target.value.split(",").map(s=>s.trim()).filter(Boolean)}))} />
                  </div>
                </div>
              )}

              {step === "portfolio" && (
                <div>
                  <h2 className={`${manrope.className} text-xl font-semibold text-slate-900`}>Portfolio (optional)</h2>
                  <p className={`${inter.className} mt-1 text-slate-500 text-sm`}>Add later in your profile if you prefer.</p>
                  <div className="mt-4 text-sm text-slate-500">Uploads coming soon.</div>
                </div>
              )}

              {step === "trust" && (
                <div>
                  <h2 className={`${manrope.className} text-xl font-semibold text-slate-900`}>Trust & verification</h2>
                  <p className={`${inter.className} mt-1 text-slate-500 text-sm`}>Insurance, years in trade, badges.</p>
                  <div className="mt-4 text-sm text-slate-500">Verification upload coming soon.</div>
                </div>
              )}

              {step === "notifications" && (
                <div>
                  <h2 className={`${manrope.className} text-xl font-semibold text-slate-900`}>Notifications</h2>
                  <p className={`${inter.className} mt-1 text-slate-500 text-sm`}>You’ll only get matching leads.</p>
                  <div className="mt-4 flex items-center gap-3 text-sm">
                    <label className="inline-flex items-center gap-2">
                      <input type="checkbox" className="checkbox" onChange={()=>{}} /> Email
                    </label>
                    <label className="inline-flex items-center gap-2">
                      <input type="checkbox" className="checkbox" onChange={()=>{}} /> WhatsApp
                    </label>
                  </div>
                </div>
              )}

              {step === "review" && (
                <div>
                  <h2 className={`${manrope.className} text-xl font-semibold text-slate-900`}>Review & publish</h2>
                  <pre className="mt-3 whitespace-pre-wrap rounded-lg bg-slate-50 p-3 text-xs text-slate-700">{JSON.stringify(draft, null, 2)}</pre>
                </div>
              )}

              <div className="mt-6 flex items-center gap-3">
                <button className="btn" onClick={gotoPrev}>Back</button>
                <div className="flex-1" />
                <button className="btn btn-outline" disabled={busy} onClick={gotoNext}>Next</button>
                <RippleButton className="btn btn-primary" disabled={busy} onClick={publish}>
                  {busy ? "Publishing…" : "Publish profile"}
                </RippleButton>
              </div>
            </motion.div>
          </AnimatePresence>
        </section>

        {/* Live Preview Card (shimmer + parallax) */}
        <aside className="hidden md:block">
          <motion.div style={{ y: previewY }} className="sticky top-6 rounded-2xl border border-slate-200 bg-white shadow-[0_8px_24px_rgba(0,0,0,0.06)] p-6 relative overflow-hidden">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -top-24 -left-24 h-40 w-40 rounded-full blur-3xl opacity-30"
                   style={{ background: 'radial-gradient(closest-side, rgba(14,165,233,0.18), transparent)' }} />
              <div className="absolute -bottom-28 -right-24 h-48 w-48 rounded-full blur-3xl opacity-20"
                   style={{ background: 'radial-gradient(closest-side, rgba(59,130,246,0.16), transparent)' }} />
            </div>

            <div className={`${manrope.className} text-sm uppercase tracking-wide text-slate-500`}>Your Public Profile</div>
            <h3 className="mt-2 text-lg font-semibold text-slate-900">{draft.companyName || 'Your Company'}</h3>
            <div className="mt-1 text-slate-600 text-sm">{draft.bio || 'Trusted local builder. Quality craft, modern tools.'}</div>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              {(draft.trades ?? ['Plastering']).map(t => (
                <span key={t} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-slate-600 hover:shadow-sm transition-transform hover:-translate-y-0.5">
                  {t}
                </span>
              ))}
            </div>
            <div className="mt-2 text-xs text-slate-500">Coverage: {(draft.coverage ?? ['Kent']).join(', ')}</div>
            <div className="mt-4">
              <a className="btn btn-sm btn-primary hover:shadow-md hover:-translate-y-0.5 transition">Get a Quote</a>
            </div>
          </motion.div>
        </aside>
      </div>

      {/* Saved toast */}
      <AnimatePresence>
        {saved && (
          <motion.div
            initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.25,0.1,0.25,1] }}
            className="fixed bottom-4 right-4 rounded-full bg-slate-900 text-white px-4 py-2 text-sm shadow-lg"
          >
            Saved ✓
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
