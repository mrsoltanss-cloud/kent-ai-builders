import { Suspense } from "react";

export const dynamic = "force-dynamic";

import SuccessClient from "./SuccessClient";

export default async function Page() {
  // Keep server file tiny; render client with Suspense to satisfy Next 15 rules.
  return (
    <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center text-zinc-400">Loading…</div>}>
      <SuccessClient />
    </Suspense>
  );
}
