"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type EstimateRes =
  | { estimateMin: number; estimateMax: number; _source?: string }
  | { error: string };

export default function QuoteClient() {
  const router = useRouter();

  // Basic inputs
  const [service, setService] = useState("extension");
  const [scope, setScope] = useState("standard");
  const [sqm, setSqm] = useState<number>(20);
  const [urgency, setUrgency] = useState("soon");

  // Advanced inputs (early step towards deeper intake)
  const [propertyType, setPropertyType] = useState("house"); // house/flat/bungalow/other
  const [budget, setBudget] = useState("unknown"); // under10 / 10-25 / 25-50 / 50plus / unknown
  const [postcode, setPostcode] = useState("");
  const [permissions, setPermissions] = useState("unknown"); // not_needed / applied / approved / unknown
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{min?: number; max?: number; src?: string}>({});
  const [err, setErr] = useState<string | null>(null);

  async function getEstimate() {
    setErr(null); setResult({}); setLoading(true);
    const payload = { service, scope, sqm: Number(sqm), urgency };
    try {
      const res = await fetch("/api/aiQuote", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.status === 401) {
        router.push(`/auth/signin?callbackUrl=${encodeURIComponent("/quote")}`);
        return false;
      }
      const json = (await res.json()) as EstimateRes;
      if ("error" in json) { setErr(json.error || "Failed to calculate estimate."); return false; }
      setResult({ min: json.estimateMin, max: json.estimateMax, src: json._source || "unknown" });
      return true;
    } catch (e: any) {
      setErr(e?.message || "Network error.");
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function submitLead() {
    // Try to create a lead; if it fails, still produce a sensible reference
    const refFallback = "BK-" + Date.now().toString().slice(-8);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          service, scope, sqm, urgency,
          propertyType, budget, postcode, permissions, notes,
          // Include the latest estimate if we have it
          estimate: result.min && result.max ? { min: result.min, max: result.max, source: result.src } : undefined,
        }),
      });
      const json = await res.json().catch(() => ({}));
      const id = json?.id || json?.leadId || refFallback;
      router.push(`/quote/success?ref=${encodeURIComponent(String(id))}`);
    } catch {
      router.push(`/quote/success?ref=${encodeURIComponent(refFallback)}`);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    // 1) Calculate quick estimate
    const ok = await getEstimate();
    if (!ok) return;
    // 2) Immediately submit lead and go to success
    await submitLead();
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-8">
      <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Service</label>
          <select value={service} onChange={e=>setService(e.target.value)}
                  className="mt-1 w-full rounded-lg border px-3 py-2">
            <option value="extension">House extension</option>
            <option value="loft">Loft conversion</option>
            <option value="kitchen">Kitchen renovation</option>
            <option value="bathroom">Bathroom renovation</option>
            <option value="roof">Roof repair</option>
            <option value="repointing">Wall repointing</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Scope</label>
          <select value={scope} onChange={e=>setScope(e.target.value)}
                  className="mt-1 w-full rounded-lg border px-3 py-2">
            <option value="basic">Basic</option>
            <option value="standard">Standard</option>
            <option value="premium">Premium</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Size (m²)</label>
          <input type="number" min={1} step={1} value={sqm}
                 onChange={e=>setSqm(Number(e.target.value))}
                 className="mt-1 w-full rounded-lg border px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm font-medium">Urgency</label>
          <select value={urgency} onChange={e=>setUrgency(e.target.value)}
                  className="mt-1 w-full rounded-lg border px-3 py-2">
            <option value="asap">ASAP</option>
            <option value="soon">Soon (1–3 months)</option>
            <option value="planning">Planning (3–6 months)</option>
          </select>
        </div>

        {/* Advanced details (progress towards a deeper intake) */}
        <div className="md:col-span-2 mt-2">
          <details className="rounded-lg border p-4 bg-white">
            <summary className="cursor-pointer font-medium">Advanced details (optional)</summary>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              <div>
                <label className="block text-sm font-medium">Property type</label>
                <select value={propertyType} onChange={e=>setPropertyType(e.target.value)}
                        className="mt-1 w-full rounded-lg border px-3 py-2">
                  <option value="house">House</option>
                  <option value="flat">Flat</option>
                  <option value="bungalow">Bungalow</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">Budget</label>
                <select value={budget} onChange={e=>setBudget(e.target.value)}
                        className="mt-1 w-full rounded-lg border px-3 py-2">
                  <option value="under10">Under £10k</option>
                  <option value="10-25">£10k–£25k</option>
                  <option value="25-50">£25k–£50k</option>
                  <option value="50plus">£50k+</option>
                  <option value="unknown">Prefer not to say</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">Postcode</label>
                <input value={postcode} onChange={e=>setPostcode(e.target.value)}
                       placeholder="e.g., ME15"
                       className="mt-1 w-full rounded-lg border px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium">Planning/permissions</label>
                <select value={permissions} onChange={e=>setPermissions(e.target.value)}
                        className="mt-1 w-full rounded-lg border px-3 py-2">
                  <option value="not_needed">Not needed</option>
                  <option value="applied">Applied</option>
                  <option value="approved">Approved</option>
                  <option value="unknown">Unsure</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium">Notes</label>
                <textarea value={notes} onChange={e=>setNotes(e.target.value)}
                          rows={3}
                          placeholder="Anything else we should know?"
                          className="mt-1 w-full rounded-lg border px-3 py-2" />
              </div>
            </div>
          </details>
        </div>

        <div className="md:col-span-2 flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-emerald-600 text-white px-5 py-2 hover:bg-emerald-700 disabled:opacity-50"
          >
            {loading ? "Submitting…" : "Get estimate & submit"}
          </button>

          {/* Option: just preview estimate without submitting */}
          <button
            type="button"
            disabled={loading}
            onClick={getEstimate}
            className="rounded-lg border px-5 py-2 hover:bg-slate-50 disabled:opacity-50"
          >
            {loading ? "Calculating…" : "Preview estimate only"}
          </button>
        </div>
      </form>

      <aside className="mt-6 rounded-xl border p-4 bg-white">
        <h3 className="font-semibold">Estimated range</h3>
        {err && <p className="text-sm text-red-700 mt-2">{err}</p>}
        {loading && !err && <p className="text-sm text-slate-500 mt-2">Calculating…</p>}
        {!loading && !err && result.min && result.max && (
          <>
            <p className="text-2xl font-bold mt-1">
              £{result.min.toLocaleString()} – £{result.max.toLocaleString()}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Source: {result.src === "ai" ? "AI" : "Instant calculator"}
            </p>
          </>
        )}
        {!loading && !err && !(result.min && result.max) && (
          <p className="text-sm text-slate-500 mt-2">Fill the form to see a range.</p>
        )}
        <p className="text-xs text-slate-500 mt-3">Final quote depends on survey &amp; photos.</p>
      </aside>
    </section>
  );
}
