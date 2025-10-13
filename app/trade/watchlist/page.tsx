// app/trade/watchlist/page.tsx
'use client'

import * as React from 'react'
import JobCard from '@/components/trade/JobCard'
import { useWatchlist } from '@/lib/useWatchlist'

type APIJob = any

export default function WatchlistPage() {
  const { ids } = useWatchlist()
  const [jobs, setJobs] = React.useState<APIJob[]>([])
  const [loading, setLoading] = React.useState(true)

  const fetchAll = React.useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/jobs?mode=all&sort=new', { cache: 'no-store' })
      const data = await res.json()
      const all = Array.isArray(data.jobs) ? data.jobs : []
      setJobs(all.filter((j: any) => ids.includes(j.id)))
    } catch {
      setJobs([])
    } finally {
      setLoading(false)
    }
  }, [ids])

  React.useEffect(() => { fetchAll() }, [fetchAll])

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-2xl font-bold">⭐ Watchlist</h1>
        <a href="/trade/jobs" className="text-sm text-sky-700 hover:underline">← Back to jobs</a>
      </div>

      {loading && (
        <div className="rounded-2xl border bg-neutral-50 p-5 text-neutral-600">Loading your saved jobs…</div>
      )}

      {!loading && ids.length === 0 && (
        <div className="rounded-2xl border bg-neutral-50 p-6 text-neutral-600">
          Your watchlist is empty. Visit <a className="underline" href="/trade/jobs">Jobs</a> and tap ⭐ Save on any card.
        </div>
      )}

      {!loading && ids.length > 0 && jobs.length === 0 && (
        <div className="rounded-2xl border bg-neutral-50 p-6 text-neutral-600">
          The jobs you saved are no longer visible. We’ll keep this list fresh as new leads appear.
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {jobs.map((job: APIJob) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  )
}
