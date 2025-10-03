import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import LiveCounter from "@/components/LiveCounter";
import TrustSidebar from "@/components/TrustSidebar";
import QuoteWizard from "./wizard";

export const dynamic = "force-dynamic";

export default async function QuotePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect(`/auth/signin?callbackUrl=/quote`);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            Your instant, AI-powered quote — <span className="text-emerald-600">fair, fast, and guaranteed.</span>
          </h1>
          <p className="mt-1 text-gray-600">
            No pushy sales calls. No guesswork. Just trusted local builders with 10+ years experience.
          </p>
        </div>
        <LiveCounter />
      </header>

      <section className="mt-6 grid gap-6 md:grid-cols-[1fr_320px]">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-sm">
          <QuoteWizard />
        </div>
        <div className="md:sticky md:top-6 h-fit">
          <TrustSidebar />
        </div>
      </section>
    </main>
  );
}
