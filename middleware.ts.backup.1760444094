import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname
  if (!pathname.startsWith('/trade')) return NextResponse.next()

  // Dev bypass: allow if ?dev=1
  if (req.nextUrl.searchParams.get('dev') === '1') return NextResponse.next()

  // Simple session check via cookie presence (placeholder)
  const hasSession = req.cookies.get('next-auth.session-token') || req.cookies.get('__Secure-next-auth.session-token')
  if (!hasSession) {
    const url = new URL('/api/auth/signin', req.url)
    url.searchParams.set('callbackUrl', req.nextUrl.pathname)
    return NextResponse.redirect(url)
  }
  return NextResponse.next()
}

export const config = { matcher: ['/trade/:path*'] }
