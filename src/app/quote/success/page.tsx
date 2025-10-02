// SERVER component wrapper (no "use client")
import SuccessClient from "./SuccessClient";
import ConfettiOnce from "@/components/ConfettiOnce";

export const dynamic = "force-dynamic";

type SP = Record<string, string | string[] | undefined>;

export default async function QuoteSuccessPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;

  const refParam = sp?.ref;
  const ref =
    (Array.isArray(refParam) ? refParam[0] : refParam) ||
    `BK-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${String(
      Math.floor(Math.random() * 1e6)
    ).padStart(6, "0")}`;

  return (
    <>
      {/* Fire confetti once per tab/session (change key to re-test quickly) */}
      <ConfettiOnce mode="session" storageKey="success_confetti_v3" power={2} />
      <SuccessClient refId={ref} />
    </>
  );
}
