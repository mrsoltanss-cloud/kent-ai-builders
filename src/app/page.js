export default function Home() {
  const accent = "text-teal-500"; // main accent colour
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

  const guides = [
    "How much does repointing cost in Kent?",
    "Roof repair costs explained",
    "Do you need planning permission for an extension?",
  ];

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-20 pointer-events-none">
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
            The UK’s First <span className={`${accent}`}>AI-Powered Builder</span>
          </h1>
          <p className="mt-5 text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
            From a single repair to 100 new homes — one trusted team. Our AI gives you an instant, fair price range so you don’t need 20 random quotes to know if you’re getting a good deal.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/quote"
              className="rounded-xl px-6 py-3 font-semibold bg-teal-500 text-white hover:bg-teal-600"
            >
              Get My Instant Estimate
            </a>
            <a
              href="https://wa.me/447000000000"
              className="rounded-xl px-6 py-3 font-semibold border border-teal-500 text-teal-500 hover:bg-teal-50"
            >
              Talk on WhatsApp
            </a>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            Serving all of Kent • Transparent • Fast • Guaranteed
          </p>
        </div>
      </section>

      {/* TRUST STRIP */}
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
            <span className="text-sm md:text-base">AI Verified Estimates + Free Survey</span>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-6xl px-6 py-14">
        <h2 className={`text-2xl md:text-3xl font-bold text-center ${accent}`}>How it works</h2>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border p-6 hover:border-teal-500">
            <div className="text-3xl">📝</div>
            <h3 className="mt-3 font-semibold">Tell us about your job</h3>
            <p className="mt-2 text-gray-600">Upload photos, plans, or just type what you need.</p>
          </div>
          <div className="rounded-2xl border p-6 hover:border-teal-500">
            <div className="text-3xl">🤖</div>
            <h3 className="mt-3 font-semibold">AI gives instant range</h3>
            <p className="mt-2 text-gray-600">Based on your details + our real-world data.</p>
          </div>
          <div className="rounded-2xl border p-6 hover:border-teal-500">
            <div className="text-3xl">🏠</div>
            <h3 className="mt-3 font-semibold">Free site survey</h3>
            <p className="mt-2 text-gray-600">We confirm access, timeline, and fixed price.</p>
          </div>
        </div>
      </section>

      {/* SERVICES GRID */}
      <section className="mx-auto max-w-6xl px-6 py-14">
        <h2 className={`text-2xl md:text-3xl font-bold text-center ${accent}`}>One-stop building services</h2>
        <p className="text-center text-gray-600 mt-2">
          From tiny fixes to large developments — we handle it all.
        </p>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map((s) => (
            <a
              key={s.key}
              href={`/quote?service=${encodeURIComponent(s.key)}`}
              className="rounded-2xl border p-5 hover:shadow-md hover:border-teal-500 transition"
            >
              <div className="h-28 w-full rounded-xl bg-gray-100 flex items-center justify-center text-gray-400">
                <span className="text-sm">Photo</span>
              </div>
              <h3 className="mt-4 font-semibold">{s.label}</h3>
              <p className="text-sm text-teal-500 mt-1">Get instant estimate →</p>
            </a>
          ))}
        </div>
      </section>

      {/* WHY AI */}
      <section className="mx-auto max-w-6xl px-6 pb-14">
        <div className="rounded-3xl bg-gray-900 text-white p-8 md:p-12">
          <h2 className="text-2xl md:text-3xl font-bold">Why AI-powered pricing?</h2>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold">The Old Way</h3>
              <ul className="list-disc list-inside text-gray-300 mt-2 space-y-1">
                <li>Request 20+ quotes</li>
                <li>Wait days for replies</li>
                <li>Prices vary wildly</li>
                <li>Stress & uncertainty</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold">The AI Way</h3>
              <ul className="list-disc list-inside text-teal-400 mt-2 space-y-1">
                <li>Instant, fair price range</li>
                <li>Transparent & accurate</li>
                <li>Backed by real job data</li>
                <li>Survey confirms final cost</li>
              </ul>
            </div>
          </div>
          <div className="mt-6">
            <a href="/quote" className="inline-block rounded-xl bg-teal-500 text-white px-5 py-3 font-semibold hover:bg-teal-600">
              Try it now → Get My Estimate
            </a>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="mx-auto max-w-6xl px-6 pb-14">
        <h2 className={`text-2xl md:text-3xl font-bold text-center ${accent}`}>Homeowners trust us</h2>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            "“Brilliant job repointing our wall — the instant estimate matched the final price.”",
            "“Roof valley repair done in a day. Loved getting a ballpark quote online first.”",
            "“Clear communication and fair pricing. Would definitely recommend in Kent.”",
          ].map((quote, i) => (
            <div key={i} className="rounded-2xl border p-5 hover:border-teal-500">
              <div className="text-yellow-500">★★★★★</div>
              <p className="mt-2 text-gray-700">{quote}</p>
              <p className="mt-2 text-sm text-gray-500">— Local homeowner</p>
            </div>
          ))}
        </div>
      </section>

      {/* GUIDES PREVIEW */}
      <section className="mx-auto max-w-6xl px-6 pb-14">
        <h2 className={`text-2xl md:text-3xl font-bold text-center ${accent}`}>Cost guides & advice</h2>
        <p className="text-center text-gray-600 mt-2">
          Helping you understand building costs before you commit.
        </p>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {guides.map((g, i) => (
            <a key={i} href="#" className="rounded-2xl border p-6 hover:shadow-md hover:border-teal-500 transition">
              <h3 className="font-semibold">{g}</h3>
              <p className="text-sm text-teal-500 mt-2">Read more →</p>
            </a>
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
            <a href="/quote" className="rounded-xl px-6 py-3 font-semibold bg-teal-500 text-white hover:bg-teal-600">
              Get My Instant Estimate
            </a>
            <a href="https://wa.me/447000000000" className="rounded-xl px-6 py-3 font-semibold border border-teal-500 text-teal-500 hover:bg-teal-50">
              Talk on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
