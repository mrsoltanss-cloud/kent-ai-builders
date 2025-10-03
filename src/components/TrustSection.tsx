export default function TrustSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 my-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left column: trust copy (no emoji) */}
        <div className="mx-auto lg:mx-0 max-w-3xl">
          <ul className="list-none pl-0 space-y-3 text-sm leading-6 text-gray-300">
            <li>
              <strong className="text-white">Local builders you can actually trust</strong> — vetted, reviewed, and verified.
            </li>
            <li>
              <strong className="text-white">Guaranteed peace of mind</strong> — insurance, warranties, and DBS-checked teams.
            </li>
            <li>
              <strong className="text-white">Fast response, no hassle</strong> — we call back within 1 hour; free survey included.
            </li>
          </ul>
        </div>

        {/* Right column: keep spacing, remove the old big tiles */}
        <div className="hidden lg:block" aria-hidden="true" />
      </div>
    </section>
  );
}
