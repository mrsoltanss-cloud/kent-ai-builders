"use client";

import { useMemo, useState } from "react";
import { signOut } from "next-auth/react";

/**
 * Visual “vocabulary” for stages: label, emoji, and color classes (Tailwind)
 */
const STAGES = [
  { key: "matched",           label: "Matched",           emoji: "✅", pill: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { key: "confirming_scope",  label: "Confirming scope",  emoji: "📝", pill: "bg-sky-50 text-sky-700 border-sky-200" },
  { key: "survey_booked",     label: "Survey booked",     emoji: "📅", pill: "bg-violet-50 text-violet-700 border-violet-200" },
  { key: "estimate_ready",    label: "Estimate ready",    emoji: "📄", pill: "bg-amber-50 text-amber-700 border-amber-200" },
  { key: "work_scheduled",    label: "Work scheduled",    emoji: "🛠️", pill: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { key: "archived",          label: "Archived",          emoji: "🗄️", pill: "bg-zinc-50 text-zinc-700 border-zinc-200" },
] as const;

type StageKey = typeof STAGES[number]["key"];

type Lead = {
  id: string;
  ref: string;
  service: string;
  stage: StageKey;
  postcode: string;
};

const INITIAL: Lead[] = [
  { id: "L1", ref: "BK-X5NENKON", service: "Plastering",            stage: "work_scheduled",   postcode: "CT1" },
  { id: "L2", ref: "BK-YTORRETQ", service: "Kitchen Renovation",    stage: "work_scheduled",   postcode: "CT1" },
  { id: "L3", ref: "BK-P9K7AA12", service: "Loft Conversion",       stage: "survey_booked",    postcode: "ME16" },
  { id: "L4", ref: "BK-ZZ31MMQ2", service: "Bathroom Refurbishment",stage: "estimate_ready",   postcode: "TN9" },
  { id: "L5", ref: "BK-AB77CDE3", service: "Electrical",            stage: "work_scheduled",   postcode: "DA1" },
];

function stageIndex(key: StageKey) {
  return STAGES.findIndex((s) => s.key === key);
}

function StagePill({ stage }: { stage: StageKey }) {
  const s = STAGES[stageIndex(stage)];
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium ${s.pill}`}
    >
      <span aria-hidden>{s.emoji}</span>
      {s.label}
    </span>
  );
}

function ProgressDots({ stage }: { stage: StageKey }) {
  const idx = stageIndex(stage);
  return (
    <div className="flex items-center gap-2" aria-label={`Progress: ${Math.round(((idx+1)/STAGES.length)*100)}%`}>
      <div className="flex items-center gap-1">
        {STAGES.map((s, i) => (
          <span
            key={s.key}
            className={`h-2.5 w-2.5 rounded-full ${i <= idx ? "bg-emerald-500" : "bg-zinc-300"}`}
            aria-hidden
          />
        ))}
      </div>
      <span className="text-sm text-zinc-500 w-10 text-right">
        {Math.round(((idx+1)/STAGES.length)*100)}%
      </span>
    </div>
  );
}

function WhatsAppButton({ className = "" }: { className?: string }) {
  return (
    <a
      href="https://wa.me/447713454032?text=Hi%20Brixel%2C%20I%27d%20like%20to%20discuss%20my%20job."
      target="_blank"
      rel="noreferrer noopener"
      className={`inline-flex items-center justify-center rounded-md bg-emerald-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${className}`}
    >
      <span aria-hidden className="mr-2">💬</span>
      Chat on WhatsApp
    </a>
  );
}

export default function Page() {
  const [leads, setLeads] = useState<Lead[]>(INITIAL);
  const [activeId, setActiveId] = useState<string | null>(leads[0]?.id ?? null);
  const [tab, setTab] = useState<StageKey | "all">("all");
  const [query, setQuery] = useState("");

  const active = leads.find((l) => l.id === activeId) ?? leads[0];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return leads.filter((l) => {
      const inTab = tab === "all" ? true : l.stage === tab;
      if (!q) return inTab;
      return (
        inTab &&
        (l.service.toLowerCase().includes(q) ||
          l.ref.toLowerCase().includes(q) ||
          l.postcode.toLowerCase().includes(q))
      );
    });
  }, [leads, tab, query]);

  function moveBack(id: string) {
    setLeads((curr) =>
      curr.map((l) => {
        if (l.id !== id) return l;
        const idx = stageIndex(l.stage);
        // Don't move back from "matched" or "archived"
        if (l.stage === "archived" || idx <= 0) return l;
        return { ...l, stage: STAGES[idx - 1].key as StageKey };
      })
    );
  }

  function archive(id: string) {
    setLeads((curr) => curr.map((l) => (l.id === id ? { ...l, stage: "archived" } : l)));
  }

  function remove(id: string) {
    setLeads((curr) => curr.filter((l) => l.id !== id));
    if (activeId === id) setActiveId(null);
  }

  const TABS: { key: StageKey | "all"; label: string }[] = [
    { key: "all", label: "All" },
    ...STAGES
      .filter((s) => s.key !== "archived")
      .map((s) => ({ key: s.key, label: s.label })),
    { key: "archived", label: "Archived" },
  ];

  return (
    <>
      {/* Header */}
      <div className="mx-auto max-w-6xl px-4 pt-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-zinc-900">My Portal</h1>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <span aria-hidden>↪</span> Sign out
          </button>
        </div>

        {/* Tabs */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {TABS.map((t) => {
            const is = tab === t.key;
            return (
              <button
                key={String(t.key)}
                onClick={() => setTab(t.key)}
                className={`rounded-full border px-3 py-1.5 text-sm ${is
                  ? "border-zinc-900 bg-zinc-900 text-white"
                  : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
                  }`}
              >
                {t.label}
              </button>
            );
          })}
          <div className="ml-auto">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by service, ref or postcode"
              className="w-[320px] rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm outline-none placeholder:text-zinc-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-4 pb-12 pt-4 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        {/* List */}
        <div className="flex flex-col gap-4">
          {filtered.map((l) => {
            const isActive = l.id === active?.id;
            return (
              <div
                key={l.id}
                className={`rounded-xl border p-4 shadow-sm bg-white ${isActive ? "border-emerald-300" : "border-zinc-200"}`}
              >
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setActiveId(l.id)}
                    className="text-lg font-semibold text-emerald-800 hover:underline"
                  >
                    {l.service}
                  </button>
                  <span className="text-sm text-zinc-400">Ref {l.ref}</span>
                  <StagePill stage={l.stage} />
                  <div className="ml-auto">
                    <ProgressDots stage={l.stage} />
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <WhatsAppButton />
                  <button
                    onClick={() => setActiveId(l.id)}
                    className="rounded-md border border-zinc-200 bg-white px-3.5 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
                  >
                    View details
                  </button>

                  {/* Move back (styled + arrow) */}
                  {l.stage !== "archived" && stageIndex(l.stage) > 0 && (
                    <button
                      onClick={() => moveBack(l.id)}
                      className="inline-flex items-center gap-2 rounded-md border border-zinc-300 bg-white px-3.5 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
                      title="Revert one step"
                    >
                      <span aria-hidden>↩</span>
                      Move back
                    </button>
                  )}

                  <button
                    onClick={() => archive(l.id)}
                    className="rounded-md border border-zinc-200 bg-white px-3.5 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
                  >
                    Archive
                  </button>
                  <button
                    onClick={() => remove(l.id)}
                    className="rounded-md border border-rose-200 bg-rose-50 px-3.5 py-2 text-sm font-medium text-rose-700 hover:bg-rose-100"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="rounded-xl border border-zinc-200 bg-white p-8 text-center text-zinc-500">
              No results.
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="rounded-xl border border-zinc-200 bg-white p-4 h-fit sticky top-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-semibold text-zinc-900">{active?.service ?? "—"}</div>
              <div className="mt-1 text-xs text-zinc-400">
                Ref {active?.ref ?? "—"} · {active?.postcode ?? "—"}
              </div>
            </div>
            {active && <StagePill stage={active.stage} />}
          </div>

          <div className="mt-4">
            <WhatsAppButton className="w-full" />
          </div>

          <div className="mt-4">
            <button
              onClick={() => active && setActiveId(active.id)}
              className="w-full rounded-md border border-zinc-200 bg-white px-3.5 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
            >
              View details
            </button>
          </div>

          <div className="mt-5 rounded-lg border border-zinc-100 bg-zinc-50 p-4">
            <div className="text-sm font-semibold text-zinc-900">What happens next</div>
            <ul className="mt-2 space-y-2 text-sm text-zinc-700">
              <li><span className="mr-2" aria-hidden>💬</span> Chat to us on WhatsApp — you’ll be routed to a specialist in minutes.</li>
              <li><span className="mr-2" aria-hidden>📍</span> You’re matched — vetted local builder assigned.</li>
              <li><span className="mr-2" aria-hidden>📅</span> Book your site survey — pick a time that suits you.</li>
              <li><span className="mr-2" aria-hidden>📄</span> Get your estimate — we confirm the scope and share your price.</li>
              <li><span className="mr-2" aria-hidden>🛠️</span> Schedule the work — agree a start date; covered by our guarantee.</li>
            </ul>
            <div className="mt-3 text-xs text-zinc-500">
              Fastest reply during working hours. Typical response: under 10 minutes.
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-xs text-zinc-700">DBS-checked</span>
              <span className="rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-xs text-zinc-700">£5m Public Liability</span>
              <span className="rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-xs text-zinc-700">12-month guarantee</span>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
