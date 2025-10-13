'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export default function NotFoundSuccessFallback() {
  const sp = useSearchParams()
  const ref = sp?.get?.('ref') ?? 'BK-REF'

  // Small celebration so it feels like the normal page
  useEffect(() => {
    try {
      // no-op placeholder; real confetti wired on main success page
    } catch {}
  }, [])

  return (
    <main className="min-h-[60vh] grid place-items-center p-10">
      <div className="max-w-xl w-full rounded-2xl p-8 bg-white shadow text-center">
        <h1 className="text-2xl font-bold">Success page moved</h1>
        <p className="text-slate-600 mt-2">
          Your reference: <span className="font-mono">{ref}</span>
        </p>
        <a href="/quote" className="btn btn-primary mt-6">Start a new quote</a>
      </div>
    </main>
  )
}
