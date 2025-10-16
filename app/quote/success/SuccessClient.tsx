// app/quote/success/SuccessClient.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import confetti from "canvas-confetti";

/* ---------- tiny ui helpers ---------- */
function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 text-xs font-medium">
      {children}
    </span>
  );
}
function CopyChip({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          confetti({ particleCount: 50, spread: 70, origin: { y: 0.3 }, startVelocity: 35, scalar: 0.8 });
          setTimeout(() => setCopied(false), 1400);
        } catch {}
      }}
      className="text-xs rounded-full border border-slate-300 px-3 py-1 hover:bg-slate-50 transition"
      aria-label="Copy reference"
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
function Card({ children }: { children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 shadow-sm">
      {children}
    </section>
  );
}

/* ---------- link + copy helpers ---------- */
function normalizeWhatsAppNumber(raw?: string | null): string | null {
  if (!raw) return null;
  const digits = raw.replace(/\D/g, "");
  if (!digits) return null;
  if (digits.startsWith("0")) return `44${digits.slice(1)}`; // UK 0xxxx -> 44xxxx
  return digits;
}
function buildWhatsAppLink(opts: { phone: string | null; ref: string; service?: string; postcode?: string; notes?: string }) {
  const phone = normalizeWhatsAppNumber(opts.phone);
  const base = phone ? `https://wa.me/${phone}` : `https://wa.me/`;
  const msg = [
    `Hi Brixel — Ref ${opts.ref}. I’ve just submitted a job request.`,
    opts.service ? `Service: ${opts.service}` : null,
    opts.postcode ? `Postcode: ${opts.postcode}` : null,
    opts.notes ? `Notes: ${opts.notes.slice(0, 120)}` : null,
    `I’ll send photos now. Thanks!`,
  ]
    .filter(Boolean)
    .join("\n");
  return `${base}?text=${encodeURIComponent(msg)}`;
}
function businessHoursCopy(now: Date) {
  const h = now.getHours();
  const isOpen = h >= 8 && h < 19;
  return isOpen
    ? { headline: "We only use WhatsApp — message us to proceed.", sub: "We reply in under 2 hours (8am–7pm)." }
    : { headline: "Message us on WhatsApp now.", sub: "We’ll reply first thing tomorrow. No cold calls, ever." };
}

/* ---------- page ---------- */
export default function SuccessClient() {
  const params = useSearchParams();

  // reference handling (becomes real when leadId provided)
  const [ref, setRef] = useState<string>(params.get("ref") || params.get("reference") || params.get("r") || "BK-XXXX-XXXX");
  const leadId = params.get("leadId") || params.get("id") || undefined;

  useEffect(() => {
    confetti({ particleCount: 140, spread: 70, startVelocity: 30, ticks: 180, origin: { y: 0.25 }, scalar: 0.9 });
    const t = setTimeout(() => {
      confetti({ particleCount: 80, spread: 60, startVelocity: 25, origin: { y: 0.2 }, scalar: 0.8, drift: 0.4 });
    }, 600);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (leadId && (!ref || ref.includes("XXXX"))) {
      fetch("/api/lead/reference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId }),
      })
        .then((r) => r.json())
        .then((j) => {
          if (j?.reference) setRef(j.reference as string);
        })
        .catch(() => {});
    }
  }, [leadId]); // eslint-disable-line react-hooks/exhaustive-deps

  const service = params.get("service") || undefined;
  const postcode = params.get("postcode") || params.get("pc") || undefined;
  const notes = params.get("details") || params.get("notes") || undefined;
  const urgency = (params.get("urgency") || "").toUpperCase();
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";

  const waHref = buildWhatsAppLink({ phone: whatsapp, ref, service, postcode, notes });
  const copy = useMemo(() => businessHoursCopy(new Date()), []);
  const urgent = urgency === "URGENT";

  return (
    <main className="w-full mx-auto px-4 md:px-6 py-8 md:py-10 max-w-[1200px]">
      {/* HERO: light, matches top-of-page style; full width container */}
      <Card>
        <div className="flex items-start gap-3 md:gap-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200">✓</div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Thanks — we’ve got your request ✅</h1>
              <Chip>no cold calls</Chip>
            </div>
            <p className="mt-1 text-slate-700">{copy.headline}</p>
            <p className="text-sm text-slate-500">{copy.sub}</p>

            <div className="mt-3 flex items-center gap-2 text-sm">
              <span className="text-slate-600">Reference:</span>
              <span className="font-mono font-semibold text-slate-900">{ref}</span>
              <CopyChip text={ref} />
            </div>

            {/* WhatsApp only */}
            <div className="mt-5">
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl bg-emerald-600 hover:bg-emerald-500 transition px-5 py-3 font-semibold text-white shadow-sm"
                data-kpi="cta-whatsapp"
              >
                {urgent ? "URGENT — Message us on WhatsApp" : "Send photos & details on WhatsApp"}
              </a>
            </div>

            <ul className="mt-3 grid gap-1.5 text-xs text-slate-600 sm:grid-cols-3">
              <li>Reply in under 2 hours</li>
              <li>Share photos & measurements easily</li>
              <li>Keep everything in one chat</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Timeline – light cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Card>
          <div className="flex items-center gap-3">
            <span className="text-emerald-700">🕑</span>
            <div className="font-semibold text-slate-900">We assign a specialist</div>
          </div>
          <p className="mt-1.5 text-sm text-slate-600">Usually within a few hours (always &lt; 24h).</p>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <span className="text-emerald-700">📲</span>
            <div className="font-semibold text-slate-900">They’ll message you on WhatsApp</div>
          </div>
          <p className="mt-1.5 text-sm text-slate-600">
            To confirm scope, timing, and next steps. <strong>No cold calls.</strong>
          </p>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <span className="text-emerald-700">💷</span>
            <div className="font-semibold text-slate-900">Get your guide price</div>
          </div>
          <p className="mt-1.5 text-sm text-slate-600">Often the same day once we’ve seen your photos.</p>
        </Card>
      </div>

      {/* Why WhatsApp */}
      <div className="mt-6">
        <Card>
          <h3 className="text-lg font-semibold text-slate-900">Why WhatsApp?</h3>
          <p className="mt-1 text-slate-700">
            It’s the quickest way to get you an accurate quote. <strong>You control the conversation</strong> — message us first, and we’ll
            never ring you out of the blue.
          </p>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center justify-center rounded-lg bg-emerald-600 hover:bg-emerald-500 transition px-4 py-2 font-semibold text-white"
          >
            Open WhatsApp
          </a>
          <p className="mt-2 text-xs text-slate-500">Out of hours? Message us anyway — we’ll reply first thing.</p>
        </Card>
      </div>

      {/* Photo checklist */}
      <div className="mt-6">
        <Card>
          <h3 className="text-lg font-semibold text-slate-900">Speed things up — photo checklist</h3>
          <ul className="mt-2 grid gap-2 sm:grid-cols-2">
            <li className="flex items-start gap-2 text-sm text-slate-700">
              <span className="mt-1 inline-block h-2 w-2 rounded-full bg-emerald-500/90" />
              Room/wall wide shot + close-ups of the issue
            </li>
            <li className="flex items-start gap-2 text-sm text-slate-700">
              <span className="mt-1 inline-block h-2 w-2 rounded-full bg-emerald-500/90" />
              Measurements (L×W×H) or floor area (sqm)
            </li>
            <li className="flex items-start gap-2 text-sm text-slate-700">
              <span className="mt-1 inline-block h-2 w-2 rounded-full bg-emerald-500/90" />
              Access notes (parking, stairs, narrow doors)
            </li>
            <li className="flex items-start gap-2 text-sm text-slate-700">
              <span className="mt-1 inline-block h-2 w-2 rounded-full bg-emerald-500/90" />
              Any finishes you like (links welcome)
            </li>
          </ul>
          <p className="mt-2 text-sm text-slate-600">Not sure? Send what you have — we’ll guide you.</p>
        </Card>
      </div>

      {/* Footer actions */}
      <div className="mt-6 flex flex-wrap gap-3">
        <a
          href="/auth/signup"
          className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-4 py-2 text-slate-800 hover:bg-slate-50 transition"
        >
          Track this job (create account)
        </a>
        <a
          href="/quote"
          className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-4 py-2 text-slate-800 hover:bg-slate-50 transition"
        >
          Start another request
        </a>
      </div>
    </main>
  );
}
