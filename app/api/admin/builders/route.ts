import { NextResponse } from "next/server";
export async function GET(){ 
  // TODO: Wire to real Builder model; for now return stub list
  return NextResponse.json({ ok:true, builders: [] });
}
