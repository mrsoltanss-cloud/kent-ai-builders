"use client";

import { useEffect, useState } from "react";

export default function StepFinal({ data }) {
  const [loading, setLoading] = useState(true);
  const [estimate, setEstimate] = useState(null);
  const [error, setError] = useState(null);
  const [leadStatus, setLeadStatus] = useState("idle"); // idle | saving | saved | failed

  useEffect(() => {
    async function run() {
      try {
        // 1) Get AI (or fallback) estimate
        const res = await fetch("/api/aiQuote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            service: data.service,
            answers: {
              budget: data.budget,
              timeline: data.timeline,
              description: data.description,
              postcode: data.postcode,
            },
          }),
        });

        if (!res.ok) throw new Error("Failed to fetch estimate");
        const json = await res.json();
        setEstimate(json);

        // 2) Save lead + estimate
        setLeadStatus("saving");
        const save = await fetch("/api/lead", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            // core lead fields we collected in steps
            service: data.service,
            description: data.description,
            postcode: data.postcode,
            name: data.name,
            phone: data.phone,
            email: data.email || "",
            budget: data.budget || "",
            timeline: data.timeline || "",
            // ai estimate fields
            aiEstimateMin: json?.estimatedRange?.[0] ?? null,
            aiEstimateMax: json?.estimatedRange?.[1] ?? null,
            aiNote: json?.note || "",
            // helpful meta
            source: "wizard-v1",
            path: "/quote",
          }),
        });

        if (!save.ok) throw new Error("Lead save failed");
        setLeadStatus("saved");
      } catch (e) {
        console.error("[StepFinal] error:", e);
        setError("Could not generate or save your estimate. Please try again.");
        setLeadStatus("failed");
      } finally {
        setLoading(false);
      }
    }

    run();
  }, [data]);

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">Your AI Estimate</h2>

      {loading && <p className="text-gray-600">Calculating your estimate…</p>}

      {error && <p className="text-red-600 font-medium">⚠️ {error}</p>}

      {estimate && Array.isArray(estimate.estimatedRange) && (
        <div className="space-y-3">
          <p className="text-lg">
            ✅ Estimated cost range:{" "}
            <span className="font-bold text-teal-600">
              £{Number(estimate.estimatedRange[0]).toLocaleString()} – £
              {Number(estimate.estimatedRange[1]).toLocaleString()}
            </span>
          </p>
          {estimate.note && (
            <p className="text-sm text-gray-500 italic">{estimate.note}</p>
          )}
          <p className="text-xs text-gray-500">
            {leadStatus === "saving" && "Saving your request…"}
            {leadStatus === "saved" && "Saved. We’ll be in touch shortly."}
            {leadStatus === "failed" && "We couldn’t save the request automatically."}
          </p>

          {/* CTAs */}
          <div className="flex gap-3 pt-2">
            <a
              href="tel:+447000000000"
              className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
            >
              Call us now
            </a>
            <a
              href="https://calendly.com/your-calendly/15min"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 border rounded hover:bg-gray-50"
            >
              Book a free site visit
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
