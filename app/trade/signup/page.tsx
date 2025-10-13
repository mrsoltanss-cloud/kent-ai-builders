/** 🚫 DO NOT EDIT — locked by Mr Soltan on 2025-10-13  
  This page is visually approved. Changes should go to a new variant file.
*/

"use client"
import { motion } from "framer-motion"
import RippleButton from "@/components/ui/RippleButton"
import TypewriterText from "@/components/ui/TypewriterText"
import Particles from "@/components/fx/Particles"
import Tilt from "@/components/fx/Tilt"
import TrustBadges from "@/components/ui/TrustBadges"
import Spotlight from "@/components/fx/Spotlight"

export default function TradeSignupPage() {
  return (
    <div className="fixed inset-0 z-50 bg-aurora overflow-hidden grain">
      <Particles className="opacity-35" />
      <Spotlight className="opacity-70" />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <Tilt className="w-[min(720px,92vw)]">
          
import Magnetic from "/components/fx/Magnetic"

<Magnetic><motion.div
            initial={{ opacity: 0, y: 18, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.55, ease: [0.25,0.1,0.25,1] }}
            className="relative glass-card shimmer gold-rim rounded-2xl p-8 md:p-12 text-center text-white"
          >
            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5, ease: [0.25,0.1,0.25,1] }}
              className="text-3xl md:text-5xl font-semibold mb-3 leading-tight"
            >
              AI that brings great builders into the 21st century.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.45 }}
              className="text-slate-200 mb-3"
            >
              Win better projects. Verified profile. Instant AI visibility.
            </motion.p>

            <TypewriterText
              className="text-cyan-200 mb-6"
              phrases={[
                'AI job matching that favours quality builders.',
                'Instant estimates that convert serious homeowners.',
                'Smart reputation that grows with every project.',
                'Verified profiles that signal trust at a glance.',
                'Portfolio-first profiles that showcase real craft.',
                'Coverage radius so the right jobs find you fast.',
                'Pro response tools that save hours per week.',
                'A network built for modern, professional trades.'
              ]}
            />

            
import Magnetic from "/components/fx/Magnetic"

<Magnetic><motion.div
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
              className="flex flex-wrap justify-center gap-2 mb-8"
            >
              {["AI job matching","Instant estimates","Smart reputation"].map((s) => (
                <motion.span
                  key={s}
                  variants={{ hidden: { opacity: 0, y: 6 }, show: { opacity: 1, y: 0 } }}
                  className="px-3 py-1 border border-white/25 rounded-full text-sm"
                >
                  {s}
                </motion.span>
              ))}
            </motion.div>

            <div className="grid gap-3">
              <RippleButton
                onClick={() => (window.location.href = "/api/auth/signin?provider=email")}
                className="h-12 rounded-xl bg-cyan-500 text-white hover:bg-cyan-400 transition-colors font-medium shadow-[0_0_28px_rgba(6,182,212,0.55)]"
              >
                Continue with Email
              </RippleButton>
            </div>

            <p className="text-slate-300 text-sm mt-6">
              Already a member?{" "}
              <a href="/api/auth/signin?provider=email" className="text-cyan-300 hover:underline">Sign in</a>
            </p>

            <TrustBadges />
          </motion.div>
        </Tilt>
      </div>
    </div>
  )
}
