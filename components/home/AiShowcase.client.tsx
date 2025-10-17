"use client";
import * as React from "react";

/** Minimal client wrapper used by HomeAiShowcase.
 *  It simply renders its children. You can enhance it later if needed.
 */
export default function AiShowcase({ children }: { children?: React.ReactNode }) {
  return <>{children}</>;
}
