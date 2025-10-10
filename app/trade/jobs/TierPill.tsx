"use client";
export default function TierPill({ tier }: { tier: "STANDARD" | "QUICKWIN" | "PRIORITY" }) {
  const map: Record<string, string> = {
    STANDARD: "bg-gray-100 text-gray-700 ring-1 ring-gray-300",
    QUICKWIN: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    PRIORITY: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
  };
  const label = tier === "QUICKWIN" ? "Quick win" : tier === "PRIORITY" ? "Priority" : "Standard";
  return <span className={`text-xs px-2 py-0.5 rounded-full ${map[tier]}`}>{label}</span>;
}
