'use client'
export default function TrustHero() {
  return (
    <section className="w-full rounded-2xl border border-slate-200 p-6">
      <h2 className="text-2xl font-semibold">Trusted network for serious homeowners</h2>
      <p className="mt-2 text-slate-600">
        Verified trades, clear communication, and AI-assisted pricing to keep projects on track.
      </p>
      <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
        <span className="rounded-full border px-3 py-1">ID & Insurance Checks</span>
        <span className="rounded-full border px-3 py-1">Kent Coverage</span>
        <span className="rounded-full border px-3 py-1">Fast Response</span>
      </div>
    </section>
  );
}
