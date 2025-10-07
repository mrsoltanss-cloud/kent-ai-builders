import Link from "next/link";

export default function MinimalTrustPanel() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
      <div className="rounded-[20px] sm:rounded-[28px] bg-[#0f1b22] text-white p-5 sm:p-10 shadow-[0_10px_40px_rgba(0,0,0,.25)]">
        <h2 className="text-center text-xl sm:text-3xl font-extrabold">
          Why <span className="text-emerald-400">2,300+ homeowners</span> choose Brixel
        </h2>

        {/* Chips: horizontal scroll on mobile */}
        <div className="mt-4 overflow-x-auto no-scrollbar -mx-2 sm:mx-0">
          <div className="px-2 sm:px-0 flex gap-2 sm:flex-wrap sm:justify-center text-xs sm:text-sm">
            {[
              ["✅","Verified local builders"],
              ["🔒","£5m insurance cover"],
              ["⚡","12-month workmanship guarantee"],
              ["⭐","4.9/5 customer rating"],
            ].map(([emoji,label])=>(
              <span key={label} className="shrink-0 inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5 border border-white/10">
                <span>{emoji}</span><span>{label}</span>
              </span>
            ))}
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
          <div className="rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 p-4 sm:p-6 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold">2,300+</div>
            <div className="text-[10px] sm:text-xs uppercase tracking-wide text-gray-300 mt-1">Projects completed</div>
          </div>
          <div className="rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 p-4 sm:p-6 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold">4.9<sup className="text-xs sm:text-base">/5</sup></div>
            <div className="text-[10px] sm:text-xs uppercase tracking-wide text-gray-300 mt-1">Average rating</div>
          </div>
          <div className="rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 p-4 sm:p-6 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold">10+ yrs</div>
            <div className="text-[10px] sm:text-xs uppercase tracking-wide text-gray-300 mt-1">Team experience</div>
          </div>
        </div>

        <div className="mt-5 text-center sm:mt-6">
          <Link href="/quote" className="inline-flex items-center justify-center rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-4 sm:px-5 py-2.5 sm:py-3 shadow-lg transition">
            Get your instant estimate →
          </Link>
          <p className="mt-2 text-[11px] sm:text-xs text-gray-400">Takes less than 60 seconds. No obligation.</p>
        </div>
      </div>
    </section>
  );
}
