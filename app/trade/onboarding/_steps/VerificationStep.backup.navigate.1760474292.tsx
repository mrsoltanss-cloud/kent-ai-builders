"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { CheckCircle2 } from "lucide-react";

export default function VerificationStep({ onBack }: { onBack?: () => void }) {
  const [proofs, setProofs] = useState([
    { id: "insurance", name: "Insurance Policy", uploaded: false },
    { id: "id", name: "Photo ID", uploaded: false },
    { id: "cert", name: "Certificates", uploaded: false },
  ]);

  const handleUpload = (id: string) => {
    setProofs((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, uploaded: true } : p
      )
    );
    const done = proofs.filter((p) => p.uploaded).length + 1;
    if (done === proofs.length) {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.7 } });
    }
  };

  const uploadedCount = proofs.filter((p) => p.uploaded).length;
  const progress = (uploadedCount / proofs.length) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <button onClick={onBack} className="text-sky-300 hover:text-sky-100 transition">
          ← Back
        </button>
        <span className="text-amber-400 text-sm font-semibold">
          {uploadedCount}/{proofs.length} Verified
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-amber-400 to-yellow-300"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.6 }}
        />
      </div>

      <div className="grid sm:grid-cols-3 gap-5">
        {proofs.map((p) => (
          <motion.div
            key={p.id}
            whileHover={{ scale: 1.03 }}
            className={`relative rounded-2xl border-2 ${
              p.uploaded
                ? "border-amber-400/60 bg-gradient-to-b from-slate-900/60 to-amber-950/10"
                : "border-slate-600/40 bg-slate-900/40"
            } p-6 text-center transition-all`}
          >
            <div className="text-sky-200 font-medium mb-3">{p.name}</div>
            {!p.uploaded ? (
              <label
                htmlFor={p.id}
                className="block cursor-pointer rounded-xl border border-sky-500/40 bg-white/5 py-3 px-4 text-sky-300 hover:bg-white/10 transition"
              >
                Upload File
                <input
                  id={p.id}
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={() => handleUpload(p.id)}
                  className="hidden"
                />
              </label>
            ) : (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center"
                >
                  <CheckCircle2 className="text-amber-400 w-8 h-8 mb-2" />
                  <p className="text-amber-300 text-sm">Verified</p>
                </motion.div>
              </AnimatePresence>
            )}
          </motion.div>
        ))}
      </div>

      {/* Continue */}
      <button
        disabled={uploadedCount < 2}
        onClick={() =>
          alert("Verification complete — proceeding to Review Step")
        }
        className={`w-full py-3 font-semibold rounded-xl transition-all ${
          uploadedCount >= 2
            ? "bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-900 shadow-lg shadow-amber-400/30 hover:opacity-90"
            : "bg-white/10 text-sky-200 cursor-not-allowed"
        }`}
      >
        Continue →
      </button>
    </motion.div>
  );
}
