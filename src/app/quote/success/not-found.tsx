"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";
import LiveNowBadge from "@/components/LiveNowBadge";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import BrixelSuccessPanel from "@/components/brixel/BrixelSuccessPanel";

export default function NotFoundSuccessFallback() {
  const sp = useSearchParams();
  const ref = sp.get("ref") || "BK-REF";

  // Small celebration so it feels like the normal page
  useEffect(() => {
    const end = Date.now() + 600;
    const frame = () => {
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          🎉 Request received — <span className="text-emerald-600">thank you!</span>
        </h1>
        <div className="hidden md:block">
          <LiveNowBadge />
        </div>
      </div>

      <p className="mt-2 text-gray-700">
        Your reference: <span className="font-semibold">{ref}</span>
      </p>
      <p className="mt-1 text-gray-600">
        You’ve joined <span className="font-semibold">2,300+ homeowners in Kent</span> who trust us.
      </p>

      <div className="mt-6 rounded-2xl border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left */}
          <div className="md:col-span-2 space-y-5">
            <BrixelSuccessPanel reference={ref} />
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

          {/* Right: trust sidebar (unchanged) */}
          <div className="rounded-xl border border-gray-200 p-4">
            <div className="text-sm text-gray-700">Why homeowners choose us</div>
            <ul className="mt-2 space-y-1 text-sm text-gray-600">
              <li>✓ 2,300+ successful projects</li>
              <li>✓ 4.9/5 rating</li>
              <li>✓ £5m Public Liability cover</li>
              <li>✓ 12-month workmanship guarantee</li>
              <li>✓ Verified &amp; DBS-checked teams</li>
            </ul>
            <div className="mt-4 flex gap-2 text-xs text-gray-500">
              <span className="rounded-md border border-gray-200 px-2 py-1">Insurance £5m</span>
              <span className="rounded-md border border-gray-200 px-2 py-1">12-month guarantee</span>
              <span className="rounded-md border border-gray-200 px-2 py-1">DBS checked</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
