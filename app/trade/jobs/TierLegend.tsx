"use client";
import TierPill from "./TierPill";
export default function TierLegend() {
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="text-gray-500">Tiers:</span>
      <TierPill tier="STANDARD" />
      <TierPill tier="QUICKWIN" />
      <TierPill tier="PRIORITY" />
    </div>
  );
}
