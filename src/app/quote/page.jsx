import { Suspense } from "react";
import QuoteClient from "./QuoteClient";

export const dynamic = "force-dynamic"; // avoid prerender errors for searchParams
export const revalidate = 0;

export const metadata = {
  title: "Instant Estimate | Brixel",
  description: "Get an instant, AI-powered estimate and book a free survey.",
};

export default function QuotePage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen grid place-items-center p-10">
          <div className="text-gray-600">Loading estimate…</div>
        </main>
      }
    >
      <QuoteClient />
    </Suspense>
  );
}
