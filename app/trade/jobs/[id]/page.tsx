import { db } from "@/lib/prisma";

export default async function JobDetail({ params }: { params: { id: string } }) {
  const job = await db.job.findUnique({ where: { id: params.id } });
  if (!job) return <div className="max-w-3xl mx-auto py-10">Job not found.</div>;

  const introduced = job.contactUnlocks ?? 0;
  const cap = job.allocCap ?? 3;
  const slotsLeft = Math.max(0, cap - introduced);
  const pct = Math.min(100, Math.round((introduced / Math.max(1, cap)) * 100));
  const full = introduced >= cap || job.status === "CLOSED";

  const creditCost = job.tier === "PRIORITY" ? 3 : job.tier === "QUICKWIN" ? 2 : 1;

  return (
    <div className="max-w-3xl mx-auto py-10 space-y-5">
      <a href="/trade/jobs" className="text-sm underline">← Back to jobs</a>

      <div className="bg-white rounded-2xl border shadow-sm p-5 relative">
        {/* Full banner */}
        {full && (
          <div className="absolute right-4 top-4 px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700 border border-gray-200">
            Shortlist full
          </div>
        )}

        <h1 className="text-2xl font-semibold">{job.title}</h1>
        {job.summary && <p className="text-gray-700 mt-1">{job.summary}</p>}

        <div className="mt-3 flex flex-wrap gap-3 text-sm">
          <span className="px-2 py-1 rounded bg-gray-100">📍 {job.postcode}</span>
          <span className="px-2 py-1 rounded bg-gray-100">
            🧾 £{job.priceMin?.toLocaleString()} — £{job.priceMax?.toLocaleString()}
          </span>
          <span className="px-2 py-1 rounded bg-gray-100 flex items-center gap-2">
            Tier:
            {/* @ts-expect-error server-to-client boundary */}
            <TierPillClient tier={job.tier as "STANDARD" | "QUICKWIN" | "PRIORITY"} />
          </span>
          <span className="px-2 py-1 rounded bg-gray-100">👀 {job.views ?? 0} views</span>
        </div>

        <div className="mt-4">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-2 bg-amber-500" style={{ width: `${pct}%` }} />
          </div>
          <div className="text-sm text-gray-600 mt-1">
            {introduced} / {cap} introduced — {slotsLeft} slots left
          </div>
        </div>

        {/* How joining works */}
        <div className="mt-5 rounded-xl border border-sky-200 bg-sky-50 text-sky-900 p-4">
          <p className="font-medium">How joining works</p>
          <ul className="text-sm mt-2 list-disc ml-5 space-y-1">
            <li>Costs <strong>{creditCost} credit{creditCost > 1 ? "s" : ""}</strong> to join this shortlist.</li>
            <li>The homeowner sees your <strong>profile & contact details</strong> after you join.</li>
            <li>We’ll notify you if you’re <strong>put forward</strong>; no extra credits to message.</li>
            <li>If the shortlist fills up, this job is marked <strong>full</strong> and will disappear after 72 hours.</li>
          </ul>
        </div>

        {/* CTA */}
        <div className="mt-4">
          {/* @ts-expect-error client */}
          <JoinShortlist jobId={job.id} introduced={introduced} cap={cap} />
          <p className="text-xs text-gray-500 mt-2">
            By joining, you agree to spend {creditCost} credit{creditCost > 1 ? "s" : ""}. Credits are only used on join, not per message.
          </p>
        </div>
      </div>
    </div>
  );
}

// client bridge for join button
function JoinShortlist(props: { jobId: string; introduced: number; cap: number }) {
  // @ts-ignore
  const Button = require("../JoinShortlistButton").default;
  return <Button {...props} />;
}

// client bridge for the coloured tier pill
function TierPillClient(props: { tier: "STANDARD" | "QUICKWIN" | "PRIORITY" }) {
  // @ts-ignore
  const TierPill = require("../TierPill").default;
  return <TierPill {...props} />;
}
