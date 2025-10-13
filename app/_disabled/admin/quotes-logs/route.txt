import { NextResponse } from "next/server";
export async function GET(){
  // If you log AI requests later, return them here
  return NextResponse.json({ ok:true, logs: [] });
}
