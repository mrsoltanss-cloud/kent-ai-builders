import type { ReactNode } from "react";
import HeroBelt from "@/components/quote/HeroBelt";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function QuoteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
      <HeroBelt />
      {children}
    </div>
  );
}
