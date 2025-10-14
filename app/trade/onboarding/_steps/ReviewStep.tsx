"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ReviewStep({ onBack }: { onBack?: () => void }) {
  const [published, setPublished] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (published) {
      confetti({ particleCount: 160, spread: 100, origin: { y: 0.6 } });
      const timer = setTimeout(() => {
        router.push("/trade/onboarding/success");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [published, router]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="flex justify-between items-center">
        <button onClick={onBack} className="text-sky-300 hover:text-sky-100 transition">
          ← Back
        </button>
        <span className="text-sm text-amber-400 font-semibold">Final Review</span>
      </div>

      {/* Review Summary */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-white/5 border border-white/10 p-5 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-amber-300 mb-2">Company Details</h3>
          <p className="text-slate-300 text-sm">Your company name, contact info & bio summary.</p>
        </div>
        <div className="rounded-2xl bg-white/5 border border-white/10 p-5 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-amber-300 mb-2">Trades & Services</h3>
          <p className="text-slate-300 text-sm">Selected trades & categories.</p>
        </div>
        <div className="rounded-2xl bg-white/5 border border-white/10 p-5 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-amber-300 mb-2">Coverage Area</h3>
          <p className="text-slate-300 text-sm">Service radius & location coverage.</p>
        </div>
        <div className="rounded-2xl bg-white/5 border border-white/10 p-5 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-amber-300 mb-2">Portfolio</h3>
          <p className="text-slate-300 text-sm">2–3 showcase projects uploaded.</p>
        </div>
        <div className="rounded-2xl bg-white/5 border border-white/10 p-5 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-amber-300 mb-2">Verification</h3>
          <p className="text-slate-300 text-sm">Insurance + ID verified ✅</p>
        </div>
      </div>

      {/* Publish Section */}
      <div className="text-center mt-10">
        {!published ? (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setPublished(true)}
            className="px-12 py-4 rounded-2xl text-slate-900 font-bold text-lg bg-gradient-to-r from-amber-400 to-yellow-300 shadow-[0_0_25px_rgba(250,204,21,0.4)] hover:shadow-[0_0_35px_rgba(250,204,21,0.6)] transition"
          >
            🚀 Go Live
          </motion.button>
        ) : (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center space-y-3"
            >
              <CheckCircle2 className="w-12 h-12 text-amber-400" />
              <h3 className="text-amber-300 font-semibold text-xl">
                Profile Published Successfully!
              </h3>
              <p className="text-slate-400 text-sm">
                Redirecting to your profile dashboard in 5 seconds …
              </p>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
}
