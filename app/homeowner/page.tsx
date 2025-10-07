import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Server redirect:
 * - If a NextAuth session cookie exists -> /my
 * - Else -> /homeowner/signup
 */
export default async function HomeownerGate() {
  const c = cookies();
  const hasSession =
    c.get("next-auth.session-token") ||
    c.get("__Secure-next-auth.session-token");

  if (hasSession) {
    redirect("/my");
  } else {
    redirect("/homeowner/signup");
  }
}
