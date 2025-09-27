"use client";

import Head from "next/head";

export default function RoofRepairCostKent() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <Head>
        <title>Roof Repair Cost in Kent (2025 Guide) | TradeSure</title>
        <meta
          name="description"
          content="Full breakdown of roof repair costs in Kent. Leak fixes, valley lead replacement, and new tiles explained with average pricing."
        />
      </Head>

      <h1 className="text-3xl font-bold text-teal-600">
        Roof Repair Cost in Kent – 2025 Guide
      </h1>
      <p className="mt-4 text-gray-700">
        Roof issues are urgent — from slipped tiles to leaking valleys. Here’s
        what Kent homeowners should budget in 2025:
      </p>

      <ul className="mt-6 space-y-2 list-disc list-inside">
        <li>Small roof repair / tile replacement: <strong>£150 – £400</strong></li>
        <li>Chimney repointing / lead flashing: <strong>£400 – £900</strong></li>
        <li>Valley lead replacement: <strong>£800 – £1,800</strong></li>
        <li>Full re-roof (terraced): <strong>£4,000 – £7,000</strong></li>
      </ul>

      <h2 className="mt-10 text-2xl font-semibold">Factors affecting price</h2>
      <p className="mt-2 text-gray-700">
        Roof pitch, access (scaffolding), material type, and urgency (emergency
        callout vs scheduled) all impact cost.
      </p>

      <h2 className="mt-10 text-2xl font-semibold">FAQ</h2>
      <div className="mt-2 space-y-4">
        <div>
          <p className="font-medium">Do you handle emergencies?</p>
          <p className="text-gray-700">
            Yes — 24/7 emergency roof repair is available across Kent.
          </p>
        </div>
        <div>
          <p className="font-medium">How long do roof repairs last?</p>
          <p className="text-gray-700">
            A properly carried-out repair should last decades, provided the rest
            of the roof is in good condition.
          </p>
        </div>
      </div>

      <div className="mt-10 p-6 bg-teal-50 border border-teal-200 rounded-xl text-center">
        <h3 className="text-xl font-bold">Get an Instant Roof Repair Estimate</h3>
        <p className="mt-2 text-gray-600">
          Our AI-powered tool gives you a fair ballpark instantly.
        </p>
        <a
          href="/quote?service=roofing"
          className="inline-block mt-4 bg-teal-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-teal-700"
        >
          Try Free Quote →
        </a>
      </div>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "Do you handle emergencies?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes — 24/7 emergency roof repair is available across Kent."
                }
              },
              {
                "@type": "Question",
                name: "How long do roof repairs last?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "A properly carried-out repair should last decades."
                }
              }
            ]
          }),
        }}
      />
    </main>
  );
}
