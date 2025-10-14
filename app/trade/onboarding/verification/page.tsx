"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import VerificationStep from "../_steps/VerificationStep";

export default function VerificationPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-sky-950 to-slate-900 text-white flex flex-col items-center justify-center overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-6xl px-6 py-12 grid md:grid-cols-2 gap-8"
      >
        <div className="bg-white/5 backdrop-blur-xl border border-sky-500/20 rounded-2xl p-8 shadow-xl shadow-sky-500/10 overflow-hidden">
          <h1 className="text-3xl font-semibold text-sky-400 mb-2">Step 5 of 7</h1>
          <h2 className="text-4xl font-bold mb-6">Trust & verification</h2>
          <div className="w-full bg-white/10 rounded-full h-2 mb-10 overflow-hidden">
            <motion.div
              initial={{ width: "72%" }}
              animate={{ width: "86%" }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-cyan-400 via-sky-400 to-teal-500 rounded-full shadow-[0_0_10px_rgba(56,189,248,0.6)]"
            />
          </div>
          <VerificationStep onBack={() => router.push("/trade/onboarding/portfolio")} />
        </div>

        <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-slate-800/40 to-slate-900/60 border border-sky-500/10 rounded-2xl shadow-xl shadow-sky-900/30 p-8 backdrop-blur-xl">
          <div className="w-48 h-48 rounded-full bg-gradient-to-br from-amber-400/30 to-yellow-300/20 flex items-center justify-center mb-6">
            <span className="text-amber-300 text-3xl font-bold">🏅</span>
          </div>
          <h3 className="text-2xl font-bold mb-2">Verification Preview</h3>
          <p className="text-sky-200 text-sm text-center leading-relaxed max-w-xs">
            Upload insurance & ID to unlock the verified badge on your public profile.
          </p>
        </div>
      </motion.div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-cyan-500/20 blur-3xl rounded-full pointer-events-none"></div>
    </div>
  );
}
