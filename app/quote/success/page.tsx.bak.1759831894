"use client";

import React, { useEffect, useMemo, useState } from "react";
import confetti from "canvas-confetti";
import LiveNowBadge from "@/components/LiveNowBadge";
import Link from "next/link";
import TrustBoxV2 from "@/components/brixel/TrustBoxV2.client";
import { DateTime } from "luxon";

function useRefCode() {
  return useMemo(() => "BK-" + Math.random().toString(36).slice(2, 10).toUpperCase(), []);
}

/** Start of week = Sunday 00:00 (Europe/London) */
function weekStartLondon(now: DateTime) {
  const n = now.setZone("Europe/London");
  const dow = n.weekday % 7; // Mon=1..Sun=7 → 0..6
  return n.startOf("day").minus({ days: dow });
}

/** Demo weekly counters: monotonic increase, reset weekly */
function useWeeklyCounters() {
  const [similar, setSimilar] = useState(0);
  const [surveys, setSurveys] = useState(0);
  const [rating, setRating] = useState(4.9);

  useEffect(() => {
    const tick = () => {
      const now = DateTime.now().setZone("Europe/London");
      const ws = weekStartLondon(now);
      const secs = Math.max(0, Math.floor(now.diff(ws, "seconds").seconds));
      setSimilar(Math.floor(55 + secs * 0.02));   // ~+1.2/min
      setSurveys(Math.floor(12 + secs * 0.008));  // ~+0.48/min
    };
    tick();
    const iv = setInterval(tick, 5000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    // Tiny, rare jitter ±0.01 around 4.9
    const iv = setInterval(() => {
      const r = 4.9 + (Math.random() < 0.1 ? (Math.random() < 0.5 ? -0.01 : 0.01) : 0);
      setRating(parseFloat(r.toFixed(2)));
    }, 8000);
    return () => clearInterval(iv);
  }, []);

  return { similar, surveys, rating };
}

export default function SuccessPage() {
  const refCode = useRefCode();
  const { similar, surveys, rating } = useWeeklyCounters();

  // Confetti
  useEffect(() => {
    const end = Date.now() + 800;
    const frame = () => {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
    const sprinkle = setInterval(() => {
      confetti({
        particleCount: 20,
        startVelocity: 25,
        spread: 60,
        ticks: 120,
        origin: { x: Math.random() * 0.6 + 0.2, y: 0.1 },
        scalar: 0.8,
      });
    }, 1500);
    return () => clearInterval(sprinkle);
  }, []);

  // WhatsApp: use env NEXT_PUBLIC_WA_NUMBER if set; always prefill with ref
  const waNumber = process.env.NEXT_PUBLIC_WA_NUMBER || "";
  const prefill = `Hi Brixel, my reference is ${refCode}. I'd like to get started and book a site survey.`;
  const waHref = waNumber
    ? `https://wa.me/${waNumber}?text=${encodeURIComponent(prefill)}`
    : `https://wa.me/?text=${encodeURIComponent(prefill)}`;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          🎉 Request received — <span className="text-emerald-600">thank you!</span>
        </h1>
        <div className="hidden md:block">
          <LiveNowBadge />
        </div>
      </div>

      {/* Reference + trust line */}
      <p className="mt-2 text-gray-700">
        Your reference: <span className="font-semibold">{refCode}</span>
      </p>
      <p className="mt-1 text-gray-600">
        You’ve joined <span className="font-semibold">2,300+ homeowners in Kent</span> who trust us.
      </p>

      {/* Main body */}
      <div className="mt-6 rounded-2xl border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* LEFT COLUMN */}
          <div className="md:col-span-2 space-y-5">
            {/* Option A copy */}
            <div className="divide-y divide-gray-100 rounded-xl border border-gray-100">
              <div className="p-4 text-gray-800 flex items-center gap-3">
                <span className="text-lg">💬</span>
                <span>
                  <span className="font-semibold">Chat to us on WhatsApp</span> — get routed to a specialist{" "}
                  <span className="font-semibold">in minutes</span>.
                </span>
              </div>
              <div className="p-4 text-gray-800 flex items-center gap-3">
                <span className="text-lg">📍</span>
                <span>
                  <span className="font-semibold">Already matched</span> with a vetted{" "}
                  <span className="font-semibold">local builder</span>.
                </span>
              </div>
              <div className="p-4 text-gray-800 flex items-center gap-3">
                <span className="text-lg">🗓</span>
                <span>
                  <span className="font-semibold">We’ll book your site survey</span> at a time that suits you.
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md bg-emerald-600 hover:bg-emerald-700 px-5 h-12 text-white text-base font-medium"
                aria-label="Message us on WhatsApp to get started"
              >
                Message us on WhatsApp to get started
              </a>
              <a
                href="mailto:hello@brixel.uk"
                className="inline-flex items-center justify-center rounded-md border border-emerald-600 text-emerald-700 hover:bg-emerald-50 px-5 h-12 text-base font-medium bg-white"
              >
                Email us now
              </a>
              <Link
                href="/my"
                className="inline-flex items-center rounded-xl border border-zinc-300 bg-white px-4 py-2 text-zinc-700 hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-300"
              >
                Back to my area
              </Link>
            </div>

            {/* Helper line */}
            <div className="text-sm text-gray-500">
              Fastest response. Typical reply in minutes during working hours.
            </div>

            {/* ✅ Dynamic weekly stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-xl border border-gray-200 p-4">
                <div className="text-xs text-gray-500">
                  Similar requests · last 7 days
                  <span
                    title="Preview metric while we finish integration. Simulated trend. Resets Sun 12:00am (Europe/London)."
                    className="ml-1 cursor-help"
                  >
                    ⓘ
                  </span>
                </div>
                <div className="mt-2 text-3xl font-bold text-emerald-700">{similar}</div>
              </div>
              <div className="rounded-xl border border-gray-200 p-4">
                <div className="text-xs text-gray-500">
                  Surveys booked · last 7 days
                  <span
                    title="Preview metric while we finish integration. Simulated bookings. Resets Sun 12:00am (Europe/London)."
                    className="ml-1 cursor-help"
                  >
                    ⓘ
                  </span>
                </div>
                <div className="mt-2 text-3xl font-bold text-emerald-700">{surveys}</div>
              </div>
              <div className="rounded-xl border border-gray-200 p-4">
                <div className="text-xs text-gray-500">
                  Homeowner rating (312 reviews)
                  <span
                    title="Placeholder rating during beta. Final value will reflect verified reviews."
                    className="ml-1 cursor-help"
                  >
                    ⓘ
                  </span>
                </div>
                <div className="mt-2 text-3xl font-bold">
                  {rating}
                  <span className="align-top text-sm text-gray-500">/5</span>
                </div>
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 text-xs text-gray-700">
              <span className="rounded-md border border-gray-200 px-2 py-1">£5m Insurance</span>
              <span className="rounded-md border border-gray-200 px-2 py-1">12-month guarantee</span>
              <span className="rounded-md border border-gray-200 px-2 py-1">DBS checked teams</span>
            </div>
          </div>

          {/* RIGHT COLUMN — upgraded trust box */}
          <TrustBoxV2 />
        </div>
      </div>
    </div>
  );
}
