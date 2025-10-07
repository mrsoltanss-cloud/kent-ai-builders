"use client";
import React from "react";
import StatsPanel from "./StatsPanel";

export default function BrixelSuccessPanel({
  reference,
  service,
  town,
  summary,
}: {
  reference: string;
  service?: string;
  town?: string;
  summary?: string;
}) {
  const waNumber = process.env.NEXT_PUBLIC_WA_NUMBER || "";
  const prefill = `Hi Brixel, my reference is ${reference}. I'd like to book a site survey${service ? ` for ${service}` : ""}${town ? ` in ${town}` : ""}.`;
  const waHref = waNumber ? `https://wa.me/${waNumber}?text=${encodeURIComponent(prefill)}` : `https://wa.me/?text=${encodeURIComponent(prefill)}`;

  async function handleEmail() {
    try {
      const res = await fetch("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference, service, town, summary }),
      });
      if (res.ok) alert("Thanks! We’ve sent your project details to our team.");
      else alert("We couldn't send the email just now. Please try WhatsApp or try again.");
    } catch { alert("Network error. Please try again."); }
  }

  return (
    <div className="space-y-6">
      <div className="text-sm text-gray-600">Your reference: <span className="font-semibold">{reference}</span></div>

      <div className="space-y-2">
        <div>💬 <span className="font-semibold">Message us on WhatsApp now</span> — we’ll connect you to a specialist <span className="font-semibold">immediately</span>.</div>
        <div>📍 <span className="font-semibold">We’ve already matched your project</span> to a vetted local builder in your area.</div>
        <div>🗓 <span className="font-semibold">When you’re ready</span>, message us and we’ll <span className="font-semibold">book your site survey</span> with a specialist.</div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <a href={waHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-5 py-3 text-white shadow hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-400" aria-label="Message us on WhatsApp to get started">
          Message us on WhatsApp to get started
        </a>
        <button onClick={handleEmail} className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-3 text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-400" aria-label="Email us now">
          Email us now
        </button>
      </div>

      <div className="text-sm text-gray-500">Fastest response. Typical reply in minutes during working hours.</div>

      <StatsPanel />
    </div>
  );
}
