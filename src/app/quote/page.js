export const dynamic = "force-dynamic";
import QuoteForm from "./QuoteForm";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/authOptions";
import { redirect } from "next/navigation";


export const metadata = {
  title: "Get Your Quote | Brixel",
  description:
    "Answer a few simple questions to receive a personalised estimate for your building project in Kent.",
};

export default function QuotePage() {
  return (
    <main className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-2">Get Your Quote</h1>
        <p className="text-center text-slate-600 mb-6">
          This takes about 2 minutes. Once you submit, we’ll call you within 15 minutes to confirm your project.
        </p>
        <QuoteForm />
      </div>
    </main>
  );
}
