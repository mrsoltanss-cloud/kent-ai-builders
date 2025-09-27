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
      <section className="relative bg-gray-900 text-white">
        <img
          src="https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=2000&q=80"
          alt="Building site"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/40"></div>

        <div className="relative mx-auto max-w-6xl px-6 pt-20 pb-24 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            Build Smarter. Faster. Fairer. <br />
            <span className="text-teal-400">Kent’s #1 AI-Powered Builder</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-200 max-w-3xl mx-auto">
            Instant quotes • Verified builders • Guaranteed work
          </p>

          {/* Search */}
          <form onSubmit={onSearchSubmit} className="mt-8 max-w-xl mx-auto">
            <div className="flex items-stretch gap-2">
              <input
                className="flex-1 rounded-xl border px-4 py-3 text-black"
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
            <p className="mt-2 text-xs text-gray-300">Try: “{suggestions[(sIndex + 1) % suggestions.length]}”</p>
          </form>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/quote"
              className="rounded-xl px-6 py-3 font-semibold bg-orange-500 text-white hover:bg-orange-600"
            >
              Get My Instant Estimate
            </Link>
            <a
              href="https://wa.me/447000000000"
              className="rounded-xl px-6 py-3 font-semibold border border-teal-400 text-teal-400 hover:bg-teal-50 hover:text-teal-600 bg-white/10"
            >
              Talk on WhatsApp
            </a>
          </div>

          <p className="mt-6 text-sm text-gray-300">
            ★★★★★ Trusted by 2,000+ Kent homeowners • Fully Insured • Free Site Survey
          </p>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="bg-white shadow">
        <div className="mx-auto max-w-6xl px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="font-semibold">🤖 AI Fair Pricing</div>
          <div className="font-semibold">🛡️ Fully Insured & Guaranteed</div>
          <div className="font-semibold">📍 Serving All of Kent</div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-3xl font-bold text-center text-navy-900">How it works</h2>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="rounded-2xl border p-6 hover:border-teal-500 bg-gray-50">
            <div className="text-4xl">📝</div>
            <h3 className="mt-4 font-semibold text-lg">Tell us about your job</h3>
            <p className="mt-2 text-gray-600">Describe your project. Add photos or plans for accuracy.</p>
          </div>
          <div className="rounded-2xl border p-6 hover:border-teal-500 bg-gray-50">
            <div className="text-4xl">🤖</div>
            <h3 className="mt-4 font-semibold text-lg">AI estimates instantly</h3>
            <p className="mt-2 text-gray-600">You get a fair price range based on real job data.</p>
          </div>
          <div className="rounded-2xl border p-6 hover:border-teal-500 bg-gray-50">
            <div className="text-4xl">👷</div>
            <h3 className="mt-4 font-semibold text-lg">Matched with the right builder</h3>
            <p className="mt-2 text-gray-600">Free survey and a fixed confirmed quote.</p>
          </div>
        </div>
      </section>

      {/* SERVICES GRID */}
      <section className="bg-gray-50 border-y">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-3xl font-bold text-center text-teal-600">Our Services</h2>
          <p className="text-center text-gray-600 mt-2">From small fixes to large builds — we cover it all.</p>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Roofing", cost: "from £150/m²" },
              { name: "Extensions", cost: "from £1,200/m²" },
              { name: "Brickwork", cost: "from £60/m²" },
              { name: "Kitchens", cost: "from £6,000" },
              { name: "Bathrooms", cost: "from £4,000" },
              { name: "Driveways", cost: "from £80/m²" },
              { name: "Electrical", cost: "from £50/hr" },
              { name: "Plumbing", cost: "from £60/hr" },
            ].map((s, i) => (
              <Link
                key={i}
                href={`/quote?service=${s.name.toLowerCase()}`}
                className="rounded-2xl border bg-white p-6 hover:shadow-md hover:border-teal-500 transition"
              >
                <div className="h-24 w-full rounded-xl bg-gray-100 flex items-center justify-center text-gray-400">
                  <span className="text-sm">Image</span>
                </div>
                <h3 className="mt-4 font-semibold">{s.name}</h3>
                <p className="text-sm text-gray-500">{s.cost}</p>
                <p className="text-sm text-teal-500 mt-1">Get instant estimate →</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* MINI CALCULATOR */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="rounded-3xl border p-8 bg-white shadow">
          <h3 className="text-2xl font-semibold text-teal-600">Quick estimate preview</h3>
          <p className="text-sm text-gray-600 mt-1">Choose a service and size to see a ballpark now.</p>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-3">
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

            <Link href={`/quote?service=${svc}`} className="rounded-lg bg-orange-500 text-white px-4 py-2 font-semibold hover:bg-orange-600 text-center">
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

      {/* WHY TRUST US */}
      <section className="bg-gray-900 text-white py-16">
        <div className="mx-auto max-w-6xl px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <img
            src="https://images.unsplash.com/photo-1600585152938-3eaa35236e03?auto=format&fit=crop&w=800&q=80"
            alt="Builder handshake"
            className="rounded-2xl shadow-lg"
          />
          <div>
            <h2 className="text-3xl font-bold">Why homeowners trust us</h2>
            <ul className="mt-6 space-y-3 text-lg">
              <li>🤖 Instant, fair AI-powered pricing</li>
              <li>👷 Verified, experienced local builders</li>
              <li>🛡️ Fully insured & guaranteed work</li>
              <li>🚀 Fast response + free survey</li>
            </ul>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-3xl font-bold text-center text-teal-600">What our customers say</h2>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { text: "“Great job repointing our wall — instant estimate was spot on.”", name: "Sarah, Maidstone" },
            { text: "“Roof valley fixed in a day. Loved the online quote.”", name: "James, Canterbury" },
            { text: "“Clear pricing, fast service. Highly recommend.”", name: "Helen, Ashford" },
          ].map((t, i) => (
            <div key={i} className="rounded-2xl border p-6 hover:border-teal-500 bg-gray-50">
              <div className="text-yellow-500">★★★★★</div>
              <p className="mt-4 text-gray-700">{t.text}</p>
              <p className="mt-2 text-sm text-gray-500">{t.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* GUIDES */}
      <section className="bg-gray-50 border-y">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-3xl font-bold text-center text-teal-600">Cost guides & advice</h2>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "How much does repointing cost in Kent?", img: "https://images.unsplash.com/photo-1600585152938-3eaa35236e03?auto=format&fit=crop&w=600&q=80" },
              { title: "Roof repair costs explained", img: "https://images.unsplash.com/photo-1597003723183-d84e3b31cae6?auto=format&fit=crop&w=600&q=80" },
              { title: "Do you need planning permission for an extension?", img: "https://images.unsplash.com/photo-1600585152934-7c3f98b9f95a?auto=format&fit=crop&w=600&q=80" },
            ].map((g, i) => (
              <a key={i} href="#" className="rounded-2xl border bg-white p-4 hover:shadow-md hover:border-teal-500 transition">
                <img src={g.img} alt={g.title} className="rounded-lg w-full h-40 object-cover" />
                <h3 className="mt-4 font-semibold">{g.title}</h3>
                <p className="text-sm text-teal-500 mt-2">Read more →</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-orange-500 text-white text-center py-16">
        <h2 className="text-3xl font-bold">Ready to build smarter?</h2>
        <p className="mt-4 text-lg">Kent’s only AI-powered builder. Get your instant estimate today.</p>
        <div className="mt-8 flex gap-4 justify-center">
          <Link href="/quote" className="rounded-xl px-6 py-3 font-semibold bg-white text-orange-600 hover:bg-gray-100">
            Get My Instant Estimate
          </Link>
          <a href="https://wa.me/447000000000" className="rounded-xl px-6 py-3 font-semibold border border-white text-white hover:bg-orange-600">
            Talk on WhatsApp
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-navy-900 text-gray-200">
        <div className="mx-auto max-w-6xl px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
          <div>
            <h3 className="font-semibold text-white">Contact</h3>
            <p>📞 07000 000000</p>
            <p>✉️ info@kent-ai-builders.co.uk</p>
          </div>
          <div>
            <h3 className="font-semibold text-white">Service Areas</h3>
            <p>Kent • Maidstone • Canterbury • Ashford • Medway</p>
          </div>
          <div>
            <h3 className="font-semibold text-white">Trust</h3>
            <p>🛡️ Fully insured & guaranteed</p>
            <p>© Kent AI Builders 2025</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
