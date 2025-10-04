import HowItWorksShow from "@/components/home/HowItWorksShow";

export default function Page() {
  return (
    <main className="min-h-screen bg-[#F7FAFC]">
      <div className="px-6 py-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-zinc-900">✅ New Jarvis Slideshow — /how-it-works-test</h1>
        <p className="mt-2 text-zinc-600">Arrows, dots, keyboard, swipe. All text stays in-frame.</p>
      </div>
      <HowItWorksShow />
    </main>
  );
}
