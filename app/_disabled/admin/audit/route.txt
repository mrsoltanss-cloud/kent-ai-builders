import { NextResponse } from "next/server";
export async function GET(){
  // TODO: Wire to a real Activity model; safe empty list for now
  return NextResponse.json({ ok:true, events: [] });
}
