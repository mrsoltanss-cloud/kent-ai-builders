export const metadata = { title: "TW Test" };

export default function Page() {
  return (
    <main className="min-h-screen grid place-items-center bg-slate-100">
      <div className="p-8 rounded-2xl shadow-lg bg-white">
        <h1 className="text-3xl font-bold mb-4 text-teal-600">Tailwind OK ✅</h1>
        <p className="text-slate-600">If this is teal and spaced nicely, Tailwind is compiling.</p>
        <button className="mt-6 px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white">
          Primary CTA
        </button>
      </div>
    </main>
  );
}
