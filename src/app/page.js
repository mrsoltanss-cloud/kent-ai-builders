export default function Home() {
  const services = [
    { key: "extensions", label: "Extensions & Renovations" },
    { key: "new-builds", label: "New Builds (1–100 homes)" },
    { key: "roofing", label: "Roofing & Repairs" },
    { key: "brickwork", label: "Brickwork & Repointing" },
    { key: "kitchens", label: "Kitchens & Bathrooms" },
    { key: "plastering", label: "Plastering & Painting" },
    { key: "landscaping", label: "Driveways & Landscaping" },
    { key: "sealing", label: "Wall Sealing & Damp Proofing" },
  ];

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-20 pointer-events-none">
          {/* subtle blueprint/tech lines */}
          <svg viewBox="0 0 800 400" className="w-full h-full">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="mx-auto max-w-6xl px-6 pt-20 pb-14 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            The UK’s First <span className="text-gray-900">AI-Powered Builder</span>
          </h1>
          <p className="mt-5 text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
            From a single wall repair to 100 new homes — one trusted team. Our AI gives you
            an instant, fair price range so you don’t need 20 quotes to know you’re getting a good deal.
            Final price always confirmed after a free site survey.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/quote"
              className="rounded-xl px-6 py-3 font-semibold bg-black text-white"
            >
              Get My Instant Estimate
            </a>
            <a
              href="https://wa.me/447000000000"
              className="rounded-xl px-6 py-3 font-semibold border border-gray-300"
            >
              Talk on WhatsApp
            </a>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            Serving all of Kent • Transparent, fast & accurate • Subject to survey
          </p>
        </div>
      </section>

      {/* TRUST BANNER */}
      <section className="bg-gray-50 border-y">
        <div className="mx-auto max-w-6xl px-6 py-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <span className="text-yellow-500">★★★★★</span>
            <span className="text-sm md:text-base">Rated 5 stars by Kent homeowners</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-sm md:text-base">Fully Insured & Guaranteed</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-sm md:text-base">Fair & Transparent Pricing</span>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-6xl px-6 py-14">
        <h2 className="text-2xl md:text-3xl font-bold text-center">How it works</h2>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border p-6">
            <div className="text-3xl">📝</div>
            <h3 className="mt-3 font-semibold">Tell us about your job</h3>
            <p className="mt-2 text-gray-600">
              Answer a few quick questions and (optionally) upload photos or plans.
            </p>
          </div>
          <div className="rounded-2xl border p-6">
            <div className="text-3xl">🤖</div>
            <h3 className="mt-3 font-semibold">AI gives a fair estimate</h3>
            <p className="mt-2 text-gray-600">
              Our model combines your details with real-world pricing to give an instant price range.
            </p>
          </div>
          <div className="rounded-2xl border p-6">
            <div className="text-3xl">🏠</div>
            <h3 className="mt-3 font-semibold">Free site survey</h3>
            <p className="mt-2 text-gray-600">
              We confirm access, materials and timeline, then provide a fixed quote you can trust.
            </p>
          </div>
        </div>
      </section>

      {/* WHY AI */}
      <section className="mx-auto max-w-6xl px-6 pb-4">
        <div className="rounded-3xl bg-gray-900 text-white p-8 md:p-12">
          <h2 className="text-2xl md:text-3xl font-bold">Why AI-powered pricing?</h2>
          <p className="mt-3 text-gray-200">
            Traditional quotes can vary wildly. Our AI removes the guesswork by analysing your inputs
            and photos, then cross-checking with real job data — giving you a fair range instantly.
          </p>
          <ul className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <li className="bg-white/10 rounded-xl p-4">⚡ Instant answers — no waiting days</li>
            <li className="bg-white/10 rounded-xl p-4">🔍 Transparent ranges — no surprises</li>
            <li className="bg-white/10 rounded-xl p-4">🛡️ Human survey to confirm & protect you</li>
          </ul>
          <div className="mt-6">
            <a href="/quote" className="inline-block rounded-xl bg-white text-gray-900 px-5 py-3 font-semibold">
              Get My Instant Estimate
            </a>
          </div>
        </div>
      </section>

      {/* SERVICES GRID */}
      <section className="mx-auto max-w-6xl px-6 py-14">
        <h2 className="text-2xl md:text-3xl font-bold text-center">One-stop building services</h2>
        <p className="text-center text-gray-600 mt-2">
          From tiny fixes to large developments — we handle it all.
        </p>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map((s) => (
            <a
              key={s.key}
              href={`/quote?service=${encodeURIComponent(s.key)}`}
              className="rounded-2xl border p-5 hover:shadow-md transition"
            >
              <div className="h-28 w-full rounded-xl bg-gray-100 flex items-center justify-center text-gray-400">
                {/* Placeholder image block – replace later with real photos */}
                <span className="text-sm">Photo</span>
              </div>
              <h3 className="mt-4 font-semibold">{s.label}</h3>
              <p className="text-sm text-gray-600 mt-1">Get instant estimate →</p>
            </a>
          ))}
        </div>
      </section>

      {/* REVIEWS */}
      <section className="mx-auto max-w-6xl px-6 pb-14">
        <h2 className="text-2xl md:text-3xl font-bold text-center">Homeowners trust us</h2>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            "“Brilliant job repointing our wall — fast and tidy. The instant estimate matched the final price.”",
            "“Roof valley repair done in a day. Loved getting a ballpark quote online first.”",
            "“Clear communication and fair pricing. Would definitely recommend in Kent.”",
          ].map((quote, i) => (
            <div key={i} className="rounded-2xl border p-5">
              <div className="text-yellow-500">★★★★★</div>
              <p className="mt-2 text-gray-700">{quote}</p>
              <p className="mt-2 text-sm text-gray-500">— Local homeowner</p>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-gray-50 border-t">
        <div className="mx-auto max-w-6xl px-6 py-14 text-center">
          <h2 className="text-2xl md:text-3xl font-bold">
            Ready to build smarter?
          </h2>
          <p className="mt-2 text-gray-600">
            Kent’s only AI-powered builder. Every job, big or small — get your instant estimate now.
          </p>
          <div className="mt-6 flex gap-4 justify-center">
            <a href="/quote" className="rounded-xl px-6 py-3 font-semibold bg-black text-white">
              Get My Instant Estimate
            </a>
            <a href="https://wa.me/447000000000" className="rounded-xl px-6 py-3 font-semibold border border-gray-300">
              Talk on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
