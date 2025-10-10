import { db } from "@/lib/prisma";
import { cookies } from "next/headers";
import HideJoinedToggle from "./HideJoinedToggle";
import SearchBar from "./SearchBar";
import Link from "next/link";

type SearchParams = { [key: string]: string | string[] | undefined };

function tierStyles(tier?: string) {
  switch (tier) {
    case "PRIORITY":
      return {
        wrap: "border-red-300 bg-red-50 ring-1 ring-red-100 hover:ring-red-200",
        rail: "bg-red-200",
        fill: "bg-red-500",
        badge: "bg-red-100 text-red-700 ring-1 ring-red-200",
      };
    case "QUICKWIN":
      return {
        wrap: "border-amber-300 bg-amber-50 ring-1 ring-amber-100 hover:ring-amber-200",
        rail: "bg-amber-200",
        fill: "bg-amber-500",
        badge: "bg-amber-100 text-amber-700 ring-1 ring-amber-200",
      };
    default:
      return {
        wrap: "border-emerald-300 bg-emerald-50 ring-1 ring-emerald-100 hover:ring-emerald-200",
        rail: "bg-emerald-200",
        fill: "bg-emerald-500",
        badge: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200",
      };
  }
}

export default async function JobsList({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const now = new Date();
  const hideJoined = String(searchParams?.hideJoined ?? "") === "1";
  const q = (typeof searchParams?.q === "string" ? searchParams.q : "")?.trim();

  const builderId = cookies().get("builder_id")?.value || "demo-builder";

  const visibilityWhere = {
    OR: [
      { status: "OPEN" },
      { AND: [{ status: "CLOSED" }, { visibleUntil: { gt: now } }] },
    ],
  } as const;

  const searchWhere = q
    ? {
        OR: [
          { title: { contains: q, mode: "insensitive" as const } },
          { summary: { contains: q, mode: "insensitive" as const } },
          { postcode: { contains: q, mode: "insensitive" as const } },
        ],
      }
    : undefined;

  const where: any = { AND: [visibilityWhere] };
  if (searchWhere) where.AND.push(searchWhere);

  const jobs = await db.job.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const joined = await db.jobIntro.findMany({
    where: { builderId },
    select: { jobId: true },
  });
  const joinedSet = new Set(joined.map((j) => j.jobId));

  const items = hideJoined ? jobs.filter((j) => !joinedSet.has(j.id)) : jobs;

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="flex items-center justify-between gap-4 mb-4">
        <h1 className="text-2xl font-semibold">Jobs</h1>
        <div className="flex items-center gap-4">
          <SearchBar />
          <HideJoinedToggle />
        </div>
      </div>

      <div className="space-y-6">
        {items.map((job) => {
          const s = tierStyles(job.tier ?? "STANDARD");
          const introduced = job.contactUnlocks ?? 0;
          const cap = job.allocCap ?? 3;
          const pct = Math.max(0, Math.min(100, Math.round((introduced / cap) * 100)));
          const full = introduced >= cap;
          const isJoined = joinedSet.has(job.id);
          const slotsLeft = Math.max(0, cap - introduced);

          let statusBadge: JSX.Element;
          if (full) {
            statusBadge = (
              <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 ring-1 ring-gray-200">
                Shortlist full
              </span>
            );
          } else if (isJoined) {
            statusBadge = (
              <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 ring-1 ring-blue-200">
                You’re on the shortlist
              </span>
            );
          } else if (introduced === 0) {
            statusBadge = (
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200">
                NEW — be the first to contact
              </span>
            );
          } else {
            statusBadge = (
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 ring-1 ring-amber-200">
                Active — {introduced} introduced
              </span>
            );
          }

          return (
            <article
              key={job.id}
              className={`relative group rounded-2xl border p-4 shadow-sm transition ${s.wrap}`}
            >
              {/* Make entire card clickable */}
              <Link
                href={`/trade/jobs/${job.id}`}
                className="absolute inset-0"
                aria-label={`Open ${job.title}`}
              />

              <div className="flex items-center gap-2 text-xs mb-2">
                <span className={`px-2 py-0.5 rounded-full ${s.badge}`}>
                  {job.tier === "PRIORITY"
                    ? "Priority"
                    : job.tier === "QUICKWIN"
                    ? "Quick win"
                    : "Standard"}
                </span>
                {statusBadge}
              </div>

              <h2 className="text-lg font-semibold">{job.title}</h2>
              <p className="text-gray-700 mt-1">{job.summary}</p>

              <div className="flex flex-wrap gap-2 text-sm mt-3">
                {job.postcode && (
                  <span className="px-2 py-1 rounded bg-white/70 ring-1 ring-gray-200">
                    📍 Postcode: {job.postcode}
                  </span>
                )}
                {(job.priceMin || job.priceMax) && (
                  <span className="px-2 py-1 rounded bg-white/70 ring-1 ring-gray-200">
                    💷 £{job.priceMin?.toLocaleString()} — £{job.priceMax?.toLocaleString()}
                  </span>
                )}
                <span className="px-2 py-1 rounded bg-white/70 ring-1 ring-gray-200">
                  🎯 Slots left: {slotsLeft}/{cap}
                </span>
                <span className="px-2 py-1 rounded bg-white/70 ring-1 ring-gray-200">
                  👀 Views: {job.views ?? 0}
                </span>
              </div>

              <div className={`h-2 rounded-full mt-3 ${s.rail}`}>
                <div className={`h-2 rounded-full ${s.fill}`} style={{ width: `${pct}%` }} />
              </div>

              <div className="mt-4">
                <Link
                  href={`/trade/jobs/${job.id}`}
                  className="relative z-10 inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm shadow-sm hover:border-gray-400 hover:shadow"
                >
                  View details
                </Link>
              </div>
            </article>
          );
        })}

        {items.length === 0 && (
          <div className="text-sm text-gray-500 py-8 text-center">
            No jobs to show with the current filters.
          </div>
        )}
      </div>
    </div>
  );
}
