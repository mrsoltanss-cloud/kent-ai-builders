"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const router = useRouter();

  // Rotating search suggestions
  const suggestions = [
    "Leaky roof",
    "Wall needs repointing",
    "Need an extension",
    "Kitchen renovation",
    "Cracked driveway",
    "Loft conversion",
  ];
  const [sIndex, setSIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setSIndex((i) => (i + 1) % suggestions.length), 2200);
    return () => clearInterval(id);
  }, [suggestions.length]);

  // Search bar → /quote
  const [query, setQuery] = useState("");
  function onSearchSubmit(e) {
    e.preventDefault();
    const q = query.trim() || suggestions[sIndex];
    router.push(`/quote?query=${encodeURIComponent(q)}`);
  }

  // Mini calculator
  const [svc, setSvc] = useState("repointing");
  const [len, setLen] = useState("");
  const [ht, setHt] = useState("");
  const [valley, setValley] = useState("");

  const [low, high] = useMemo(() => {
    const n = (v) => Number(String(v).replace(",", ".")) || 0;
    let base = 0;
    if (svc === "repointing") base = n(len) * n(ht) * 58;
    if (svc === "sealing") base = n(len) * n(ht) * 12;
    if (svc === "roof-valley") base = n(valley) * 200;
    return [base * 0.9, base * 1.2];
  }, [svc, len, ht, valley]);

  const gbp = (x) =>
    new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(
      Math.max(0, Math.round(x))
    );

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* HERO */}
      <section className="bg-gray-50 border-b">
        <div className="mx-auto max-w-6xl px-6 pt-16 pb-10 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold">
            Kent’s Most Trusted <span className="text-teal-500">AI-Powered Builder</span>
          </h1>
          <p className="mt-5 text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
            Instant quotes • Verified builders • Guaranteed work
          </p>

          {/* Search */}
          <form onSubmit={onSearchSubmit} className="mt-6 max-w-xl mx-auto">
            <div className="flex items-stretch gap-2">
              <input
                className="flex-1 rounded-xl border px-4 py-3"
                placeholder={suggestions[sIndex]}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button
                type="submit"
                className="rounded-xl px-5 py-3 bg-teal-500 text-white font-semibold hover:bg-teal-600"
              >
                Get Estimate
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-500">Try: “{suggestions[(sIndex + 1) % suggestions.length]}”</p>
          </form>

          <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/quote"
              className="rounded-xl px-6 py-3 font-semibold bg-teal-500 text-white hover:bg-teal-600"
            >
              Get My Instant Estimate
            </Link>
            <a
              href="https://wa.me/447000000000"
              className="rounded-xl px-6 py-3 font-semibold border border-teal-500 text-teal-500 hover:bg-teal-50"
            >
              Talk on WhatsApp
            </a>
          </div>
          <p className="mt-3 text-sm text-gray-500">
            ★★★★★ Trusted by Kent homeowners • Fully Insured • Free Site Survey
          </p>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="bg-white border-y">
        <div className="mx-auto max-w-6xl px-6 py-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>🤖 AI Fair Pricing</div>
          <div>🛡️ Fully Insured & Guaranteed</div>
          <div>📍 Serving All of Kent</div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-6xl px-6 py-14">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-teal-500">How it works</h2>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border p-6 hover:border-teal-500">
            📝 <h3 className="mt-3 font-semibold">Tell us about your job</h3>
            <p className="mt-2 text-gray-600">Describe your project. Add photos or plans for accuracy.</p>
          </div>
          <div className="rounded-2xl border p-6 hover:border-teal-500">
            🤖 <h3 className="mt-3 font-semibold">AI estimates instantly</h3>
            <p className="mt-2 text-gray-600">You get a fair price range based on real job data.</p>
          </div>
          <div className="rounded-2xl border p-6 hover:border-teal-500">
            👷 <h3 className="mt-3 font-semibold">Matched with the right builder</h3>
            <p className="mt-2 text-gray-600">Free survey and a fixed confirmed quote.</p>
          </div>
        </div>
      </section>

      {/* SERVICES GRID */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-teal-500">Our Services</h2>
        <p className="text-center text-gray-600 mt-2">From small fixes to large builds — we cover it all.</p>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            "Roofing", "Extensions", "Brickwork", "Kitchens",
            "Bathrooms", "Driveways", "Electrical", "Plumbing"
          ].map((s, i) => (
            <Link
              key={i}
              href={`/quote?service=${s.toLowerCase()}`}
              className="rounded-2xl border p-5 hover:shadow-md hover:border-teal-500 transition text-center"
            >
              <div className="h-20 flex items-center justify-center text-gray-400">🔨</div>
              <h3 className="mt-4 font-semibold">{s}</h3>
              <p className="text-sm text-teal-500 mt-1">Get instant estimate →</p>
            </Link>
          ))}
        </div>
      </section>

      {/* MINI CALCULATOR */}
      <section className="mx-auto max-w-5xl px-6 pb-12">
        <div className="rounded-3xl border p-6 bg-gray-50">
          <h3 className="text-xl font-semibold">Quick estimate preview</h3>
          <p className="text-sm text-gray-600 mt-1">Choose a service and size to see a ballpark now.</p>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3">
            <select value={svc} onChange={(e) => setSvc(e.target.value)} className="rounded-lg border px-3 py-2">
              <option value="repointing">Repointing</option>
              <option value="roof-valley">Roof Valley</option>
              <option value="sealing">Wall Sealing</option>
            </select>

            {(svc === "repointing" || svc === "sealing") && (
              <>
                <input className="rounded-lg border px-3 py-2" placeholder="Length (m)" value={len} onChange={(e) => setLen(e.target.value)} />
                <input className="rounded-lg border px-3 py-2" placeholder="Height (m)" value={ht} onChange={(e) => setHt(e.target.value)} />
              </>
            )}

            {svc === "roof-valley" && (
              <input className="rounded-lg border px-3 py-2 md:col-span-2" placeholder="Valley length (m)" value={valley} onChange={(e) => setValley(e.target.value)} />
            )}

            <Link href={`/quote?service=${svc}`} className="rounded-lg bg-teal-500 text-white px-4 py-2 font-semibold hover:bg-teal-600 text-center">
              Full Quote →
            </Link>
          </div>

          <div className="mt-3 text-sm">
            <span className="font-semibold">Estimated range:</span>{" "}
            <span className="text-teal-600">{gbp(low)}</span> – <span className="text-teal-600">{gbp(high)}</span>{" "}
            <span className="text-gray-500">(subject to survey)</span>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="mx-auto max-w-6xl px-6 pb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-teal-500">What our customers say</h2>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            "“Great job repointing our wall — instant estimate was spot on.”",
            "“Roof valley fixed in a day. Loved the online quote.”",
            "“Clear pricing, fast service. Highly recommend.”",
          ].map((quote, i) => (
            <div key={i} className="rounded-2xl border p-5 hover:border-teal-500">
              <div className="text-yellow-500">★★★★★</div>
              <p className="mt-2 text-gray-700">{quote}</p>
              <p className="mt-2 text-sm text-gray-500">— Local homeowner</p>
            </div>
          ))}
        </div>
      </section>

      {/* GUIDES */}
      <section className="mx-auto max-w-6xl px-6 pb-14">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-teal-500">Cost guides & advice</h2>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            "How much does repointing cost in Kent?",
            "Roof repair costs explained",
            "Do you need planning permission for an extension?",
          ].map((g, i) => (
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
          <h2 className="text-2xl md:text-3xl font-bold">Ready to build smarter?</h2>
          <p className="mt-2 text-gray-600">Kent’s only AI-powered builder. Every job, big or small — get your instant estimate now.</p>
          <div className="mt-6 flex gap-4 justify-center">
            <Link href="/quote" className="rounded-xl px-6 py-3 font-semibold bg-teal-500 text-white hover:bg-teal-600">
              Get My Instant Estimate
            </Link>
            <a href="https://wa.me/447000000000" className="rounded-xl px-6 py-3 font-semibold border border-teal-500 text-teal-500 hover:bg-teal-50">
              Talk on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t">
        <div className="mx-auto max-w-6xl px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-600">
          <div>
            <h3 className="font-semibold">Contact</h3>
            <p>📞 07000 000000</p>
            <p>✉️ info@kent-ai-builders.co.uk</p>
          </div>
          <div>
            <h3 className="font-semibold">Service Areas</h3>
            <p>Kent • Maidstone • Canterbury • Ashford • Medway</p>
          </div>
          <div>
            <h3 className="font-semibold">Trust</h3>
            <p>🛡️ Fully insured & guaranteed</p>
            <p>© Kent AI Builders 2025</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
