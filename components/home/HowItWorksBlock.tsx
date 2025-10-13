'use client'
export default function HowItWorksBlock() {
  return (
    <section className="rounded-2xl border border-slate-200 p-6">
      <h3 className="text-xl font-semibold">How it works</h3>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <div>
          <div className="text-sm uppercase tracking-wide text-slate-500">1. Tell us</div>
          <p className="text-slate-600">Share a few project details (rooms, sqm, timing).</p>
        </div>
        <div>
          <div className="text-sm uppercase tracking-wide text-slate-500">2. Get estimate</div>
          <p className="text-slate-600">Instant AI range to set expectations in GBP.</p>
        </div>
        <div>
          <div className="text-sm uppercase tracking-wide text-slate-500">3. Hire</div>
          <p className="text-slate-600">We connect you with verified local trades.</p>
        </div>
      </div>
    </section>
  );
}
