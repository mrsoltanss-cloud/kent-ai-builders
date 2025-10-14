import { redirect } from "next/navigation";

export default function SignInRedirect({ searchParams }: { searchParams: { next?: string; kind?: string } }) {
  const next = searchParams?.next || "";
  const kind = searchParams?.kind || "";
  // If this sign-in was invoked by the trade flow, bounce straight to onboarding
  if (kind === "trade" || next.startsWith("/trade/onboarding")) {
    ./* disabled *"/trade/onboarding");
  }
  // Otherwise, keep existing behaviour and send people to the normal login
  ./* disabled *`/login${next ? `?next=${encodeURIComponent(next)}` : ""}`);
}
