"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Estimate = { low?: number; high?: number; ref?: string } | null;

function parseReview() {
  const blocks = Array.from(document.querySelectorAll<HTMLElement>("div, section, article"));
  const target = blocks.find(el => {
    const t = (el.innerText || "").toLowerCase();
    return t.includes("service:") && t.includes("postcode:");
  });
  const txt = (target?.innerText || "").replace(/\u00A0/g, " ");
  const pick = (label: string) => {
    const re = new RegExp(label + "\\s*:\\s*([^\\n\\r]+)", "i");
    const m = txt.match(re);
    return m ? m[1].trim() : "";
  };

  const service = pick("Service");
  const postcode = pick("Postcode");
  const timing = pick("Timing");

  const detailsBlock = (() => {
    const i = txt.toLowerCase().indexOf("details:");
    if (i === -1) return "";
    return txt.slice(i).split(/\n/).slice(1).join("\n");
  })();

  const details: Record<string, any> = {};
  detailsBlock.split(/\n/).forEach(line => {
    const m = line.match(/^\s*[-•]?\s*([a-z0-9_ ]+)\s*:\s*(.+)\s*$/i);
    if (m) details[m[1].trim().replace(/\s+/g, "")] = m[2].trim();
  });

  return { service, postcode, timing, details };
}

function toUrgency(timing?: string) {
  const t = (timing || "").toLowerCase();
  if (t.includes("asap")) return "asap";
  if (t.includes("1-3")) return "1-3_months";
  if (t.includes("3-6")) return "3-6_months";
  return "planning";
}

const money = (n?: number) => (typeof n === "number" ? `£${n.toLocaleString()}` : "—");

export default function TwoStageEstimateButton({
  className,
  initialLabel = "Submit & get estimate",
  submitLabel = "Looks good — submit",
}: {
  className: string;
  initialLabel?: string;
  submitLabel?: string;
}) {
  const router = useRouter();
  const [estimating, setEstimating] = useState(false);
  const [previewReady, setPreviewReady] = useState(false);
  const [estimate, setEstimate] = useState<Estimate>(null);

  useEffect(() => { parseReview(); }, []);

  const label = useMemo(() => {
    if (estimating) return "Getting estimate...";
    return previewReady ? submitLabel : initialLabel;
  }, [estimating, previewReady, initialLabel, submitLabel]);

  async function handleClick() {
    const { service, postcode, timing, details } = parseReview();

    if (!previewReady) {
      setEstimating(true);
      try {
        const res = await fetch("/api/aiQuote", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            service,
            postcode,
            urgency: toUrgency(timing),
            details: { ...(details || {}) },
          }),
        });
        const data = await res.json().catch(() => ({} as any));
        setEstimate({
          low: data.low ?? data.estimateLow,
          high: data.high ?? data.estimateHigh,
          ref: data.ref ?? data.reference,
        });
      } catch {}
      finally {
        setEstimating(false);
        setPreviewReady(true);
      }
      return;
    }

    try {
      const resLead = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          service,
          urgency: toUrgency(timing),
          description: "",
          photos: [],
          details: { ...(details || {}), postcode },
        }),
      });

      if (!resLead.ok) {
        alert("Something went wrong. Please try again.");
        return;
      }

      const lead = await resLead.json().catch(() => ({} as any));
      const ref = lead.ref || lead.id || estimate?.ref || "";
      router.push(`/quote/success?ref=${encodeURIComponent(ref)}`);
    } catch {
      alert("Something went wrong. Please try again.");
    }
  }

  return (
    <>
      {estimate && (
        <div className="rounded-lg border border-emerald-300 bg-emerald-50/60 p-4 mt-4">
          <div className="font-semibold text-emerald-700">Your instant estimate</div>
          <div className="text-2xl font-bold text-emerald-800 mt-1">
            {money(estimate.low)} – {money(estimate.high)}
          </div>
          <div className="text-sm text-emerald-700 mt-1">
            Based on your selections. We’ll confirm by email.
          </div>
          {estimate?.ref && (
            <div className="text-xs text-slate-500 mt-2">Ref: {estimate.ref}</div>
          )}
        </div>
      )}

      <button type="button" onClick={handleClick} className={className} disabled={estimating}>
        {label}
      </button>
    </>
  );
}
