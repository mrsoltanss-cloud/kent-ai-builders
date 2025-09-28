"use client";
import Link from "next/link";

export default function Step6Complete({ data }) {
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

      <div className="mt-8 text-sm text-gray-500">
        Confirmation sent to: <br />
        {data.phone && <div>📱 {data.phone}</div>}
        {data.email && <div>📧 {data.email}</div>}
      </div>
    </div>
  );
}
