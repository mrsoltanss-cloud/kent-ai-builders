"use client";
import React from "react";

/** Minimal pass-through Providers to satisfy app/layout.tsx without changing UI */
export default function Providers({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
