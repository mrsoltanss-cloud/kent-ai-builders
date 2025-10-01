import { NextResponse, NextRequest } from "next/server";

/** Apply required security headers to any NextResponse */
function applySecurityHeaders(res: NextResponse) {
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; img-src 'self' data:; script-src 'self'; style-src 'self' 'unsafe-inline'; connect-src 'self' https: http:;"
  );
}

/** Minimal cookie check for NextAuth session token (works for local HTTP & HTTPS) */
function hasSessionCookie(req: NextRequest): boolean {
  const c = req.cookies;
  return Boolean(
    c.get("next-auth.session-token")?.value ||
    c.get("__Secure-next-auth.session-token")?.value ||
    c.get("authjs.session-token")?.value
  );
}

export function middleware(req: NextRequest) {
  const url = req.nextUrl;

  // Protect these routes (mirrors your existing behavior)
  const protectedPrefixes = ["/home", "/trade", "/quote"];
  const needsAuth = protectedPrefixes.some((p) => url.pathname.startsWith(p));

  if (needsAuth && !hasSessionCookie(req)) {
    const signin = new URL("/auth/signin", req.url);
    signin.searchParams.set("callbackUrl", url.pathname + url.search);
    const redirectRes = NextResponse.redirect(signin);
    applySecurityHeaders(redirectRes);
    return redirectRes;
  }

  // Fall-through: allow, but add security headers
  const res = NextResponse.next();
  applySecurityHeaders(res);
  return res;
}

export const config = {
  // run on everything (excluding _next/static etc handled by Next automatically)
  matcher: ["/:path*"],
};
