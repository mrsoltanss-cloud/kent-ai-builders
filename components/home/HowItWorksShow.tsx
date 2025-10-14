"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Slide = 0 | 1 | 2;

const STAGE =
  "relative mx-auto w-full max-w-[980px] rounded-3xl border border-zinc-200 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.06)] overflow-hidden";
const HEADING_WRAPPER = "text-center mb-3";
const HEADING_STEPPER = "text-emerald-600 text-xs tracking-widest";
const HEADING_TITLE = "text-3xl md:text-5xl font-extrabold text-zinc-900";

/* -------------------------------- Helpers -------------------------------- */
function Arrow({
  dir,
  onClick,
  disabled,
}: {
  dir: "left" | "right";
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      aria-label={dir === "left" ? "Previous" : "Next"}
      onClick={onClick}
      disabled={disabled}
      className={`absolute top-1/2 -translate-y-1/2 ${
        dir === "left" ? "left-2 md:left-4" : "right-2 md:right-4"
      } inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-300 bg-white/90 backdrop-blur
      hover:bg-white shadow-sm text-zinc-700 disabled:opacity-40`}
    >
      {dir === "left" ? "←" : "→"}
    </button>
  );
}

function Dots({
  index,
  setIndex,
}: {
  index: number;
  setIndex: (i: number) => void;
}) {
  return (
    <div className="mt-5 flex items-center justify-center gap-2">
      {[0, 1, 2].map((i) => (
        <button
          key={i}
          onClick={() => setIndex(i)}
          aria-label={`Go to slide ${i + 1}`}
          className={`h-2.5 w-2.5 rounded-full transition ${
            i === index ? "bg-emerald-600" : "bg-zinc-300 hover:bg-zinc-400"
          }`}
        />
      ))}
    </div>
  );
}

/* =============================== STEP 1 ====================================
   WORKFLOW — 3 detailed job cards (blueprint grid) + confidence pill
============================================================================ */
function MiniBlueprint({ seed = 0 }: { seed?: number }) {
  const [t, setT] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setT((v) => v + 1), 700 + (seed % 3) * 120);
    return () => window.clearInterval(id);
  }, [seed]);
  const wiggle = (base: number) => base + (t % 2 === 0 ? 0 : 3);

  return (
    <div className="rounded-lg border border-emerald-200 bg-white">
      <svg viewBox="0 0 320 96" className="w-full h-24">
        {[1, 2, 3, 4, 5].map((r) => (
          <line
            key={"r" + r}
            x1="10"
            y1={r * 16}
            x2="310"
            y2={r * 16}
            stroke="rgba(16,185,129,0.15)"
            strokeWidth="1"
          />
        ))}
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((c) => (
          <line
            key={"c" + c}
            x1={c * 30}
            y1="8"
            x2={c * 30}
            y2="88"
            stroke="rgba(16,185,129,0.1)"
            strokeWidth="1"
          />
        ))}
        <path
          d={`M 16 28 H ${wiggle(150)} V 70 H 16 Z`}
          stroke="rgba(16,185,129,0.7)"
          fill="none"
          strokeWidth="2"
        />
        <path
          d={`M 168 24 H 304 V ${wiggle(64)} H 168 Z`}
          stroke="rgba(16,185,129,0.45)"
          fill="none"
          strokeWidth="2"
        />
        <path
          d={`M 168 64 Q 196 ${wiggle(54)} 304 ${wiggle(64)}`}
          stroke="rgba(16,185,129,0.35)"
          fill="none"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}

function LiveMetric({ from, to, label }: { from: number; to: number; label: string }) {
  const [val, setVal] = useState(from);
  useEffect(() => {
    const id = window.setInterval(() => {
      setVal((v) => {
        const delta = Math.max(1, Math.round(Math.abs(to - from) / 40));
        const next = v + (v < to ? delta : -delta);
        if ((to >= from && next >= to) || (to < from && next <= to)) return to;
        return next;
      });
    }, 60);
    return () => window.clearInterval(id);
  }, [from, to]);
  return (
    <div className="text-xs text-zinc-600">
      <span className="font-semibold text-zinc-900">{val}</span> {label}
    </div>
  );
}

function ConfidencePill({ seed = 0 }: { seed?: number }) {
  const [t, setT] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setT((v) => v + 1), 900 + seed * 200);
    return () => window.clearInterval(id);
  }, [seed]);
  const pct = 68 + Math.round(8 * Math.sin((t + seed) / 4));
  return (
    <span className="ml-2 inline-flex items-center gap-1 rounded-full border border-emerald-300 bg-emerald-50 px-2 py-0.5 text-[11px] text-emerald-800">
      Confidence {pct}%
      <span className="relative inline-block h-1.5 w-8 overflow-hidden rounded bg-emerald-100">
        <span
          className="absolute left-0 top-0 h-full bg-emerald-500"
          style={{ width: `${pct}%`, maxWidth: "100%" }}
        />
      </span>
    </span>
  );
}

type JobCard = {
  icon: string;
  title: string;
  sub: string;
  chips: string[];
  bullets: string[];
  sim: { similar: [number, number]; etaWks: [number, number]; rating: number };
  rangeBase: [number, number];
};

function Step1_Workflow() {
  const JOBS: JobCard[] = [
    {
      icon: "🍳",
      title: "Kitchen → Extension",
      sub: "Knock-through, island, bi-folds",
      chips: ["ME15", "24 sqm", "ASAP", "Terraced access"],
      bullets: ["Remove rear wall, RSJ install", "Utility + WC re-route", "Underfloor heating & LVT"],
      sim: { similar: [1100, 1260], etaWks: [2, 3], rating: 4.9 },
      rangeBase: [12800, 15600],
    },
    {
      icon: "🛁",
      title: "Bathroom → Refit",
      sub: "Walk-in shower, tiled niche",
      chips: ["CT4", "7 sqm", "1–3 months", "Vent upgrade"],
      bullets: ["Rip-out + first fix", "Aqua-board + porcelain 600x600", "LED strip, demist mirror"],
      sim: { similar: [980, 1120], etaWks: [1, 2], rating: 4.8 },
      rangeBase: [4200, 5900],
    },
    {
      icon: "🏠",
      title: "Loft → Dormer",
      sub: "Rear dormer + ensuite",
      chips: ["TN23", "28 sqm", "Planning in place", "Party-wall"],
      bullets: ["Stairs cut-in & fire doors", "Velux + dormer shell", "1st fix M&E + plaster"],
      sim: { similar: [640, 720], etaWks: [3, 4], rating: 4.9 },
      rangeBase: [28500, 34600],
    },
  ];

  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => t + 1), 140);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className={STAGE}>
      <div className="relative aspect-[16/9]">
        <div className="absolute inset-0 p-5 md:p-7 overflow-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {JOBS.map((j, i) => {
              const low = Math.round(j.rangeBase[0] + Math.sin((tick + i * 4) / 6) * (j.rangeBase[0] * 0.01));
              const high = Math.round(j.rangeBase[1] + Math.cos((tick + i * 5) / 7) * (j.rangeBase[1] * 0.01));
              return (
                <motion.div
                  key={j.title}
                  className="rounded-2xl border border-zinc-200 bg-white px-3.5 py-3.5 shadow-sm"
                  whileHover={{ y: -4, scale: 1.01 }}
                >
                  <div className="flex items-center gap-2">
                    <div className="text-2xl">{j.icon}</div>
                    <div>
                      <div className="font-semibold text-zinc-900">{j.title}</div>
                      <div className="text-xs text-zinc-600">{j.sub}</div>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1">
                    {j.chips.map((c, k) => (
                      <span
                        key={k}
                        className="rounded-full border border-zinc-200 bg-white px-2.5 py-0.5 text-[11px] text-zinc-600 shadow-sm"
                      >
                        {c}
                      </span>
                    ))}
                  </div>

                  <div className="mt-3">
                    <MiniBlueprint seed={i} />
                  </div>

                  <ul className="mt-3 space-y-1">
                    {j.bullets.map((b, k) => (
                      <li key={k} className="text-xs text-zinc-700 flex gap-2">
                        <span className="text-emerald-500 mt-[2px]">▴</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-3 grid grid-cols-3 gap-2">
                    <div className="rounded-lg border border-zinc-200 bg-white px-2 py-2 text-center">
                      <LiveMetric from={j.sim.similar[0]} to={j.sim.similar[1]} label="similar" />
                    </div>
                    <div className="rounded-lg border border-zinc-200 bg-white px-2 py-2 text-center">
                      <div className="text-xs text-zinc-600">
                        <span className="font-semibold text-zinc-900">
                          {j.sim.etaWks[0]}–{j.sim.etaWks[1]}
                        </span>{" "}
                        wks ETA
                      </div>
                    </div>
                    <div className="rounded-lg border border-zinc-200 bg-white px-2 py-2 text-center">
                      <div className="text-xs text-zinc-600">
                        <span className="font-semibold text-zinc-900">{j.sim.rating}</span> ★ rating
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 rounded-xl border border-emerald-300 bg-emerald-50/60 px-3 py-2 text-center">
                    <div className="text-xs text-zinc-600">
                      Instant estimate <ConfidencePill seed={i} />
                    </div>
                    <div className="font-extrabold text-zinc-900">
                      £{low.toLocaleString()} — £{high.toLocaleString()}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* =============================== STEP 2 ====================================
   NEURAL CORE — building terms matrix + optimiser chip (your tagline first)
============================================================================ */
function Step2_NeuralCoreSlim() {
  const CX = 400, CY = 225;

  const TOKENS = [
    "RSJ","PLASTER","SCREED","PERMITS","LABOUR","MATERIALS","ACCESS","INSULATION",
    "TILING","ELECTRICS","PLUMBING","SCAFFOLD","JOISTS","FOUNDATIONS","DAMP-PROOF",
    "PARTY-WALL","WASTE","SURVEY","ARCHITECT","STRUCTURAL","FIXINGS","BRICKWORK",
    "ROOF","TIMBER","WINDOWS","DOORS","KITCHEN","BATHROOM","EXTENSION","U-VALUE",
    "RADIATORS","CAVITY","DPM","DPC","LATEX","SKIM","STUD","FIRE-DOOR"
  ];

  type Emission = { id: number; pts: number[][] };
  const [emissions, setEmissions] = useState<Emission[]>([]);
  const seqRef = useRef(1);
  const [pulseKey, setPulseKey] = useState(0);
  const [rippleKey, setRippleKey] = useState(0);

  useEffect(() => {
    const rowsY = [150, 170, 190, 210, 230, 250, 270];
    const timer = window.setInterval(() => {
      const y = rowsY[Math.floor(Math.random() * rowsY.length)];
      const pts: number[][] = [
        [230, y],
        [315, y - 6],
        [360, y + 4],
        [CX, CY],
      ];
      const id = seqRef.current++;
      setEmissions((L) => [...L, { id, pts }]);
      setPulseKey((k) => k + 1);
      setRippleKey((k) => k + 1);
      window.setTimeout(() => setEmissions((L) => L.filter((e) => e.id !== id)), 1400);
    }, 650);
    return () => window.clearInterval(timer);
  }, []);

  const baseLow = 12800, baseHigh = 15600;
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => t + 1), 120);
    return () => window.clearInterval(id);
  }, []);
  const low  = Math.round(baseLow  + Math.sin(tick/6) * 140);
  const high = Math.round(baseHigh + Math.cos(tick/7) * 140);

  const satellites = useMemo(
    () => Array.from({ length: 6 }).map((_, i) => ({ r: 110 + (i % 3) * 18, speed: 16 + i * 2, size: 5 + (i % 3) })),
    []
  );

  const columns = useMemo(() => {
    return Array.from({ length: 8 }).map((_, i) => {
      const seq = Array.from({ length: 42 }).map((__, k) => TOKENS[(i * 3 + k) % TOKENS.length]).join(" ");
      return { left: 100 + i * 70, text: seq };
    });
  }, []);

  const TICKER = "101001 £ 00110 0101 11 010 001 10 £ 01 0101 0110 £ 101 010 001 1101";

  // Taglines – first is hard requirement
  const TAGLINES = [
    "Optimising learning and best-fit price",
    "Reconciling live market signals",
    "Weighing constraints vs. scope",
    "Normalising labour & materials",
    "Reducing uncertainty",
    "Matching against analogue jobs",
    "Adjusting for access & seasonality",
    "Balancing risk profiles",
    "Learning from nearby work",
    "Squeezing variance",
    "Cross-checking quotes",
    "Finalising confidence band",
  ];
  const verb = TAGLINES[tick % TAGLINES.length];
  const quality = 70 + Math.round(18 * Math.abs(Math.sin(tick / 6)));

  return (
    <div className={STAGE}>
      <div className="relative aspect-[16/9]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.08),transparent_60%)]" />

        {/* Optimiser chip (top-center, high z-index) */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 top-4 z-[60] rounded-2xl border border-emerald-400 bg-white/95 backdrop-blur px-4 py-2.5 shadow"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="flex items-center gap-2">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-600 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
            <span className="text-[13px] font-semibold text-emerald-900">
              {verb || "Optimising learning and best-fit price"}
            </span>
          </div>
          <div className="mt-1 h-1.5 w-56 rounded bg-emerald-100 overflow-hidden">
            <motion.div
              className="h-full bg-emerald-500"
              style={{ width: `${quality}%` }}
              animate={{ width: [`${quality}%`, `${Math.min(100, quality + 10)}%`] }}
              transition={{ duration: 0.9, repeat: Infinity, repeatType: "reverse" }}
            />
          </div>
          <div className="mt-1 text-[11px] text-emerald-700">Quality {quality}%</div>
        </motion.div>

        {/* matrix columns */}
        {columns.map((c, i) => (
          <motion.div
            key={i}
            className="absolute text-[10px] font-mono uppercase tracking-wider text-emerald-700/35"
            style={{ left: c.left, whiteSpace: "pre" }}
            initial={{ y: -220 }}
            animate={{ y: [-220, 480] }}
            transition={{ duration: 6 + (i % 4), repeat: Infinity, ease: "linear", delay: i * 0.2 }}
          >
            {c.text.split(" ").join("\n")}
          </motion.div>
        ))}

        {/* emitted orbs */}
        {emissions.map((e) => (
          <motion.div
            key={e.id}
            className="absolute h-2.5 w-2.5 rounded-full"
            style={{ background: "rgba(16,185,129,1)", boxShadow: "0 0 10px rgba(16,185,129,0.85)" }}
            animate={{ x: e.pts.map((p) => p[0]), y: e.pts.map((p) => p[1]) }}
            transition={{ duration: 1.4, ease: "easeInOut" }}
          />
        ))}

        {/* satellites */}
        {satellites.map((s, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-emerald-500"
            style={{ width: s.size, height: s.size, left: CX, top: CY }}
            animate={{ rotate: 360 }}
            transition={{ duration: s.speed, repeat: Infinity, ease: "linear" }}
          >
            <div
              className="absolute rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.7)]"
              style={{ width: s.size, height: s.size, transform: `translate(${s.r}px,0)` }}
            />
          </motion.div>
        ))}

        {/* CORE */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute h-80 w-80 rounded-full bg-emerald-400/25 blur-3xl" />
          <motion.div
            className="absolute h-72 w-72 rounded-full"
            style={{
              background:
                "conic-gradient(rgba(16,185,129,0.18) 0deg, rgba(16,185,129,0.18) 42deg, transparent 42deg)",
              maskImage: "radial-gradient(circle at center, transparent 0 40%, black 41% 100%)",
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            key={rippleKey}
            className="absolute rounded-full border-2"
            style={{ width: 150, height: 150, borderColor: "rgba(16,185,129,0.45)" }}
            initial={{ scale: 0.7, opacity: 0.45 }}
            animate={{ scale: 1.8, opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
          <motion.div
            key={pulseKey + 1000}
            className="h-48 w-48 md:h-64 md:w-64 rounded-full"
            style={{
              background:
                "conic-gradient(from 0deg, rgba(16,185,129,0.95), rgba(52,211,153,0.95), rgba(16,185,129,0.95))",
              filter: "blur(2px)",
              boxShadow: "0 0 52px rgba(16,185,129,0.35)",
            }}
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.55, ease: "easeInOut" }}
          />
          {[84, 124, 168].map((r, i) => (
            <motion.div
              key={r}
              className="absolute rounded-full border"
              style={{
                width: r * 2,
                height: r * 2,
                borderColor: i % 2 ? "rgba(52,211,153,0.45)" : "rgba(16,185,129,0.45)",
              }}
              animate={{ rotate: i % 2 ? [0, 360] : [0, -360] }}
              transition={{ duration: 18 - i * 3, repeat: Infinity, ease: "linear" }}
            />
          ))}
        </div>

        {/* PRICE PANEL + ticker */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-6 w-[86%] max-w-[640px]">
          <div className="rounded-2xl border border-emerald-200 bg-white/80 backdrop-blur px-3 py-3 shadow-sm">
            <div className="relative overflow-hidden rounded-lg border border-emerald-200 bg-emerald-50/60">
              <motion.div
                className="whitespace-nowrap font-mono text-[11px] px-3 py-1 text-emerald-800"
                animate={{ x: ["0%", "-50%"] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              >
                {Array.from({ length: 6 }).map(() => TICKER).join("   ·   ")}
              </motion.div>
            </div>
            <div className="mt-2 rounded-xl border border-emerald-300/70 bg-emerald-50/70 px-3 py-2 text-center">
              <div className="text-xs text-zinc-600">Estimated range</div>
              <div className="text-zinc-900 font-extrabold">
                £{low.toLocaleString()} — £{high.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* top-layer orbs */}
        {emissions.map((e) => (
          <motion.div
            key={`top-${e.id}`}
            className="absolute h-1.5 w-1.5 rounded-full"
            style={{ background: "rgba(16,185,129,0.9)", boxShadow: "0 0 14px rgba(16,185,129,0.8)" }}
            animate={{ x: e.pts.map((p) => p[0]), y: e.pts.map((p) => p[1]) }}
            transition={{ duration: 1.4, ease: "easeInOut" }}
          />
        ))}
      </div>
    </div>
  );
}

/* =============================== STEP 3 ====================================
   BIPARTITE MATCH — gradient beams + centred badges (no overlap) + new CTAs
============================================================================ */
function Step3_BipartitePlus() {
  const leftX = 180, rightX = 620;
  const rowY = (i: number) => 110 + i * 42;

  const BUILDERS = [
    "Medway Renovations",
    "East Kent Craftsmen",
    "Greenline Contractors",
    "Maidstone Pro Build",
    "Riverbank Refurbs",
    "Prime Loft & Kitchen",
  ];
  const JOBS = [
    "ME15 Kitchen Extension",
    "TN23 Rear Extension",
    "CT2 Garage Conversion",
    "ME14 Bathroom Refit",
    "ME10 Porch + Utility",
    "CT4 Garden Office",
  ];

  const MATCHES = [
    { b: 0, j: 0, reason: "12 similar • 2.3mi" },
    { b: 2, j: 3, reason: "Wetroom specialist" },
    { b: 1, j: 2, reason: "Planning handled" },
  ];
  const BADGE_OFFSETS = [-18, 0, 18];

  const qPoint = (
    x1: number, y1: number, cx: number, cy: number, x2: number, y2: number, t: number
  ) => {
    const u = 1 - t;
    const x = u * u * x1 + 2 * u * t * cx + t * t * x2;
    const y = u * u * y1 + 2 * u * t * cy + t * t * y2;
    return { x, y };
  };

  return (
    <div className={STAGE}>
      <div className="relative aspect-[16/9]">
        <div className="absolute inset-0 pb-44">
          <div className="absolute left-6 top-10">
            <div className="text-xs font-semibold text-zinc-500 mb-2">Builders</div>
            <div className="grid gap-2">
              {BUILDERS.map((n) => (
                <div key={n} className="w-56 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-800 shadow-sm">
                  {n}
                </div>
              ))}
            </div>
          </div>
          <div className="absolute right-6 top-10">
            <div className="text-xs font-semibold text-zinc-500 mb-2">Jobs</div>
            <div className="grid gap-2">
              {JOBS.map((n) => (
                <div key={n} className="w-64 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-800 shadow-sm text-right">
                  {n}
                </div>
              ))}
            </div>
          </div>

          {/* beams */}
          <svg viewBox="0 0 800 450" className="absolute inset-0 pointer-events-none">
            <defs>
              <linearGradient id="beamGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="rgba(16,185,129,0.35)" />
                <stop offset="50%" stopColor="rgba(16,185,129,1)" />
                <stop offset="100%" stopColor="rgba(16,185,129,0.35)" />
              </linearGradient>
              <filter id="beamGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {MATCHES.map((m, i) => {
              const x1 = leftX,  y1 = rowY(m.b);
              const x2 = rightX, y2 = rowY(m.j);
              const cx = (x1 + x2) / 2, cy = (y1 + y2) / 2 + (i - 1) * 18;
              const d = `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
              const mid = qPoint(x1, y1, cx, cy, x2, y2, 0.5);
              const labelY = mid.y + BADGE_OFFSETS[i];

              return (
                <g key={i} filter="url(#beamGlow)">
                  <motion.path
                    d={d}
                    fill="none"
                    stroke="url(#beamGrad)"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray="8 10"
                    initial={{ pathLength: 0, opacity: 0, strokeDashoffset: 0 }}
                    animate={{ pathLength: 1, opacity: 1, strokeDashoffset: [0, -36] }}
                    transition={{ duration: 1.0, delay: 0.15 + i * 0.15, repeat: Infinity, repeatType: "reverse" }}
                  />
                  <circle cx={mid.x} cy={mid.y} r="3.5" fill="rgba(16,185,129,0.95)" />
                  <circle cx={mid.x} cy={mid.y} r="10" fill="rgba(16,185,129,0.18)" />
                  <foreignObject x={mid.x - 70} y={labelY - 12} width="140" height="24">
                    <div className="pointer-events-none text-[10px] text-center text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5 shadow-sm">
                      {m.reason}
                    </div>
                  </foreignObject>
                </g>
              );
            })}
          </svg>
        </div>

        {/* result card */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-8 w-[92%] max-w-[720px]">
          <motion.div
            className="rounded-2xl border border-emerald-300 bg-white px-5 py-4 shadow-[0_10px_24px_rgba(16,185,129,0.16)]"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <div className="text-center">
              <div className="text-sm font-mono text-zinc-500">Best match</div>
              <div className="text-xl md:text-2xl font-extrabold text-zinc-900">ME15 Kitchen Extension</div>
            </div>

            <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
              {["Medway Renovations", "Greenline Contractors", "East Kent Craftsmen"].map((name, i) => (
                <div key={i} className="rounded-xl border border-zinc-200 bg-white px-4 py-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-sm text-zinc-900 truncate">{name}</div>
                    <span className="text-xs text-emerald-700">Score {i === 0 ? 92 : i === 1 ? 90 : 88}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="h-1.5 w-20 bg-emerald-100 rounded overflow-hidden">
                      <motion.div
                        className="h-full bg-emerald-500"
                        initial={{ width: "0%" }}
                        animate={{ width: ["70%", "95%", "85%"] }}
                        transition={{ duration: 2.2, repeat: Infinity }}
                      />
                    </div>
                    <div className="text-[11px] text-zinc-600">12 similar jobs</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap gap-3 justify-center">
              <a href="/auth/signup" className="inline-flex items-center justify-center rounded-full px-5 py-2.5 font-semibold bg-emerald-500 text-white hover:bg-emerald-400 transition">
                Sign up
              </a>
              <a href="/auth/signup?role=TRADER" className="inline-flex items-center justify-center rounded-full px-5 py-2.5 font-semibold border border-emerald-500 text-emerald-700 hover:bg-emerald-50 transition">
                Trade sign up
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ WRAPPER ------------------------------ */
export default function HowItWorksShow() {
  const [index, setIndex] = useState<Slide>(0);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setIndex((i) => (i === 2 ? 2 : ((i + 1) as Slide)));
      if (e.key === "ArrowLeft") setIndex((i) => (i === 0 ? 0 : ((i - 1) as Slide)));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const s = touchStartX.current;
    if (s == null) return;
    const dx = e.changedTouches[0].clientX - s;
    if (Math.abs(dx) > 50)
      setIndex((i) => (dx < 0 ? (i === 2 ? 2 : ((i + 1) as Slide)) : i === 0 ? 0 : ((i - 1) as Slide)));
    touchStartX.current = null;
  };

  const headings = ["Pick Your Job", "AI Thinks", "Smart Matchmaking"];
  const subcopy = [
    "Choose the work, add the basics — we’ll suggest what matters.",
    "Optimising learning and best-fit price — watch the range adjust live.",
    "We score nearby pros on similarity, proximity and availability.",
  ];

  return (
    <section className="relative w-full bg-[#F7FAFC] py-8 md:py-12">
      <div className="text-center px-6">
        <div className="text-sm md:text-base text-zinc-600">
          Blueprint → AI thinking → Matched builder — explained in seconds.
        </div>
      </div>

      <div className="mt-5 md:mt-7 select-none" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <div className={HEADING_WRAPPER}>
          <div className={HEADING_STEPPER}>STEP {index + 1} OF 3</div>
          <h2 className={HEADING_TITLE}>{headings[index]}</h2>
          <p className="mt-2 text-sm md:text-base text-zinc-600 px-6">{subcopy[index]}</p>
        </div>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              {index === 0 && <Step1_Workflow />}
              {index === 1 && <Step2_NeuralCoreSlim />}
              {index === 2 && <Step3_BipartitePlus />}
            </motion.div>
          </AnimatePresence>
          <Arrow dir="left" onClick={() => setIndex((i) => (i === 0 ? 0 : ((i - 1) as Slide)))} disabled={index === 0} />
          <Arrow dir="right" onClick={() => setIndex((i) => (i === 2 ? 2 : ((i + 1) as Slide)))} disabled={index === 2} />
        </div>

        <Dots index={index} setIndex={(i) => setIndex(i as Slide)} />
      </div>
    </section>
  );
}
