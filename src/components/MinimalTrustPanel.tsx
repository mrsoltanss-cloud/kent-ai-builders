import Link from "next/link";

export default function MinimalTrustPanel() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div className="rounded-[28px] bg-[#0f1b22] text-white p-6 sm:p-10 shadow-[0_10px_40px_rgba(0,0,0,.25)]">
        <h2 className="text-center text-2xl sm:text-3xl font-extrabold">
          Why <span className="text-emerald-400">2,300+ homeowners</span> choose Brixel
        </h2>

        <div className="mt-4 flex flex-wrap justify-center gap-2 text-sm">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5 border border-white/10"><span>✅</span> Verified local builders</span>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5 border border-white/10"><span>🔒</span> £5m insurance cover</span>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5 border border-white/10"><span>⚡</span> 12-month workmanship guarantee</span>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5 border border-white/10"><span>⭐</span> 4.9/5 customer rating</span>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-2xl bg-white/5 border border-white/10 p-6 text-center"><div className="text-3xl font-extrabold">2,300+</div><div className="text-xs uppercase tracking-wide text-gray-300 mt-1">Projects completed</div></div>
          <div className="rounded-2xl bg-white/5 border border-white/10 p-6 text-center"><div className="text-3xl font-extrabold">4.9<sup className="text-base">/5</sup></div><div className="text-xs uppercase tracking-wide text-gray-300 mt-1">Average rating</div></div>
          <div className="rounded-2xl bg-white/5 border border-white/10 p-6 text-center"><div className="text-3xl font-extrabold">10+ yrs</div><div className="text-xs uppercase tracking-wide text-gray-300 mt-1">Team experience</div></div>
        </div>

        <div className="mt-6 text-center">
          <Link href="/quote" className="inline-flex items-center justify-center rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-5 py-3 shadow-lg transition focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-[#0f1b22]">
            Get your instant estimate →
          </Link>
          <p className="mt-2 text-xs text-gray-400">Takes less than 60 seconds. No obligation.</p>
        </div>
      </div>
    </section>
  );
}
