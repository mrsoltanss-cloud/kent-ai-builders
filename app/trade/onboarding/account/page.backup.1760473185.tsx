"use client";

import { motion } from "framer-motion";
import AccountStep from "../_steps/AccountStep";

export default function TradeOnboardingAccount() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-sky-950 to-slate-900 text-white flex flex-col items-center justify-center overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        className="w-full max-w-6xl px-6 py-12 grid md:grid-cols-2 gap-8"
      >
        {/* Left Column */}
        <div className="bg-white/5 backdrop-blur-xl border border-sky-500/20 rounded-2xl p-8 shadow-xl shadow-sky-500/10">
          <h1 className="text-3xl font-semibold text-sky-400 mb-2">Step 1 of 7</h1>
          <h2 className="text-4xl font-bold mb-6">Create your trade account</h2>

          {/* Progress */}
          <div className="w-full bg-white/10 rounded-full h-2 mb-10 overflow-hidden">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "28%" }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-sky-400 via-cyan-400 to-teal-500 rounded-full shadow-[0_0_10px_rgba(56,189,248,0.6)]"
            />
          </div>

          <AccountStep />
        </div>

        {/* Right Column: Preview */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-slate-800/40 to-slate-900/60 border border-sky-500/10 rounded-2xl shadow-xl shadow-sky-900/30 p-8 backdrop-blur-xl"
        >
          <div className="w-48 h-48 rounded-full bg-gradient-to-br from-cyan-400/30 to-sky-500/20 flex items-center justify-center mb-6 overflow-hidden">
            <span className="text-sky-300 text-3xl font-bold">👷‍♂️</span>
          </div>
          <h3 className="text-2xl font-bold mb-2">Your Public Profile</h3>
          <p className="text-sky-200 text-sm text-center leading-relaxed max-w-xs">
            As you fill in your details, your live builder profile will update here in real time.
          </p>
        </motion.div>
      </motion.div>

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-cyan-500/20 blur-3xl rounded-full pointer-events-none"></div>
    </div>
  );
}
