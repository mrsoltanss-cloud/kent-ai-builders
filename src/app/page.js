"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    // Example: simulate fetching suggestions
    setSuggestions(["Plumber", "Roofer", "Electrician"]);
  }, [suggestions.length]); // ✅ added dependency

  return (
    <main className="p-8 text-center">
      <h1 className="text-4xl font-bold mb-6">
        Welcome to Kent AI Builders
      </h1>

      <div className="space-x-4">
        <Link
          href="/quote"
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Get an Instant Quote
        </Link>
        <Link
          href="/"
          className="px-4 py-2 bg-gray-200 rounded"
        >
          Home
        </Link>
      </div>
    </main>
  );
}
