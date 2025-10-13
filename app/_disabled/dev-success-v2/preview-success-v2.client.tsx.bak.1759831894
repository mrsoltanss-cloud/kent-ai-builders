"use client";

import React, { useEffect, useMemo, useState } from "react";
import confetti from "canvas-confetti";
import LiveNowBadge from "@/components/LiveNowBadge";
import Link from "next/link";
import { DateTime } from "luxon";
import TrustBoxV2 from "../dev-trust-v2/TrustBoxV2.client"; // NEW: upgraded trust box

type Props = {
  reference?: string;
  service?: string;
  town?: string;
  summary?: string;
};

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(!!mq.matches);
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, []);
  return reduced;
}

function CopyRefChip({ refCode }: { refCode: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(refCode);
          setCopied(true);
          setTimeout(() => setCopied(false), 1200);
        } catch {}
      }}
      className="ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-2 py-1 text-xs text-gray-700 hover:bg-gray-50"
      aria-label="Copy reference"
    >
      {copied ? "✓ Copied" : "Copy ref"}
    </button>
  );
}

function useOpenHoursMessage() {
  const [msg, setMsg] = useState("Fastest response. Typical reply in minutes during working hours.");
  useEffect(() => {
    const update = () => {
      const now = DateTime.now().setZone("Europe/London");
      const open = now.hour >= 8 && now.hour < 20;
      setMsg(
        open
          ? "Fastest response. Typical reply in minutes during working hours."
          : "We’re offline now — message us and we’ll reply from 8:00."
      );
    };
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, []);
  return msg;
}

/** Sunday 00:00 (Europe/London) start-of-week */
function weekStartLondon(now: DateTime) {
  const n = now.setZone("Europe/London");
  const dow = n.weekday % 7; // Mon=1..Sun=7 → 0..6
  return n.startOf("day").minus({ days: dow });
}

function useDemoWeeklyCounters() {
  const [similar, setSimilar] = useState(0);
  const [surveys, setSurveys] = useState(0);
  const [rating, setRating] = useState(4.9);

  useEffect(() => {
    const tick = () => {
      const now = DateTime.now().setZone("Europe/London");
      const ws = weekStartLondon(now);
      const secs = Math.max(0, Math.floor(now.diff(ws, "seconds").seconds));

      const sim = Math.floor(55 + secs * 0.02);   // ~+1.2/min
      const book = Math.floor(12 + secs * 0.008); // ~+0.48/min
      setSimilar(sim);
      setSurveys(book);
    };
    tick();
    const iv = setInterval(tick, 5_000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const iv = setInterval(() => {
      const r = 4.9 + (Math.random() < 0.1 ? (Math.random() < 0.5 ? -0.01 : 0.01) : 0);
      setRating(parseFloat(r.toFixed(2)));
    }, 8000);
    return () => clearInterval(iv);
  }, []);

  return { similar, surveys, rating };
}

export default function PreviewSuccessV2({
  reference,
  service,
  town,
  summary,
}: Props) {
  const refCode = useMemo(
    () => reference || ("BK-" + Math.random().toString(36).slice(2, 10).toUpperCase()),
    [reference]
  );

  const reducedMotion = useReducedMotion();
  const helper = useOpenHoursMessage();
  const { similar, surveys, rating } = useDemoWeeklyCounters();

  useEffect(() => {
    if (reducedMotion) return;
    const end = Date.now() + 700;
    const frame = () => {
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, [reducedMotion]);

  const waNumber = process.env.NEXT_PUBLIC_WA_NUMBER || "";
  const prefill = `Hi Brixel, my reference is ${refCode}. I'd like to book a site survey${service ? ` for ${service}` : ""}${town ? ` in ${town}` : ""}.`;
  const waHref = waNumber
    ? `https://wa.me/${waNumber}?text=${encodeURIComponent(prefill)}`
    : `https://wa.me/?text=${encodeURIComponent(prefill)}`;

  async function handleEmail() {
    try {
      const res = await fetch("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference: refCode, service, town, summary }),
      });
      if (res.ok) alert("Sent — we’ve emailed your project to our team.");
      else alert("We couldn't send the email just now. Please try again.");
    } catch {
      alert("Network error. Please try again.");
    }
  }

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          🎉 Request received — <span className="text-emerald-600">thank you!</span>
        </h1>
        <div className="hidden md:block">
          <LiveNowBadge />
        </div>
      </div>

      {/* Ref + trust */}
      <p className="mt-2 text-gray-700">
        Your reference: <span className="font-semibold">{refCode}</span>
        <CopyRefChip refCode={refCode} />
      </p>
      <p className="mt-1 text-gray-600">
        You’ve joined <span className="font-semibold">2,300+ homeowners in Kent</span> who trust us.
      </p>

      {/* Card */}
      <div className="mt-6 rounded-2xl border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left */}
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
              <button
                onClick={handleEmail}
                className="inline-flex items-center justify-center rounded-md border border-emerald-600 text-emerald-700 hover:bg-emerald-50 px-5 h-12 text-base font-medium bg-white"
              >
                Email us now
              </button>
            </div>

            {/* Helper (hours-aware) */}
            <div className="text-sm text-gray-500">{helper}</div>

            {/* What happens next */}
            <div className="mt-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-lg border border-gray-200 p-3">
                <div className="text-sm font-semibold">1) Share details</div>
                <div className="text-sm text-gray-600">Send photos or a brief on WhatsApp.</div>
              </div>
              <div className="rounded-lg border border-gray-200 p-3">
                <div className="text-sm font-semibold">2) Specialist hello</div>
                <div className="text-sm text-gray-600">Your matched pro replies and checks scope.</div>
              </div>
              <div className="rounded-lg border border-gray-200 p-3">
                <div className="text-sm font-semibold">3) Survey booked</div>
                <div className="text-sm text-gray-600">Pick a time; we confirm the visit.</div>
              </div>
            </div>

            {/* Demo stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-xl border border-gray-200 p-4">
                <div className="text-xs text-gray-500">
                  Similar requests · last 7 days
                  <span title="Preview metric while we finish integration. Simulated trend. Will reset Sun 12:00am (Europe/London)." className="ml-1 cursor-help">ⓘ</span>
                </div>
                <div className="mt-2 text-3xl font-bold text-emerald-700">{similar}</div>
              </div>
              <div className="rounded-xl border border-gray-200 p-4">
                <div className="text-xs text-gray-500">
                  Surveys booked · last 7 days
                  <span title="Preview metric while we finish integration. Simulated bookings. Will reset Sun 12:00am (Europe/London)." className="ml-1 cursor-help">ⓘ</span>
                </div>
                <div className="mt-2 text-3xl font-bold text-emerald-700">{surveys}</div>
              </div>
              <div className="rounded-xl border border-gray-200 p-4">
                <div className="text-xs text-gray-500">
                  Homeowner rating (312 reviews)
                  <span title="Placeholder rating during beta. Final value will reflect verified reviews." className="ml-1 cursor-help">ⓘ</span>
                </div>
                <div className="mt-2 text-3xl font-bold">
                  {rating}<span className="align-top text-sm text-gray-500">/5</span>
                </div>
              </div>
            </div>

            {/* Back to area */}
            <div>
              <Link
                href="/my"
                className="inline-flex items-center rounded-xl border border-zinc-300 bg-white px-4 py-2 text-zinc-700 hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-300"
              >
                Back to my area
              </Link>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 text-xs text-gray-700">
              <span className="rounded-md border border-gray-200 px-2 py-1">£5m Insurance</span>
              <span className="rounded-md border border-gray-200 px-2 py-1">12-month guarantee</span>
              <span className="rounded-md border border-gray-200 px-2 py-1">DBS checked teams</span>
            </div>
          </div>

          {/* Right column uses the upgraded TrustBoxV2 */}
          <TrustBoxV2 />
        </div>
      </div>
    </>
  );
}
