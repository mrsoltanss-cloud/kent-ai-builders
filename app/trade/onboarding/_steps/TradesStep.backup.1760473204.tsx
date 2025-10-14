"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const TRADES = [
  { id: "bricklayer", label: "Bricklayer", icon: "🧱" },
  { id: "plumber", label: "Plumber", icon: "🚰" },
  { id: "electrician", label: "Electrician", icon: "⚡" },
  { id: "carpenter", label: "Carpenter", icon: "🪚" },
  { id: "roofer", label: "Roofer", icon: "🏠" },
  { id: "painter", label: "Painter", icon: "🎨" },
  { id: "tiler", label: "Tiler", icon: "🧩" },
  { id: "plasterer", label: "Plasterer", icon: "🪵" },
];

export default function TradesStep({ onBack }: { onBack?: () => void }) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleTrade = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const ready = selected.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <button
          onClick={onBack}
          className="text-sky-300 hover:text-sky-100 transition"
        >
          ← Back
        </button>
        <span className="text-sky-300 text-sm">
          {selected.length} selected
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {TRADES.map((trade) => {
          const active = selected.includes(trade.id);
          return (
            <motion.button
              key={trade.id}
              onClick={() => toggleTrade(trade.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className={`flex flex-col items-center justify-center p-6 rounded-2xl border transition-all duration-200 ${
                active
                  ? "border-yellow-400 bg-yellow-400/10 text-yellow-300 shadow-[0_0_15px_rgba(250,204,21,0.3)]"
                  : "border-sky-500/30 bg-white/5 text-sky-200 hover:border-sky-400/60"
              }`}
            >
              <span className="text-3xl mb-2">{trade.icon}</span>
              <span className="font-medium">{trade.label}</span>
            </motion.button>
          );
        })}
      </div>

      <button
        disabled={!ready}
        className={`w-full py-3 mt-6 font-semibold rounded-xl transition-all ${
          ready
            ? "bg-gradient-to-r from-sky-500 to-cyan-400 text-slate-900 shadow-lg shadow-cyan-500/30 hover:opacity-90"
            : "bg-white/10 text-sky-200 cursor-not-allowed"
        }`}
        onClick={() => alert("Next step placeholder")}
      >
        Continue →
      </button>
    </motion.div>
  );
}
