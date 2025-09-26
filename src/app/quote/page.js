"use client";
import Link from "next/link";

export default function QuotePage() {
  return (
    <main className="p-8 text-center">
      <h1 className="text-3xl font-bold mb-6">Instant Quote</h1>
      <p className="mb-4">
        Answer a few questions and get an AI-powered estimate.
      </p>

      <Link
        href="/"
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Back to Home
      </Link>
    </main>
  );
}
