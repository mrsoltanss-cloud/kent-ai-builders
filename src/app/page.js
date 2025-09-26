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
            One platform. Every building job. Our AI estimates your project and matches you with the perfect builder — fast, fair, and stress-free.
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
    </main>
  );
}
