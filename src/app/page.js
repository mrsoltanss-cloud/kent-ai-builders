export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto max-w-5xl px-6 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight">
          Kent’s First <span className="text-gray-900">AI-Powered Builder</span>
        </h1>
        <p className="mt-5 text-lg md:text-xl text-gray-600">
          Get an instant price range for repointing, roof repairs and more.
          Upload photos or plans. Final quote confirmed after a free site survey.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/quote"
            className="rounded-xl px-6 py-3 font-semibold bg-black text-white"
          >
            Get My Instant Estimate
          </a>
          <a
            href="https://wa.me/447000000000"
            className="rounded-xl px-6 py-3 font-semibold border border-gray-300"
          >
            Call / WhatsApp
          </a>
        </div>

        <p className="mt-4 text-sm text-gray-500">
          Serving all of Kent • Transparent, fast, and accurate • Subject to survey
        </p>
      </section>
    </main>
  );
}
