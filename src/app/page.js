"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  // Rotating search suggestions
  const suggestions = [
    "Leaky roof",
    "Wall needs repointing",
    "Kitchen renovation",
    "Emergency plumber",
  ];
  const [sIndex, setSIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setSIndex((i) => (i + 1) % suggestions.length);
    }, 2400);
    return () => clearInterval(id);
  }, [suggestions.length]);

  // Simple testimonials slider
  const reviews = [
    {
      quote: "They handled the extension from start to finish. Stress-free.",
      name: "Mark, Medway",
    },
    {
      quote: "Fair price, tidy team, and kept us informed daily.",
      name: "Amelia, Tonbridge",
    },
    {
      quote: "Emergency leak sorted within hours. Brilliant.",
      name: "Tom, Sevenoaks",
    },
  ];
  const [rIndex, setRIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setRIndex((i) => (i + 1) % reviews.length);
    }, 3800);
    return () => clearInterval(id);
  }, [reviews.length]);

  // Categories (horizontal scroll row)
  const cats = [
    { key: "plumbing", label: "Plumber", emoji: "🚰" },
    { key: "electrical", label: "Electrician", emoji: "⚡" },
    { key: "roofing", label: "Roofer", emoji: "🏠" },
    { key: "builder", label: "Builder", emoji: "👷" },
    { key: "gardener", label: "Gardener", emoji: "🪴" },
    { key: "decorator", label: "Painter / Decorator", emoji: "🖌️" },
    { key: "driveways", label: "Driveways", emoji: "🧱" },
    { key: "kitchens", label: "Kitchens", emoji: "🍳" },
    { key: "bathrooms", label: "Bathrooms", emoji: "🛁" },
  ];
  const scroller = useRef(null);
  const scrollBy = (px) => scroller.current?.scrollBy({ left: px, behavior: "smooth" });

  return (
    <main className="min-h-screen bg-white text-gray-900">

      {/* HEADER BAR (kept simple to match your design shell) */}
      <header className="w-full border-b bg-white/90 backdrop-blur sticky top-0 z-40">
        <div className="mx-auto max-w-6xl px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-teal-600 text-white text-xs font-bold">✓</span>
            <span className="font-bold">TradeSure</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/" className="hover:text-teal-700">Homeowner</Link>
            <Link href="/trades/join" className="hover:text-teal-700">Trades</Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/trades/join" className="hidden sm:inline-flex rounded-full border px-3 py-1.5 text-sm hover:bg-gray-50">Trade sign up</Link>
            <Link href="/login" className="rounded-full bg-teal-600 text-white px-3 py-1.5 text-sm hover:bg-teal-700">Log in</Link>
          </div>
        </div>
      </header>

      {/* ============== HERO ============== */}
      <section className="relative overflow-hidden">
        {/* Hero background */}
        <Image
          src="/images/hero-kitchen.jpg"
          alt="Modern kitchen"
          fill
          priority
          className="object-cover brightness-[.45]"
        />
        <div className="relative mx-auto max-w-6xl px-6 pt-16 pb-14 md:pt-20 md:pb-24">
          <h1 className="text-white font-extrabold leading-tight text-4xl md:text-6xl">
            Build Smarter. Faster. Fairer.
            <br />
            <span className="text-teal-400">Kent’s #1 AI-Powered Builder</span>
          </h1>
          <p className="mt-4 text-gray-100 text-lg">
            Instant quotes • Verified builders • Guaranteed work
          </p>

          {/* Search + button (fixed to JS, no TS cast) */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const input = e.currentTarget.elements.namedItem("q");
              const q =
                input && typeof input.value === "string" && input.value.trim()
                  ? input.value.trim()
                  : suggestions[sIndex];
              window.location.href = `/quote?query=${encodeURIComponent(q)}`;
            }}
            className="mt-6 max-w-3xl"
          >
            <div className="flex gap-3">
              <input
                name="q"
                className="flex-1 rounded-2xl bg-white/90 backdrop-blur border border-black/10 px-5 py-4 outline-none shadow-[inset_0_0_0_1px_rgba(0,0,0,.1)]"
                placeholder={suggestions[sIndex]}
              />
              <button
                type="submit"
                className="rounded-2xl px-6 py-4 bg-teal-600 text-white font-semibold hover:bg-teal-700 shadow-md"
              >
                Get Estimate
              </button>
            </div>
            <p className="mt-3 text-sm text-gray-100">
              Try: “{suggestions[(sIndex + 1) % suggestions.length]}”
            </p>
          </form>

          {/* CTAs under search */}
          <div className="mt-6 flex flex-wrap gap-4">
            <Link
              href="/quote"
              className="rounded-xl bg-teal-600 text-white px-5 py-3 font-semibold hover:bg-teal-700"
            >
              Get My Instant Estimate
            </Link>
            <a
              href="https://wa.me/447000000000"
              className="rounded-xl border border-white/70 text-white px-5 py-3 font-semibold hover:bg-white hover:text-teal-700"
            >
              Talk on WhatsApp
            </a>
          </div>

          <p className="mt-4 text-gray-100">
            ★★★★★ Trusted by 2,000+ Kent homeowners • Fully Insured • Free Site Survey
          </p>
        </div>
      </section>

      {/* ============== HOW IT WORKS ============== */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-center">How it works</h2>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { emoji: "📝", title: "Tell us about your job", text: "Describe your project. Add photos or plans for accuracy." },
            { emoji: "🤖", title: "AI estimates instantly", text: "You get a fair price range based on real job data." },
            { emoji: "👷", title: "Matched with the right builder", text: "Free survey and a fixed confirmed quote." },
          ].map((it, i) => (
            <div key={i} className="rounded-2xl border p-6 text-center hover:shadow-sm">
              <div className="text-3xl">{it.emoji}</div>
              <h3 className="mt-3 font-semibold">{it.title}</h3>
              <p className="mt-2 text-gray-600">{it.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============== POPULAR CATEGORIES (slider-style row) ============== */}
      <section className="bg-white border-y">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <h2 className="text-2xl md:text-3xl font-bold text-center">
            Browse our most popular categories
          </h2>

          <div className="relative mt-8">
            <button
              aria-label="scroll left"
              onClick={() => scrollBy(-320)}
              className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 bg-white border rounded-full w-10 h-10 grid place-content-center shadow"
            >
              ‹
            </button>

            <div
              ref={scroller}
              className="flex gap-5 overflow-x-auto px-2 snap-x snap-mandatory"
            >
              {cats.map((c) => (
                <Link
                  key={c.key}
                  href={`/services/${c.key}`}
                  className="min-w-[230px] snap-start rounded-3xl border px-6 py-6 hover:shadow-md hover:border-teal-500 transition bg-white"
                >
                  <div className="text-4xl">{c.emoji}</div>
                  <div className="mt-4 font-semibold">{c.label}</div>
                </Link>
              ))}
            </div>

            <button
              aria-label="scroll right"
              onClick={() => scrollBy(320)}
              className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 bg-white border rounded-full w-10 h-10 grid place-content-center shadow"
            >
              ›
            </button>
          </div>
        </div>
      </section>

      {/* ============== TRUST (dark section with photos + stats) ============== */}
      <section className="bg-[#0f1b24] text-white">
        <div className="mx-auto max-w-6xl px-6 py-14 grid md:grid-cols-2 gap-10 items-center">
          {/* Photo collage */}
          <div className="grid grid-cols-2 gap-4">
            <div className="relative h-48 md:h-64 rounded-2xl overflow-hidden bg-white/5">
              <Image src="/images/trust-handshake.jpg" alt="Handshake" fill className="object-cover" />
            </div>
            <div className="relative h-48 md:h-64 rounded-2xl overflow-hidden bg-white/5">
              <Image src="/images/trust-team.jpg" alt="Team on site" fill className="object-cover" />
            </div>
          </div>

          {/* Copy + stats */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">Why homeowners trust us</h2>
            <ul className="mt-4 space-y-2 text-gray-200">
              <li>🤖 Instant, fair AI-powered pricing</li>
              <li>🧑‍🔧 Verified, experienced local builders</li>
              <li>🛡 Fully insured & guaranteed work</li>
              <li>🚀 Fast response + free survey</li>
            </ul>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-3 gap-4">
              {[
                { big: "2,300+", small: "Projects completed" },
                { big: "4.9/5", small: "Average rating" },
                { big: "10+ yrs", small: "Experience" },
              ].map((s, i) => (
                <div key={i} className="rounded-xl bg-white/5 px-4 py-4">
                  <div className="text-2xl font-bold">{s.big}</div>
                  <div className="text-sm text-gray-300">{s.small}</div>
                </div>
              ))}
            </div>

            {/* Safety markers */}
            <div className="mt-4 flex flex-wrap gap-2">
              {[
                "DBS-checked teams",
                "£5m Public Liability",
                "NICEIC / Gas Safe where required",
                "CSCS qualified",
                "12-month workmanship guarantee",
              ].map((b, i) => (
                <span key={i} className="rounded-full bg-white/10 px-3 py-1 text-sm">
                  {b}
                </span>
              ))}
            </div>

            <Link href="/quote" className="inline-block mt-6 rounded-xl bg-teal-500 text-white px-5 py-3 font-semibold hover:bg-teal-600">
              Get your instant estimate →
            </Link>
          </div>
        </div>
      </section>

      {/* ============== TESTIMONIALS (auto-rotating) ============== */}
      <section className="mx-auto max-w-6xl px-6 py-14">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-teal-600">
          What our customers say
        </h2>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[0, 1, 2].map((offset) => {
            const i = (rIndex + offset) % reviews.length;
            const r = reviews[i];
            return (
              <div key={i} className="rounded-3xl border p-6 hover:border-teal-500">
                <div className="text-yellow-500">★★★★★</div>
                <p className="mt-3 text-gray-800">“{r.quote}”</p>
                <p className="mt-3 text-sm text-gray-500">{r.name}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ============== COST GUIDES PREVIEW ============== */}
      <section className="mx-auto max-w-6xl px-6 pb-14">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-teal-600">
          Cost guides & advice
        </h2>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { href: "/guides/repointing-cost-kent", title: "How much does repointing cost in Kent?", img: "/images/guide-repointing.jpg" },
            { href: "/guides/roof-repair-cost-kent", title: "Roof repair costs explained", img: "/images/guide-roof.jpg" },
            { href: "/guides/loft-conversion-cost-kent", title: "Loft conversion costs (2025)", img: "/images/guide-loft.jpg" },
          ].map((g, i) => (
            <Link key={i} href={g.href} className="rounded-3xl border hover:shadow-md hover:border-teal-500 transition overflow-hidden">
              <div className="relative h-40">
                <Image src={g.img} alt={g.title} fill className="object-cover" />
              </div>
              <div className="p-5">
                <h3 className="font-semibold">{g.title}</h3>
                <p className="text-sm text-teal-600 mt-2">Read more →</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ============== ACTION CARDS ============== */}
      <section className="mx-auto max-w-6xl px-6 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Leave a review */}
          <div className="rounded-3xl border overflow-hidden">
            <div className="relative h-44 bg-gray-100">
              <Image src="/images/action-review.jpg" alt="Leave a review" fill className="object-cover" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-[#0d1a4a]">Leave a review</h3>
              <p className="mt-2 text-gray-600">Have you completed a project recently? Let your tradesperson know how they did.</p>
              <Link href="/review" className="mt-5 inline-flex rounded-full bg-teal-600 text-white px-5 py-3 font-semibold hover:bg-teal-700">
                Leave a review
              </Link>
            </div>
          </div>

          {/* Tradesperson sign up */}
          <div className="rounded-3xl border overflow-hidden">
            <div className="relative h-44 bg-gray-100">
              <Image src="/images/action-trades.jpg" alt="Tradesperson sign up" fill className="object-cover" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-[#0d1a4a]">Tradesperson sign up</h3>
              <p className="mt-2 text-gray-600">Join a platform built for quality trades — AI-ready leads, fair pricing, real jobs.</p>
              <Link href="/trades/join" className="mt-5 inline-flex rounded-full bg-teal-600 text-white px-5 py-3 font-semibold hover:bg-teal-700">
                Join today
              </Link>
            </div>
          </div>

          {/* Request a quote */}
          <div className="rounded-3xl border overflow-hidden">
            <div className="relative h-44 bg-gray-100">
              <Image src="/images/action-quote.jpg" alt="Request a quote" fill className="object-cover" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-[#0d1a4a]">Request a quote</h3>
              <p className="mt-2 text-gray-600">Tell us what you’re looking for and we’ll pass your request to approved tradespeople.</p>
              <Link href="/quote" className="mt-5 inline-flex rounded-full bg-teal-600 text-white px-5 py-3 font-semibold hover:bg-teal-700">
                Request a quote
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============== FINAL TEAL CTA ============== */}
      <section className="bg-teal-700 text-white">
        <div className="mx-auto max-w-6xl px-6 py-14 text-center">
          <h2 className="text-3xl font-bold">Ready to build smarter?</h2>
          <p className="mt-2 text-white/90">Kent’s only AI-powered builder. Get your instant estimate today.</p>
          <div className="mt-6 flex flex-wrap gap-4 justify-center">
            <Link href="/quote" className="rounded-xl bg-white text-teal-700 px-6 py-3 font-semibold hover:bg-gray-100">
              Get My Instant Estimate
            </Link>
            <a href="https://wa.me/447000000000" className="rounded-xl border border-white text-white px-6 py-3 font-semibold hover:bg-white hover:text-teal-700">
              Talk on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ============== FOOTER ============== */}
      <footer className="bg-[#0f1b24] text-white">
        <div className="mx-auto max-w-6xl px-6 py-10 grid md:grid-cols-3 gap-8">
          <div>
            <h4 className="font-semibold">Contact</h4>
            <p className="mt-2 text-white/80">📞 07000 000000</p>
            <p className="text-white/80">✉️ info@tradesure.uk</p>
          </div>
          <div>
            <h4 className="font-semibold">Service Areas</h4>
            <p className="mt-2 text-white/80">Kent • Maidstone • Canterbury • Ashford • Medway</p>
          </div>
          <div>
            <h4 className="font-semibold">Trust</h4>
            <p className="mt-2 text-white/80">🛡 Fully insured & guaranteed</p>
            <p className="text-white/60 mt-2">© TradeSure 2025</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
