import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "../../../../../../lib/prisma";

const UI_ORDER = ["new","pending_review","awaiting_contact","scheduled","in_progress","complete","archived","cancelled"] as const;
type UiStatus = typeof UI_ORDER[number];
const norm = (x: unknown) => String(x ?? "").toLowerCase();
const allow = (r?: string|null) => !!r && ["ADMIN","OPS"].includes(String(r).toUpperCase());

function writer(currentDbStatus: string){
  const up = /^[A-Z_]+$/.test(currentDbStatus);
  const upMap: Record<UiStatus,string> = {new:"NEW",pending_review:"PENDING_REVIEW",awaiting_contact:"AWAITING_CONTACT",scheduled:"SCHEDULED",in_progress:"IN_PROGRESS",complete:"COMPLETE",archived:"ARCHIVED",cancelled:"CANCELLED"};
  const loMap: Record<UiStatus,string> = {new:"new",pending_review:"pending_review",awaiting_contact:"awaiting_contact",scheduled:"scheduled",in_progress:"in_progress",complete:"complete",archived:"archived",cancelled:"cancelled"};
  return (ui: UiStatus)=> up? upMap[ui] : loMap[ui];
}

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const session = await getServerSession();
  const email = (session as any)?.user?.email as string|undefined;
  if(!email) return NextResponse.json({error:"Unauthorized"},{status:401});
  const me = await prisma.user.findUnique({where:{email},select:{role:true}});
  if(!allow(me?.role??null)) return NextResponse.json({error:"Forbidden"},{status:403});

  const body = await req.json().catch(()=> ({}));
  const action = body?.action as "forward"|"back"|"set"|undefined;
  const value  = body?.value as string|undefined;

  const lead = await prisma.lead.findUnique({where:{id}});
  if(!lead) return NextResponse.json({error:"Not found"},{status:404});

  const curKey = UI_ORDER.find(k=>norm(lead.status)===k) ?? "new";
  const idx = UI_ORDER.indexOf(curKey);
  let next: UiStatus = curKey;

  if(action==="set"){
    const v = norm(value) as UiStatus;
    if(!UI_ORDER.includes(v)) return NextResponse.json({error:"Invalid status value"},{status:400});
    next = v;
  } else if(action==="forward"){
    next = UI_ORDER[Math.min(idx+1, UI_ORDER.length-1)];
  } else if(action==="back"){
    next = UI_ORDER[Math.max(idx-1, 0)];
  } else {
    return NextResponse.json({error:"Invalid action"},{status:400});
  }

  const toDb = writer(String(lead.status));
  const updated = await prisma.lead.update({where:{id}, data:{ status: toDb(next) as any }});
  return NextResponse.json({ok:true, lead: updated});
}
