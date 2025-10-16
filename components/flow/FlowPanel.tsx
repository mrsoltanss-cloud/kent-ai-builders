"use client";
import { motion } from "framer-motion";

export default function FlowPanel({
  k, title, subtitle, children,
}: { k: number; title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <motion.div
      key={`panel-${k}`}
      initial={{ opacity: 0, y: 16, scale: .995 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 16, scale: .995 }}
      transition={{ duration: .45 }}
      className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-[0_10px_60px_rgba(16,185,129,0.08)] backdrop-blur md:p-8"
    >
      <div className="mb-4">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700">Step {k}</div>
        <h2 className="mt-1 text-[22px] font-semibold md:text-2xl">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-gray-600">{subtitle}</p>}
      </div>
      {children}
    </motion.div>
  );
}
