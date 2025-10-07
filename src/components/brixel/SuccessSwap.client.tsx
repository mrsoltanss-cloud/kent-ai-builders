"use client";
import React, { useMemo } from "react";
import BrixelSuccessPanel from "./BrixelSuccessPanel";

export default function SuccessSwap({
  service,
  town,
  summary,
}: {
  service?: string;
  town?: string;
  summary?: string;
}) {
  const reference = useMemo(() => {
    if (typeof window === "undefined") return "";
    const sp = new URLSearchParams(window.location.search);
    return sp.get("ref") || "";
  }, []);
  return (
    <BrixelSuccessPanel
      reference={reference || "BK-REF"}
      service={service}
      town={town}
      summary={summary}
    />
  );
}
