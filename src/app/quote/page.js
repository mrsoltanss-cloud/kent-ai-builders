import QuoteForm from "./QuoteForm";
import Link from "next/link";

export const metadata = {
  title: "Get an Instant Quote | Brixel",
  description:
    "Answer a few quick questions and get a smart, AI-powered estimate for your building project in Kent.",
};

export default function QuotePage() {
  return (
    <main className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-2">Get Your Instant Estimate</h1>
        <p className="text-center text-slate-600 mb-6">
          This takes about 2 minutes. We’ll call you within 15 minutes after you submit.
        </p>

        <QuoteForm />

        <div className="text-center mt-6 text-sm text-slate-600">
          Prefer the quick calculator?{" "}
          <Link className="text-teal-700 underline hover:text-teal-800" href="/quote/instant">
            Try the Instant Estimate
          </Link>
        </div>
      </div>
    </main>
  );
}
