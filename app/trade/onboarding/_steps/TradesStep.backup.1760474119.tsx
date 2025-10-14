"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CORE_TRADES = [
  { id: "bricklayer", label: "Bricklayer", icon: "🧱" },
  { id: "plumber", label: "Plumber", icon: "🚰" },
  { id: "electrician", label: "Electrician", icon: "⚡" },
  { id: "carpenter", label: "Carpenter / Joiner", icon: "🪚" },
  { id: "roofer", label: "Roofer", icon: "🏠" },
  { id: "painter", label: "Painter & Decorator", icon: "🎨" },
  { id: "tiler", label: "Tiler", icon: "🧩" },
  { id: "plasterer", label: "Plasterer / Renderer", icon: "🪵" },
  { id: "windows", label: "Window & Door Installer", icon: "🚪" },
  { id: "bathroom", label: "Bathroom Fitter", icon: "🧺" },
  { id: "kitchen", label: "Kitchen Fitter", icon: "🍳" },
  { id: "builder", label: "General Builder", icon: "🏗️" },
  { id: "handyman", label: "Handyman", icon: "🔧" },
];

const SPECIAL_TRADES = [
  { id: "landscaper", label: "Landscaper / Gardener", icon: "🪴" },
  { id: "glazier", label: "Glazier", icon: "🪟" },
  { id: "heating", label: "Heating Engineer", icon: "🔥" },
  { id: "ac", label: "Air Conditioning", icon: "❄️" },
  { id: "drainage", label: "Drainage Specialist", icon: "🪠" },
  { id: "maintenance", label: "Maintenance Engineer", icon: "🧰" },
  { id: "fire", label: "Fire Safety Installer", icon: "🧯" },
  { id: "smart", label: "Smart Home Installer", icon: "🧑‍💻" },
  { id: "tree", label: "Tree Surgeon", icon: "🌳" },
  { id: "cleaning", label: "Cleaning & Aftercare", icon: "🧼" },
];

export default function TradesStep({ onBack }: { onBack?: () => void }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [showMore, setShowMore] = useState(false);
  const [query, setQuery] = useState("");

  const allTrades = useMemo(
    () => [...CORE_TRADES, ...(showMore ? SPECIAL_TRADES : [])],
    [showMore]
  );

  const filteredTrades = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q
      ? allTrades.filter((t) => t.label.toLowerCase().includes(q))
      : allTrades;
  }, [query, allTrades]);

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
      {/* Header */}
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

      {/* Search */}
      <input
        type="text"
        placeholder="Search a trade..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-sky-500/30 text-sky-100 placeholder-sky-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
      />

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <AnimatePresence>
          {filteredTrades.map((trade) => {
            const active = selected.includes(trade.id);
            return (
              <motion.button
                key={trade.id}
                layout
                onClick={() => toggleTrade(trade.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className={`flex flex-col items-center justify-center p-5 rounded-2xl border transition-all duration-200 ${
                  active
                    ? "border-yellow-400 bg-yellow-400/10 text-yellow-300 shadow-[0_0_15px_rgba(250,204,21,0.3)]"
                    : "border-sky-500/30 bg-white/5 text-sky-200 hover:border-sky-400/60"
                }`}
              >
                <span className="text-3xl mb-2">{trade.icon}</span>
                <span className="font-medium text-center text-sm sm:text-base">
                  {trade.label}
                </span>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Show more toggle */}
      {!showMore && (
        <div className="flex justify-center mt-2">
          <button
            onClick={() => setShowMore(true)}
            className="text-sky-400 hover:text-cyan-300 text-sm underline"
          >
            + Show more trades
          </button>
        </div>
      )}

      {/* Continue */}
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
