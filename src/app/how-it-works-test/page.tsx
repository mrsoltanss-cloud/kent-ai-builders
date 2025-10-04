"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

/** ============================================================================
 *  HOW-IT-WORKS: Demo Lab (mount one demo at a time to avoid collisions)
 *  No external deps. All styles injected below to keep things contained.
 * ============================================================================ */

type DemoId =
  | "prompt"
  | "hud"
  | "particles"
  | "parallax"
  | "magnet"
  | "chips";

const DEMOS: { id: DemoId; label: string }[] = [
  { id: "prompt", label: "1) Prompt + Halo" },
  { id: "hud", label: "2) Micro-estimate HUD" },
  { id: "particles", label: "3) Ambient Particles" },
  { id: "parallax", label: "4) Parallax" },
  { id: "magnet", label: "5) Magnetic CTA" },
  { id: "chips", label: "6) Explainability Chips" },
];

const formatGBP = (n: number) =>
  n.toLocaleString("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  });

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia) {
      setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    }
  }, []);
  return reduced;
}

/** ================================== PAGE ================================== */
export default function HowItWorksDemoLab() {
  const [active, setActive] = useState<DemoId>("prompt");
  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(1200px 600px at 50% -10%, #0b3b2e 0%, #071c18 45%, #050d0c 100%)",
        color: "#e6fff7",
      }}
    >
      <StyleTagOnce />
      <header style={{ padding: "32px 20px 8px", textAlign: "center" }}>
        <h1 style={{ fontSize: 28, lineHeight: 1.1, marginBottom: 8 }}>
          How-it-works Demo Lab
        </h1>
        <p style={{ opacity: 0.8, fontSize: 14 }}>
          Mount <em>one</em> experiment at a time to avoid collisions. Mobile-safe.
        </p>
      </header>

      <div
        role="tablist"
        aria-label="Demo switcher"
        style={{
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          justifyContent: "center",
          padding: "12px 16px 20px",
        }}
      >
        {DEMOS.map((d) => (
          <button
            key={d.id}
            role="tab"
            aria-selected={active === d.id}
            onClick={() => setActive(d.id)}
            className="demo-pill"
            style={{
              padding: "8px 12px",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.14)",
              background:
                active === d.id
                  ? "linear-gradient(135deg, #0ad18b, #14b37b)"
                  : "transparent",
              color: active === d.id ? "#031a14" : "#c9fff0",
              fontWeight: 600,
              fontSize: 13,
            }}
          >
            {d.label}
          </button>
        ))}
      </div>

      <main
        style={{
          maxWidth: 980,
          margin: "0 auto",
          padding: "16px",
          display: "grid",
          placeItems: "stretch",
        }}
      >
        {active === "prompt" && <DemoPromptHalo />}
        {active === "hud" && <DemoMicroHUD />}
        {active === "particles" && <DemoParticles />}
        {active === "parallax" && <DemoParallax />}
        {active === "magnet" && <DemoMagneticCTA />}
        {active === "chips" && <DemoExplainChips />}
      </main>
    </div>
  );
}

/** ============================ 1) PROMPT + HALO ============================ */
function DemoPromptHalo() {
  const [value, setValue] = useState("");
  const [typing, setTyping] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const placeholders = useMemo(
    () => [
      "Wall needs repointing",
      "Swap bath to shower",
      "Velux + insulation",
      "Garage conversion",
      "Kitchen island + electrics",
    ],
    []
  );
  const [phI, setPhI] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setPhI((i) => (i + 1) % placeholders.length);
    }, 4000);
    return () => clearInterval(id);
  }, [placeholders.length]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    setTyping(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setTyping(false), 450);
  };

  return (
    <Card title="AI Prompt + Neural Halo">
      <div style={{ position: "relative", padding: 16 }}>
        <div
          aria-hidden
          className={`halo ${typing ? "halo--tight" : ""}`}
          style={{
            position: "absolute",
            inset: "-30px -20px",
            borderRadius: 24,
            filter: "blur(20px)",
            opacity: 0.9,
          }}
        />

        <div className="field-wrap">
          <input
            value={value}
            onChange={onChange}
            placeholder={placeholders[phI] + " →"}
            aria-label="Describe your job"
            className="field"
          />
          <button className="btn-emerald" onClick={() => setTyping(true)}>
            Get Estimate
          </button>
        </div>

        <p className="muted">The halo tightens while typing and pops on submit.</p>
      </div>
    </Card>
  );
}

/** ========================= 2) MICRO-ESTIMATE HUD ========================= */
function DemoMicroHUD() {
  const [show, setShow] = useState(false);
  const [band, setBand] = useState<[number, number]>([12800, 15600]);

  const run = () => {
    setShow(true);
    const jitter = 1 + Math.random() * 0.06;
    const min = Math.round(11000 * jitter);
    const max = Math.round(15400 * jitter + 800);
    setBand([min, max]);
    setTimeout(() => setShow(false), 2200);
  };

  return (
    <Card title="Micro-estimate HUD (2s flicker)">
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <button className="btn-emerald" onClick={run} aria-live="polite">
          Run
        </button>
        <div className="hud">
          <span
            style={{
              whiteSpace: "nowrap",
              opacity: show ? 1 : 0,
              transform: `translateY(${show ? 0 : 12}px)`,
              transition: "opacity .25s, transform .25s",
              fontSize: 14,
            }}
          >
            Analysing 2,317 similar jobs · labour ↑ +0.08 · materials ↔ → est.{" "}
            <strong>
              {formatGBP(band[0])}—{formatGBP(band[1])}
            </strong>
          </span>
        </div>
      </div>
      <p className="muted">Appears on trigger; auto-hides to keep the hero clean.</p>
    </Card>
  );
}

/** =========================== 3) PARTICLE FIELD =========================== */
function DemoParticles() {
  const [typing, setTyping] = useState(false);
  const tRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduced = useReducedMotion();

  const bump = () => {
    setTyping(true);
    if (tRef.current) clearTimeout(tRef.current);
    tRef.current = setTimeout(() => setTyping(false), 400);
  };

  return (
    <Card title="Ambient particles (drift + nudge on type)">
      <div style={{ position: "relative", padding: 16 }}>
        <div className="orb-stage" aria-hidden>
          {!reduced &&
            Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={`orb ${typing ? "orb--nudge" : ""}`}
                style={{
                  left: `${8 + i * 18}%`,
                  top: `${15 + (i % 3) * 22}%`,
                  animationDelay: `${i * 0.6}s`,
                }}
              />
            ))}
        </div>

        <div className="field-wrap" style={{ position: "relative", zIndex: 1 }}>
          <input
            onChange={bump}
            placeholder="Type to see particles nudge →"
            aria-label="Demo input"
            className="field"
          />
          <button className="btn-emerald" onClick={bump}>
            Get Estimate
          </button>
        </div>
      </div>
    </Card>
  );
}

/** ============================== 4) PARALLAX ============================== */
function DemoParallax() {
  const reduced = useReducedMotion();
  const [ox, setOx] = useState(0);
  const [oy, setOy] = useState(0);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduced) return;
    const r = (e.currentTarget.getBoundingClientRect() || { left: 0, top: 0, width: 1, height: 1 });
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = (e.clientX - cx) / (r.width / 2);
    const dy = (e.clientY - cy) / (r.height / 2);
    setOx(Math.max(-1, Math.min(1, dx)));
    setOy(Math.max(-1, Math.min(1, dy)));
  };

  return (
    <Card title="Parallax (restrained)">
      <div
        className="plx-stage"
        onMouseMove={onMove}
        onMouseLeave={() => {
          setOx(0);
          setOy(0);
        }}
      >
        <div
          className="plx-back"
          style={{
            transform: `translate3d(${ox * -6}px, ${oy * -4}px, 0)`,
          }}
        />
        <div
          className="plx-front"
          style={{
            transform: `translate3d(${ox * 6}px, ${oy * 4}px, 0)`,
          }}
        >
          <span className="hud-badge">Parallax HUD (subtle)</span>
        </div>
      </div>
      <p className="muted">6–12px total motion, no scroll hijack.</p>
    </Card>
  );
}

/** =========================== 5) MAGNETIC CTA ============================ */
function DemoMagneticCTA() {
  const reduced = useReducedMotion();
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [pulse, setPulse] = useState(false);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduced || !btnRef.current || !wrapRef.current) return;
    const r = wrapRef.current.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = (e.clientX - cx) / (r.width / 2);
    const dy = (e.clientY - cy) / (r.height / 2);
    const mag = 12; // px
    btnRef.current.style.transform = `translate3d(${dx * mag}px, ${dy * mag}px, 0)`;
  };

  const reset = () => {
    if (!btnRef.current) return;
    btnRef.current.style.transform = `translate3d(0,0,0)`;
  };

  return (
    <Card title="Magnetic button + press pulse">
      <div
        ref={wrapRef}
        className="magnet-wrap"
        onMouseMove={onMove}
        onMouseLeave={reset}
      >
        <button
          ref={btnRef}
          className={`btn-emerald ${pulse ? "btn-pulse" : ""}`}
          onClick={() => {
            setPulse(true);
            setTimeout(() => setPulse(false), 420);
          }}
        >
          Get my instant estimate →
        </button>
      </div>
      <p className="muted">Desktop magnet tug + a light press pulse. Mobile just taps.</p>
    </Card>
  );
}

/** ======================== 6) EXPLAINABILITY CHIPS ======================= */
const CHIP_DATA = [
  {
    title: "DBS-checked teams",
    proof: "We verify ID & criminal record status for on-site staff.",
  },
  {
    title: "12-month guarantee",
    proof: "Workmanship covered by a clear 12-month commitment.",
  },
  {
    title: "£5m insurance",
    proof: "Public liability cover up to £5m carried by teams.",
  },
  {
    title: "No pushy sales",
    proof: "No call-centre sales scripts. We’re builders, not brokers.",
  },
];

function DemoExplainChips() {
  const [open, setOpen] = useState<number | null>(null);
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setVisible((i) => (i + 1) % CHIP_DATA.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <Card title="Explainability chips (with tiny popover)">
      <div className="chip-row">
        {CHIP_DATA.map((c, i) => {
          const active = i === visible;
          const showing = open === i;
          return (
            <div key={i} className="chip-wrap">
              <button
                className="chip"
                aria-expanded={showing}
                onClick={() => setOpen(showing ? null : i)}
                style={{
                  outline: active ? "2px solid rgba(20, 211, 146, 0.8)" : "none",
                }}
              >
                {c.title}
              </button>
              <div
                role="tooltip"
                className="chip-pop"
                style={{
                  opacity: showing ? 1 : 0,
                  transform: `translateY(${showing ? 0 : -6}px)`,
                  pointerEvents: showing ? "auto" : "none",
                }}
              >
                {c.proof}
              </div>
            </div>
          );
        })}
      </div>
      <p className="muted">Rotates every 5s. Click any chip for a one-liner proof.</p>
    </Card>
  );
}

/** =============================== UI PRIMS ================================ */
function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      style={{
        background: "linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.04))",
        border: "1px solid rgba(255,255,255,.12)",
        borderRadius: 16,
        boxShadow: "0 10px 30px rgba(0,0,0,.25)",
        marginBottom: 18,
      }}
    >
      <div
        style={{
          padding: "12px 16px",
          borderBottom: "1px solid rgba(255,255,255,.10)",
          fontWeight: 700,
          letterSpacing: 0.2,
        }}
      >
        {title}
      </div>
      <div style={{ padding: 16 }}>{children}</div>
    </section>
  );
}

/** =============================== STYLES ================================= */
function StyleTagOnce() {
  return (
    <style>{`
      .muted{opacity:.75;font-size:13px;margin-top:8px}

      .field-wrap{
        display:flex;gap:10px;align-items:center;
        background:rgba(255,255,255,.06);
        border:1px solid rgba(255,255,255,.12);
        border-radius:14px;padding:10px;
      }
      .field{
        flex:1;background:transparent;border:none;color:white;
        font-size:16px;outline:none;padding:10px 12px;
      }

      .btn-emerald{
        --bg: linear-gradient(135deg,#10d59a,#14b37b);
        background: var(--bg);
        color:#042018;border:none;border-radius:12px;
        font-weight:800;padding:10px 14px;cursor:pointer;
        box-shadow:0 6px 18px rgba(16,213,154,.22);
        transition: transform .12s ease, box-shadow .12s ease;
      }
      .btn-emerald:hover{ transform: translateY(-1px); box-shadow:0 10px 24px rgba(16,213,154,.28); }
      .btn-emerald:active{ transform: translateY(0); }
      .btn-emerald.btn-pulse{ animation: btnPulse .42s ease-out; }
      @keyframes btnPulse{
        0%{ box-shadow:0 0 0 0 rgba(16,213,154,.45); }
        100%{ box-shadow:0 0 0 14px rgba(16,213,154,0); }
      }

      .halo{
        background:
          radial-gradient(500px 220px at 50% 50%, rgba(20,211,146,.55), transparent 60%),
          radial-gradient(600px 280px at 50% 50%, rgba(245,176,68,.25), transparent 62%);
        animation: haloPulse 2.8s ease-in-out infinite;
        border-radius:24px;
      }
      .halo--tight{ animation: haloTight .6s ease; }
      @keyframes haloPulse{
        0%,100%{ transform: scale(1); opacity:.9 }
        50%{ transform: scale(1.03); opacity:1 }
      }
      @keyframes haloTight{
        0%{ transform: scale(1.03) }
        100%{ transform: scale(1) }
      }

      .hud{
        flex:1;height:44px;border-radius:12px;
        border:1px solid rgba(255,255,255,.12);
        background:rgba(255,255,255,.06);
        display:flex;align-items:center;padding:0 12px;overflow:hidden;
        position:relative;
      }

      .orb-stage{ position:absolute; inset:0; overflow:hidden; border-radius:16px; pointer-events:none; }
      .orb{
        position:absolute;width:12px;height:12px;border-radius:9999px;
        background: radial-gradient(circle at 30% 30%, #22ffc0, #0aa56f);
        filter: blur(0.5px);
        animation: orbDrift 12s ease-in-out infinite alternate;
        opacity:.9;
      }
      .orb--nudge{ animation: orbNudge .5s ease, orbDrift 12s ease-in-out infinite alternate; }
      @keyframes orbDrift{
        0%{ transform: translateY(-8px) translateX(-4px) }
        100%{ transform: translateY(8px) translateX(4px) }
      }
      @keyframes orbNudge{
        0%{ transform: scale(1) }
        50%{ transform: scale(1.35) }
        100%{ transform: scale(1) }
      }

      .plx-stage{
        position:relative;height:220px;border-radius:16px;
        overflow:hidden;border:1px solid rgba(255,255,255,.12);
        background: linear-gradient(180deg,#0c2620,#081513);
      }
      .plx-back, .plx-front{
        position:absolute; inset:0; will-change: transform;
      }
      .plx-back{
        background:
          radial-gradient(1000px 300px at 50% -20%, rgba(18, 168, 118, .18), transparent 60%),
          radial-gradient(600px 300px at 10% 120%, rgba(18, 168, 118, .12), transparent 70%);
        filter: blur(6px);
      }
      .plx-front{
        display:flex;align-items:center;justify-content:center;
        background:
          radial-gradient(180px 200px at 80% 30%, rgba(26, 255, 184, .08), transparent 60%);
      }
      .hud-badge{
        background: rgba(255,255,255,.06);
        border:1px solid rgba(255,255,255,.12);
        padding:8px 12px;border-radius:10px;font-weight:700;
      }

      .magnet-wrap{
        display:grid;place-items:center;height:140px;
        background:rgba(255,255,255,.04);
        border:1px solid rgba(255,255,255,.12);
        border-radius:16px;
      }

      .chip-row{ display:flex; gap:10px; flex-wrap:wrap }
      .chip-wrap{ position:relative }
      .chip{
        background:rgba(255,255,255,.06);
        border:1px solid rgba(255,255,255,.12);
        color:#d9fff4;padding:8px 12px;border-radius:999px;
        font-weight:700;cursor:pointer;
      }
      .chip-pop{
        position:absolute; left:0; top: calc(100% + 8px);
        background:#071914; color:#d9fff4;
        border:1px solid rgba(255,255,255,.12);
        padding:10px 12px; border-radius:10px;
        width:260px; box-shadow:0 10px 28px rgba(0,0,0,.35);
        transition: opacity .2s, transform .2s;
        z-index:2;
      }

      .demo-pill:focus-visible{ outline:2px solid #26e2a8; outline-offset:2px }
    `}</style>
  );
}
