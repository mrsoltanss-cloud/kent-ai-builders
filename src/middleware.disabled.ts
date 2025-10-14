import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const p = req.nextUrl.pathname
  if (p === '/my' || p === '/me' || p === '/homeowner') {
    const url = req.nextUrl.clone()
    url.pathname = '/my/portal'
    return NextResponse.redirect(url)
  }
}

export const config = {
  matcher: ['/my', '/me', '/homeowner'],
}
