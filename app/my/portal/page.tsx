"use client";

import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";

/** ========== Types ========== */
type LeadStage =
  | "all"
  | "matched"
  | "confirming_scope"
  | "survey_booked"
  | "estimate_ready"
  | "work_scheduled"
  | "archived";

type Lead = {
  id: string;
  ref: string;
  service: string;
  area: string;
  status: LeadStage;
  progress: number; // 0–100
  rooms?: string;
  sizeSqm?: number;
  budgetLabel?: string;
  propertyAge?: string;
  timeline?: string;
  notes?: string;
  photos?: string[];
};

/** ========== Env (client) ========== */
const WHATSAPP = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "+447000000000").replace(/\D/g, "");
const SALES_EMAIL = process.env.NEXT_PUBLIC_SALES_EMAIL ?? "hello@brixel.uk";

/** ========== UI bits ========== */
function SignOutButton({ className = "" }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/" })}
      className={`rounded-full border px-3 py-1.5 text-sm font-medium hover:bg-gray-50 ${className}`}
    >
      Sign out
    </button>
  );
}

function Pill({ children, tone = "slate" }: { children: React.ReactNode; tone?: "emerald" | "amber" | "blue" | "slate" }) {
  const map: Record<string, string> = {
    emerald: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    amber: "bg-amber-50 text-amber-800 ring-amber-600/20",
    blue: "bg-blue-50 text-blue-700 ring-blue-600/20",
    slate: "bg-slate-100 text-slate-700 ring-slate-600/20",
  };
  return <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ring-1 ${map[tone]}`}>{children}</span>;
}

function ProgressDots({ pct }: { pct: number }) {
  const dots = [0, 20, 40, 60, 80, 100];
  return (
    <div className="flex items-center gap-1">
      {dots.map((d, i) => (
        <span key={i} className={`h-1.5 w-1.5 rounded-full ${pct >= d ? "bg-emerald-600" : "bg-slate-300"}`} />
      ))}
      <span className="ml-2 text-[11px] text-slate-500">{Math.round(pct)}%</span>
    </div>
  );
}

function PrimaryBtn({ children, onClick, className = "" }: { children: React.ReactNode; onClick?: () => void; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 ${className}`}
    >
      {children}
    </button>
  );
}

function SecondaryBtn({ children, onClick, className = "" }: { children: React.ReactNode; onClick?: () => void; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center rounded-2xl border px-4 py-2 text-sm font-medium hover:bg-gray-50 ${className}`}
    >
      {children}
    </button>
  );
}

/** ========== Demo Data (replace with server data later) ========== */
const DEMO: Lead[] = [
  { id: "1", ref: "BK-X5NENKON", service: "Plastering", status: "work_scheduled", progress: 100, area: "Canterbury, CT1", rooms: "Living room + hallway", sizeSqm: 28, budgetLabel: "£1,500–£2,000", propertyAge: "1930s", timeline: "Within 2 weeks", notes: "Some existing cracks. Happy to supply paint.", photos: ["/demo/sea.jpg", "/demo/van.jpg"] },
  { id: "2", ref: "BK-YTORRETQ", service: "Kitchen Renovation", status: "work_scheduled", progress: 100, area: "Whitstable, CT5" },
  { id: "3", ref: "BK-P9K7A1A2", service: "Loft Conversion", status: "survey_booked", progress: 60, area: "Maidstone, ME15" },
  { id: "4", ref: "BK-ZZ31MMQ2", service: "Bathroom Refurbishment", status: "estimate_ready", progress: 80, area: "Bromley, BR1" },
  { id: "5", ref: "BK-AB77DCE3", service: "Electrical", status: "work_scheduled", progress: 100, area: "Dover, CT16" },
];

/** ========== Helpers ========== */
const STAGE_ORDER: Exclude<LeadStage, "all" | "archived">[] = [
  "matched",
  "confirming_scope",
  "survey_booked",
  "estimate_ready",
  "work_scheduled",
];

const STATUS_META: Record<LeadStage, { label: string; emoji: string; tone: "emerald" | "amber" | "blue" | "slate" }> = {
  all: { label: "All", emoji: "📋", tone: "slate" },
  matched: { label: "Matched", emoji: "🤝", tone: "blue" },
  confirming_scope: { label: "Confirming scope", emoji: "📝", tone: "blue" },
  survey_booked: { label: "Survey booked", emoji: "📅", tone: "amber" },
  estimate_ready: { label: "Estimate ready", emoji: "🧮", tone: "amber" },
  work_scheduled: { label: "Work scheduled", emoji: "🛠️", tone: "emerald" },
  archived: { label: "Archived", emoji: "📦", tone: "slate" },
};

const FILTER_TABS: LeadStage[] = ["all", "matched", "confirming_scope", "survey_booked", "estimate_ready", "work_scheduled", "archived"];

/** ========== Details Modal ========== */
type DetailsModalProps = { open: boolean; lead: Lead | null; onClose: () => void; };

function copyText(text: string) {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).catch(() => {});
  }
}

function DetailsModal(props: DetailsModalProps) {
  const { open, onClose, lead } = props;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || !lead) return null;

  const summary = [
    `${lead.service} • ${lead.ref}`,
    `Status: ${STATUS_META[lead.status].emoji} ${STATUS_META[lead.status].label}`,
    lead.rooms ? `Rooms: ${lead.rooms}` : null,
    lead.sizeSqm ? `Size: ${lead.sizeSqm} sqm` : null,
    lead.budgetLabel ? `Budget: ${lead.budgetLabel}` : null,
    lead.propertyAge ? `Property age: ${lead.propertyAge}` : null,
    lead.timeline ? `Timeline: ${lead.timeline}` : null,
    `Area: ${lead.area}`,
    lead.notes ? `Notes: ${lead.notes}` : null,
  ].filter(Boolean).join("\n");

  const mailto = `mailto:${SALES_EMAIL}?subject=${encodeURIComponent(`${lead.service} • ${lead.ref}`)}&body=${encodeURIComponent(summary)}`;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={onClose} role="dialog" aria-modal="true">
      <div className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4">
          <div className="text-lg font-semibold lowercase first-letter:uppercase">
            {lead.service} • {lead.ref}
          </div>
          <button onClick={onClose} className="rounded-full border px-2 py-1 text-sm">✕</button>
        </div>

        <div className="px-5 pb-5">
          <div className="mb-3">
            <Pill tone={STATUS_META[lead.status].tone}>
              <span>{STATUS_META[lead.status].emoji}</span>
              <span>{STATUS_META[lead.status].label}</span>
            </Pill>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><div className="text-slate-500">Reference</div><div className="font-medium">{lead.ref}</div></div>
            <div><div className="text-slate-500">Service</div><div className="font-medium lowercase first-letter:uppercase">{lead.service}</div></div>
            {lead.rooms && <div><div className="text-slate-500">Rooms</div><div className="font-medium">{lead.rooms}</div></div>}
            {lead.sizeSqm != null && <div><div className="text-slate-500">Size (sqm)</div><div className="font-medium">{lead.sizeSqm}</div></div>}
            {lead.budgetLabel && <div><div className="text-slate-500">Budget</div><div className="font-medium">{lead.budgetLabel}</div></div>}
            {lead.timeline && <div><div className="text-slate-500">Timeline</div><div className="font-medium">{lead.timeline}</div></div>}
            {lead.propertyAge && <div><div className="text-slate-500">Property age</div><div className="font-medium">{lead.propertyAge}</div></div>}
            <div><div className="text-slate-500">Area</div><div className="font-medium">{lead.area}</div></div>
          </div>

          {lead.notes && (
            <div className="mt-4">
              <div className="text-slate-500 text-sm">Notes</div>
              <div className="mt-1 rounded-lg border bg-white p-3 text-sm">{lead.notes}</div>
            </div>
          )}

          {lead.photos && lead.photos.length > 0 && (
            <div className="mt-4">
              <div className="text-slate-500 text-sm">Photos</div>
              <div className="mt-2 grid grid-cols-2 gap-3">
                {lead.photos.map((src, i) => (
                  <div key={i} className="overflow-hidden rounded-xl border">
                    <img src={src} alt={`photo-${i + 1}`} className="h-36 w-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t px-5 py-3">
          <PrimaryBtn onClick={() => (window.location.href = `https://wa.me/${WHATSAPP}`)}>Chat on WhatsApp</PrimaryBtn>
          <span className="text-xs text-slate-600">
            Start here — chat to us to get started <span className="font-semibold">ASAP</span>. We don’t cold call. 🙌
          </span>
          <div className="ml-auto flex items-center gap-2">
            <SecondaryBtn onClick={() => copyText(summary)}>Copy summary</SecondaryBtn>
            <SecondaryBtn
              onClick={() => {
                const w = window.open("", "_blank");
                if (!w) return;
                w.document.write(`<pre style="font-family: ui-monospace, SFMono-Regular, Menlo, monospace; white-space: pre-wrap">${summary.replace(/</g, "&lt;")}</pre>`);
                w.document.close();
                w.focus();
                w.print?.();
              }}
            >
              Print / Save PDF
            </SecondaryBtn>
            <Link className="text-sm underline" href={mailto}>Email this</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/** ========== Main Page ========== */
export default function Page() {
  const [tab, setTab] = useState<LeadStage>("all");
  const [q, setQ] = useState("");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<Lead | null>(null);

  useEffect(() => {
    setLeads(DEMO);
  }, []);

  const filtered = useMemo(() => {
    let rows = leads;
    if (tab !== "all") rows = rows.filter((l) => l.status === tab);
    if (q.trim()) {
      const term = q.trim().toLowerCase();
      rows = rows.filter((l) => l.service.toLowerCase().includes(term) || l.ref.toLowerCase().includes(term) || l.area.toLowerCase().includes(term));
    }
    return rows;
  }, [leads, tab, q]);

  const openDetails = (lead: Lead) => {
    setCurrent(lead);
    setOpen(true);
  };

  // --- Stage transitions (client-side demo; wire to API later) ---
  const nextStage = (s: LeadStage): LeadStage => {
    if (s === "archived" || s === "all") return s;
    const idx = STAGE_ORDER.indexOf(s);
    if (idx === -1 || idx === STAGE_ORDER.length - 1) return "work_scheduled";
    return STAGE_ORDER[idx + 1];
    };
  const prevStage = (s: LeadStage): LeadStage => {
    if (s === "archived" || s === "all") return s;
    const idx = STAGE_ORDER.indexOf(s);
    if (idx <= 0) return "matched";
    return STAGE_ORDER[idx - 1];
  };

  const advance = (id: string) =>
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: nextStage(l.status), progress: Math.min(100, Math.max(0, l.progress + 20)) } : l))
    );

  const back = (id: string) =>
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: prevStage(l.status), progress: Math.min(100, Math.max(0, l.progress - 20)) } : l))
    );

  const archive = (id: string) => setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status: "archived" } : l)));
  const del = (id: string) => setLeads((prev) => prev.filter((l) => l.id !== id));

  const sidebarCard = (
    <div className="rounded-2xl border p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="font-semibold">{current?.service ?? "Plastering"}</div>
        <Pill tone="emerald">🛠️ Work scheduled</Pill>
      </div>
      <div className="flex items-center gap-2">
        <PrimaryBtn onClick={() => (window.location.href = `https://wa.me/${WHATSAPP}`)}>Chat on WhatsApp</PrimaryBtn>
        <span className="text-[12px] text-slate-600">Start here — chat to us to get started <span className="font-semibold">ASAP</span>. We don’t cold call. 🙌</span>
      </div>
      <SecondaryBtn className="mt-2" onClick={() => (current ? openDetails(current) : null)}>View details</SecondaryBtn>

      <div className="mt-4 text-sm">
        <div className="font-semibold">What happens next</div>
        <ul className="mt-2 space-y-1 text-slate-700">
          <li>🤝 Matched → 📝 Confirm scope → 📅 Survey → 🧮 Estimate → 🛠️ Schedule</li>
        </ul>
        <div className="mt-2 text-xs text-slate-500">Fastest reply during working hours. Typical response: under 10 minutes.</div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Pill tone="slate">DBS-checked</Pill>
          <Pill tone="slate">£5m Public Liability</Pill>
          <Pill tone="slate">12-month guarantee</Pill>
        </div>
      </div>
    </div>
  );

  const whyCard = (
    <div className="rounded-2xl border p-4">
      <div className="font-semibold">Why homeowners choose us</div>
      <ul className="mt-2 space-y-1 text-sm text-slate-700">
        <li>🤖 Instant AI-powered quotes</li>
        <li>🛠️ Vetted local builders you can trust</li>
        <li>🛡️ £5m insurance • 12-month guarantee • DBS-checked teams</li>
      </ul>
      <div className="mt-3 flex flex-wrap gap-2">
        <Pill tone="slate">DBS-checked</Pill>
        <Pill tone="slate">£5m Public Liability</Pill>
        <Pill tone="slate">12-month guarantee</Pill>
      </div>
    </div>
  );

  const mailto = `mailto:${SALES_EMAIL}?subject=${encodeURIComponent("Book my job")}&body=${encodeURIComponent("Hi team, I'd like to get this started...")}`;

  return (
    <main className="mx-auto max-w-6xl p-6">
      <header className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">My Portal</h1>
        <SignOutButton />
      </header>

      {/* Filters + search */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {FILTER_TABS.map((key) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`rounded-full px-3 py-1.5 text-sm ring-1 ${tab === key ? "bg-emerald-600 text-white ring-emerald-600" : "bg-white text-slate-700 ring-slate-300 hover:bg-gray-50"}`}
            title={STATUS_META[key].label}
          >
            <span className="mr-1">{STATUS_META[key].emoji}</span>
            {STATUS_META[key].label}
          </button>
        ))}
        <div className="relative ml-auto">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by service, ref or postcode"
            className="w-72 rounded-full border px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-emerald-600"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
        {/* Left: list */}
        <div className="space-y-3">
          {filtered.map((lead) => (
            <div key={lead.id} className="rounded-2xl border p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="text-base font-semibold">{lead.service}</div>
                    <span className="text-xs text-slate-500">Ref {lead.ref}</span>
                    <Pill tone={STATUS_META[lead.status].tone}>
                      <span>{STATUS_META[lead.status].emoji}</span>
                      <span>{STATUS_META[lead.status].label}</span>
                    </Pill>
                  </div>
                  <div className="mt-1 text-xs text-slate-500">{lead.area}</div>
                </div>
                <ProgressDots pct={lead.progress} />
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <PrimaryBtn onClick={() => (window.location.href = `https://wa.me/${WHATSAPP}`)}>Chat on WhatsApp</PrimaryBtn>
                <span className="text-[12px] text-slate-600">Start here — chat to us to get started <span className="font-semibold">ASAP</span>. We don’t cold call. 🙌</span>
              </div>

              <div className="mt-2 flex flex-wrap gap-2">
                <SecondaryBtn onClick={() => openDetails(lead)}>View details</SecondaryBtn>
                <SecondaryBtn onClick={() => {/* link to booking page when wired */}}>View booking</SecondaryBtn>
                <SecondaryBtn onClick={() => back(lead.id)}>◀ Back stage</SecondaryBtn>
                <SecondaryBtn onClick={() => advance(lead.id)}>Advance stage ▶</SecondaryBtn>
                {lead.status !== "archived" ? (
                  <SecondaryBtn onClick={() => archive(lead.id)}>Archive</SecondaryBtn>
                ) : null}
                <button
                  type="button"
                  onClick={() => del(lead.id)}
                  className="inline-flex items-center justify-center rounded-2xl border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
                  aria-label="Delete lead"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="rounded-xl border p-8 text-center text-sm text-slate-600">No leads match your filters.</div>
          )}
        </div>

        {/* Right: sticky sidebar */}
        <div className="hidden lg:block">
          <div className="sticky top-6 space-y-4">
            {sidebarCard}
            {whyCard}
            <div className="rounded-2xl border p-3 text-xs text-slate-600">
              Prefer email?{" "}
              <Link className="underline" href={mailto}>
                {SALES_EMAIL}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Details modal */}
      <DetailsModal open={open} onClose={() => setOpen(false)} lead={current} />
    </main>
  );
}
