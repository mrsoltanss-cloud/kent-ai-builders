import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};

export async function middleware(req: Request) {
  const url = new URL(req.url);
  const pathname = url.pathname;

  // Public routes (keep onboarding & auth public)
  const isPublic =
    pathname === "/" ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/trade/signin") ||   // trade sign-in is public
    pathname.startsWith("/trade/signup") ||
    pathname.startsWith("/trade/onboarding") ||
    pathname.startsWith("/api/auth");

  if (isPublic) return NextResponse.next();

  // Protected: require a session
  const token = await getToken({ req: req as any });
  const isAuthed = !!token;

  // Trade private areas
  const TRADE_PRIVATE = ["/trade/profile", "/trade/leads", "/trade/jobs", "/trade/watchlist"];
  const isTradePrivate = TRADE_PRIVATE.some((p) => pathname.startsWith(p));

  if (!isAuthed) {
    // ⬅️ CHANGE: unauthenticated users going to trade areas go to /trade/signin (no callbackUrl)
    if (isTradePrivate) {
      return NextResponse.redirect(new URL("/trade/signin", url), 302);
    }
    // Non-trade protected pages still go to homeowner sign-in with callback
    const callbackUrl = encodeURIComponent(url.pathname + url.search);
    return NextResponse.redirect(new URL(`/auth/signin?callbackUrl=${callbackUrl}`, url), 302);
  }

  // Role gate: only BUILDER/ADMIN can access trade private
  const role = (token as any)?.role || (token as any)?.user?.role;
  if (isTradePrivate && role !== "BUILDER" && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/trade/signin?error=wrong_role", url), 302);
  }

  return NextResponse.next();
}
