"use client";
import React from "react";

export default function Tooltip({ text }: { text: string }) {
  return (
    <span className="group relative inline-flex items-center">
      <span
        className="ml-2 inline-flex h-5 w-5 cursor-default items-center justify-center rounded-full border border-gray-300 text-xs font-semibold text-gray-600 hover:bg-gray-50"
        aria-label={text}
      >i</span>
      <span className="pointer-events-none absolute left-6 top-1/2 z-10 hidden -translate-y-1/2 whitespace-pre rounded-md border bg-white px-3 py-2 text-xs text-gray-700 shadow-md group-hover:block">
        {text}
      </span>
    </span>
  );
}
