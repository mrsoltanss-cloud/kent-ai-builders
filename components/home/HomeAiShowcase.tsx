"use client";

import React from "react";
import AiQuotePreview from "./AiQuotePreview";

export default function HomeAiShowcase() {
  return (
    <section className="relative isolate py-16 sm:py-20">
      {/* Subtle fintech grid background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at top, rgba(99,102,241,0.05), transparent 45%), radial-gradient(ellipse at bottom, rgba(16,185,129,0.06), transparent 45%)",
        }}
      />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-8 sm:mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900">
                AI-powered estimates, trusted local pros.
              </span>
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600">
              Instant, fair pricing based on real Kent projects — built for speed and trust.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200/70 bg-white/50 backdrop-blur px-3 py-1 text-sm text-slate-700 shadow-sm">
            <span className="relative inline-flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Live right now: <strong className="tabular-nums font-medium pl-1">77</strong>
          </div>
        </div>

        {/* Glassy card container */}
        <div className="rounded-2xl border border-slate-200/70 bg-white/60 backdrop-blur shadow-sm">
          <AiQuotePreview />
        </div>
      </div>
    </section>
  );
}
