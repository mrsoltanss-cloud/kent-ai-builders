import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

function isPublicPath(pathname: string) {
  return (
    pathname === "/quote/success" ||
    pathname.startsWith("/quote/success") ||
    pathname === "/dev-success-preview"
  );
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow the success/preview routes to pass through
  if (isPublicPath(pathname)) return NextResponse.next();

  // TODO: paste your original logic below if you had redirects/auth checks.
  // For example:
  // if (!authed) return NextResponse.redirect(new URL("/auth/signin", req.url));

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
