"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Timing = "ASAP" | "1-3 months" | "3-6 months" | "Just planning";
const SERVICES = [
  "Kitchen renovation",
  "Bathroom refurbishment",
  "Loft conversion",
  "House extension",
  "Roofing",
  "Plastering",
  "Electrical",
  "Plumbing",
];

function estimatePrice(service: string, timing: Timing) {
  // quick pseudo-estimator (placeholder)
  const base =
    service.includes("Kitchen") ? 7500 :
    service.includes("Bathroom") ? 4500 :
    service.includes("Loft") ? 28000 :
    service.includes("Extension") ? 42000 :
    service.includes("Roof") ? 3000 :
    1500;

  const timingFactor =
    timing === "ASAP" ? 1.06 :
    timing === "1-3 months" ? 1.02 :
    timing === "3-6 months" ? 1.00 :
    0.98;

  const est = Math.round(base * timingFactor);
  const low = Math.round(est * 0.9);
  const high = Math.round(est * 1.15);
  return { low, high, est };
}

export default function QuoteWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [service, setService] = useState(SERVICES[0]);
  const [postcode, setPostcode] = useState("");
  const [timing, setTiming] = useState<Timing>("ASAP");

  const result = useMemo(() => estimatePrice(service, timing), [service, timing]);

  const canNext1 = !!service;
  const canNext2 = /^[A-Za-z]{1,2}\d[A-Za-z\d]?\s*\d[A-Za-z]{2}$/.test(postcode.trim()); // UK-ish
  const canNext3 = !!timing;

  function goSuccess() {
    // Generate a simple ref like BK-YYMMDD-xxxxx
    const d = new Date();
    const yy = String(d.getFullYear()).slice(-2);
    const mm = String(d.getMonth()+1).padStart(2,"0");
    const dd = String(d.getDate()).padStart(2,"0");
    const rand = Math.random().toString(36).slice(2,7).toUpperCase();
    const ref = `BK-${yy}${mm}${dd}-${rand}`;
    router.push(`/quote/success?ref=${encodeURIComponent(ref)}`);
  }

  return (
    <div>
      {/* stepper */}
      <ol className="flex items-center gap-2 text-xs text-gray-500 mb-4">
        {[1,2,3,4].map(n => (
          <li key={n} className={`flex-1 h-1 rounded ${step >= n ? "bg-emerald-500" : "bg-gray-200"}`} />
        ))}
      </ol>

      {step === 1 && (
        <div>
          <label className="block text-sm font-medium text-gray-800">Select service type</label>
          <div className="mt-2 grid sm:grid-cols-2 gap-2">
            {SERVICES.map(s => (
              <button
                key={s}
                type="button"
                onClick={() => setService(s)}
                className={`text-left rounded-lg border px-3 py-2 transition ${
                  service === s ? "border-emerald-500 bg-emerald-50" : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="mt-4 flex justify-end">
            <button
              disabled={!canNext1}
              onClick={()=>setStep(2)}
              className="rounded-lg bg-emerald-600 text-white px-4 py-2 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <label className="block text-sm font-medium text-gray-800">Enter postcode</label>
          <input
            value={postcode}
            onChange={e=>setPostcode(e.target.value)}
            placeholder="e.g. ME4 4XX"
            className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-300"
          />
          <div className="mt-4 flex items-center justify-between">
            <button onClick={()=>setStep(1)} className="text-gray-600 hover:underline">Back</button>
            <button
              disabled={!canNext2}
              onClick={()=>setStep(3)}
              className="rounded-lg bg-emerald-600 text-white px-4 py-2 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <label className="block text-sm font-medium text-gray-800">Choose timing</label>
          <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(["ASAP","1-3 months","3-6 months","Just planning"] as Timing[]).map(t => (
              <button
                key={t}
                type="button"
                onClick={()=>setTiming(t)}
                className={`rounded-lg border px-3 py-2 text-sm transition ${
                  timing === t ? "border-emerald-500 bg-emerald-50" : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between">
            <button onClick={()=>setStep(2)} className="text-gray-600 hover:underline">Back</button>
            <button
              onClick={()=>setStep(4)}
              disabled={!canNext3}
              className="rounded-lg bg-emerald-600 text-white px-4 py-2 disabled:opacity-50"
            >
              See instant estimate
            </button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900">
            Great news — here’s your fair, instant estimate 🚀
          </h3>
          <p className="mt-1 text-gray-600">
            We’ll call you within 1 hour to confirm. You’re covered by our 12-month workmanship guarantee. Join 2,300+ homeowners who already trusted us.
          </p>

          <div className="mt-4 grid sm:grid-cols-3 gap-3">
            <div className="rounded-xl border border-gray-200 p-4 text-center">
              <div className="text-2xl font-extrabold text-emerald-700">£{result.low.toLocaleString()}</div>
              <div className="text-xs text-gray-500">Low</div>
            </div>
            <div className="rounded-xl border border-gray-200 p-4 text-center">
              <div className="text-2xl font-extrabold text-emerald-700">£{result.est.toLocaleString()}</div>
              <div className="text-xs text-gray-500">Estimate</div>
            </div>
            <div className="rounded-xl border border-gray-200 p-4 text-center">
              <div className="text-2xl font-extrabold text-emerald-700">£{result.high.toLocaleString()}</div>
              <div className="text-xs text-gray-500">High</div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm text-gray-600">
              📍 <strong>{postcode || "Your area"}</strong> · {service} · {timing}
            </div>
            <button
              onClick={goSuccess}
              className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-3 shadow"
            >
              Confirm my free survey
            </button>
          </div>

          <p className="mt-2 text-xs text-gray-500">No obligation. We’ll confirm the scope and final price after a quick survey.</p>

          <div className="mt-5">
            <Link href="/" className="text-sm text-gray-600 hover:underline">Back to home</Link>
          </div>
        </div>
      )}
    </div>
  );
}
