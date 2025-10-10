import { db } from "@/lib/prisma";

// Tier theme map (explicit class strings so Tailwind can tree-shake safely)
function themeByTier(tier: "STANDARD" | "QUICKWIN" | "PRIORITY") {
  switch (tier) {
    case "STANDARD":
      return {
        ring: "ring-emerald-500/40",
        border: "border-emerald-200",
        hover: "hover:shadow-emerald-200/60",
        rail: "bg-emerald-500",
        progress: "bg-emerald-500",
      };
    case "QUICKWIN":
      return {
        ring: "ring-amber-500/40",
        border: "border-amber-200",
        hover: "hover:shadow-amber-200/60",
        rail: "bg-amber-500",
        progress: "bg-amber-500",
      };
    case "PRIORITY":
      return {
        ring: "ring-rose-500/40",
        border: "border-rose-200",
        hover: "hover:shadow-rose-200/60",
        rail: "bg-rose-500",
        progress: "bg-rose-500",
      };
    default:
      return {
        ring: "ring-slate-300/40",
        border: "border-slate-200",
        hover: "hover:shadow-slate-200/60",
        rail: "bg-slate-400",
        progress: "bg-slate-500",
      };
  }
}

// Derive secondary badge (NEW / High interest / Full)
function deriveBadge(introduced: number, cap: number, createdAt: Date) {
  const isNew = Date.now() - new Date(createdAt).getTime() < 36 * 3600 * 1000; // 36h window
  const full = introduced >= cap;
  if (full) return { text: "Shortlist full", className: "bg-gray-100 text-gray-700 border border-gray-200" };
  if (introduced === 0 && isNew) return { text: "NEW — be the first to contact", className: "bg-emerald-50 text-emerald-800 border border-emerald-200" };
  if (introduced > 0 && introduced < cap) return { text: "High interest", className: "bg-amber-50 text-amber-800 border border-amber-200" };
  return { text: "Open", className: "bg-sky-50 text-sky-900 border border-sky-200" };
}

export default async function JobsList() {
  const now = new Date();
  const jobs = await db.job.findMany({
    where: {
      OR: [
        { status: "OPEN" },
        { AND: [{ status: "CLOSED" }, { visibleUntil: { gt: now } }] },
      ],
    },
    orderBy: [{ createdAt: "desc" }],
    take: 100,
    select: {
      id: true,
      title: true,
      summary: true,
      postcode: true,
      priceMin: true,
      priceMax: true,
      tier: true,
      views: true,
      createdAt: true,
      contactUnlocks: true,
      allocCap: true,
      status: true,
    },
  });

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-4">
      <h1 className="text-2xl font-semibold">Jobs</h1>

      {jobs.map((j) => {
        const introduced = j.contactUnlocks ?? 0;
        const cap = Math.max(1, j.allocCap ?? 3);
        const slotsLeft = Math.max(0, cap - introduced);
        const pct = Math.min(100, Math.round((introduced / cap) * 100));
        const isFull = introduced >= cap || j.status === "CLOSED";
        const badge = deriveBadge(introduced, cap, j.createdAt);
        const theme = themeByTier(j.tier as "STANDARD" | "QUICKWIN" | "PRIORITY");

        return (
          <a
            key={j.id}
            href={`/trade/jobs/${j.id}`}
            className={[
              "relative block rounded-2xl border p-4 shadow-sm transition ring-1",
              theme.border,
              theme.ring,
              isFull ? "opacity-60" : `hover:shadow-lg ${theme.hover}`,
              "bg-white"
            ].join(" ")}
          >
            {/* Colored left rail */}
            <div className={`absolute inset-y-0 left-0 w-1 rounded-l-2xl ${theme.rail}`} />

            <div className="flex items-center gap-2 mb-2">
              {/* Tier pill via client bridge */}
              {/* @ts-expect-error server-to-client boundary */}
              <TierPillClient tier={j.tier as "STANDARD" | "QUICKWIN" | "PRIORITY"} />
              <span className={`px-2 py-0.5 text-xs rounded-full ${badge.className}`}>
                {badge.text}
              </span>
            </div>

            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="text-lg font-semibold">{j.title}</h2>
                {j.summary && <p className="text-gray-700 mt-0.5">{j.summary}</p>}

                <div className="mt-2 flex flex-wrap gap-2 text-sm">
                  <span className="px-2 py-1 rounded bg-gray-100">📍 {j.postcode}</span>
                  <span className="px-2 py-1 rounded bg-gray-100">
                    🧾 £{j.priceMin?.toLocaleString()} — £{j.priceMax?.toLocaleString()}
                  </span>
                  <span className="px-2 py-1 rounded bg-gray-100">
                    🎯 Slots left: {slotsLeft}/{cap}
                  </span>
                  <span className="px-2 py-1 rounded bg-gray-100">👀 Views: {j.views ?? 0}</span>
                </div>

                {/* Progress (themed) */}
                <div className="mt-3">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-2 ${isFull ? "bg-gray-400" : theme.progress}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Right-side state chip */}
              {isFull && (
                <div className="self-start px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700 border border-gray-200">
                  Full
                </div>
              )}
            </div>
          </a>
        );
      })}
    </div>
  );
}

// client bridge for tier chip
function TierPillClient(props: { tier: "STANDARD" | "QUICKWIN" | "PRIORITY" }) {
  // @ts-ignore
  const TierPill = require("./TierPill").default;
  return <TierPill {...props} />;
}
