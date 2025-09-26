"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  const accent = "text-teal-500";

  // ----- Rotating search suggestions -----
  const suggestions = [
    "Leaky roof",
    "Wall needs repointing",
    "Roof valley repair",
    "Need an extension",
    "Cracked driveway",
    "Damp on brickwork",
    "Kitchen renovation",
    "Loft conversion",
  ];
  const [sIndex, setSIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setSIndex((i) => (i + 1) % suggestions.length), 2200);
    return () => clearInterval(id);
  }, [suggestions.length]); // ✅ include dependency

  // Search bar → /quote with query
  const [query, setQuery] = useState("");
  function onSearchSubmit(e) {
    e.preventDefault();
    const q = query.trim() || suggestions[sIndex];
    router.push(`/quote?query=${encodeURIComponent(q)}`);
  }

  // ----- Services directory (bigger set) -----
  const services = [
    { key: "extensions", label: "Extensions & Renovations" },
    { key: "new-builds", label: "New Builds (1–100 homes)" },
    { key: "loft-conversion", label: "Loft Conversions" },
    { key: "roofing", label: "Roofing & Repairs" },
    { key: "roof-valley", label: "Roof Valley Lead Replacement" },
    { key: "brickwork", label: "Brickwork & Repointing" },
    { key: "sealing", label: "Wall Sealing & Damp Proofing" },
    { key: "plastering", label: "Plastering & Rendering" },
    { key: "kitchens", label: "Kitchens" },
    { key: "bathrooms", label: "Bathrooms" },
    { key: "windows-doors", label: "Windows & Doors" },
    { key: "driveways", label: "Driveways & Landscaping" },
    { key: "fencing", label: "Fencing & Decking" },
    { key: "electrical", label: "Electrical (Part P)" },
    { key: "plumbing", label: "Plumbing & Heating" },
    { key: "painting", label: "Painting & Decorating" },
    { key: "guttering", label: "Gutters, Soffits & Fascias" },
  ];

  // ----- Mini Instant Estimate (teaser) -----
  const [svc, setSvc] = useState("repointing");
  const [len, setLen] = useState("");     // metres
  const [ht, setHt] = useState("");       // metres
  const [valley, setValley] = useState(""); // metres

  const [low, high] = useMemo(() => {
    const n = (v) => Number(String(v).replace(",", ".")) || 0;
    let base = 0;
    if (svc === "repointing") base = n(len) * n(ht) * 58;
    if (svc === "sealing")    base = n(len) * n(ht) * 12;
    if (svc === "roof-valley") base = n(valley) * 200;
    return [base * 0.9, base * 1.2];
  }, [svc, len, ht, valley]);

  const gbp = (x) =>
    new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(
      Math.max(0, Math.round(x))
    );

  function toQuote() {
    const p = new URLSearchParams();
    p.set("service", svc);
    if (len) p.set("length", String(len));
    if (ht) p.set("height", String(ht));
    if (valley) p.set("valley", String(valley));
    router.push(`/quote?${p.toString()}`);
  }

  // ----- Guides preview -----
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

        <div className="mx-auto max-w-6xl px-6 pt-16 pb-10 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            The UK’s First <span className="text-teal-500">AI-Powered Builder</span>
          </h1>
          <p className="mt-5 text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
            One platform. Every building job. Our AI estimates your project and matches you with the perfect builder — fast, fair, and stress-free.
          </p>

          {/* Search bar with rotating example */}
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
            {/* External link can remain <a> */}
            <a
              href="https://wa.me/447000000000"
              className="rounded-xl px-6 py-3 font-semibold border border-teal-500 text-teal-500 hover:bg-teal-50"
            >
              Talk on WhatsApp
            </a>
          </div>
          <p className="mt-3 text-sm text-gray-500">
            Serving all of Kent • AI estimates + human survey • Transparent & Guaranteed
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
        <h2 className="text-2xl md:text-3xl font-bold text-center text-teal-500">How it works</h2>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border p-6 hover:border-teal-500">
            <div className="text-3xl">📝</div>
            <h3 className="mt-3 font-semibold">Tell us about your job</h3>
            <p className="mt-2 text-gray-600">Use the search or quick form. Add photos or plans for accuracy.</p>
          </div>
          <div className="rounded-2xl border p-6 hover:border-teal-500">
            <div className="text-3xl">🤖</div>
            <h3 className="mt-3 font-semibold">AI estimates instantly</h3>
            <p className="mt-2 text-gray-600">You get a fair price range based on real job data.</p>
          </div>
          <div className="rounded-2xl border p-6 hover:border-teal-500">
            <div className="text-3xl">👷</div>
            <h3 className="mt-3 font-semibold">Matched with the right builder</h3>
            <p className="mt-2 text-gray-600">We schedule a free survey and confirm your fixed quote.</p>
          </div>
        </div>
      </section>

      {/* MINI INSTANT ESTIMATE (teaser) */}
      <section className="mx-auto max-w-5xl px-6 pb-6">
        <div className="rounded-3xl border p-6 md:p-8 bg-gray-50">
          <h3 className="text-xl font-semibold">Quick estimate preview</h3>
          <p className="text-sm text-gray-600 mt-1">Choose a service and add rough sizes — see a ballpark now.</p>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3">
            <select value={svc} onChange={(e) => setSvc(e.target.value)} className="rounded-lg border px-3 py-2">
              <option value="repointing">Repointing</option>
              <option value="roof-valley">Roof Valley Lead Replacement</option>
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

            <button onClick={toQuote} className="rounded-lg bg-teal-500 text-white px-4 py-2 font-semibold hover:bg-teal-600">
              Continue to full quote
            </button>
          </div>

          <div className="mt-3 text-sm">
            <span className="font-semibold">Estimated range:</span>{" "}
            <span className="text-teal-600">{gbp(low)}</span> – <span className="text-teal-600">{gbp(high)}</span>{" "}
            <span className="text-gray-500">(subject to free survey)</span>
          </div>
        </div>
      </section>

      {/* SERVICES GRID (expanded) */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-teal-500">One-stop building services</h2>
        <p className="text-center text-gray-600 mt-2">From tiny fixes to large developments — we handle it all.</p>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map((s) => (
            <Link
              key={s.key}
              href={`/quote?service=${encodeURIComponent(s.key)}`}
              className="rounded-2xl border p-5 hover:shadow-md hover:border-teal-500 transition"
            >
              <div className="h-28 w-full rounded-xl bg-gray-100 flex items-center justify-center text-gray-400">
                <span className="text-sm">Photo</span>
              </div>
              <h3 className="mt-4 font-semibold">{s.label}</h3>
              <p className="text-sm text-teal-500 mt-1">Get instant estimate →</p>
            </Link>
          ))}
        </div>
      </section>

      {/* WHY AI */}
      <section className="mx-auto max-w-6xl px-6 pb-12">
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
            <Link href="/quote" className="inline-block rounded-xl bg-teal-500 text-white px-5 py-3 font-semibold hover:bg-teal-600">
              Try it now → Get My Estimate
            </Link>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="mx-auto max-w-6xl px-6 pb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-teal-500">Homeowners trust us</h2>
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
        <h2 className="text-2xl md:text-3xl font-bold text-center text-teal-500">Cost guides & advice</h2>
        <p className="text-center text-gray-600 mt-2">Helping you understand building costs before you commit.</p>
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
          <h2 className="text-2xl md:text-3xl font-bold">Ready to build smarter?</h2>
          <p className="mt-2 text-gray-600">
            Kent’s only AI-powered builder. Every job, big or small — get your instant estimate now.
          </p>
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
    </main>
  );
}
