// src/components/TrustHero.tsx
export default function TrustHero() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <div className="rounded-3xl bg-slate-900 text-white p-8 md:p-12 shadow-lg">
        {/* Headline */}
        <h2 className="text-center text-2xl md:text-3xl font-bold tracking-tight">
          Why <span className="text-emerald-400">2,300+ homeowners</span> choose Brixel
        </h2>

        {/* Badges */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-sm">
            ✅ Verified local builders
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-sm">
            🔒 £5m insurance cover
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-sm">
            🛠️ 12-month workmanship guarantee
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-sm">
            ⭐ 4.9/5 customer rating
          </span>
        </div>

        {/* Stats */}
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-white/5 p-5 text-center">
            <div className="text-3xl font-extrabold">2,300+</div>
            <div className="text-sm text-white/70 mt-1">Projects completed</div>
          </div>
          <div className="rounded-2xl bg-white/5 p-5 text-center">
            <div className="text-3xl font-extrabold">4.9<span className="text-base align-top">/5</span></div>
            <div className="text-sm text-white/70 mt-1">Average rating</div>
          </div>
          <div className="rounded-2xl bg-white/5 p-5 text-center">
            <div className="text-3xl font-extrabold">10+ yrs</div>
            <div className="text-sm text-white/70 mt-1">Team experience</div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-10 flex flex-col items-center">
          <a
            href="/quote"
            className="rounded-full bg-emerald-500 px-6 py-3 font-semibold text-slate-900 hover:bg-emerald-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 transition"
          >
            Get your instant estimate →
          </a>
          <p className="mt-2 text-sm text-white/70">
            Takes less than 60 seconds. No obligation.
          </p>
        </div>
      </div>
    </section>
  );
}
