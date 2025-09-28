import QuoteForm from "./QuoteForm";

export const metadata = {
  title: "Get an Instant Quote | Brixel",
  description: "Answer a few quick questions and get a smart, AI-powered estimate for your building project in Kent.",
};

export default function QuotePage() {
  return (
    <main className="min-h-screen bg-slate-50 py-10">
      <h1 className="text-3xl font-bold text-center mb-6">
        Get Your Instant Estimate
      </h1>
      <QuoteForm />
    </main>
  );
}
