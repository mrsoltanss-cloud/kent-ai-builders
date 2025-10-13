'use client'
export const dynamic = 'force-dynamic'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import ConfettiBurst from '@/components/fx/ConfettiBurst'

export default function Success() {
  return (
    <Suspense fallback={<div className="min-h-[100dvh] bg-slate-900" />}>
      <InnerSuccess />
    </Suspense>
  )
}

function InnerSuccess() {
  const params = useSearchParams()
  const slug = params.get('slug') ?? ''
  const profileUrl = `/b/${slug}`

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800">
      <ConfettiBurst />
      <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-white shadow-[0_12px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl w-[min(560px,92vw)]">
        <div className="mx-auto h-28 w-28 relative">
          <svg viewBox="0 0 100 100" className="h-full w-full">
            <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="6" />
            <circle cx="50" cy="50" r="45" fill="none" stroke="rgb(14,165,233)" strokeWidth="6"
              strokeLinecap="round" strokeDasharray="282.743" strokeDashoffset="282.743" className="animate-circle" />
            <path d="M28 52 L44 66 L74 36" fill="none" stroke="white" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"
              strokeDasharray="70" strokeDashoffset="70" className="animate-check" />
          </svg>
          <style jsx>{`
            @keyframes dash { to { stroke-dashoffset: 0; } }
            .animate-circle { animation: dash 800ms cubic-bezier(0.25,0.1,0.25,1) forwards; }
            .animate-check  { animation: dash 700ms 200ms cubic-bezier(0.25,0.1,0.25,1) forwards; }
          `}</style>
        </div>

        <h1 className="mt-3 text-2xl font-semibold">Welcome aboard!</h1>
        <p className="mt-1 text-white/80">Your AI-ready profile is live and already working for you.</p>

        <div className="mt-6 grid gap-3">
          <a className="btn btn-primary" href={profileUrl}>View My Profile</a>
          <div className="flex gap-3 justify-center">
            <a className="btn btn-outline" href="/trade/leads">Explore Leads</a>
            <button className="btn btn-outline" onClick={() => navigator.clipboard.writeText(`${location.origin}${profileUrl}`)}>
              Share profile
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
