import { NextResponse } from 'next/server'

export async function GET() {
  // TODO: read session, fetch BuilderProfile for user
  return NextResponse.json({ profile: null, todo: true })
}

export async function POST(req: Request) {
  // TODO: validate body (zod), upsert BuilderProfile for user
  const body = await req.json().catch(() => ({}))
  return NextResponse.json({ ok: true, received: body, todo: true })
}
