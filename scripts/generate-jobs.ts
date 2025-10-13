import { PrismaClient } from '@prisma/client'
import crypto from 'node:crypto'
const prisma = new PrismaClient()

const TARGET_MIN = parseInt(process.env.JOBS_MIN_VISIBLE ?? '70', 10)
const TARGET_MAX = parseInt(process.env.JOBS_MAX_VISIBLE ?? '100', 10)

const POSTCODES = ['CT1','CT2','CT3','CT11','ME14','ME2','ME7','TN23','DA11','BR3','BR7','SE9','SE12','CR0']
const AREASUFF = [' 1XX',' 2XY',' 3AB',' 4CD',' 5ZX',' 6PQ',' 7JK',' 8LM']
const TIERS = ['QUICKWIN','STANDARD','PREMIUM'] as const
const TITLE_TEMPLATES = [
  (pc:string)=>`Bathroom refit — ${pc}`,
  (pc:string)=>`Replace 6 radiators — ${pc}`,
  (pc:string)=>`Board & skim hallway — ${pc}`,
  (pc:string)=>`Fence replacement (12m) — ${pc}`,
  (pc:string)=>`Fit EV charger — ${pc}`,
  (pc:string)=>`Boiler service + certificate — ${pc}`,
  (pc:string)=>`Repair leaking gutter — ${pc}`,
  (pc:string)=>`Repaint 2 bedrooms — ${pc}`,
  (pc:string)=>`Tile kitchen splashback — ${pc}`,
  (pc:string)=>`Lay laminate (28 sqm) — ${pc}`,
  (pc:string)=>`Replace front door — ${pc}`,
  (pc:string)=>`Install CCTV (4 cams) — ${pc}`,
  (pc:string)=>`Clear & re-point brickwork — ${pc}`,
  (pc:string)=>`New patio (18 sqm) — ${pc}`,
  (pc:string)=>`Garden office base — ${pc}`,
]

function rnd<T>(xs: T[]) { return xs[Math.floor(Math.random()*xs.length)] }
function rndInt(min:number,max:number){ return Math.floor(Math.random()*(max-min+1))+min }
function weightedTier(): typeof TIERS[number] {
  const r = Math.random()
  if (r < 0.15) return 'PREMIUM'
  if (r < 0.45) return 'QUICKWIN'
  return 'STANDARD'
}
function priceBand(tier: typeof TIERS[number]) {
  if (tier === 'QUICKWIN') return [300, 1500]
  if (tier === 'STANDARD') return [800, 4000]
  return [2000, 12000]
}

async function main() {
  const want = rndInt(TARGET_MIN, TARGET_MAX)
  const existing = await prisma.job.count({ where: { status: 'OPEN' as any } })
  const toMake = Math.max(0, want - existing)
  if (toMake === 0) { console.log(`Have ${existing} OPEN jobs — within target.`); return }

  console.log(`Creating ${toMake} jobs to reach ~${want} visible.`)
  const now = new Date()

  for (let i = 0; i < toMake; i++) {
    const pc = rnd(POSTCODES) + rnd(AREASUFF)
    const tier = weightedTier()
    const [minP, maxP] = priceBand(tier)
    const priceMin = rndInt(minP, Math.floor((minP+maxP)/2))
    const priceMax = rndInt(priceMin + 200, maxP)

    // age between 0 and 5 days
    const ageHrs = rndInt(1, 120)
    const createdAt = new Date(now.getTime() - ageHrs * 3600 * 1000)

    // realistic views spread (10..300) by age/tier
    let baseViews = Math.round((Math.log(ageHrs+1) * 18) + rndInt(5, 30))
    if (tier === 'PREMIUM') baseViews += rndInt(20, 60)
    if (tier === 'QUICKWIN') baseViews += rndInt(0, 20)
    const views = Math.min(300, Math.max(10, baseViews + rndInt(-5, 12)))

    const allocCap = tier === 'PREMIUM' ? rndInt(4,6) : rndInt(3,5)
    const contactUnlocks = Math.min(allocCap-1, Math.max(0, Math.round(allocCap * (Math.random()*0.5))))

    const title = rnd(TITLE_TEMPLATES)(pc)
    const summary = `Standard spec — tidy finish important.`

    await prisma.job.create({
      data: {
        id: crypto.randomUUID(),
        title,
        summary,
        priceMin,
        priceMax,
        tier: tier as any,
        status: 'OPEN' as any,
        views,
        contactUnlocks,
        allocCap,
        aiSeeded: true,
        createdAt,
        updatedAt: createdAt,
        visibleUntil: new Date(now.getTime() + rndInt(3, 20) * 86400 * 1000),
      } as any
    })
  }
  console.log('Done.')
}

main().finally(() => prisma.$disconnect())
