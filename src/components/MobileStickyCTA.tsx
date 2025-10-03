"use client";

import Link from "next/link";

export default function MobileStickyCTA() {
  return (
    <div className="sm:hidden fixed inset-x-0 bottom-0 z-50 pb-[max(env(safe-area-inset-bottom),12px)]">
      <div className="mx-auto max-w-xl px-4">
        <Link
          href="/quote"
          className="block w-full text-center rounded-xl bg-emerald-500 px-4 py-3 font-semibold text-white shadow-lg hover:bg-emerald-600 transition"
        >
          Get your instant estimate →
        </Link>
      </div>
    </div>
  );
}
