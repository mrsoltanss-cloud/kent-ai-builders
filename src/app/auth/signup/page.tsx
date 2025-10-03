import { Suspense } from "react";
import SignupClient from "./SignupClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-md px-4 py-10 text-gray-500">Loading…</div>}>
      <SignupClient />
    </Suspense>
  );
}
