export type Urgency = 'FLEXIBLE'|'SOON'|'URGENT'
export type LeadStatus = 'NEW'|'BIDDING'|'HOT'|'FILLED'|'EXPIRING'

export function statusMeta(s: LeadStatus){
  switch(s){
    case 'NEW':      return {label:'💥 NEW – be the first to contact',  cls:'bg-emerald-500/15 text-emerald-200 border-emerald-400/30'};
    case 'BIDDING':  return {label:'⚡ Bidding in progress',            cls:'bg-amber-500/15 text-amber-200 border-amber-400/30'};
    case 'HOT':      return {label:'🔥 Popular – multiple trades bidding', cls:'bg-orange-500/15 text-orange-200 border-orange-400/30'};
    case 'FILLED':   return {label:'🚫 Job filled – closing soon',      cls:'bg-rose-500/15 text-rose-200 border-rose-400/30'};
    case 'EXPIRING': return {label:'⏳ Expires soon',                   cls:'bg-slate-500/15 text-slate-200 border-slate-400/30'};
  }
}

export function heatToPct(used:number, total:number){
  if(total<=0) return 0
  return Math.max(0, Math.min(100, Math.round((used/total)*100)))
}
