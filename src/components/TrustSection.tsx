export default function TrustSection() {
  return (
    <section className="w-full bg-[#0f1f1a] text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        {/* Headline */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
          Why homeowners across Kent choose <span className="text-emerald-500">Brixel</span>
        </h2>

        {/* Bullet list */}
        <ul className="mt-8 space-y-5">
          <li className="flex gap-4 items-start">
            <span aria-hidden className="text-2xl leading-none mt-0.5">🤖</span>
            <p className="text-base leading-7">
              <span className="font-semibold">Instant AI-powered quotes</span>
              <span className="text-neutral-300"> — no waiting around, no pushy sales visits.</span>
            </p>
          </li>
          <li className="flex gap-4 items-start">
            <span aria-hidden className="text-2xl leading-none mt-0.5">🛠️</span>
            <p className="text-base leading-7">
              <span className="font-semibold">Local builders you can actually trust</span>
              <span className="text-neutral-300"> — vetted, reviewed, and verified.</span>
            </p>
          </li>
          <li className="flex gap-4 items-start">
            <span aria-hidden className="text-2xl leading-none mt-0.5">🛡️</span>
            <p className="text-base leading-7">
              <span className="font-semibold">Guaranteed peace of mind</span>
              <span className="text-neutral-300"> — insurance, warranties, and DBS-checked teams.</span>
            </p>
          </li>
          <li className="flex gap-4 items-start">
            <span aria-hidden className="text-2xl leading-none mt-0.5">⚡</span>
            <p className="text-base leading-7">
              <span className="font-semibold">Fast response, no hassle</span>
              <span className="text-neutral-300"> — we call back within 1 hour, free survey included.</span>
            </p>
          </li>
        </ul>

        {/* Stats cards */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl bg-white/5 border border-white/10 p-6 text-center">
            <div className="text-3xl sm:text-4xl font-extrabold">2,300+</div>
            <div className="mt-1 text-[11px] uppercase tracking-wide text-neutral-300">Projects</div>
          </div>
          <div className="rounded-2xl bg-white/5 border border-white/10 p-6 text-center">
            <div className="text-3xl sm:text-4xl font-extrabold">4.9/5</div>
            <div className="mt-1 text-[11px] uppercase tracking-wide text-neutral-300">Avg Rating</div>
          </div>
          <div className="rounded-2xl bg-white/5 border border-white/10 p-6 text-center">
            <div className="text-3xl sm:text-4xl font-extrabold">10+ yrs</div>
            <div className="mt-1 text-[11px] uppercase tracking-wide text-neutral-300">Experience</div>
          </div>
        </div>

        {/* Trust chips */}
        <div className="mt-4 flex flex-wrap gap-3">
          <span className="px-3 py-1 rounded-full border text-xs text-neutral-200 border-white/15">DBS-checked teams</span>
          <span className="px-3 py-1 rounded-full border text-xs text-neutral-200 border-white/15">£5m Public Liability</span>
          <span className="px-3 py-1 rounded-full border text-xs text-neutral-200 border-white/15">NICEIC / Gas Safe</span>
          <span className="px-3 py-1 rounded-full border text-xs text-neutral-200 border-white/15">12-month workmanship guarantee</span>
        </div>

        {/* Closing line + CTA */}
        <p className="mt-8 text-base leading-7 text-neutral-300">
          <span className="font-semibold text-white">👉 Don’t gamble with your home.</span>{" "}
          Get your instant estimate today and join the homeowners who already trust Brixel.
        </p>

        <div className="mt-6">
          <a
            href="/quote"
            className="inline-flex items-center gap-2 rounded-full 
                       bg-emerald-600 hover:bg-emerald-500 
                       text-white font-semibold px-5 py-3 
                       shadow-lg shadow-emerald-600/30
                       focus:outline-none focus:ring-2 focus:ring-emerald-400"
          >
            Get my instant quote <span aria-hidden>➜</span>
          </a>
        </div>
      </div>
    </section>
  );
}
