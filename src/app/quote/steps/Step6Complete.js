"use client";
import Link from "next/link";
import { useEffect } from "react";

export default function Step6Complete({ data }) {
  // Debug: log submitted data in dev console only
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.log("✅ Submitted form data:", data);
    }
  }, [data]);

  return (
    <div className="text-center py-10">
      <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
        <span className="text-3xl">✅</span>
      </div>
      <h2 className="text-2xl font-bold mb-4">Quote Request Sent!</h2>
      <p className="text-gray-600 mb-6">
        Thanks {data.name || "there"} — we’ve received your details.  
        A Brixel team member will call you within <strong>15 minutes</strong> to confirm your project.
      </p>

      <div className="flex gap-4 justify-center">
        <Link
          href="/"
          className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
        >
          ← Back to Home
        </Link>
        <Link
          href="/quote"
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Start New Quote
        </Link>
      </div>

      {/* Debug view (only in dev, never in production) */}
      {process.env.NODE_ENV !== "production" && (
        <div className="mt-10 text-left max-w-lg mx-auto bg-gray-50 p-4 rounded border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            Debug: Submitted Data
          </h3>
          <pre className="text-xs text-gray-600 whitespace-pre-wrap">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
