import Link from "next/link";

export default function TrustSection() {
  return (
    <section className="relative isolate overflow-hidden bg-[#0f1b22] text-white py-16 sm:py-20">
      <div className="absolute -top-24 -right-32 h-72 w-72 rounded-full blur-3xl opacity-20 bg-emerald-500/40" />
      <div className="absolute -bottom-28 -left-20 h-72 w-72 rounded-full blur-3xl opacity-20 bg-cyan-400/40" />
      <div className="container mx-auto max-w-6xl px-4">
        <div className="grid gap-10 md:grid-cols-2 items-start">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight">
              Why homeowners across Kent choose <span className="text-emerald-400">Brixel</span>
            </h2>
            <ul className="mt-6 space-y-4 text-base/7 text-gray-100">
              <li className="flex gap-3"><span className="shrink-0 text-2xl" aria-hidden>🤖</span><span><strong>Instant AI-powered quotes</strong> – no waiting around, no pushy sales visits.</span></li>
              <li className="flex gap-3"><span className="shrink-0 text-2xl" aria-hidden>🛠</span><span><strong>Local builders you can actually trust</strong> – vetted, reviewed, and verified.</span></li>
              <li className="flex gap-3"><span className="shrink-0 text-2xl" aria-hidden>🛡</span><span><strong>Guaranteed peace of mind</strong> – insurance, warranties, and DBS-checked teams.</span></li>
              <li className="flex gap-3"><span className="shrink-0 text-2xl" aria-hidden>⚡</span><span><strong>Fast response, no hassle</strong> – we call back within 1 hour, free survey included.</span></li>
            </ul>
            <div className="mt-8 grid grid-cols-3 gap-3 sm:gap-4">
              <div className="rounded-2xl bg-white/5 border border-white/10 p-4 text-center"><div className="text-2xl font-extrabold text-white">2,300+</div><div className="text-xs uppercase tracking-wide text-gray-300">Projects</div></div>
              <div className="rounded-2xl bg-white/5 border border-white/10 p-4 text-center"><div className="text-2xl font-extrabold text-white">4.9/5</div><div className="text-xs uppercase tracking-wide text-gray-300">Avg rating</div></div>
              <div className="rounded-2xl bg-white/5 border border-white/10 p-4 text-center"><div className="text-2xl font-extrabold text-white">10+ yrs</div><div className="text-xs uppercase tracking-wide text-gray-300">Experience</div></div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {["DBS-checked teams","£5m Public Liability","NICEIC / Gas Safe","CSCS qualified","12-month workmanship guarantee"].map((chip) => (
                <span key={chip} className="rounded-full bg-white/5 border border-white/10 px-3 py-1.5 text-xs text-gray-200">{chip}</span>
              ))}
            </div>
            <div className="mt-8">
              <p className="text-gray-300">👉 <strong>Don’t gamble with your home.</strong> Get your instant estimate today and join the homeowners who already trust Brixel.</p>
              <Link href="/quote" className="mt-4 inline-flex items-center justify-center rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-5 py-3 shadow-lg transition focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-[#0f1b22]">
                Get my instant quote ➜
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="aspect-[4/3] rounded-3xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 shadow-inner flex items-center justify-center"><div className="text-center"><div className="text-4xl">🤝</div><div className="mt-2 text-sm text-gray-200">Handshake</div></div></div>
            <div className="aspect-[4/3] rounded-3xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 shadow-inner flex items-center justify-center"><div className="text-center"><div className="text-4xl">👷‍♂️</div><div className="mt-2 text-sm text-gray-200">Team on site</div></div></div>
            <div className="aspect-[4/3] rounded-3xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 shadow-inner flex items-center justify-center"><div className="text-center"><div className="text-4xl">✅</div><div className="mt-2 text-sm text-gray-200">Guaranteed</div></div></div>
            <div className="aspect-[4/3] rounded-3xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 shadow-inner flex items-center justify-center"><div className="text-center"><div className="text-4xl">🔎</div><div className="mt-2 text-sm text-gray-200">Verified</div></div></div>
          </div>
        </div>
      </div>
    </section>
  );
}
