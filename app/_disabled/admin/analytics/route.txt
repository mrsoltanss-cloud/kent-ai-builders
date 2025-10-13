import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "../../../../lib/prisma";
const allow = (r?: string|null)=> !!r && ["ADMIN","OPS"].includes(String(r).toUpperCase());

export async function GET(){
  const session = await getServerSession();
  const email = (session as any)?.user?.email as string|undefined;
  if(!email) return NextResponse.json({error:"Unauthorized"},{status:401});
  const me = await prisma.user.findUnique({where:{email}, select:{role:true}});
  if(!allow(me?.role??null)) return NextResponse.json({error:"Forbidden"},{status:403});

  const [users, leads] = await Promise.all([
    prisma.user.count(),
    prisma.lead.count(),
  ]);
  return NextResponse.json({ ok:true, totals: { users, leads } });
}
