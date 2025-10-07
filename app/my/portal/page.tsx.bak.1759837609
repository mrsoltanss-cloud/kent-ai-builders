"use client";

import { useMemo, useState } from "react";
import { signOut } from "next-auth/react";

/** ----- Stages & helpers ----- */
type StageKey = "matched" | "confirming" | "survey_booked" | "estimate_ready" | "work_scheduled" | "archived";
const STAGES: { key: StageKey; label: string; emoji: string }[] = [
  { key: "matched",         label: "Matched",          emoji: "✅" },
  { key: "confirming",      label: "Confirming scope", emoji: "📝" },
  { key: "survey_booked",   label: "Survey booked",    emoji: "📅" },
  { key: "estimate_ready",  label: "Estimate ready",   emoji: "📄" },
  { key: "work_scheduled",  label: "Work scheduled",   emoji: "🛠️" },
  { key: "archived",        label: "Archived",         emoji: "📦" },
];
const idxOf = (k: StageKey) => STAGES.findIndex(s => s.key === k);
const stagePct = (k: StageKey) => Math.round(((idxOf(k)+1) / (STAGES.length-1)) * 100); // archived not counted in dots

/** ----- Demo data (client only) ----- */
type Lead = {
  id: string;
  ref: string;
  service: string;
  postcode: string;
  stage: StageKey;
}
const seed: Lead[] = [
  { id: "1", ref: "BK-X5NENKON", service: "Plastering",            postcode: "CT1", stage: "archived" },
  { id: "2", ref: "BK-YTORRETQ", service: "Kitchen Renovation",     postcode: "CT2", stage: "estimate_ready" },
  { id: "3", ref: "BK-P9K7AA12", service: "Loft Conversion",        postcode: "ME7", stage: "survey_booked" },
  { id: "4", ref: "BK-ZZ31MMQ2", service: "Bathroom Refurbishment", postcode: "TN24", stage: "estimate_ready" },
  { id: "5", ref: "BK-AB77CDE3", service: "Electrical",             postcode: "DA1", stage: "work_scheduled" },
];

/** Small UI atoms */
const Chip = ({ children, tone = "default" }: { children: React.ReactNode; tone?: "default"|"green"|"amber"|"slate" }) => {
  const tones: Record<string,string> = {
    default: "border-slate-300 text-slate-700 bg-white",
    green:   "border-emerald-300 text-emerald-800 bg-emerald-50",
    amber:   "border-amber-300 text-amber-800 bg-amber-50",
    slate:   "border-slate-300 text-slate-700 bg-slate-50",
  };
  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm ${tones[tone]}`}>
      {children}
    </span>
  );
};
const Btn = ({ children, onClick, tone="default", title }: {children:React.ReactNode; onClick?:()=>void; tone?: "default"|"danger"; title?:string}) => {
  const cls = tone==="danger"
    ? "border-rose-300 text-rose-700 hover:bg-rose-50"
    : "border-slate-300 text-slate-800 hover:bg-slate-50";
  return (
    <button type="button" title={title} onClick={onClick}
      className={`rounded-md border px-3 py-2 text-sm font-medium transition ${cls}`}>
      {children}
    </button>
  );
};

export default function PortalPage() {
  const [leads, setLeads] = useState<Lead[]>(seed);
  const [selectedId, setSelected] = useState<string>(leads[0]?.id ?? "");
  const [tab, setTab] = useState<StageKey | "all">("all");
  const selected = leads.find(l => l.id === selectedId) ?? leads[0];

  const filtered = useMemo(() => {
    return tab === "all" ? leads : leads.filter(l => l.stage === tab);
  }, [leads, tab]);

  const move = (id: string, dir: -1 | 1) => {
    setLeads(prev => prev.map(l => {
      if (l.id !== id) return l;
      const i = idxOf(l.stage);
      let j = Math.min(STAGES.length-1, Math.max(0, i + dir));
      // keep Archived terminal (no forward from archived)
      if (l.stage === "archived" && dir === 1) j = i;
      return { ...l, stage: STAGES[j].key };
    }));
  };
  const archive = (id: string) => setLeads(prev => prev.map(l => l.id===id ? ({...l, stage: "archived"}) : l));
  const del = (id: string) => setLeads(prev => prev.filter(l => l.id !== id));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* header row */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">My Portal</h1>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/" })}
          className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-100"
        >
          <span>🚪</span> <span>Sign out</span>
        </button>
      </div>

      {/* tabs */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        {(["all", ...STAGES.map(s=>s.key)] as (StageKey|"all")[]).map(k => {
          const s = STAGES.find(x => x.key === k);
          const label = k==="all" ? "All" : `${s?.label}`;
          const active = tab===k;
          return (
            <button key={String(k)} onClick={()=>setTab(k)}
              className={`rounded-full border px-3 py-1.5 text-sm ${active ? "border-emerald-300 bg-emerald-50 text-emerald-800" : "border-slate-300 text-slate-700 hover:bg-slate-50"}`}>
              {k==="all" ? "All" : `${s?.label}`}
            </button>
          );
        })}
        <input
          placeholder="Search by service, ref or postcode"
          className="ml-auto w-64 rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-400"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        {/* list */}
        <div className="space-y-4">
          {filtered.map(lead => {
            const s = STAGES[idxOf(lead.stage)];
            const i = idxOf(lead.stage);
            const canBack = i > 0;
            const canFwd  = i < STAGES.length-1 && lead.stage !== "archived";

            // stage-specific CTAs (kept from your first version)
            const stageCtas: Record<StageKey, React.ReactNode> = {
              matched:        <Btn onClick={()=>move(lead.id,+1 as 1)}>Add photos / details</Btn>,
              confirming:     <Btn onClick={()=>move(lead.id,+1 as 1)}>Book a survey</Btn>,
              survey_booked:  <>
                                <Btn onClick={()=>move(lead.id,+1 as 1)}>Get estimate</Btn>
                                <Btn onClick={()=>move(lead.id,+1 as 1)}>Confirm scope</Btn>
                              </>,
              estimate_ready: <Btn onClick={()=>move(lead.id,+1 as 1)}>Approve estimate</Btn>,
              work_scheduled: <Btn onClick={()=>setSelected(lead.id)}>View booking</Btn>,
              archived:       <span className="text-sm text-slate-500">—</span>,
            };

            return (
              <div key={lead.id}
                className={`rounded-xl border p-4 ${selected?.id===lead.id ? "border-emerald-300 ring-1 ring-emerald-200" : "border-slate-200"}`}>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="text-lg font-semibold">{lead.service}</div>
                    <span className="text-sm text-slate-500">Ref {lead.ref}</span>
                    <Chip tone={lead.stage==="archived" ? "slate" : lead.stage==="estimate_ready" ? "amber" : "green"}>
                      <span>{s.emoji}</span>
                      <span>{s.label}</span>
                    </Chip>
                  </div>

                  {/* progress dots */}
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <div className="flex items-center gap-1">
                      {STAGES.slice(0, STAGES.length-1).map((st, idx) => (
                        <span key={st.key} className={`h-2 w-2 rounded-full ${idx <= i-1 ? "bg-emerald-500" : "bg-slate-300"}`}></span>
                      ))}
                    </div>
                    <span>{stagePct(lead.stage)}%</span>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <Btn onClick={()=>window.open("https://wa.me/message","_blank")}><span className="mr-1">💬</span>Chat on WhatsApp</Btn>
                  <Btn onClick={()=>{ setSelected(lead.id); }} >View details</Btn>

                  {/* stage-specific CTAs */}
                  <div className="mx-1 hidden sm:block h-5 w-px bg-slate-200" />
                  {stageCtas[lead.stage]}

                  {/* spacer then archive/delete */}
                  <div className="grow" />
                  {canBack && <Btn onClick={()=>move(lead.id,-1 as -1)} title="Go back one step"><span className="mr-1">↩️</span>Move back</Btn>}
                  {canFwd  && <Btn onClick={()=>move(lead.id,+1 as 1)}  title="Advance one step"><span className="mr-1">↪️</span>Move forward</Btn>}
                  <Btn onClick={()=>archive(lead.id)}>Archive</Btn>
                  <Btn onClick={()=>del(lead.id)} tone="danger">Delete</Btn>
                </div>
              </div>
            );
          })}
        </div>

        {/* right panel */}
        {selected && (
          <aside className="sticky top-6 h-fit space-y-4 rounded-xl border border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-semibold">{selected.service}</div>
                <div className="text-sm text-slate-500">Ref {selected.ref} · {selected.postcode}</div>
              </div>
              <Chip tone={selected.stage==="estimate_ready" ? "amber" : selected.stage==="archived" ? "slate" : "green"}>
                <span>{STAGES[idxOf(selected.stage)].emoji}</span>
                <span>{STAGES[idxOf(selected.stage)].label}</span>
              </Chip>
            </div>

            <div className="flex gap-2">
              <Btn onClick={()=>window.open("https://wa.me/message","_blank")}><span className="mr-1">💬</span>Chat on WhatsApp</Btn>
              <Btn onClick={()=>{ /* keep as dummy */ }}>View details</Btn>
            </div>

            <div className="rounded-xl border border-slate-200 p-4">
              <h3 className="mb-3 text-base font-semibold">What happens next</h3>
              <ul className="space-y-2 text-slate-700">
                <li>💬 <b>Chat to us on WhatsApp</b> — you’ll be routed to a specialist in minutes.</li>
                <li>📍 <b>You’re matched</b> — vetted local builder assigned.</li>
                <li>📅 <b>Book your site survey</b> — pick a time that suits you.</li>
                <li>📄 <b>Get your estimate</b> — we confirm the scope and share your price.</li>
                <li>🛠️ <b>Schedule the work</b> — agree a start date; covered by our guarantee.</li>
              </ul>
              <p className="mt-3 text-xs text-slate-500">Fastest reply during working hours. Typical response: under 10 minutes.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Chip tone="slate">DBS-checked</Chip>
                <Chip tone="slate">£5m Public Liability</Chip>
                <Chip tone="slate">12-month guarantee</Chip>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 p-4">
              <h3 className="mb-3 text-base font-semibold">Why homeowners choose us</h3>
              <ul className="space-y-2 text-slate-700">
                <li>🤖 Instant AI-powered quotes</li>
                <li>🛠️ Vetted local builders you can trust</li>
                <li>🛡️ £5m insurance • 12-month guarantee • DBS-checked teams</li>
              </ul>
              <div className="mt-3 flex flex-wrap gap-2">
                <Chip tone="slate">DBS-checked</Chip>
                <Chip tone="slate">£5m Public Liability</Chip>
                <Chip tone="slate">12-month guarantee</Chip>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
