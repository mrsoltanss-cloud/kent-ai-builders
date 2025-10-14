'use client'
export default function MyBids(){
  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-slate-950 to-slate-900 px-5 py-10">
      <div className="mx-auto w-[min(1100px,100%)]">
        <h1 className="text-2xl font-semibold text-white tracking-tight">My bids</h1>
        <p className="text-slate-300 mt-1">Jobs you’ve bid on — auto-refreshes and drops off after 72 hours.</p>
        <div className="glass-card rounded-2xl px-4 sm:px-6 py-8 border border-white/10 mt-6 text-slate-300">
          Coming soon: we’ll list your active bids here with status (Waiting, Selected, Not Picked) and 72h countdowns.
        </div>
      </div>
    </div>
  )
}
