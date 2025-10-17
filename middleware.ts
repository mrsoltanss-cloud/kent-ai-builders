import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: Request) {
  const url = new URL(req.url);
  const token = await getToken({ req: req as any });
  if (!token) {
    const callbackUrl = encodeURIComponent(url.pathname + url.search);
    return NextResponse.redirect(new URL(`/auth/signin?callbackUrl=${callbackUrl}`, url.origin));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/trade/:path*",
    "/home/:path*",
  ],
};
