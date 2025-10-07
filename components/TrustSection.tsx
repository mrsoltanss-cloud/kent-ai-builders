// TrustSection — dark, high-trust slice (matches previous production look)
export default function TrustSection() {
  return (
    <section className="bg-slate-900 text-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
        <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight">
          Why homeowners across Kent choose{" "}
          <span className="text-emerald-400">Brixel</span>
        </h2>

        <div className="mt-8 space-y-5">
          <div className="flex gap-3">
            <span className="text-2xl leading-none select-none">🤖</span>
            <p className="text-base sm:text-lg">
              <span className="font-semibold">Instant AI-powered quotes</span> —
              no waiting around, no pushy sales visits.
            </p>
          </div>

          <div className="flex gap-3">
            <span className="text-2xl leading-none select-none">🛠️</span>
            <p className="text-base sm:text-lg">
              <span className="font-semibold">
                Local builders you can actually trust
              </span>{" "}
              — vetted, reviewed, and verified.
            </p>
          </div>

          <div className="flex gap-3">
            <span className="text-2xl leading-none select-none">🛡️</span>
            <p className="text-base sm:text-lg">
              <span className="font-semibold">Guaranteed peace of mind</span> —
              insurance, warranties, and DBS-checked teams.
            </p>
          </div>

          <div className="flex gap-3">
            <span className="text-2xl leading-none select-none">⚡</span>
            <p className="text-base sm:text-lg">
              <span className="font-semibold">Fast response, no hassle</span> —
              we call back within 1 hour, free survey included.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl bg-slate-800/60 border border-slate-700 p-6 text-center">
            <div className="text-3xl sm:text-4xl font-extrabold">2,300+</div>
            <div className="mt-1 text-sm tracking-wide text-slate-300">
              PROJECTS
            </div>
          </div>
          <div className="rounded-2xl bg-slate-800/60 border border-slate-700 p-6 text-center">
            <div className="text-3xl sm:text-4xl font-extrabold">4.9/5</div>
            <div className="mt-1 text-sm tracking-wide text-slate-300">
              AVG RATING
            </div>
          </div>
          <div className="rounded-2xl bg-slate-800/60 border border-slate-700 p-6 text-center">
            <div className="text-3xl sm:text-4xl font-extrabold">10+ yrs</div>
            <div className="mt-1 text-sm tracking-wide text-slate-300">
              EXPERIENCE
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="mt-4 flex flex-wrap gap-3">
          {[
            "DBS-checked teams",
            "£5m Public Liability",
            "NICEIC / Gas Safe",
            "CSCS qualified",
            "12-month workmanship guarantee",
          ].map((label) => (
            <span
              key={label}
              className="inline-flex items-center rounded-full border border-slate-700 bg-slate-800/70 px-3 py-1 text-sm text-slate-200"
            >
              {label}
            </span>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-8">
          <a
            href="#quote"
            className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-5 py-3 text-base font-semibold text-slate-900 hover:bg-emerald-400 transition"
          >
            Get my instant quote{" "}
            <span aria-hidden className="ml-2">
              ➜
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
