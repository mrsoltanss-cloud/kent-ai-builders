import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const url = new URL(req.url);

  // Redirect legacy entry points to the new portal
  if (url.pathname === '/my' || url.pathname === '/homeowner') {
    url.pathname = '/my/portal';
    return NextResponse.redirect(url, 308); // permanent
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/my', '/homeowner'],
};
