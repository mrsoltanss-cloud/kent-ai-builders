import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import QuoteClient from "./QuoteClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function QuotePage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect(`/auth/signin?callbackUrl=${encodeURIComponent("/quote")}`);
  }
  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-semibold">Get your instant estimate</h1>
      <p className="text-slate-600 mt-2">You are signed in. Continue with your quote flow…</p>
      <QuoteClient />
    </main>
  );
}
