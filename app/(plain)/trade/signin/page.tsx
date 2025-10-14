import { Suspense } from "react";
import SigninClient from "./SigninClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function Page() {
  return (
    <Suspense fallback={null}>
      <SigninClient />
    </Suspense>
  );
}
