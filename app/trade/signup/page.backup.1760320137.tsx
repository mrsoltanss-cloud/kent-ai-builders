"use client"

import { useRef } from "react"
import { motion } from "framer-motion"
import RippleButton from "../../../components/ui/RippleButton"
import Tilt from "../../../components/ui/Tilt"
import TypewriterText from "../../../components/ui/TypewriterText"
import TrustBadges from "../../../components/ui/TrustBadges"
import Magnetic from "../../../components/fx/Magnetic"

const phrases = [
  "AI job matching that favours quality builders.",
  "Instant estimates that convert curious to committed.",
  "Smart reputation: showcase your work, win trust.",
  "Verified network. Insurance-ready. GDPR friendly."
]

export default function TradeSignup() {
  const wrapRef = useRef<HTMLDivElement>(null)

  function onMove(e: React.MouseEvent) {
    const r = wrapRef.current?.getBoundingClientRect()
    if (!r) return
    const x = ((e.clientX - r.left) / r.width) * 100
    const y = ((e.clientY - r.top) / r.height) * 100
    wrapRef.current!.style.setProperty("--mx", `${x}%`)
    wrapRef.current!.style.setProperty("--my", `${y}%`)
  }

  return (
    <div className="fixed inset-0 z-50 bg-aurora signup-grain overflow-hidden" onMouseMove={onMove}>
      <div ref={wrapRef} className="signup-sweep h-full w-full flex items-center justify-center px-4 py-10">
        <div className="max-w-3xl w-full">
          <Magnetic strength={0.08}>
            <Tilt max={12} className="rounded-3xl glass-card rim-gold px-4 sm:px-6 py-8 sm:p-12 text-center text-white">
              <motion.div
                initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                <motion.h1
                  className="text-3xl sm:text-5xl font-extrabold tracking-tight"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                >
                  AI that brings great builders<br className="hidden sm:block" /> into the 21st century.
                </motion.h1>

                <p className="mt-4 text-slate-200/90">
                  Win better projects. Verified profile. Instant AI visibility.
                </p>

                <div className="mt-4 text-cyan-200/95">
                  <TypewriterText items={phrases} delay={1800} period={2600} />
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-sm">
                  <span className="rounded-full border border-white/30 px-3 py-1.5 bg-white/10">AI job matching</span>
                  <span className="rounded-full border border-white/30 px-3 py-1.5 bg-white/10">Instant estimates</span>
                  <span className="rounded-full border border-white/30 px-3 py-1.5 bg-white/10">Smart reputation</span>
                </div>

                <div className="mt-8">
                  <RippleButton
                    onClick={() => (window.location.href="/auth/signup?next=/trade/onboarding/account")}
                    className="h-12 w-full rounded-xl bg-cyan-500 text-white hover:bg-cyan-600 transition-colors text-base font-semibold"
                  >
                    Continue with Email
                <p className="mt-3 text-slate-300/90 text-sm"><a href="/trade/onboarding/account" className="hover:underline">Explore onboarding</a></p>
                  </RippleButton>
                </div>

                <p className="text-slate-300 text-sm mt-6">
                  Already a member?{" "}
                  <a href="/auth/signup?next=/trade/onboarding/account" className="text-cyan-300 hover:underline">
                    Sign in
                  </a>
                </p>

                <div className="mt-6 opacity-90">
                  <TrustBadges />
                </div>
              </motion.div>
            </Tilt>
          </Magnetic>
        </div>
      </div>
    </div>
  )
}
