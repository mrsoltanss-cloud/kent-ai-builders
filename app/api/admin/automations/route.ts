import { NextResponse } from "next/server";
export async function GET(){
  const examples = [
    { id:"a1", name:"Email admin on new lead", trigger:"lead.created", action:"email", enabled:true },
    { id:"a2", name:"Ping builder when survey booked", trigger:"lead.survey_booked", action:"email+whatsapp", enabled:false },
  ];
  return NextResponse.json({ ok:true, automations: examples });
}
