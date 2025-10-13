"use client";

import { useEffect, useMemo, useState } from "react";
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
const stagePct = (k: StageKey) =>
  Math.round(((idxOf(k)+1) / (STAGES.length-1)) * 100); // archived not counted in dots

/** ----- Demo data (client only) ----- */
type Lead = {
  id: string;
  ref: string;
  service: string;
  postcode: string;
  stage: StageKey;
  // optional fields for the details modal
  rooms?: string;
  budget?: string;
  size?: number;
  timeline?: string;
  age?: string;
  notes?: string;
  photos?: string[];
}
const seed: Lead[] = [
  { id: "1", ref: "BK-X5NENKON", service: "Plastering",            postcode: "CT1",  stage: "archived",
    rooms:"Living room + hallway", budget:"£1,500–£2,000", size:28, timeline:"Within 2 weeks", age:"1930s",
    notes:"Some existing cracks. Happy to supply paint.", photos:["/demo/photo1.jpg","/demo/photo2.jpg"] },
  { id: "2", ref: "BK-YTORRETQ", service: "Kitchen Renovation",     postcode: "CT2",  stage: "estimate_ready" },
  { id: "3", ref: "BK-P9K7AA12", service: "Loft Conversion",        postcode: "ME7",  stage: "survey_booked" },
  { id: "4", ref: "BK-ZZ31MMQ2", service: "Bathroom Refurbishment", postcode: "TN24", stage: "estimate_ready" },
  { id: "5", ref: "BK-AB77CDE3", service: "Electrical",             postcode: "DA1",  stage: "work_scheduled" },
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
    <div className="whatsapp-cta-wrap flex flex-col items-start gap-1">
    <button type="button" title={title} onClick={onClick}
      className={`rounded-md border px-3 py-2 text-sm font-medium transition ${cls}`}>
      {children}
    </button>
  );
};
/** Primary green CTA (for WhatsApp) */
const PrimaryBtn = ({ children, onClick, title }: {children:React.ReactNode; onClick?:()=>void; title?:string}) => (
  <button
    type="button"
    title={title}
    onClick={onClick}
    className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
  >
    {children}
  </button>
);

/** ----- Modal for details ----- */
function DetailsModal({open, onClose, lead}:{open:boolean; onClose:()=>void; lead: Lead|null}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || !lead) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-start justify-center bg-black/40 p-4 sm:p-8" onClick={onClose}>
      <div
        className="mt-8 w-full max-w-4xl rounded-xl bg-white shadow-2xl"
        onClick={(e)=>e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="text-sm font-semibold lowercase">
            <span className="capitalize">{lead.service}</span> • {lead.ref}
          </div>
          <button onClick={onClose} className="rounded p-1 text-slate-500 hover:bg-slate-100">✕</button>
        </div>

        <div className="grid grid-cols-1 gap-4 px-4 py-4 sm:grid-cols-2">
          <div className="text-sm">
            <div className="text-slate-500">Reference</div>
            <div className="font-medium">{lead.ref}</div>
          </div>
          <div className="text-sm">
            <div className="text-slate-500">Service</div>
            <div className="font-medium lowercase capitalize">{lead.service}</div>
          </div>
          <div className="text-sm">
            <div className="text-slate-500">Rooms</div>
            <div className="font-medium">{lead.rooms ?? "—"}</div>
          </div>
          <div className="text-sm">
            <div className="text-slate-500">Size (sqm)</div>
            <div className="font-medium">{lead.size ?? "—"}</div>
          </div>
          <div className="text-sm">
            <div className="text-slate-500">Budget</div>
            <div className="font-medium">{lead.budget ?? "—"}</div>
          </div>
          <div className="text-sm">
            <div className="text-slate-500">Timeline</div>
            <div className="font-medium">{lead.timeline ?? "—"}</div>
          </div>
          <div className="text-sm">
            <div className="text-slate-500">Property age</div>
            <div className="font-medium">{lead.age ?? "—"}</div>
          </div>
          <div className="text-sm">
            <div className="text-slate-500">Area</div>
            <div className="font-medium">{lead.postcode ? `Canterbury, ${lead.postcode}` : "—"}</div>
          </div>
        </div>

        <div className="px-4">
          <div className="rounded-lg border p-3 text-sm">
            <div className="text-slate-500">Notes</div>
            <div className="mt-1">{lead.notes ?? "—"}</div>
          </div>
        </div>

        {lead.photos?.length ? (
          <div className="mt-4 grid grid-cols-1 gap-3 px-4 sm:grid-cols-2">
            {lead.photos.map((src, i)=>(
              <div key={i} className="h-40 w-full overflow-hidden rounded-lg border bg-slate-50">
                {/* demo images; replace with real src when wired */}
                <img alt="" src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=60&auto=format&fit=crop"
                     className="h-full w-full object-cover"/>
              </div>
            ))}
          </div>
        ) : null}

        <div className="mt-4 flex flex-wrap items-center gap-2 border-t px-4 py-3">
          <PrimaryBtn onClick={()=>window.open("https://wa.me/message","_blank")} title="Start on WhatsApp">
            <span>💬</span><span>Chat on WhatsApp</span>
          </PrimaryBtn>
          <Btn>Copy summary</Btn>
          <Btn>Print / Save PDF</Btn>
        </div>
      </div>
    </div>
  );
}

/** ----- Page ----- */
export default function PortalPage() {
  const [leads, setLeads] = useState<Lead[]>(seed);
  const [selectedId, setSelected] = useState<string>(leads[0]?.id ?? "");
  const [tab, setTab] = useState<StageKey | "all">("all");
  const [modalLead, setModalLead] = useState<Lead|null>(null);

  const selected = leads.find(l => l.id === selectedId) ?? leads[0];

  const filtered = useMemo(() => {
    return tab === "all" ? leads : leads.filter(l => l.stage === tab);
  }, [leads, tab]);

  const move = (id: string, dir: -1 | 1) => {
    setLeads(prev => prev.map(l => {
      if (l.id !== id) return l;
      const i = idxOf(l.stage);
      let j = Math.min(STAGES.length-1, Math.max(0, i + dir));
      if (l.stage === "archived" && dir === 1) j = i; // no forward from archived
      return { ...l, stage: STAGES[j].key };
    }));
  };
  const archive = (id: string) => setLeads(prev => prev.map(l => l.id===id ? ({...l, stage: "archived"}) : l));
  const del = (id: string) => setLeads(prev => prev.filter(l => l.id !== id));

  return (
    <>
      {/* modal */}
      <DetailsModal open={!!modalLead} onClose={()=>setModalLead(null)} lead={modalLead} />

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
    <div data-whatsapp-caption className="mt-1 inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-1 text-[13px] font-semibold text-emerald-800"> <span>👉</span> <span>Start here — chat to us on WhatsApp to progress your booking.</span> <span className="text-slate-500"> · </span> <a className="underline underline-offset-2" href="mailto:support@brixel.uk?subject=Brixel%20booking%20support&body=Hi%20Brixel%2C%0A%0AI%E2%80%99d%20like%20to%20progress%20my%20booking.%0A%0AReference%3A%20(add%20BK-xxxxx%20if%20known)%0AService%3A%20(e.g.%20Plastering)%0A%0AName%3A%0APhone%3A%0APostcode%3A%0ANotes%3A%0A%0AThanks!">Email us instead</a>. </div>
  </div>

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
                {label}
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

              // stage-specific CTAs (preserved)
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
                    {/* Primary green CTA */}
                    <PrimaryBtn onClick={()=>window.open("https://wa.me/message","_blank")} title="Start on WhatsApp">
                      <span>💬</span><span>Chat on WhatsApp</span>
                    </PrimaryBtn>

                    {/* details (opens modal now) */}
                    <Btn onClick={()=>{ setSelected(lead.id); setModalLead(lead); }}>View details</Btn>

                    {/* stage-specific CTAs */}
                    <div className="mx-1 hidden sm:block h-5 w-px bg-slate-200" />
                    {stageCtas[lead.stage]}

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

          {/* right panel kept (secondary) */}
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
                <PrimaryBtn onClick={()=>window.open("https://wa.me/message","_blank")} title="Start on WhatsApp">
                  <span>💬</span><span>Chat on WhatsApp</span>
                </PrimaryBtn>
                <Btn onClick={()=>setModalLead(selected)}>View details</Btn>
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
    </>
  );
}
