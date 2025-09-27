"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { locationsData } from "@/data/locationsData";

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

      {/* TRUST STRIP */}
      <section className="bg-white border-y py-6">
        <div className="mx-auto max-w-6xl px-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm text-gray-700">
          <div>✔ DBS Checked Teams</div>
          <div>✔ £5m Public Liability Cover</div>
          <div>✔ Gas Safe / NICEIC Certified</div>
          <div>✔ 12-Month Workmanship Guarantee</div>
        </div>
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
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {Object.keys(locationsData).map((townKey) => {
            const town = locationsData[townKey];
            return (
              <Link
                key={townKey}
                href={`/locations/${townKey}`}
                className="rounded-xl border p-5 hover:border-teal-600 hover:shadow-md transition flex flex-col justify-between"
              >
                <h3 className="font-semibold text-lg text-teal-700">
                  {town.name}
                </h3>
                {town.reviews && (
                  <p className="text-sm text-gray-600 mt-2 italic line-clamp-3">
                    {town.reviews[0]}
                  </p>
                )}
              </Link>
            );
          })}
        </div>
      </section>

      {/* COST GUIDES PREVIEW */}
      <section className="mx-auto max-w-6xl px-6 pb-14">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-teal-600">
          Cost Guides & Advice
        </h2>
        <p className="text-center text-gray-600 mt-2">
          Transparent pricing — know what to expect before you commit.
        </p>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/guides/repointing-cost-kent"
            className="rounded-xl border p-6 hover:shadow-md hover:border-teal-600 transition"
          >
            <h3 className="font-semibold">How much does repointing cost?</h3>
            <p className="text-sm text-gray-600 mt-2">
              A breakdown of brickwork repointing costs in Kent.
            </p>
          </Link>
          <Link
            href="/guides/loft-conversion-cost-kent"
            className="rounded-xl border p-6 hover:shadow-md hover:border-teal-600 transition"
          >
            <h3 className="font-semibold">Loft conversion cost explained</h3>
            <p className="text-sm text-gray-600 mt-2">
              Average costs and factors that affect your loft project.
            </p>
          </Link>
          <Link
            href="/guides/roof-repair-cost-kent"
            className="rounded-xl border p-6 hover:shadow-md hover:border-teal-600 transition"
          >
            <h3 className="font-semibold">Roof repair pricing guide</h3>
            <p className="text-sm text-gray-600 mt-2">
              What Kent homeowners typically pay for roof repairs.
            </p>
          </Link>
        </div>
      </section>

      {/* FINAL CTA */}
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
