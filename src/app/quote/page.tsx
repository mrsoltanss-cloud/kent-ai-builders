export const dynamic = "force-dynamic";           // ensure this page never prerenders statically
export const revalidate = 0;

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/options";
import QuoteClient from "./QuoteClient";

export default async function QuotePage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect(`/auth/signin?callbackUrl=${encodeURIComponent("/quote")}`);
  }
  return <QuoteClient />;
}
