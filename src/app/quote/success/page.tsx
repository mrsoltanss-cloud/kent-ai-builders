"use client";
export const dynamic = "force-dynamic";
import { useEffect } from "react";
import confetti from "canvas-confetti";
import Link from "next/link";

export default function QuoteSuccessPage() {
  useEffect(() => {
    const end = Date.now() + 800;
    (function frame() {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  }, []);
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">You’re all set 🎉</h1>
        <p className="mt-3 text-gray-600">Thanks! Your request has been received. A verified local pro will be in touch shortly.</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link href="https://wa.me/447000000000?text=Hi%20Brixel%2C%20I%20just%20submitted%20a%20quote%20request!" className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-white hover:bg-emerald-600 transition text-center">Chat on WhatsApp</Link>
          <Link href="/" className="inline-flex items-center justify-center rounded-xl border border-gray-300 px-5 py-3 font-semibold text-gray-800 hover:bg-gray-50 transition text-center">Back to home</Link>
        </div>
        <p className="mt-4 text-xs text-gray-400">We aim to call back within 1 hour.</p>
      </div>
    </main>
  );
}
