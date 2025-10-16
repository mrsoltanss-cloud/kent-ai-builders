"use client";
import { motion } from "framer-motion";

export default function FlowStep({
  k, title, subtitle, children,
}: { k: number; title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <motion.div
      key={`step-${k}`}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 14 }}
      transition={{ duration: .4 }}
      className="rounded-2xl border border-gray-200 bg-white/90 p-5 shadow-md backdrop-blur md:p-7"
    >
      <div className="mb-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Step {k}</div>
        <h2 className="mt-1 text-xl font-semibold md:text-2xl">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-gray-600">{subtitle}</p>}
      </div>
      {children}
    </motion.div>
  );
}
