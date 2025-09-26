"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function QuotePage() {
  const sp = useSearchParams();

  const [service, setService] = useState("repointing");
  const [length, setLength] = useState("");
  const [height, setHeight] = useState("");
  const [valleyLen, setValleyLen] = useState("");
  const [postcode, setPostcode] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [showResult, setShowResult] = useState(false);

  // Prefill from URL (?service=... or ?query=...)
  useEffect(() => {
    const svc = sp.get("service") || sp.get("query") || "";
    if (svc) {
      const q = svc.toLowerCase();
      if (q.includes("valley")) setService("roof-valley");
      else if (q.includes("seal") || q.includes("damp")) setService("sealing");
      else if (q.includes("repoint") || q.includes("brick")) setService("repointing");
      else setService(q);
    }
    const l = sp.get("length"); if (l) setLength(l);
    const h = sp.get("height"); if (h) setHeight(h);
    const v = sp.get("valley"); if (v) setValleyLen(v);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sp]);

  // Pricing rules
  const estimate = useMemo(() => {
    const toNum = (v) => Number(String(v).replace(",", ".")) || 0;
    let low = 0, high = 0;

    if (service === "repointing") {
      const area = toNum(length) * toNum(height);
      const base = area * 58;
      low = base * 0.9;
      high = base * 1.2;
    } else if (service === "sealing") {
      const area = toNum(length) * toNum(height);
      const base = area * 12;
      low = base * 0.9;
      high = base * 1.2;
    } else if (service === "roof-valley") {
      const run = toNum(valleyLen);
      const base = run * 200;
      low = base * 0.9;
      high = base * 1.2;
    }
    return [low, high];
  }, [service, length, height, valleyLen]);

  const gbp = (n) =>
    new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 })
      .format(Math.max(0, Math.round(n)));

  function onSubmit(e) {
    e.preventDefault();
    if (!name || !phone) {
      alert("Please add your name and phone so we can confirm your quote.");
      return;
    }
    setShowResult(true);
    // TODO: send to CRM (Airtable/Sheets) + WhatsApp
  }

  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="text-3xl md:text-4xl font-bold">Instant Estimate</h1>
        <p className="text-gray-600 mt-2">
          Get a fast price range. Final quote confirmed after a free site survey.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">Service</label>
            <select
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="w-full rounded-lg border px-3 py-2"
            >
              <option value="repointing">Repointing</option>
              <option value="roof-valley">Roof Valley Lead Replacement</option>
              <option value="sealing">Wall Sealing</option>
            </select>
          </div>

          {(service === "repointing" || service === "sealing") && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Wall Length (m)</label>
                <input
                  inputMode="decimal"
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  placeholder="e.g. 16.5"
                  className="w-full rounded-lg border px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Wall Height (m)</label>
                <input
                  inputMode="decimal"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="e.g. 2.5"
                  className="w-full rounded-lg border px-3 py-2"
                  required
                />
              </div>
            </div>
          )}

          {service === "roof-valley" && (
            <div>
              <label className="block text-sm font-medium mb-1">Valley Length (m)</label>
              <input
                inputMode="decimal"
                value={valleyLen}
                onChange={(e) => setValleyLen(e.target.value)}
                placeholder="e.g. 3"
                className="w-full rounded-lg border px-3 py-2"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Postcode</label>
            <input
              value={postcode}
              onChange={(e) => setPostcode(e.target.value.toUpperCase())}
              placeholder="e.g. ME15"
              className="w-full rounded-lg border px-3 py-2"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-lg border px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email (optional)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border px-3 py-2"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto rounded-xl bg-teal-500 text-white px-5 py-3 font-semibold hover:bg-teal-600"
          >
            Get My Estimate
          </button>
        </form>

        {showResult && (
          <div className="mt-8 rounded-2xl border p-6 bg-gray-50">
            <h2 className="text-2xl font-bold">Your Estimated Price Range</h2>
            <p className="mt-2 text-xl">
              <span className="font-semibold">{gbp(estimate[0])}</span> –{" "}
              <span className="font-semibold">{gbp(estimate[1])}</span>
            </p>
            <p className="mt-2 text-sm text-gray-600">
              Based on your inputs ({service.replace("-", " ")}). Final price confirmed after a free site survey.
            </p>
            <div className="mt-4 flex gap-3">
              <Link href="/" className="rounded-lg border px-4 py-2 font-semibold">
                Back to Home
              </Link>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

