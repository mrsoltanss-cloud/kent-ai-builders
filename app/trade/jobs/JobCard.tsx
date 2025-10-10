type Tier = "STANDARD" | "QUICKWIN" | "PRIORITY";

type Job = {
  id: string;
  title: string;
  summary: string | null;
  postcode: string | null;
  priceMin: number | null;
  priceMax: number | null;
  tier: Tier;
  views: number | null;
  contactUnlocks: number | null;
  allocCap: number | null;
  status: "OPEN" | "CLOSED";
  createdAt: Date | string;
  visibleUntil: Date | string | null;
};

function fmtGBP(n?: number | null) {
  if (n == null) return "—";
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(n);
}

function since(d: Date) {
  const diff = Date.now() - d.getTime();
  const h = Math.round(diff / 36e5);
  if (h < 1) return "just now";
  if (h < 24) return `${h}h ago`;
  const dys = Math.round(h / 24);
  return `${dys}d ago`;
}

function interestLevel(views: number, fillRatio: number) {
  // simple heuristic: strong if lots of views or >60% filled
  if (views >= 20 || fillRatio >= 0.6) return "high";
  if (views >= 8 || fillRatio >= 0.3) return "medium";
  return "low";
}

function tierStyles(tier: Tier) {
  switch (tier) {
    case "QUICKWIN":
      return {
        ring: "ring-amber-400",
        bar: "bg-amber-500",
        chip: "bg-amber-100 text-amber-800 border border-amber-200",
        halo: "from-amber-50/70",
      };
    case "PRIORITY":
      return {
        ring: "ring-rose-400",
        bar: "bg-rose-500",
        chip: "bg-rose-100 text-rose-800 border border-rose-200",
        halo: "from-rose-50/70",
      };
    default:
      return {
        ring: "ring-emerald-400",
        bar: "bg-emerald-500",
        chip: "bg-emerald-100 text-emerald-800 border border-emerald-200",
        halo: "from-emerald-50/70",
      };
  }
}

export default function JobCard({ job }: { job: Job }) {
  const created = new Date(job.createdAt);
  const introduced = job.contactUnlocks ?? 0;
  const cap = job.allocCap ?? 3;
  const pct = Math.min(100, Math.round((introduced / Math.max(1, cap)) * 100));
  const slotsLeft = Math.max(0, cap - introduced);
  const full = introduced >= cap || job.status === "CLOSED";
  const isNew = Date.now() - created.getTime() <= 1000 * 60 * 60 * 24; // 24h
  const fillRatio = (job.contactUnlocks ?? 0) / Math.max(1, job.allocCap ?? 3);
  const interest = interestLevel(job.views ?? 0, fillRatio);
  const t = tierStyles(job.tier);

  return (
    <a
      href={`/trade/jobs/${job.id}`}
      className={[
        "block rounded-2xl border bg-white shadow-sm transition-all duration-200",
        "hover:shadow-md hover:-translate-y-0.5",
        "ring-1",
        t.ring,
        full ? "opacity-70" : "",
        "relative overflow-hidden"
      ].join(" ")}
    >
      {/* soft tier halo */}
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${t.halo} to-transparent`} />

      {/* header badges */}
      <div className="relative z-10 flex flex-wrap items-center gap-2 p-4 pt-5">
        <span className={`px-2 py-0.5 text-xs rounded-full ${t.chip}`}>{job.tier === "QUICKWIN" ? "Quick win" : job.tier === "PRIORITY" ? "Priority" : "Standard"}</span>
        {isNew && <span className="px-2 py-0.5 text-xs rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">NEW — be the first to contact</span>}
        {interest !== "low" && (
          <span className={`px-2 py-0.5 text-xs rounded-full border ${interest === "high" ? "bg-orange-100 text-orange-800 border-orange-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}>
            {interest === "high" ? "High interest" : "Picking up"}
          </span>
        )}
        {full && (
          <span className="ml-auto px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-700 border border-gray-200">
            Shortlist full
          </span>
        )}
      </div>

      {/* title + summary */}
      <div className="relative z-10 px-4 pb-3">
        <h3 className="text-lg font-semibold">{job.title}</h3>
        {job.summary && <p className="text-gray-700 mt-1">{job.summary}</p>}
      </div>

      {/* meta chips */}
      <div className="relative z-10 px-4 pb-4 flex flex-wrap gap-2 text-sm">
        {job.postcode && (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-gray-50 border border-gray-200 text-gray-800">
            <span>📍</span> Postcode: {job.postcode}
          </span>
        )}
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-gray-50 border border-gray-200 text-gray-800">
          <span>🧾</span> Budget: {fmtGBP(job.priceMin)} — {fmtGBP(job.priceMax)}
        </span>
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-gray-50 border border-gray-200 text-gray-800">
          <span>🎯</span> Slots left: {slotsLeft}/{cap}
        </span>
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-gray-50 border border-gray-200 text-gray-800">
          <span>👀</span> Views: {job.views ?? 0}
        </span>
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-gray-50 border border-gray-200 text-gray-800">
          <span>⏱</span> {since(created)}
        </span>
      </div>

      {/* progress */}
      <div className="relative z-10 px-4 pb-4">
        <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
          <div className={`h-2 ${t.bar}`} style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* subtle bottom border tint */}
      <div className={`h-1 w-full ${t.bar}`} />
    </a>
  );
}
