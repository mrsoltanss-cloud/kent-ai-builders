import HowItWorksShow from "@/components/home/HowItWorksShow";

export default function Page() {
  return (
    <main className="min-h-[100dvh] bg-[#F7FAFC]">
      <div className="px-6 py-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-zinc-900">
          ✅ Slideshow — /how-it-works-show
        </h1>
        <p className="mt-2 text-zinc-600">
          Arrow keys, click arrows, dots, or swipe on mobile.
        </p>
      </div>
      <HowItWorksShow />
    </main>
  );
}
