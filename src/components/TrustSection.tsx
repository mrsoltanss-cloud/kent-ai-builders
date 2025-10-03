export default function TrustSection() {
  // Text-only trust points; no emoji, no large tiles/cards.
  // Lightweight markup so it fits your current styling.
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 my-16">
      <div className="mx-auto max-w-3xl">
        <ul className="space-y-3 text-sm leading-6 text-gray-300">
          <li>
            <strong className="text-white">Instant AI-powered quotes</strong> — no waiting around, no pushy sales visits.
          </li>
          <li>
            <strong className="text-white">Local builders you can trust</strong> — vetted, reviewed, and verified.
          </li>
          <li>
            <strong className="text-white">Guaranteed peace of mind</strong> — insurance, warranties, and DBS-checked teams.
          </li>
          <li>
            <strong className="text-white">Fast response, no hassle</strong> — we’ll call back within 1 hour; free survey included.
          </li>
        </ul>
      </div>
    </section>
  );
}
