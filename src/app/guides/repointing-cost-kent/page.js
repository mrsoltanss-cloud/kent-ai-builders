export const metadata = {
  title: "Repointing Cost in Kent (2025 Guide) | TradeSure",
  description: "Full breakdown of brick repointing costs in Kent. Prices per m², factors affecting cost, and how AI estimates give you a fair price instantly.",
};

export default function RepointingCostKent() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-teal-600">Repointing Cost in Kent – 2025 Guide</h1>
      <p className="mt-4 text-gray-700">Repointing brickwork is one of the most common jobs we’re asked to estimate in Kent. Here’s what you can expect to pay in 2025:</p>
      <ul className="mt-6 space-y-2 list-disc list-inside">
        <li>Average repointing cost: <strong>£40 – £60 per m²</strong></li>
        <li>Terraced house full repoint: <strong>£2,000 – £4,000</strong></li>
        <li>Semi-detached: <strong>£3,500 – £6,500</strong></li>
        <li>Detached: <strong>£6,000 – £12,000+</strong></li>
      </ul>
      <h2 className="mt-10 text-2xl font-semibold">What affects the cost?</h2>
      <p className="mt-2 text-gray-700">Height of walls, access (scaffolding), mortar type, and condition of existing brickwork all impact price.</p>
      <h2 className="mt-10 text-2xl font-semibold">FAQ</h2>
      <div className="mt-2 space-y-4">
        <div><p className="font-medium">Do I need scaffolding?</p><p className="text-gray-700">For anything above a single storey, yes — scaffolding is required.</p></div>
        <div><p className="font-medium">How long does it last?</p><p className="text-gray-700">Good repointing should last at least 50 years if maintained.</p></div>
      </div>
      <div className="mt-10 p-6 bg-teal-50 border border-teal-200 rounded-xl text-center">
        <h3 className="text-xl font-bold">Get an Instant Repointing Estimate</h3>
        <p className="mt-2 text-gray-600">Use our AI-powered estimator for a fair, instant price range.</p>
        <a href="/quote?service=repointing" className="inline-block mt-4 bg-teal-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-teal-700">Try Free Quote →</a>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
        "@context":"https://schema.org","@type":"FAQPage",
        mainEntity:[
          {"@type":"Question","name":"Do I need scaffolding?","acceptedAnswer":{"@type":"Answer","text":"Yes, for anything above a single storey, scaffolding is required."}},
          {"@type":"Question","name":"How long does repointing last?","acceptedAnswer":{"@type":"Answer","text":"Good repointing should last at least 50 years if maintained."}}
        ]})}} />
    </main>
  );
}
