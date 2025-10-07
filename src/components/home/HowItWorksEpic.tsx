// "use client"
"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useMemo, useRef } from "react";

/**
 * PHOTON WHITE — Epic "How it Works" (light theme)
 * - Scene 1: Blueprint Storm (SVG fragments snap into place + scanline)
 * - Scene 2: AI Thinking (neural nodes + orbiting packets + narrowing price band + confidence)
 * - Scene 3: Builder Beam-In (hologram profile, rotating badges, swipeable thumbnails)
 * - Scene 4: Trust + CTA
 * Mobile-first, GPU transforms only, avoids heavy filters on small screens.
 */

function SceneWrapper({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.25 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`relative w-full min-h-[80vh] flex items-center justify-center ${className}`}
    >
      {children}
    </motion.section>
  );
}

function LightBG() {
  return (
    <div className="absolute inset-0 -z-10 bg-[#F7FAFC]">
      {/* soft gradient corners */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(0,229,255,0.10),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(56,239,125,0.10),transparent_55%)]" />
      {/* faint grid */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.12) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs text-zinc-600 shadow-sm">
      {children}
    </span>
  );
}

export default function HowItWorksEpic() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: rootRef, offset: ["start end", "end start"] });
  const bgParallax = useTransform(scrollYProgress, [0, 1], ["0px", "140px"]);

  /** Scene 1 blueprint fragments (positions are percentage-based for responsiveness) */
  const fragments = useMemo(
    () => [
      { w: 22, h: 10, x: 14, y: 62, r: -6, d: 0.0 },
      { w: 30, h: 16, x: 48, y: 36, r: 4, d: 0.1 },
      { w: 24, h: 12, x: 70, y: 64, r: 8, d: 0.15 },
      { w: 10, h: 10, x: 32, y: 44, r: -10, d: 0.25 },
      { w: 18, h: 10, x: 60, y: 52, r: 12, d: 0.32 },
    ],
    []
  );

  return (
    <div ref={rootRef} className="relative overflow-hidden">
      <motion.div style={{ y: bgParallax }}>
        <LightBG />
      </motion.div>

      {/* INTRO */}
      <SceneWrapper className="py-20">
        <div className="max-w-4xl text-center px-6">
          <motion.h2
            className="text-3xl md:text-6xl font-extrabold tracking-tight text-zinc-900"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            How Brixel Works — <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-cyan-500">AI, Visualised</span>
          </motion.h2>
          <motion.p
            className="mt-4 text-base md:text-lg text-zinc-600"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
          >
            Blueprint ➝ AI thinking ➝ Matched builder — explained in seconds, not paragraphs.
          </motion.p>
        </div>
      </SceneWrapper>

      {/* SCENE 1 — BLUEPRINT STORM */}
      <SceneWrapper className="py-20">
        <div className="max-w-5xl w-full px-6 text-center">
          <p className="text-emerald-600 text-xs tracking-widest mb-2">STEP 1</p>
          <h3 className="text-2xl md:text-4xl font-bold text-zinc-900">
            Your Idea, <span className="text-emerald-600">Digitised</span>
          </h3>
          <p className="mt-2 text-zinc-600">
            We parse your inputs and assemble a live plan.
          </p>

          <motion.div
            className="mt-8 mx-auto max-w-3xl rounded-[28px] border border-zinc-200 bg-white p-6 md:p-10 shadow-[0_10px_30px_rgba(0,0,0,0.06)] relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Scanline */}
            <motion.div
              className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-emerald-400/20 to-transparent pointer-events-none"
              animate={{ y: ["-15%", "115%"] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* Artboard */}
            <div className="relative aspect-[16/9]">
              {/* Outer dashed plan */}
              <motion.div
                className="absolute inset-6 rounded-xl border-2 border-emerald-500/80 [border-style:dashed]"
                initial={{ clipPath: "inset(0 100% 0 0)" }}
                whileInView={{ clipPath: "inset(0 0% 0 0)" }}
                transition={{ duration: 1.0, ease: "easeInOut" }}
              />
              {/* Fragments fly in and snap */}
              {fragments.map((f, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-md border-2 [border-style:dashed] border-emerald-500/80 bg-emerald-50/30"
                  style={{ width: `${f.w}%`, height: `${f.h}%`, left: `${f.x}%`, top: `${f.y}%` }}
                  initial={{ opacity: 0, rotate: f.r, x: (i % 2 ? -120 : 120), y: (i % 3 ? -80 : 100), scale: 0.9 }}
                  whileInView={{ opacity: 1, rotate: 0, x: 0, y: 0, scale: 1 }}
                  transition={{ duration: 0.7, delay: 0.3 + f.d, type: "spring", stiffness: 120, damping: 18 }}
                />
              ))}
              {/* Input chips */}
              <div className="absolute right-6 bottom-6 flex gap-2 flex-wrap justify-end">
                <Chip>Photos</Chip>
                <Chip>Plans</Chip>
                <Chip>Postcode</Chip>
                <Chip>Timing</Chip>
              </div>
            </div>
          </motion.div>
        </div>
      </SceneWrapper>

      {/* SCENE 2 — AI THINKING */}
      <SceneWrapper className="py-20">
        <div className="max-w-5xl w-full px-6 text-center">
          <p className="text-emerald-600 text-xs tracking-widest mb-2">STEP 2</p>
          <h3 className="text-2xl md:text-4xl font-bold text-zinc-900">
            AI <span className="text-emerald-600">Crunches the Numbers</span>
          </h3>
          <p className="mt-2 text-zinc-600">Watch inputs flow through jobs, market pricing, and constraints.</p>

          <motion.div
            className="mt-8 mx-auto max-w-3xl rounded-[28px] border border-zinc-200 bg-white p-6 md:p-10 shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative aspect-[16/9] flex items-center justify-center">
              {/* Core */}
              <motion.div
                className="h-36 w-36 rounded-full bg-gradient-to-br from-emerald-300 to-cyan-300 opacity-80 blur-[4px]"
                animate={{ scale: [1, 1.06, 1] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
              />
              {/* Node rings */}
              {[60, 92, 128].map((r, i) => (
                <motion.div
                  key={r}
                  className="absolute rounded-full border border-zinc-300"
                  style={{ width: r * 2, height: r * 2 }}
                  animate={{ rotate: i % 2 ? [0, 360] : [0, -360] }}
                  transition={{ duration: 20 - i * 3, repeat: Infinity, ease: "linear" }}
                />
              ))}
              {/* Orbiting packets */}
              {Array.from({ length: 12 }).map((_, i) => {
                const radius = 70 + (i % 3) * 24;
                const dur = 5 + (i % 5);
                return (
                  <motion.div
                    key={i}
                    className="absolute"
                    style={{ top: "50%", left: "50%" }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: dur, repeat: Infinity, ease: "linear" }}
                  >
                    <div
                      className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.7)]"
                      style={{ transform: `translate(${radius}px, 0)` }}
                    />
                  </motion.div>
                );
              })}
              {/* Pipelines labels */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-[11px] md:text-sm text-zinc-700 font-mono">
                Historical jobs • Similarity scoring
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-[11px] md:text-sm text-zinc-700 font-mono">
                Supplier pricing • Labour • Seasonality
              </div>

              {/* Price band: narrows as “confidence” rises */}
              <motion.div
                className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[78%] max-w-[520px]"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="text-zinc-500 text-xs md:text-sm font-mono mb-1 flex items-center justify-between">
                  <span>Estimated range</span>
                  <motion.span
                    className="text-emerald-600"
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 1.6, repeat: Infinity }}
                  >
                    Confidence ↑ 64% → 86%
                  </motion.span>
                </div>
                <div className="relative h-12 rounded-full bg-emerald-100/60 border border-emerald-300/70 overflow-hidden">
                  {/* narrowing mask */}
                  <motion.div
                    className="absolute inset-y-0 left-0 right-0 bg-gradient-to-r from-white via-transparent to-white"
                    initial={{ left: "0%", right: "0%" }}
                    whileInView={{ left: "18%", right: "18%" }}
                    transition={{ duration: 2.0, ease: "easeInOut" }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-zinc-900 text-lg md:text-2xl font-extrabold">
                      £12,800 — £15,600
                    </span>
                  </div>
                </div>
                <div className="mt-2 flex gap-2 flex-wrap justify-center text-[11px] md:text-xs text-zinc-600">
                  <Chip>Access: Terraced</Chip>
                  <Chip>Materials: Bespoke</Chip>
                  <Chip>Timing: ASAP</Chip>
                  <Chip>Postcode: ME15</Chip>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </SceneWrapper>

      {/* SCENE 3 — BUILDER BEAM-IN */}
      <SceneWrapper className="py-20">
        <div className="max-w-5xl w-full px-6 text-center">
          <p className="text-emerald-600 text-xs tracking-widest mb-2">STEP 3</p>
          <h3 className="text-2xl md:text-4xl font-bold text-zinc-900">
            Meet Your <span className="text-emerald-600">Perfect Builder</span>
          </h3>
          <p className="mt-2 text-zinc-600">Matched on proximity • skill • availability • rating.</p>

          <motion.div
            className="mt-8 mx-auto max-w-3xl rounded-[28px] border border-zinc-200 bg-white p-6 md:p-10 shadow-[0_10px_30px_rgba(0,0,0,0.06)] relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative aspect-[16/9]">
              {/* Beam line */}
              <motion.div
                className="pointer-events-none absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2 bg-gradient-to-b from-transparent via-emerald-400/70 to-transparent"
                animate={{ opacity: [0.2, 0.8, 0.2] }}
                transition={{ duration: 2.0, repeat: Infinity }}
              />
              {/* Hologram card */}
              <motion.div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[78%] max-w-[520px] rounded-2xl border border-emerald-300/60 bg-emerald-50/60 backdrop-blur-[2px] p-5 text-left"
                initial={{ opacity: 0, scale: 0.95, y: 12 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-full border-2 border-emerald-400/80" />
                  <div className="min-w-0">
                    <div className="font-semibold text-zinc-900 truncate">Kent Pro Build Co.</div>
                    <div className="text-xs text-zinc-600">Kitchen & Extensions • Maidstone</div>
                    <div className="mt-1 flex gap-2 flex-wrap">
                      <Chip>DBS-checked</Chip>
                      <Chip>£5m Insurance</Chip>
                      <Chip>4.9/5</Chip>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-xs text-zinc-600">Why matched: 12 similar kitchens nearby</div>
                  <a href="/quote" className="text-emerald-700 text-sm font-semibold hover:underline">Open secure chat →</a>
                </div>
              </motion.div>

              {/* Rotating badges */}
              {["DBS", "Insured", "Top Rated"].map((label, i) => (
                <motion.div
                  key={label}
                  className="absolute left-1/2 top-1/2"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                >
                  <div
                    className="px-3 py-1 rounded-full border border-zinc-200 bg-white text-[11px] text-zinc-700 shadow-sm"
                    style={{ transform: `rotate(${-120 * i}deg) translate(180px) rotate(${120 * i}deg)` }}
                  >
                    {label}
                  </div>
                </motion.div>
              ))}

              {/* Swipeable job thumbs (mobile-friendly) */}
              <div className="absolute left-1/2 -translate-x-1/2 bottom-4 w-[86%] overflow-x-auto no-scrollbar">
                <div className="flex gap-3 min-w-max">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-14 w-24 rounded-lg border border-zinc-200 bg-white shadow-sm flex items-center justify-center text-[11px] text-zinc-500">
                      Job {i + 1}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </SceneWrapper>

      {/* SCENE 4 — TRUST + CTA */}
      <SceneWrapper className="py-20">
        <div className="max-w-5xl w-full px-6 text-center">
          <h3 className="text-2xl md:text-4xl font-bold text-zinc-900">
            Built on <span className="text-emerald-600">Trust</span>
          </h3>
          <p className="mt-2 text-zinc-600">Numbers behind our promise.</p>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { k: "2,300+", v: "Projects Completed" },
              { k: "4.9/5", v: "Average Rating" },
              { k: "10+ yrs", v: "Team Experience" },
            ].map((item, idx) => (
              <motion.div
                key={item.v}
                className="rounded-2xl border border-zinc-200 bg-white px-6 py-8 shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
              >
                <div className="text-3xl md:text-4xl font-extrabold text-zinc-900">
                  {item.k}
                </div>
                <div className="mt-1 text-zinc-600">{item.v}</div>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <a
              href="/quote"
              className="inline-flex items-center justify-center rounded-full px-7 py-3.5 font-semibold bg-emerald-500 text-white hover:bg-emerald-400 transition shadow-[0_8px_24px_rgba(16,185,129,0.35)]"
            >
              Get my instant estimate →
            </a>
            <p className="mt-2 text-[11px] text-zinc-600">Takes less than 60 seconds. No obligation.</p>
          </motion.div>
        </div>
      </SceneWrapper>
    </div>
  );
}
