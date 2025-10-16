// Mobile-first flow with snap carousel; NO sticky toasts or buttons.
// Banner is a normal block at the bottom of the page content.
"use client";

import React, { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type JobCard = {
  id: string;
  title: string;
  subtitle?: string;
  tags?: string[];
  estimateLow?: number;
  estimateHigh?: number;
};

const currency = (v:number) => new Intl.NumberFormat("en-GB", { style:"currency", currency:"GBP", maximumFractionDigits:0 }).format(v);

const SAMPLE: JobCard[] = [
  { id:"kitchen-ext", title:"Kitchen → Extension", subtitle:"Knock-through, island, bi-folds", tags:["ME15","24 sqm","ASAP"], estimateLow:12737, estimateHigh:15444 },
  { id:"bath-refit", title:"Bathroom → Refit", subtitle:"Walk-in shower, tiled niche", tags:["CT4","7 sqm","1–3 months"], estimateLow:4206, estimateHigh:5856 },
  { id:"loft-dormer", title:"Loft → Dormer", subtitle:"Rear dormer + ensuite", tags:["TN23","28 sqm","Planning in place"], estimateLow:28708, estimateHigh:34553 },
];

export default function FlowClient() {
  const router = useRouter();
  const [selected, setSelected] = useState<JobCard| null>(null);
  const [postcode, setPostcode] = useState("");
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);

  const cards = useMemo(()=>SAMPLE, []);

  async function submitLead() {
    if (!selected) return; // soft-fail: require a selection
    setSubmitting(true);
    try {
      const res = await fetch("/api/lead", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({
          service: selected.title,
          details: details || selected.subtitle || "",
          postcode: postcode || undefined,
          urgency: "SOON",
          priceMin: selected.estimateLow,
          priceMax: selected.estimateHigh
        })
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      router.push(`/quote/success?ref=${encodeURIComponent(data.reference || data.id)}`);
    } catch {
      // keep silent UI; you asked to avoid sticky elements — we won't spawn overlays
      alert("Could not create lead. Please try again."); // basic fallback
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <div className="text-center mt-6">
        <p className="text-xs tracking-[0.2em] text-emerald-600 font-semibold">STEP 1 OF 3</p>
        <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold">Pick Your Job</h1>
        <p className="mt-2 text-sm sm:text-base text-neutral-600">Choose the work, add the basics — we’ll suggest what matters.</p>
      </div>

      {/* MOBILE SNAP CAROUSEL (one card per screen), GRID on >= md */}
      <div
        ref={scroller}
        className="mt-6 -mx-4 px-4 snap-x snap-mandatory overflow-x-auto md:overflow-visible md:mx-0 md:px-0"
        aria-label="Job options"
      >
        <div className="flex md:grid md:grid-cols-3 gap-4 md:gap-6">
          {cards.map((c) => {
            const active = selected?.id === c.id;
            return (
              <button
                key={c.id}
                onClick={()=>setSelected(c)}
                className={[
                  "snap-center shrink-0 w-[85%] xs:w-[88%] sm:w-[80%] md:w-auto",
                  "rounded-2xl border bg-white text-left shadow-sm transition-all",
                  active ? "border-emerald-500 ring-2 ring-emerald-200" : "border-neutral-200 hover:shadow",
                  "md:p-5 p-4"
               ].join(" ")}
                style={{ scrollMargin: "24px" }}
              >
                <div className="flex items-start gap-2">
                  <div className="text-xl">🏗️</div>
                  <div>
                    <div className="font-semibold text-[17px]">{c.title}</div>
                    {c.subtitle && <div className="text-neutral-600 text-sm">{c.subtitle}</div>}
                    <div className="mt-2 flex flex-wrap gap-1">
                      {(c.tags||[]).map(t => (
                        <span key={t} className="rounded-full bg-neutral-100 border border-neutral-200 px-2 py-0.5 text-[11px]">{t}</span>
                      ))}
                    </div>
                    {(c.estimateLow && c.estimateHigh) && (
                      <div className="mt-3 text-[13px]">
                        <span className="font-medium">Instant estimate:</span>{" "}
                        <span className="font-semibold">{currency(c.estimateLow)} — {currency(c.estimateHigh)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Minimal details form — mobile tuned */}
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <input
          placeholder="Postcode (optional)"
          value={postcode}
          onChange={e=>setPostcode(e.target.value.toUpperCase())}
          className="h-11 rounded-xl border border-neutral-300 px-3 text-sm outline-none focus:border-emerald-500 sm:col-span-1"
        />
        <input
          placeholder="Add a few details (optional)"
          value={details}
          onChange={e=>setDetails(e.target.value)}
          className="h-11 rounded-xl border border-neutral-300 px-3 text-sm outline-none focus:border-emerald-500 sm:col-span-2"
        />
      </div>

      <div className="mt-4 flex gap-3 flex-col sm:flex-row">
        <button
          onClick={submitLead}
          disabled={submitting || !selected}
          className="h-12 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 disabled:opacity-60"
        >
          {submitting ? "Getting your estimate…" : "Get My Instant Estimate — No Account Needed"}
        </button>
        <a
          href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "441474462265"}`}
          target="_blank"
          className="h-12 rounded-xl border border-emerald-600 text-emerald-700 font-semibold grid place-items-center"
        >
          Talk on WhatsApp
        </a>
      </div>

      {/* NON-STICKY banner: lives at the bottom, scrolls with the page */}
      <div className="mt-8">
        <div className="rounded-2xl border border-yellow-300 bg-yellow-100 px-4 py-3 text-[13px] leading-tight text-yellow-900 shadow-sm">
          <span className="mr-1">📣</span>
          Emma from Dartford just booked a Full rewire for £6,254 ✅
        </div>
      </div>
    </div>
  );
}
