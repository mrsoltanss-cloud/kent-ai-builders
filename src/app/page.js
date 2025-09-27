"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const suggestions = [
    "Loft conversion",
    "Roof repair",
    "Kitchen renovation",
    "Wall repointing",
  ];
  const [sIndex, setSIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setSIndex((i) => (i + 1) % suggestions.length),
      2000
    );
    return () => clearInterval(id);
  }, []);

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* HERO */}
      <section className="text-center py-16 px-6 bg-gray-50 border-b">
        <h1 className="text-4xl md:text-6xl font-extrabold">
          The UK’s First{" "}
          <span className="text-teal-600">AI-Powered Builder</span>
        </h1>
        <p className="mt-4 text-lg text-gray-700 max-w-3xl mx-auto">
          Get instant estimates, trusted reviews, and verified local builders —
          all in one place.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const q = suggestions[sIndex];
            window.location.href = `/quote?query=${encodeURIComponent(q)}`;
          }}
          className="mt-6 max-w-xl mx-auto"
        >
          <div className="flex items-stretch gap-2">
            <input
              className="flex-1 rounded-xl border px-4 py-3"
              placeholder={suggestions[sIndex]}
            />
            <button
              type="submit"
              className="rounded-xl px-5 py-3 bg-teal-600 text-white font-semibold hover:bg-teal-700"
            >
              Get Estimate
            </button>
          </div>
        </form>
      </section>

      {/* AREAS WE COVER */}
      <section className="mx-auto max-w-6xl px-6 py-14">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-teal-600">
          Areas We Cover
        </h2>
        <p className="text-center text-gray-600 mt-2">
          Serving homeowners across Kent with AI-powered pricing and trusted
          trades.
        </p>
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 text-center">
          <Link
            href="/locations/maidstone"
            className="rounded-xl border p-4 hover:border-teal-600 hover:shadow-md transition"
          >
            Maidstone
          </Link>
          <Link
            href="/locations/canterbury"
            className="rounded-xl border p-4 hover:border-teal-600 hover:shadow-md transition"
          >
            Canterbury
          </Link>
          <Link
            href="/locations/ashford"
            className="rounded-xl border p-4 hover:border-teal-600 hover:shadow-md transition"
          >
            Ashford
          </Link>
          <Link
            href="/locations/dartford"
            className="rounded-xl border p-4 hover:border-teal-600 hover:shadow-md transition"
          >
            Dartford
          </Link>
          <Link
            href="/locations/sevenoaks"
            className="rounded-xl border p-4 hover:border-teal-600 hover:shadow-md transition"
          >
            Sevenoaks
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-100 border-t">
        <div className="mx-auto max-w-4xl px-6 py-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold">
            Ready to start your project?
          </h2>
          <p className="mt-2 text-gray-600">
            Get your free instant estimate today, backed by AI-powered pricing.
          </p>
          <div className="mt-6 flex gap-4 justify-center">
            <Link
              href="/quote"
              className="rounded-xl px-6 py-3 font-semibold bg-teal-600 text-white hover:bg-teal-700"
            >
              Get My Instant Estimate
            </Link>
            <a
              href="https://wa.me/447000000000"
              className="rounded-xl px-6 py-3 font-semibold border border-teal-600 text-teal-600 hover:bg-teal-50"
            >
              Talk on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
