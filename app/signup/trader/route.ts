import { NextResponse } from "next/server";

const target = "/trade/signup";

export function GET(req: Request) {
  return NextResponse.redirect(new URL(target, req.url), 308);
}
export function HEAD(req: Request) {
  return NextResponse.redirect(new URL(target, req.url), 308);
}
export function POST(req: Request) {
  return NextResponse.redirect(new URL(target, req.url), 308);
}
export function PUT(req: Request) {
  return NextResponse.redirect(new URL(target, req.url), 308);
}
export function DELETE(req: Request) {
  return NextResponse.redirect(new URL(target, req.url), 308);
}
export function PATCH(req: Request) {
  return NextResponse.redirect(new URL(target, req.url), 308);
}
