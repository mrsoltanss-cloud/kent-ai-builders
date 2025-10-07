"use client";
import React from "react";
import Tooltip from "./Tooltip";

export default function StatsCard({
  label,
  value,
  suffix,
  tooltip,
}: {
  label: string;
  value: string | number;
  suffix?: string;
  tooltip?: string;
}) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">{label}</div>
        {tooltip ? <Tooltip text={tooltip} /> : null}
      </div>
      <div className="mt-2 text-3xl font-bold tracking-tight">
        {value}{suffix ? <span className="ml-1 text-lg text-gray-500">{suffix}</span> : null}
      </div>
    </div>
  );
}
