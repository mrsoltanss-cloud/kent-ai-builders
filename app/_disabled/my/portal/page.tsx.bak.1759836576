"use client";

import { useMemo, useState } from "react";
import { signOut } from "next-auth/react";

// ──────────────────────────────────────────────────────────────
// Lightweight types & demo data (UI-only; no persistence)
// ──────────────────────────────────────────────────────────────
type StageKey =
  | "matched"
  | "confirming"
  | "survey"
  | "estimate"
  | "scheduled"
  | "archived";

const STAGES: { key: StageKey; label: string }[] = [
  { key: "matched",    label: "Matched" },
  { key: "confirming", label: "Confirming scope" },
  { key: "survey",     label: "Survey booked" },
  { key: "estimate",   label: "Estimate ready" },
  { key: "scheduled",  label: "Work scheduled" },
  { key: "archived",   label: "Archived" },
];

type Lead = {
  id: string;
  ref: string;
  service: string;
  stage: StageKey;
  progress: number; // 0–100
  postcode?: string;
};

const SEED: Lead[] = [
  { id: "1", ref: "BK-X5NENKON", service: "Plastering",            stage: "scheduled", progress: 100 },
  { id: "2", ref: "BK-YTORRETQ", service: "Kitchen Renovation",    stage: "scheduled", progress: 100 },
  { id: "3", ref: "BK-P9K7AA12", service: "Loft Conversion",       stage: "survey",    progress: 60  },
  { id: "4", ref: "BK-ZZ31MMQ2", service: "Bathroom Refurbishment",stage: "estimate",  progress: 80  },
  { id: "5", ref: "BK-AB77CDE3", service: "Electrical",            stage: "scheduled", progress: 100 },
];

// Utility to get stage index
const stageIndex = (k: StageKey) => STAGES.findIndex(s => s.key === k);

// ──────────────────────────────────────────────────────────────
// Page
// ──────────────────────────────────────────────────────────────
export default function MyPortalPage() {
  const [leads, setLeads] = useState<Lead[]>(SEED);
  const [query, setQuery] = useState("");

  // Simple text filter over service/ref/postcode
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return leads;
    return leads.filter(l =>
      l.service.toLowerCase().includes(q) ||
      l.ref.toLowerCase().includes(q) ||
      (l.postcode?.toLowerCase().includes(q) ?? false)
    );
  }, [leads, query]);

  // Move forward one step (kept for completeness)
  const advance = (id: string) => {
    setLeads(prev =>
      prev.map(l => {
        if (l.id !== id) return l;
        const i = stageIndex(l.stage);
        // if already archived, do nothing
        if (l.stage === "archived" || i === -1) return l;
        const next = Math.min(i + 1, STAGES.length - 1);
        const nextKey = STAGES[next].key;
        return {
          ...l,
          stage: nextKey,
          progress: nextKey === "archived" ? l.progress : Math.min(100, Math.max(20, Math.round(((next + 1) / (STAGES.length - 1)) * 100))),
        };
      })
    );
  };

  // ⭐ NEW: Move back one step
  const moveBack = (id: string) => {
    setLeads(prev =>
      prev.map(l => {
        if (l.id !== id) return l;
        const i = stageIndex(l.stage);
        if (i <= 0) return l; // already at first stage
        const prevIdx = i - 1;
        const prevKey = STAGES[prevIdx].key;
        return {
          ...l,
          stage: prevKey,
          progress: Math.min(100, Math.max(20, Math.round(((prevIdx + 1) / (STAGES.length - 1)) * 100))),
        };
      })
    );
  };

  // Archive & Delete keep working as before
  const archive = (id: string) => {
    setLeads(prev => prev.map(l => (l.id === id ? { ...l, stage: "archived" } : l)));
  };
  const remove = (id: string) => {
    setLeads(prev => prev.filter(l => l.id !== id));
  };

  const pills = [
    { key: "all", label: "All" },
    { key: "matched", label: "Matched" },
    { key: "confirming", label: "Confirming scope" },
    { key: "survey", label: "Survey booked" },
    { key: "estimate", label: "Estimate ready" },
    { key: "scheduled", label: "Work scheduled" },
    { key: "archived", label: "Archived" },
  ] as const;

  const [activeFilter, setActiveFilter] = useState<typeof pills[number]["key"]>("all");
  const visible = filtered.filter(l => (activeFilter === "all" ? true : l.stage === activeFilter));

  return (
    <>
      {/* Header row with title + Sign out */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">My Portal</h1>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="rounded-full bg-emerald-600 text-white px-3 py-1.5 text-sm font-medium hover:bg-emerald-700 transition-colors"
        >
          Sign out
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {pills.map(p => (
          <button
            key={p.key}
            onClick={() => setActiveFilter(p.key)}
            className={`px-3 py-1.5 rounded-full text-sm border ${
              activeFilter === p.key ? "bg-emerald-600 text-white border-emerald-600" : "bg-white hover:bg-gray-50"
            }`}
          >
            {p.label}
          </button>
        ))}

        <div className="ml-auto w-full sm:w-80">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by service, ref or postcode"
            className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 mt-6">
        {/* List */}
        <div className="space-y-4">
          {visible.map((l) => {
            const i = stageIndex(l.stage);
            const canMoveBack = i > 0;

            return (
              <div key={l.id} className="rounded-xl border bg-white p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="text-sm text-gray-500">Ref {l.ref}</div>
                    <span className={`text-xs rounded-full px-2 py-0.5 border ${l.stage === "scheduled" ? "border-emerald-200 text-emerald-700 bg-emerald-50" : "border-gray-200 text-gray-700 bg-gray-50"}`}>
                      {STAGES[i]?.label}
                    </span>
                  </div>

                  {/* progress dots */}
                  <div className="flex items-center gap-1" aria-label={`Progress: ${l.progress}%`}>
                    {STAGES.slice(0, STAGES.length - 1).map((_, dot) => (
                      <span
                        key={dot}
                        className={`h-2 w-2 rounded-full ${dot <= i ? "bg-emerald-500" : "bg-gray-200"}`}
                      />
                    ))}
                    <span className="ml-2 text-xs text-gray-500">{l.progress}%</span>
                  </div>
                </div>

                <div className="mt-1 text-base font-medium">{l.service}</div>

                {/* Actions row */}
                <div className="mt-3 flex flex-wrap gap-2">
                  <a
                    href="https://wa.me/447700900000?text=Hi%20Brixel%2C%20I%27d%20like%20help%20with%20my%20job."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-lg bg-emerald-600 text-white px-3 py-1.5 text-sm font-medium hover:bg-emerald-700"
                  >
                    Chat on WhatsApp
                  </a>

                  {/* Example row-specific actions (kept from prior design) */}
                  {l.stage === "scheduled" ? (
                    <button className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50">View booking</button>
                  ) : l.stage === "estimate" ? (
                    <button onClick={() => advance(l.id)} className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50">
                      Approve estimate
                    </button>
                  ) : l.stage === "survey" ? (
                    <button onClick={() => advance(l.id)} className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50">
                      Confirm scope
                    </button>
                  ) : l.stage === "confirming" ? (
                    <div className="flex gap-2">
                      <button onClick={() => advance(l.id)} className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50">
                        Book a survey
                      </button>
                      <button onClick={() => advance(l.id)} className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50">
                        Book survey
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => advance(l.id)} className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50">
                      View details
                    </button>
                  )}

                  {/* ⭐ NEW: Move back one step */}
                  <button
                    onClick={() => moveBack(l.id)}
                    disabled={!canMoveBack}
                    className={`inline-flex items-center rounded-lg px-3 py-1.5 text-sm border ${
                      canMoveBack ? "hover:bg-gray-50" : "opacity-40 cursor-not-allowed"
                    }`}
                    title={canMoveBack ? "Move back one step" : "Already at the first stage"}
                  >
                    ← Move back
                  </button>

                  <button onClick={() => archive(l.id)} className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50">
                    Archive
                  </button>
                  <button
                    onClick={() => remove(l.id)}
                    className="rounded-lg border border-red-200 text-red-600 px-3 py-1.5 text-sm hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right column (kept the same) */}
        <aside className="hidden lg:block">
          <div className="sticky top-6 space-y-4">
            <div className="rounded-xl border bg-white p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-500">Plastering</div>
                  <div className="text-xs text-gray-500">Ref BK-X5NENKON · CT1</div>
                </div>
                <span className="text-xs rounded-full px-2 py-0.5 border border-emerald-200 text-emerald-700 bg-emerald-50">
                  Work scheduled
                </span>
              </div>

              <a
                href="https://wa.me/447700900000?text=Hi%20Brixel%2C%20I%27d%20like%20to%20go%20ahead%20please."
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center rounded-lg bg-emerald-600 text-white px-3 py-1.5 text-sm font-medium hover:bg-emerald-700"
              >
                Chat on WhatsApp
              </a>

              <div className="mt-4">
                <div className="font-medium mb-2">What happens next</div>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>💬 Chat to us on WhatsApp — you’ll be routed to a specialist in minutes.</li>
                  <li>📍 You’re matched — vetted local builder assigned.</li>
                  <li>📅 Book your site survey — pick a time that suits you.</li>
                  <li>🧾 Get your estimate — we confirm the scope and share your price.</li>
                  <li>🛠️ Schedule the work — agree a start date; covered by our guarantee.</li>
                </ul>

                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="text-xs rounded-full px-2 py-0.5 border bg-gray-50">DBS-checked</span>
                  <span className="text-xs rounded-full px-2 py-0.5 border bg-gray-50">£5m Public Liability</span>
                  <span className="text-xs rounded-full px-2 py-0.5 border bg-gray-50">12-month guarantee</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border bg-white p-4">
              <div className="font-medium mb-2">Why homeowners choose us</div>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>🤖 Instant AI-powered quotes</li>
                <li>✅ Vetted local builders you can trust</li>
                <li>🛡️ £5m insurance · 12-month guarantee · DBS-checked teams</li>
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
