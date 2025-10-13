"use client";
import React from "react";
import SignOutButton from '../../../components/SignOutButton';

/**
 * Demo My-Portal page with Details modal
 * - Stages, filters, search, WhatsApp CTA, quick survey slots, archive/delete
 * - NEW: "View details" modal with all quotation answers + actions (copy, print, WhatsApp)
 * - All in-memory; safe at /dev/my-portal-demo
 */

type StageKey = "MATCHED" | "SCOPE" | "SURVEY" | "ESTIMATE" | "SCHEDULED";
type FilterKey = "ALL" | StageKey | "ARCHIVED";

const STAGES: { key: StageKey; label: string; icon: string }[] = [
  { key: "MATCHED",   label: "Matched",           icon: "🧭" },
  { key: "SCOPE",     label: "Confirming scope",  icon: "📝" },
  { key: "SURVEY",    label: "Survey booked",     icon: "📅" },
  { key: "ESTIMATE",  label: "Estimate ready",    icon: "📄" },
  { key: "SCHEDULED", label: "Work scheduled",    icon: "🛠️" },
];

const STAGE_INDEX: Record<StageKey, number> = {
  MATCHED: 0, SCOPE: 1, SURVEY: 2, ESTIMATE: 3, SCHEDULED: 4,
};

type QuoteDetails = {
  rooms?: string;
  sizeSqm?: number;
  budget?: string;
  timeline?: string;       // e.g. ASAP / 1–3 months
  propertyAge?: string;
  address?: string;
  notes?: string;
  photos?: string[];       // URLs (we use normal <img>, not next/image)
};

type Request = {
  id: string;
  ref: string;
  service: string;
  createdAt: string;
  urgency?: "FLEXIBLE" | "SOON" | "URGENT";
  stage: StageKey;
  archived?: boolean;
  deletedAt?: number | null;
  postcode?: string;
  details?: QuoteDetails;
};

const nowISO = () => new Date().toISOString();

const INITIAL_REQUESTS: Request[] = [
  {
    id: "r1", ref: "BK-X5NENKON", service: "plastering",
    createdAt: nowISO(), stage: "MATCHED", urgency: "FLEXIBLE", postcode: "CT1",
    details: {
      rooms: "Living room + hallway",
      sizeSqm: 28,
      budget: "£1,500–£2,000",
      timeline: "Within 2 weeks",
      propertyAge: "1930s",
      address: "Canterbury, CT1",
      notes: "Some existing cracks. Happy to supply paint.",
      photos: [
        "https://picsum.photos/seed/roomA/420/260",
        "https://picsum.photos/seed/roomB/420/260",
      ],
    }
  },
  {
    id: "r2", ref: "BK-YT0RRETQ", service: "kitchen renovation",
    createdAt: nowISO(), stage: "SCOPE", urgency: "SOON", postcode: "ME7",
    details: {
      rooms: "Kitchen (12 sqm)",
      sizeSqm: 12,
      budget: "£12,000–£18,000",
      timeline: "1–3 months",
      propertyAge: "1980s",
      address: "Gillingham, ME7",
      notes: "Keep current layout. New units + tiling. Mid-range finish.",
      photos: ["https://picsum.photos/seed/kitchen1/420/260"],
    }
  },
  {
    id: "r3", ref: "BK-P9K7AA12", service: "loft conversion",
    createdAt: nowISO(), stage: "SURVEY", urgency: "FLEXIBLE", postcode: "TN23",
    details: {
      rooms: "Loft to bedroom + ensuite",
      sizeSqm: 22,
      budget: "£35,000–£50,000",
      timeline: "3–6 months",
      propertyAge: "2000s",
      address: "Ashford, TN23",
      notes: "Dormer likely needed. Planning advice please.",
      photos: ["https://picsum.photos/seed/loft1/420/260","https://picsum.photos/seed/loft2/420/260"],
    }
  },
  {
    id: "r4", ref: "BK-ZZ31MMQ2", service: "bathroom refurbishment",
    createdAt: nowISO(), stage: "ESTIMATE", urgency: "SOON", postcode: "DA1",
    details: {
      rooms: "Family bathroom",
      sizeSqm: 6,
      budget: "£5,000–£8,000",
      timeline: "Next month",
      propertyAge: "Victorian",
      address: "Dartford, DA1",
      notes: "Walk-in shower preferred. Keep bath if space allows.",
      photos: ["https://picsum.photos/seed/bath/420/260"],
    }
  },
  {
    id: "r5", ref: "BK-AB77CDE3", service: "electrical",
    createdAt: nowISO(), stage: "SCHEDULED", urgency: "URGENT", postcode: "BR8",
    details: {
      rooms: "Whole house safety check",
      sizeSqm: 95,
      budget: "£300–£600",
      timeline: "ASAP",
      propertyAge: "2010s",
      address: "Swanley, BR8",
      notes: "Add two outdoor sockets.",
      photos: [],
    }
  },
];

const WHATSAPP_NUMBER_E164 = "447000000000"; // TODO: replace with your real business number (no +)

function classNames(...xs: (string | false | undefined)[]) {
  return xs.filter(Boolean).join(" ");
}

function detailsSummary(r: Request) {
  const d = r.details ?? {};
  return [
    `Ref: ${r.ref}`,
    `Service: ${r.service}`,
    d.rooms ? `Rooms: ${d.rooms}` : "",
    typeof d.sizeSqm === "number" ? `Size: ${d.sizeSqm} sqm` : "",
    d.budget ? `Budget: ${d.budget}` : "",
    d.timeline ? `Timeline: ${d.timeline}` : "",
    d.propertyAge ? `Property age: ${d.propertyAge}` : "",
    d.address ? `Area: ${d.address}` : (r.postcode ? `Area: ${r.postcode}` : ""),
    d.notes ? `Notes: ${d.notes}` : "",
  ].filter(Boolean).join("\n");
}

function makeWaMessage(req: Request) {
  return `Hi Brixel — my ref is ${req.ref} (${req.service}).
${detailsSummary(req)}

Can we book my site survey?`;
}
function waLink(req: Request) {
  return `https://wa.me/${WHATSAPP_NUMBER_E164}?text=${encodeURIComponent(makeWaMessage(req))}`;
}

function ProgressDots({ stage }: { stage: StageKey }) {
  const idx = STAGE_INDEX[stage];
  return (
  <> <>
    <>
    <div className="flex items-center gap-1" aria-label={`Progress: ${((idx+1)/STAGES.length*100)|0}%`}>
      {STAGES.map((s, i) => (
        <span
          key={s.key}
          className={classNames(
            "inline-block h-2.5 w-2.5 rounded-full",
            i <= idx ? "bg-emerald-500" : "bg-gray-300"
          )}
          title={s.label}
        />
      ))}
      <span className="ml-2 text-xs text-gray-500">{Math.round(((idx+1)/STAGES.length)*100)}%</span>
    </div>
  
  </>
  </>
  </>);
}

type Toast = { id: string; message: string; action?: { label: string; onClick: () => void } };

function useToasts() {
  const [toasts, setToasts] = React.useState<Toast[]>([]);
  function push(message: string, action?: Toast["action"]) {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, message, action }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 6000);
  }
  function dismiss(id: string) {
    setToasts((t) => t.filter((x) => x.id !== id));
  }
  return { toasts, push, dismiss };
}

function QuickSlots({ onPick }: { onPick: (iso: string) => void }) {
  const base = new Date();
  const choices = [0, 1, 2].map((offsetDays, i) => {
    const d = new Date(base);
    d.setDate(base.getDate() + offsetDays);
    const hours = [10, 14, 16][i % 3];
    d.setHours(hours, 0, 0, 0);
    return d.toISOString();
  });
  return (
    <div className="flex flex-wrap gap-2">
      {choices.map((iso) => (
        <button
          key={iso}
          className="px-3 py-1.5 rounded-full border border-gray-300 text-sm hover:border-emerald-500"
          onClick={() => onPick(iso)}
        >
          {new Date(iso).toLocaleString(undefined, { weekday: "short", hour: "numeric", minute: "2-digit", month: "short", day: "numeric" })}
        </button>
      ))}
    </div>
  );
}

function BadgeRow() {
  const items = ["DBS-checked", "£5m Public Liability", "12-month guarantee"];
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {items.map((x) => (
        <span key={x} className="px-2.5 py-1 rounded-full text-xs border border-gray-300 bg-white">{x}</span>
      ))}
    </div>
  );
}

function NextSteps() {
  return (
    <div className="rounded-xl border border-gray-200 p-4 bg-white">
      <h3 className="font-semibold mb-2">What happens next</h3>
      <ul className="space-y-2 text-sm">
        <li>💬 <b>Chat to us on WhatsApp</b> — you’ll be routed to a specialist in minutes.</li>
        <li>📍 <b>You’re matched</b> — vetted local builder assigned.</li>
        <li>🗓 <b>Book your site survey</b> — pick a time that suits you.</li>
        <li>📄 <b>Get your estimate</b> — we confirm the scope and share your price.</li>
        <li>🛠 <b>Schedule the work</b> — agree a start date; covered by our guarantee.</li>
      </ul>
      <p className="text-xs text-gray-500 mt-3">Fastest reply during working hours. Typical response: under 10 minutes.</p>
      <BadgeRow />
    </div>
  );
}

function StageChip({ stage }: { stage: StageKey }) {
  const meta = STAGES[STAGE_INDEX[stage]];
  const color =
    stage === "SCHEDULED" ? "bg-emerald-50 text-emerald-700 ring-emerald-200" :
    stage === "ESTIMATE"  ? "bg-amber-50 text-amber-700 ring-amber-200"  :
    "bg-slate-50 text-slate-700 ring-slate-200";
  return (
    <span className={classNames("inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs ring-1", color)}>
      <span>{meta.icon}</span>{meta.label}
    </span>
  );
}

/** Simple, dependency-free modal */
function Modal({
  open, title, onClose, children, footer
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute left-1/2 top-10 -translate-x-1/2 w-[min(900px,92vw)]">
        <div className="rounded-xl bg-white shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b">
            <h3 className="font-semibold">{title}</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
          </div>
          <div className="max-h-[70vh] overflow-auto p-5">
            {children}
          </div>
          {footer && <div className="px-5 py-3 border-t bg-gray-50">{footer}</div>}
        </div>
      </div>
    </div>
  );
}

export default function MyPortalDemo() {
  const [requests, setRequests] = React.useState<Request[]>(INITIAL_REQUESTS);
  const [selectedId, setSelectedId] = React.useState<string | null>(requests[0]?.id ?? null);
  const [filter, setFilter] = React.useState<FilterKey>("ALL");
  const [q, setQ] = React.useState("");
  const [detailsOpen, setDetailsOpen] = React.useState(false);
  const { toasts, push, dismiss } = useToasts();

  const selected = requests.find((r) => r.id === selectedId) ?? requests[0];

  function applyStage(id: string, stage: StageKey) {
    setRequests((xs) => xs.map((r) => (r.id === id ? { ...r, stage } : r)));
  }
  function archive(id: string) {
    setRequests((xs) => xs.map((r) => (r.id === id ? { ...r, archived: true } : r)));
  }
  function unarchive(id: string) {
    setRequests((xs) => xs.map((r) => (r.id === id ? { ...r, archived: false } : r)));
  }
  function del(id: string) {
    setRequests((xs) => xs.map((r) => (r.id === id ? { ...r, deletedAt: Date.now() } : r)));
    push("Request deleted", { label: "Undo", onClick: () => restore(id) });
  }
  function restore(id: string) {
    setRequests((xs) => xs.map((r) => (r.id === id ? { ...r, deletedAt: null, archived: false } : r)));
  }

  const visible = requests
    .filter((r) => !r.deletedAt)
    .filter((r) => filter === "ALL" ? true : filter === "ARCHIVED" ? !!r.archived : (!r.archived && r.stage === filter))
    .filter((r) => {
      if (!q.trim()) return true;
      const hay = (r.ref + " " + r.service + " " + (r.postcode ?? "")).toLowerCase();
      return hay.includes(q.trim().toLowerCase());
    });

  function nextRecommendedAction(r: Request): { label: string; onClick: () => void } {
    switch (r.stage) {
      case "MATCHED":   return { label: "Add photos / details", onClick: () => applyStage(r.id, "SCOPE") };
      case "SCOPE":     return { label: "Book a survey",         onClick: () => applyStage(r.id, "SURVEY") };
      case "SURVEY":    return { label: "Get estimate",          onClick: () => applyStage(r.id, "ESTIMATE") };
      case "ESTIMATE":  return { label: "Approve estimate",      onClick: () => applyStage(r.id, "SCHEDULED") };
      case "SCHEDULED": return { label: "View booking",          onClick: () => {} };
    }
  }

  function copySummary(r: Request) {
    const text = detailsSummary(r);
    navigator.clipboard?.writeText(text).then(
      () => push("Copied details to clipboard"),
      () => push("Could not copy (browser blocked)")
    );
  }

  function printDetails(r: Request) {
    const html = `
      <html>
        <head>
          <title>${r.ref} — ${r.service}</title>
          <meta charset="utf-8"/>
          <style>
            body { font: 14px system-ui, -apple-system, Segoe UI, Roboto, sans-serif; padding: 24px; }
            h1 { font-size: 20px; margin: 0 0 8px; }
            .k { color:#555; width:160px; }
            table { border-collapse: collapse; }
            td { padding: 6px 10px; vertical-align: top; }
            .grid { display:grid; grid-template-columns: repeat(2, minmax(200px, 1fr)); gap:12px; margin-top: 8px;}
            img { width:100%; height:auto; border-radius:8px; }
          </style>
        </head>
        <body>
          <h1>${r.service} — ${r.ref}</h1>
          <table>
            <tr><td class="k">Rooms</td><td>${r.details?.rooms ?? "—"}</td></tr>
            <tr><td class="k">Size (sqm)</td><td>${typeof r.details?.sizeSqm === "number" ? r.details?.sizeSqm : "—"}</td></tr>
            <tr><td class="k">Budget</td><td>${r.details?.budget ?? "—"}</td></tr>
            <tr><td class="k">Timeline</td><td>${r.details?.timeline ?? "—"}</td></tr>
            <tr><td class="k">Property age</td><td>${r.details?.propertyAge ?? "—"}</td></tr>
            <tr><td class="k">Area</td><td>${r.details?.address ?? r.postcode ?? "—"}</td></tr>
            <tr><td class="k">Notes</td><td>${r.details?.notes ?? "—"}</td></tr>
          </table>
          ${r.details?.photos?.length ? `<div class="grid">${
            r.details.photos.map(src => `<img src="${src}"/>`).join("")
          }</div>` : ""}
          <script>window.print();</script>
        </body>
      </html>`;
    const w = window.open("", "_blank");
    if (w) { w.document.write(html); w.document.close(); }
  }

  const DetailsBody = ({ r }: { r: Request }) => {
    const d = r.details ?? {};
    return (
      <div id="print-area">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-3">
          <Row k="Reference" v={r.ref}/>
          <Row k="Service" v={r.service}/>
          <Row k="Rooms" v={d.rooms ?? "—"}/>
          <Row k="Size (sqm)" v={typeof d.sizeSqm === "number" ? String(d.sizeSqm) : "—"}/>
          <Row k="Budget" v={d.budget ?? "—"}/>
          <Row k="Timeline" v={d.timeline ?? "—"}/>
          <Row k="Property age" v={d.propertyAge ?? "—"}/>
          <Row k="Area" v={d.address ?? r.postcode ?? "—"}/>
        </div>

        <div className="mt-4">
          <div className="text-xs font-medium text-gray-500 mb-1">Notes</div>
          <div className="rounded-lg border p-3 text-sm bg-gray-50 min-h-[56px]">
            {d.notes ?? "—"}
          </div>
        </div>

        {d.photos && d.photos.length > 0 && (
          <div className="mt-4">
            <div className="text-xs font-medium text-gray-500 mb-2">Photos</div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {d.photos.map((src, i) => (
                <img key={i} src={src} alt={`photo ${i+1}`} className="rounded-lg border" />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex items-center justify-between gap-3">
  <h1 className="text-2xl font-semibold">My Portal</h1>
  <SignOutButton />
</div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: list & controls */}
        <div className="lg:col-span-2">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {(["ALL", ...STAGES.map(s=>s.key), "ARCHIVED"] as FilterKey[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={classNames(
                  "px-3 py-1.5 rounded-full text-sm border",
                  filter === f ? "bg-emerald-600 text-white border-emerald-600" : "border-gray-300 hover:border-emerald-500"
                )}
              >
                {f === "ALL" ? "All" : f === "ARCHIVED" ? "Archived" : STAGES[STAGE_INDEX[f]].label}
              </button>
            ))}
            <div className="ml-auto">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by service, ref or postcode"
                className="px-3 py-2 rounded-md border border-gray-300 text-sm w-72"
              />
            </div>
          </div>

          <div className="divide-y rounded-xl border overflow-hidden bg-white">
            {visible.map((r) => (
              <div key={r.id} className="p-4 hover:bg-slate-50">
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setSelectedId(r.id)}
                    className={classNames(
                      "font-medium capitalize",
                      selected?.id === r.id ? "text-emerald-700" : "text-gray-900"
                    )}
                    title="Open details"
                  >
                    {r.service}
                  </button>
                  <span className="text-xs text-gray-500">Ref {r.ref}</span>
                  <StageChip stage={r.stage} />
                  <div className="ml-auto"><ProgressDots stage={r.stage} /></div>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <a
                    href={waLink(r)}
                    target="_blank"
                    className="px-3 py-1.5 rounded-md bg-emerald-600 text-white text-sm hover:bg-emerald-700"
                  >
                    Chat on WhatsApp
                  </a>

                  <button
                    onClick={() => { setSelectedId(r.id); setDetailsOpen(true); }}
                    className="px-3 py-1.5 rounded-md border border-gray-300 text-sm hover:border-emerald-500"
                  >
                    View details
                  </button>

                  <button
                    onClick={nextRecommendedAction(r).onClick}
                    className="px-3 py-1.5 rounded-md border border-gray-300 text-sm hover:border-emerald-500"
                  >
                    {nextRecommendedAction(r).label}
                  </button>

                  {r.stage === "SCOPE" && (
                    <button
                      onClick={() => applyStage(r.id, "SURVEY")}
                      className="px-3 py-1.5 rounded-md border border-gray-300 text-sm hover:border-emerald-500"
                    >
                      Book survey
                    </button>
                  )}
                  {r.stage === "SURVEY" && (
                    <button
                      onClick={() => applyStage(r.id, "ESTIMATE")}
                      className="px-3 py-1.5 rounded-md border border-gray-300 text-sm hover:border-emerald-500"
                    >
                      Confirm scope
                    </button>
                  )}
                  {r.stage === "ESTIMATE" && (
                    <button
                      onClick={() => applyStage(r.id, "SCHEDULED")}
                      className="px-3 py-1.5 rounded-md border border-gray-300 text-sm hover:border-emerald-500"
                    >
                      Approve estimate
                    </button>
                  )}
                  {!r.archived ? (
                    <button
                      onClick={() => archive(r.id)}
                      className="px-3 py-1.5 rounded-md text-sm border border-gray-300 hover:border-emerald-500"
                    >
                      Archive
                    </button>
                  ) : (
                    <button
                      onClick={() => unarchive(r.id)}
                      className="px-3 py-1.5 rounded-md text-sm border border-gray-300 hover:border-emerald-500"
                    >
                      Restore
                    </button>
                  )}
                  <button
                    onClick={() => del(r.id)}
                    className="px-3 py-1.5 rounded-md text-sm border border-red-300 text-red-700 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {visible.length === 0 && (
              <div className="p-10 text-center text-gray-500 text-sm">
                No requests match your filters.
              </div>
            )}
          </div>
        </div>

        {/* Right: details / next step */}
        <div className="space-y-4">
          {selected ? (
            <div className="rounded-xl border border-gray-200 p-4 bg-white">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="text-lg font-semibold capitalize">{selected.service}</h2>
                  <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                    <span>Ref {selected.ref}</span>
                    <span>•</span>
                    <span>{selected.postcode ?? "—"}</span>
                  </div>
                </div>
                <StageChip stage={selected.stage} />
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <a
                  href={waLink(selected)}
                  target="_blank"
                  className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-emerald-600 text-white text-sm hover:bg-emerald-700"
                >
                  💬 Chat on WhatsApp
                </a>
                <button
                  onClick={() => setDetailsOpen(true)}
                  className="px-3 py-2 rounded-md border border-gray-300 text-sm hover:border-emerald-500"
                >
                  View details
                </button>
              </div>

              {selected.stage === "SCOPE" && (
                <div className="mt-4">
                  <p className="mb-2 text-sm text-gray-600">Pick a quick survey slot:</p>
                  <QuickSlots onPick={(iso) => {
                    applyStage(selected.id, "SURVEY");
                    push(`Survey booked for ${new Date(iso).toLocaleString()}`);
                  }} />
                </div>
              )}

              <div className="mt-6">
                <NextSteps />
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-gray-200 p-6 bg-white text-sm text-gray-600">
              Select a request to view details.
            </div>
          )}

          <div className="rounded-xl border border-gray-200 p-4 bg-white">
            <h3 className="font-semibold mb-2">Why homeowners choose us</h3>
            <ul className="space-y-2 text-sm">
              <li>🤖 Instant AI-powered quotes</li>
              <li>🛠️ Vetted local builders you can trust</li>
              <li>🛡️ £5m insurance • 12-month guarantee • DBS-checked teams</li>
            </ul>
            <BadgeRow />
          </div>
        </div>
      </div>

      {/* Details modal */}
      <Modal
        open={!!selected && detailsOpen}
        onClose={() => setDetailsOpen(false)}
        title={selected ? `${selected.service} • ${selected.ref}` : "Details"}
        footer={selected && (
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={waLink(selected)}
              target="_blank"
              className="px-3 py-2 rounded-md bg-emerald-600 text-white text-sm hover:bg-emerald-700"
            >
              Chat on WhatsApp
            </a>
            <button
              onClick={() => copySummary(selected)}
              className="px-3 py-2 rounded-md border border-gray-300 text-sm hover:border-emerald-500"
            >
              Copy summary
            </button>
            <button
              onClick={() => printDetails(selected)}
              className="px-3 py-2 rounded-md border border-gray-300 text-sm hover:border-emerald-500"
            >
              Print / Save PDF
            </button>
          </div>
        )}
      >
        {selected && <DetailsBody r={selected} />}
      </Modal>

      {/* Toasts */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 flex flex-col gap-2 z-50">
        {toasts.map((t) => (
          <div key={t.id} className="flex items-center gap-3 px-4 py-2 rounded-lg shadow-md bg-gray-900 text-white text-sm">
            <span>{t.message}</span>
            {t.action && (
              <button
                className="ml-2 px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-700"
                onClick={() => { t.action!.onClick(); dismiss(t.id); }}
              >
                {t.action.label}
              </button>
            )}
            <button className="ml-1 opacity-70 hover:opacity-100" onClick={() => dismiss(t.id)}>✕</button>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Small helper row for the details grid */
function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[150px,1fr] gap-3 text-sm">
      <div className="text-gray-500">{k}</div>
      <div className="text-gray-900">{v}</div>
    </div>
  );
}
