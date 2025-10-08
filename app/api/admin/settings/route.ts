import { NextResponse } from "next/server";
export async function GET(){
  const mask = (v?: string)=> v ? (v.length <= 6 ? "***" : v.slice(0,2) + "****" + v.slice(-2)) : null;
  return NextResponse.json({
    ok:true,
    env: {
      NEXTAUTH_URL: process.env.NEXTAUTH_URL ?? null,
      OPENAI_API_KEY: mask(process.env.OPENAI_API_KEY),
      DATABASE_URL: mask(process.env.DATABASE_URL),
      WHATSAPP_NUMBER: process.env.WHATSAPP_NUMBER ?? null,
      SALES_EMAIL: process.env.SALES_EMAIL ?? null,
    }
  });
}
