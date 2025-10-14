import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

export async function middleware(req: Request) {
  const url = new URL(req.url);
  const pathname = url.pathname;

  // Public routes
  const isPublic =
    pathname === "/" ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/trade/signin") ||
    pathname.startsWith("/trade/signup") ||
    pathname.startsWith("/trade/onboarding") ||
    pathname.startsWith("/api/auth");

  if (isPublic) return NextResponse.next();

  const token = await getToken({ req: req as any });

  const TRADE_PRIVATE = ["/trade/profile", "/trade/leads", "/trade/jobs", "/trade/watchlist"];
  const isTradePrivate = TRADE_PRIVATE.some((p) => pathname.startsWith(p));

  // Unauthed → correct trade gate
  if (!token && isTradePrivate) {
    return NextResponse.redirect(new URL("/trade/signin", url), 302);
  }

  // Other protected → homeowner sign-in (keeps existing behavior)
  if (!token) {
    const callbackUrl = encodeURIComponent(url.pathname + url.search);
    return NextResponse.redirect(new URL(`/auth/signin?callbackUrl=${callbackUrl}`, url), 302);
  }

  // Role gate for trade
  if (isTradePrivate) {
    const role = (token as any)?.role || (token as any)?.user?.role;
    if (role !== "BUILDER" && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/trade/signin?error=wrong_role", url), 302);
    }
  }

  return NextResponse.next();
}
