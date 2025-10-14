import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

export async function middleware(req: Request) {
  const url = new URL(req.url);
  const pathname = url.pathname;
  const referer = (req.headers.get("referer") || "").toString();

  // --- Trade-aware redirect: ensure signup's "Already a member? Sign in" goes to /trade/signin ---
  // If user is navigating to homeowner /auth/signin from any trade page (or ?from=trade), redirect them.
  if (
    pathname === "/auth/signin" &&
    (referer.includes("/trade/") || url.searchParams.get("from") === "trade")
  ) {
    return NextResponse.redirect(new URL("/trade/signin", url), 302);
  }

  // Public routes
  const isPublic =
    pathname === "/" ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/trade/signin") ||
    pathname.startsWith("/trade/signup") ||
    pathname.startsWith("/trade/onboarding") ||
    pathname.startsWith("/api/auth");

  if (isPublic) return NextResponse.next();

  // Auth check for protected routes
  const token = await getToken({ req: req as any });
  if (!token) {
    // For trade private areas, send to trade sign-in (no callbackUrl)
    const TRADE_PRIVATE = ["/trade/profile", "/trade/leads", "/trade/jobs", "/trade/watchlist"];
    const isTradePrivate = TRADE_PRIVATE.some((p) => pathname.startsWith(p));
    if (isTradePrivate) {
      return NextResponse.redirect(new URL("/trade/signin", url), 302);
    }
    // Other protected → homeowner sign-in (keeps your original behavior)
    const callbackUrl = encodeURIComponent(url.pathname + url.search);
    return NextResponse.redirect(new URL(`/auth/signin?callbackUrl=${callbackUrl}`, url), 302);
  }

  // Role-gate trade private (optional but useful)
  const TRADE_PRIVATE = ["/trade/profile", "/trade/leads", "/trade/jobs", "/trade/watchlist"];
  const isTradePrivate = TRADE_PRIVATE.some((p) => pathname.startsWith(p));
  const role = (token as any)?.role || (token as any)?.user?.role;
  if (isTradePrivate && role !== "BUILDER" && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/trade/signin?error=wrong_role", url), 302);
  }

  return NextResponse.next();
}
