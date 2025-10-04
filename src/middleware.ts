import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl;

  // 1) /me -> /my
  if (url.pathname === '/me') {
    const to = url.clone();
    to.pathname = '/my';
    return NextResponse.redirect(to);
  }

  // 2) Ensure sign-in carries a callback to our post-signin router
  if (url.pathname === '/auth/signin' && !url.searchParams.has('callbackUrl')) {
    const to = url.clone();
    to.searchParams.set('callbackUrl', '/auth/post-signin');
    return NextResponse.redirect(to);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/me', '/auth/signin'],
};
