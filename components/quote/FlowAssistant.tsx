"use client";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function FlowAssistant({ tip }: { tip: string }) {
  return (
    <motion.div
      initial={{ y: 16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-4 left-4 z-[60] max-w-xs rounded-2xl border border-emerald-100 bg-white/90 px-3.5 py-3 text-sm text-gray-700 shadow-lg backdrop-blur md:left-10 md:bottom-8"
    >
      <div className="mb-1 flex items-center gap-2 text-emerald-700">
        <Sparkles className="h-4 w-4" />
        <span className="text-xs font-semibold uppercase tracking-wide">AI tip</span>
      </div>
      <p>{tip}</p>
    </motion.div>
  );
}
