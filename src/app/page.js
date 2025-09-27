"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const router = useRouter();

  // ----------------- Rotating search suggestions -----------------
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

  // Search → /quote
  const [query, setQuery] = useState("");
  function onSearchSubmit(e) {
    e.preventDefault();
    const q = query.trim() || suggestions[sIndex];
    router.push(`/quote?query=${encodeURIComponent(q)}`);
  }

  // ----------------- Services carousel data -----------------
  const services = [
    { name: "Plumber", icon: "🚰" },
    { name: "Electrician", icon: "⚡" },
    { name: "Roofer", icon: "🏠" },
    { name: "Builder", icon: "👷" },
    { name: "Gardener", icon: "🪴" },
    { name: "Painter / Decorator", icon: "🖌️" },
    { name: "Handyman", icon: "🧰" },
    { name: "Locksmith", icon: "🔑" },
    { name: "Bathrooms", icon: "🛁" },
    { name: "Tiler - Tiling", icon: "🧱" },
    { name: "Central Heating", icon: "🌡️" },
    { name: "Gas Boiler Service", icon: "🔥" },
    { name: "Landscaper", icon: "⛰️" },
    { name: "Carpenter", icon: "🪚" },
    { name: "Plasterer", icon: "🛠️" },
    { name: "Driveways / Patios", icon: "🛤️" },
    { name: "Fencing / Gates", icon: "🚧" },
    { name: "Tree Surgeon", icon: "🌳" },
  ];

  // Items per page (responsive)
  const [perView, setPerView] = useState(6);
  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth;
      if (w >= 1536) setPerView(6);
      else if (w >= 1280) setPerView(6);
      else if (w >= 1024) setPerView(5);
      else if (w >= 640) setPerView(3);
      else setPerView(2);
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);
  const totalPages = useMemo(() => Math.max(1, Math.ceil(services.length / perView)), [services.length, perView]);
  const [page, setPage] = useState(0);
  useEffect(() => { if (page > totalPages - 1) setPage(totalPages - 1); }, [totalPages, page]);
  const percentPerPage = useMemo(() => 100 / totalPages, [totalPages]);
  const prevPage = () => setPage((p) => Math.max(0, p - 1));
  const nextPage = () => setPage((p) => Math.min(totalPages - 1, p + 1));

  // Testimonials (auto slider)
  const testimonials = [
    { text: "“Great job repointing our wall — instant estimate was spot on.”", name: "Sarah, Maidstone" },
    { text: "“Roof valley fixed in a day. Loved the online quote.”", name: "James, Canterbury" },
    { text: "“Clear pricing, fast service. Highly recommend.”", name: "Helen, Ashford" },
    { text: "“They handled the extension from start to finish. Stress-free.”", name: "Mark, Medway" },
    { text: "“Fair price, tidy team, and kept us informed daily.”", name: "Amelia, Tonbridge" },
    { text: "“Emergency leak sorted within hours. Brilliant.”", name: "Tom, Sevenoaks" },
  ];
  const [tPerView, setTPerView] = useState(3);
  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth;
      if (w >= 1024) setTPerView(3);
      else if (w >= 640) setTPerView(2);
      else setTPerView(1);
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);
  const tPages = useMemo(() => Math.max(1, Math.ceil(testimonials.length / tPerView)), [testimonials.length, tPerView]);
  const [tPage, setTPage] = useState(0);
  useEffect(() => { if (tPage > tPages - 1) setTPage(tPages - 1); }, [tPages, tPage]);
  useEffect(() => {
    const id = setInterval(() => setTPage((p) => (p + 1) % tPages), 4500);
    return () => clearInterval(id);
  }, [tPages]);
  const tPercentPerPage = useMemo(() => 100 / tPages, [tPages]);

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* TOP HEADER with TradeSure brand + fixed heart icon */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="h-14 flex items-center justify-between gap-3">
            {/* Brand: icon + wordmark */}
            <Link href="/" className="flex items-center gap-2 font-extrabold tracking-tight text-[#0b0c4e]" aria-label="TradeSure Home">
              <Image src="/brand/ts-shield.svg" alt="TradeSure" width={28} height={28} priority />
              <span>TradeSure</span>
            </Link>

            {/* Center nav (desktop) */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <Link href="/" className="text-gray-700 hover:text-teal-600">Homeowner</Link>
              <Link href="/trades/login" className="text-gray-700 hover:text-teal-600">Trades</Link>
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              <Link
                href="/trades/signup"
                className="hidden sm:inline-flex rounded-full border border-teal-600 text-teal-700 px-3 py-1.5 text-sm font-semibold hover:bg-teal-50"
              >
                Trade sign up
              </Link>
              <Link
                href="/login"
                className="hidden sm:inline-flex rounded-full bg-teal-600 text-white px-3 py-1.5 text-sm font-semibold hover:bg-teal-700"
              >
                Log in
              </Link>

              {/* Fixed heart icon (stroke uses currentColor for visibility) */}
              <Link
                href="/favourites"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-100 text-gray-700"
                aria-label="Favourites"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M12 20.5s-6.8-3.95-8.7-7.7C2 9.5 4 7.2 6.3 7.2c1.4 0 2.77.85 3.37 2.03.16.31.5.51.86.51s.7-.2.86-.51A3.8 3.8 0 0 1 12 7c2.3 0 4.3 2.5 5.7 5.8-1.9 3.75-8.7 7.7-8.7 7.7Z"
                    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                  />
                </svg>
              </Link>

              {/* Profile icon */}
              <Link href="/profile" className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 text-gray-700 font-bold" aria-label="My profile">
                <span className="text-xs">ME</span>
              </Link>
            </div>
          </div>

          {/* Mobile links row */}
          <div className="md:hidden flex items-center justify-center gap-4 pb-3 text-sm">
            <Link href="/" className="text-gray-700 hover:text-teal-600">Homeowner</Link>
            <span className="text-gray-300">•</span>
            <Link href="/trades/login" className="text-gray-700 hover:text-teal-600">Trades</Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative bg-gray-900 text-white">
        <img
          src="https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=2000&q=80"
          alt="Construction project"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/40" />

        <div className="relative mx-auto max-w-6xl px-6 pt-20 pb-24 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            Build Smarter. Faster. Fairer. <br />
            <span className="text-teal-400">Kent’s #1 AI-Powered Builder</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-200 max-w-3xl mx-auto">
            Instant quotes • Verified builders • Guaranteed work
          </p>

          {/* Search (stacks on mobile) */}
          <form onSubmit={onSearchSubmit} className="mt-8 max-w-2xl mx-auto flex flex-col sm:flex-row gap-3">
            <input
              className="flex-1 rounded-2xl bg-white text-gray-900 placeholder-gray-500 px-5 py-4 border border-white/30 shadow-lg text-base min-h-[48px]"
              placeholder={suggestions[sIndex]}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              type="submit"
              className="rounded-2xl px-7 py-4 bg-teal-500 text-white font-semibold hover:bg-teal-600 shadow-lg w-full sm:w-auto min-h-[48px] text-base"
            >
              Get Estimate
            </button>
          </form>

          <p className="mt-3 text-sm text-gray-200">Try: “{suggestions[(sIndex + 1) % suggestions.length]}”</p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/quote" className="rounded-xl px-6 py-3 font-semibold bg-teal-500 text-white hover:bg-teal-600 w-full sm:w-auto min-h-[48px]">
              Get My Instant Estimate
            </Link>
            <a
              href="https://wa.me/447000000000"
              className="rounded-xl px-6 py-3 font-semibold border border-teal-400 text-teal-400 hover:bg-teal-50 hover:text-teal-600 bg-white/10 w-full sm:w-auto min-h-[48px]"
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
      <section className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900">How it works</h2>
        <div className="mt-8 sm:mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 text-center">
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

      {/* SERVICES — swipe on mobile, paged on desktop */}
      <section className="bg-gray-50 border-y">
        <div className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-[#0b0c4e]">Browse our most popular categories</h2>

          <div className="relative mt-8 sm:mt-10">
            <button
              aria-label="Previous"
              onClick={prevPage}
              className="hidden sm:flex absolute -left-3 top-1/2 -translate-y-1/2 z-10 h-10 w-10 items-center justify-center rounded-xl border bg-white shadow hover:border-teal-500"
            >‹</button>
            <button
              aria-label="Next"
              onClick={nextPage}
              className="hidden sm:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 h-10 w-10 items-center justify-center rounded-xl border bg-white shadow hover:border-teal-500"
            >›</button>

            <div className="overflow-x-auto sm:overflow-hidden [-webkit-overflow-scrolling:touch]">
              <div
                className="flex sm:transition-transform sm:duration-500 sm:ease-out snap-x snap-mandatory sm:snap-none"
                style={{ transform: `translateX(-${page * percentPerPage}%)`, width: `${100 * totalPages}%` }}
              >
                {services.map((s, i) => (
                  <div key={i} className="px-2 snap-center sm:snap-none shrink-0" style={{ width: `${100 / (perView * totalPages)}%` }}>
                    <Link
                      href={`/quote?service=${encodeURIComponent(s.name.toLowerCase())}`}
                      className="block rounded-3xl bg-white border border-gray-200 p-6 text-center hover:shadow-md hover:border-teal-500 transition h-full"
                    >
                      <div className="text-4xl text-indigo-500">{s.icon}</div>
                      <div className="mt-3 font-semibold text-[#0b0c4e]">{s.name}</div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`h-2.5 w-2.5 rounded-full ${i === page ? "bg-gray-600" : "bg-gray-300"}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* WHY TRUST US */}
      <section className="bg-gray-900 text-white py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-6 grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-12 items-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <img
              src="https://images.unsplash.com/photo-1600607687920-4ce9ce9c8d49?auto=format&fit=crop&w=800&q=80"
              alt="Handshake"
              className="w-full h-56 sm:h-80 object-cover rounded-2xl shadow-lg"
              loading="lazy"
            />
            <img
              src="https://images.unsplash.com/photo-1581091014527-3d4a5b4a0f2b?auto=format&fit=crop&w=800&q=80"
              alt="Team on site"
              className="w-full h-56 sm:h-80 object-cover rounded-2xl shadow-lg"
              loading="lazy"
            />
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-bold">Why homeowners trust us</h2>
            <ul className="mt-6 space-y-3 text-lg">
              <li>🤖 Instant, fair AI-powered pricing</li>
              <li>👷 Verified, experienced local builders</li>
              <li>🛡️ Fully insured & guaranteed work</li>
              <li>🚀 Fast response + free survey</li>
            </ul>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { k: "2,300+", v: "Projects completed" },
                { k: "4.9/5", v: "Average rating" },
                { k: "10+ yrs", v: "Experience" },
              ].map((s, i) => (
                <div key={i} className="rounded-xl bg-white/10 p-4 text-center">
                  <div className="text-2xl font-extrabold text-teal-300">{s.k}</div>
                  <div className="text-sm text-gray-300">{s.v}</div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              {[
                "DBS-checked teams",
                "£5m Public Liability",
                "NICEIC / Gas Safe where required",
                "CSCS qualified",
                "12-month workmanship guarantee",
              ].map((b, i) => (
                <span key={i} className="rounded-full bg-white/10 px-3 py-2 text-sm">{b}</span>
              ))}
            </div>

            <Link
              href="/quote"
              className="mt-8 inline-flex items-center justify-center rounded-xl bg-teal-500 px-5 py-3 font-semibold text-white hover:bg-teal-600"
            >
              Get your instant estimate →
            </Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-teal-600">What our customers say</h2>
        <div className="relative mt-8 sm:mt-10">
          <div className="overflow-x-auto sm:overflow-hidden [-webkit-overflow-scrolling:touch]">
            <div
              className="flex sm:transition-transform sm:duration-600 sm:ease-out snap-x snap-mandatory sm:snap-none"
              style={{ transform: `translateX(-${tPage * tPercentPerPage}%)`, width: `${100 * tPages}%` }}
            >
              {testimonials.map((t, i) => (
                <div key={i} className="px-2 snap-center sm:snap-none shrink-0" style={{ width: `${100 / (tPerView * tPages)}%` }}>
                  <div className="h-full rounded-2xl border p-6 bg-gray-50 hover:border-teal-500">
                    <div className="text-yellow-500">★★★★★</div>
                    <p className="mt-4 text-gray-700">{t.text}</p>
                    <p className="mt-2 text-sm text-gray-500">{t.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2">
            {Array.from({ length: tPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setTPage(i)}
                aria-label={`Go to review ${i + 1}`}
                className={`h-2.5 w-2.5 rounded-full ${i === tPage ? "bg-gray-600" : "bg-gray-300"}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* GUIDES */}
      <section className="bg-gray-50 border-y">
        <div className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-teal-600">Cost guides & advice</h2>
          <div className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[
              { title: "How much does repointing cost in Kent?", img: "https://images.unsplash.com/photo-1493244040629-496f6d136cc3?auto=format&fit=crop&w=600&q=80" },
              { title: "Roof repair costs explained", img: "https://images.unsplash.com/photo-1581093458791-9d1f0b1dfd4a?auto=format&fit=crop&w=600&q=80" },
              { title: "Do you need planning permission for an extension?", img: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=600&q=80" },
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

      {/* ACTION CARDS */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="rounded-3xl bg-white shadow border overflow-hidden">
              <img src="https://images.unsplash.com/photo-1581093588401-16ec097d4b86?auto=format&fit=crop&w=1200&q=80" alt="Leave a review" className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-2xl font-bold text-[#0b0c4e]">Leave a review</h3>
                <p className="mt-3 text-gray-600">Have you completed a project recently? Let your tradesperson know how they did.</p>
                <a href="#" className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-teal-500 text-white font-semibold py-3 hover:bg-teal-600">
                  Leave a review
                </a>
              </div>
            </div>

            <div className="rounded-3xl bg-white shadow border overflow-hidden">
              <img src="https://images.unsplash.com/photo-1604145559206-e3bce0040e8d?auto=format&fit=crop&w=1200&q=80" alt="Tradesperson sign up" className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-2xl font-bold text-[#0b0c4e]">Tradesperson sign up</h3>
                <p className="mt-3 text-gray-600">Over 1 million homeowners visit our site looking for approved and quality tradespeople like you.</p>
                <a href="#" className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-teal-500 text-white font-semibold py-3 hover:bg-teal-600">
                  Join today
                </a>
              </div>
            </div>

            <div className="rounded-3xl bg-white shadow border overflow-hidden">
              <img src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80" alt="Request a quote" className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-2xl font-bold text-[#0b0c4e]">Request a quote</h3>
                <p className="mt-3 text-gray-600">Tell us what you’re looking for and we’ll pass your request on to approved tradespeople.</p>
                <Link href="/quote" className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-teal-500 text-white font-semibold py-3 hover:bg-teal-600">
                  Request a quote
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-teal-600 text-white text-center py-12 sm:py-16">
        <h2 className="text-2xl sm:text-3xl font-bold">Ready to build smarter?</h2>
        <p className="mt-4 text-lg">Kent’s only AI-powered builder. Get your instant estimate today.</p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/quote" className="rounded-xl px-6 py-3 font-semibold bg-white text-teal-700 hover:bg-gray-100 w-full sm:w-auto min-h-[48px]">
            Get My Instant Estimate
          </Link>
          <a href="https://wa.me/447000000000" className="rounded-xl px-6 py-3 font-semibold border border-white text-white hover:bg-teal-700 w-full sm:w-auto min-h-[48px]">
            Talk on WhatsApp
          </a>
        </div>
      </section>

      {/* Sticky mobile CTA */}
      <div className="fixed inset-x-0 bottom-0 z-30 bg-white/90 backdrop-blur border-t px-4 py-3 sm:hidden">
        <div className="flex gap-3">
          <Link href="/quote" className="flex-1 rounded-lg bg-teal-600 text-white font-semibold py-3 text-center">
            Get My Instant Estimate
          </Link>
          <a href="https://wa.me/447000000000" className="rounded-lg border border-teal-600 text-teal-700 font-semibold px-4 py-3">
            WhatsApp
          </a>
        </div>
        <div className="pt-[env(safe-area-inset-bottom)]" />
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-200">
        <div className="mx-auto max-w-6xl px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
          <div>
            <h3 className="font-semibold text-white">Contact</h3>
            <p>📞 07000 000000</p>
            <p>✉️ info@tradesure.uk</p>
          </div>
          <div>
            <h3 className="font-semibold text-white">Service Areas</h3>
            <p>Kent • Maidstone • Canterbury • Ashford • Medway</p>
          </div>
          <div>
            <h3 className="font-semibold text-white">Trust</h3>
            <p>🛡️ Fully insured & guaranteed</p>
            <p>© TradeSure 2025</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
