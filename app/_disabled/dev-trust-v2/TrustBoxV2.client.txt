"use client";

import React, { useEffect, useRef, useState } from "react";

function useOnClickOutside<T extends HTMLElement>(ref: React.RefObject<T>, onAway: () => void) {
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) onAway();
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onAway();
    }
    document.addEventListener("mousedown", handler);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("keydown", onKey);
    };
  }, [ref, onAway]);
}

function InfoButton({
  label,
  title,
  body,
}: {
  label: string;
  title: string;
  body: string | React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, () => setOpen(false));

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="rounded-md border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-300"
      >
        {label}
      </button>
      {open && (
        <div
          role="dialog"
          aria-modal="false"
          className="absolute z-20 mt-2 w-64 rounded-lg border border-gray-200 bg-white p-3 text-sm shadow-lg"
        >
          <div className="font-semibold text-gray-800">{title}</div>
          <div className="mt-1 text-gray-600">{body}</div>
        </div>
      )}
    </div>
  );
}

function RotatingQuote() {
  const quotes = [
    "“Booked Tuesday, survey Thursday. Clear pricing.” — Sarah, Maidstone",
    "“Polite team, tidy work. Would use again.” — James, Canterbury",
    "“Matched fast and kept me updated.” — Aisha, Ashford",
  ];
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((x) => (x + 1) % quotes.length), 6000);
    return () => clearInterval(id);
  }, []);
  return <div className="mt-3 text-sm text-gray-600 italic">{quotes[i]}</div>;
}

export default function TrustBoxV2() {
  return (
    <aside className="rounded-xl border border-gray-200 p-4">
      <div className="text-sm text-gray-700 font-semibold">Why homeowners choose us</div>
      <ul className="mt-3 space-y-2 text-sm text-gray-700">
        <li>✅ <span className="font-medium">2,300+ projects delivered</span></li>
        <li>⭐ <span className="font-medium">4.9/5</span> from <span className="font-medium">312 verified reviews</span></li>
        <li>🛡️ <span className="font-medium">£5m Public Liability</span> — <span className="text-gray-600">certificate available</span></li>
        <li>🧰 <span className="font-medium">12-month workmanship guarantee</span></li>
        <li>🔎 <span className="font-medium">Vetted &amp; DBS-checked teams</span></li>
      </ul>

      {/* Actionable mini-buttons (popover) */}
      <div className="mt-4 flex flex-wrap gap-2">
        <InfoButton
          label="View cover"
          title="Public Liability cover"
          body={
            <span>
              Insured up to <b>£5,000,000</b>. Policy reference <b>BRX-PL-2041</b>. Ask us for the certificate at any time.
            </span>
          }
        />
        <InfoButton
          label="Guarantee terms"
          title="12-month workmanship guarantee"
          body="Workmanship covered for 12 months from completion. Materials per manufacturer warranty. Full terms available on request."
        />
        <InfoButton
          label="What’s DBS?"
          title="DBS checks"
          body="A DBS check is a criminal record check for on-site operatives. We require current basic DBS for all field staff."
        />
      </div>

      {/* Localisation line (optional signal) */}
      <div className="mt-4 text-xs text-gray-500">
        Serving <b>Maidstone &amp; Kent</b> • <b>14</b> vetted teams nearby
      </div>

      <RotatingQuote />
    </aside>
  );
}
