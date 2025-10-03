"use client";
import { BUILD_ID, BUILD_TIME } from "@/build-info";

export default function FooterBuild(){
  return (
    <div className="w-full border-t border-gray-200 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/50">
      <div className="mx-auto max-w-6xl px-4 py-3 text-xs text-gray-600 flex items-center justify-between">
        <span>£5m Insurance · 12-month guarantee · DBS-checked teams</span>
        <span className="tabular-nums">Build: {BUILD_ID} · {new Date(BUILD_TIME).toLocaleString()}</span>
      </div>
    </div>
  );
}
