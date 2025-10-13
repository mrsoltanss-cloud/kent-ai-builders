import { NextResponse } from 'next/server'

export async function GET() {
  // TODO: use session.user.id to filter
  return NextResponse.json({ leads: [], todo: true })
}
