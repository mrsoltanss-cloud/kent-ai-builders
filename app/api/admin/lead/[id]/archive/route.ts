import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "../../../../../../lib/prisma";
const allow = (r?: string|null)=> !!r && ["ADMIN","OPS"].includes(String(r).toUpperCase());
const archivedLike = (s: string)=> /^[A-Z_]+$/.test(s) ? "ARCHIVED" : "archived";

export async function POST(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const session = await getServerSession();
  const email = (session as any)?.user?.email as string|undefined;
  if(!email) return NextResponse.json({error:"Unauthorized"},{status:401});
  const me = await prisma.user.findUnique({where:{email}, select:{role:true}});
  if(!allow(me?.role??null)) return NextResponse.json({error:"Forbidden"},{status:403});

  const lead = await prisma.lead.findUnique({where:{id}, select:{status:true}});
  if(!lead) return NextResponse.json({error:"Not found"},{status:404});

  const updated = await prisma.lead.update({where:{id}, data:{ status: archivedLike(String(lead.status)) as any }});
  return NextResponse.json({ok:true, lead: updated});
}
