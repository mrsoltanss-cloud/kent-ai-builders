import Link from "next/link";

export default function TrustSection() {
  return (
    <section className="relative isolate overflow-hidden bg-[#0f1b22] text-white py-10 sm:py-16">
      <div className="absolute -top-24 -right-32 h-56 sm:h-72 w-56 sm:w-72 rounded-full blur-3xl opacity-20 bg-emerald-500/40" />
      <div className="absolute -bottom-28 -left-20 h-56 sm:h-72 w-56 sm:w-72 rounded-full blur-3xl opacity-20 bg-cyan-400/40" />
      <div className="container mx-auto max-w-6xl px-4">
        <div className="grid gap-8 sm:gap-10 md:grid-cols-2 items-start">
          <div>
            <h2 className="text-2xl sm:text-4xl font-extrabold leading-tight">
              Why homeowners across Kent choose <span className="text-emerald-400">Brixel</span>
            </h2>

            <ul className="mt-5 sm:mt-6 space-y-3 sm:space-y-4 text-[15px] sm:text-base text-gray-100">
              <li className="flex gap-3"><span className="shrink-0 text-xl sm:text-2xl" aria-hidden>🤖</span><span><strong>Instant AI-powered quotes</strong> – no waiting around, no pushy sales visits.</span></li>
              <li className="flex gap-3"><span className="shrink-0 text-xl sm:text-2xl" aria-hidden>🛠</span><span><strong>Local builders you can actually trust</strong> – vetted, reviewed, and verified.</span></li>
              <li className="flex gap-3"><span className="shrink-0 text-xl sm:text-2xl" aria-hidden>🛡</span><span><strong>Guaranteed peace of mind</strong> – insurance, warranties, and DBS-checked teams.</span></li>
              <li className="flex gap-3"><span className="shrink-0 text-xl sm:text-2xl" aria-hidden>⚡</span><span><strong>Fast response, no hassle</strong> – we call back within 1 hour, free survey included.</span></li>
            </ul>

            <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-3">
              <Stat value="2,300+" label="Projects" />
              <Stat value="4.9/5" label="Avg rating" />
              <Stat value="10+ yrs" label="Experience" />
            </div>

            {/* Chips: horizontal scroll on mobile */}
            <div className="mt-3 sm:mt-4 overflow-x-auto no-scrollbar -mx-2 sm:mx-0">
              <div className="px-2 sm:px-0 flex gap-2 sm:flex-wrap sm:gap-2">
                {["DBS-checked teams","£5m Public Liability","NICEIC / Gas Safe","CSCS qualified","12-month workmanship guarantee"].map((chip) => (
                  <span key={chip} className="shrink-0 rounded-full bg-white/5 border border-white/10 px-3 py-1.5 text-xs sm:text-[13px] text-gray-200">
                    {chip}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <p className="text-gray-300 text-[15px] sm:text-base">
                👉 <strong>Don’t gamble with your home.</strong> Get your instant estimate today and join the homeowners who already trust Brixel.
              </p>
              <Link
                href="/quote"
                className="mt-3 inline-flex items-center justify-center rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-4 sm:px-5 py-2.5 sm:py-3 shadow-lg transition focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-[#0f1b22]"
              >
                Get my instant quote ➜
              </Link>
            </div>
          </div>

          {/* Emoji tiles: hide on very small screens */}
          <div className="hidden xs:grid grid-cols-2 gap-3 sm:gap-4 md:contents">
            <Tile title="Handshake" emoji="🤝" />
            <Tile title="Team on site" emoji="👷‍♂️" />
            <Tile title="Guaranteed" emoji="✅" />
            <Tile title="Verified" emoji="🔎" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 p-3 sm:p-4 text-center">
      <div className="text-lg sm:text-2xl font-extrabold text-white">{value}</div>
      <div className="text-[10px] sm:text-xs uppercase tracking-wide text-gray-300">{label}</div>
    </div>
  );
}

function Tile({ title, emoji }: { title: string; emoji: string }) {
  return (
    <div className="aspect-[4/3] rounded-2xl sm:rounded-3xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 shadow-inner flex items-center justify-center">
      <div className="text-center">
        <div className="text-3xl sm:text-4xl">{emoji}</div>
        <div className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-200">{title}</div>
      </div>
    </div>
  );
}
