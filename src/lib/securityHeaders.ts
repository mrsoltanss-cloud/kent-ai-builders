import type { NextResponse } from "next/server";

export function applySecurityHeaders(res: NextResponse) {
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  // Safe baseline CSP for your app; adjust later if needed.
  res.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; img-src 'self' data:; script-src 'self'; style-src 'self' 'unsafe-inline'; connect-src 'self' https: http:;"
  );
}
