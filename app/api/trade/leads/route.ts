import { NextResponse } from 'next/server'

const towns = ['Maidstone','Canterbury','Ashford','Tunbridge Wells','Dover','Whitstable']
const trades = [
  'Carpentry & joinery','Roofing & gutters','Brickwork & extensions','Bathroom refit','Kitchen refit',
  'Painting & decorating','Plumbing & heating','Electrical (rewire/EV)','Landscaping & patios','Fencing & decking',
  'Tiling & flooring','Plastering & rendering','Windows & doors','Driveways & paving',
  'Loft conversion / dormer','Garden office / outbuilding','Handyman & maintenance'
]
const tagsPool = ['loft','kitchen','bathroom','brickwork','render','electrics','boiler','tiling','flooring','patio','decking','fencing','roof','gutter','insulation','windows','doors','extension','EV','solar']

function rand<T>(a:T[]){ return a[Math.floor(Math.random()*a.length)] }
function ri(min:number,max:number){ return Math.floor(Math.random()*(max-min+1))+min }
function status(slotsUsed:number, total:number){
  const pct = slotsUsed/total
  if(pct===0) return 'NEW'
  if(pct<0.34) return 'BIDDING'
  if(pct<0.84) return 'HOT'
  return 'FILLED'
}
function urgency(){ return rand(['FLEXIBLE','SOON','URGENT']) as 'FLEXIBLE'|'SOON'|'URGENT' }
function tier(){ return rand(['QUICKWIN','STANDARD','PREMIUM']) as any }
function budgetBand(t:string){
  const bands = ['£1k–£3k','£3k–£8k','£8k–£15k','£15k–£40k','£40k–£90k']
  return rand(bands)
}
function makeTitle(trade:string, town:string){
  const pfx = rand(['Needed:','Quote for','Job:','Looking for'])
  return `${pfx} ${trade.toLowerCase()} — ${town}`
}
function aiSummary(trade:string){
  const lines = [
    `4-bed semi · moderate prep. Estimate 2–3 days, 2-person crew.`,
    `Approx. 30m run · posts + gravel boards · dispose old material.`,
    `Includes first-fix + second-fix · materials not included.`,
    `Scope suitable for small team · light access constraints.`,
    `Drawings available · homeowner flexible on start date.`,
  ]
  return `This ${trade.toLowerCase()} job: ${rand(lines)}`
}

export async function GET() {
  const items = Array.from({length: ri(18,26)}).map((_,i)=>{
    const town = rand(towns)
    const trade = rand(trades)
    const total = rand([3,4,5,6])
    const used = ri(0,total-1)
    const st = status(used,total)
    const expSoon = Math.random()<0.18
    const s = expSoon && st!=='FILLED' ? 'EXPIRING' : st
    return {
      id:`ld_${Date.now()}_${i}`,
      title: makeTitle(trade, town),
      town,
      postcode: `ME${ri(1,20)} ${ri(1,9)}${rand(['AA','AB','BX','CD','EF'])}`,
      budget: budgetBand(trade),
      urgency: urgency(),
      postedAt: `${ri(1,72)}h ago`,
      tags: Array.from({length: ri(2,6)}).map(()=>rand(tagsPool)),
      status: s,
      tier: tier(),
      slotsTotal: total,
      slotsUsed: used,
      aiSummary: aiSummary(trade),
      matchConfidence: ri(62,97),
      summary: undefined
    }
  })
  return NextResponse.json({
    ok:true,
    ticker: `${ri(2,5)} new jobs added in the last hour in Kent.`,
    items
  })
}
