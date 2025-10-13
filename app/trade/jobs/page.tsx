'use client'

import * as React from 'react'

type Job = {
  id: string
  title: string
  summary?: string | null
  priceMin?: number | null
  priceMax?: number | null
  tier?: 'QUICKWIN' | 'STANDARD' | 'PREMIUM' | null
  status?: string | null
  views?: number | null
  contactUnlocks?: number | null
  allocCap?: number | null
  createdAt?: string | Date | null
  visibleUntil?: string | Date | null
  meta?: any
}

function useQueryState() {
  const [params, setParams] = React.useState<URLSearchParams>(() => {
    // SSR-safe: don't touch window during init
    return new URLSearchParams('')
  })

  React.useEffect(() => {
    setParams(new URLSearchParams(window.location.search))
  }, [])

  const set = React.useCallback((key: string, val: string | null) => {
    setParams(prev => {
      const p = new URLSearchParams(prev.toString())
      if (val === null || val === '') p.delete(key)
      else p.set(key, val)
      const url = new URL(window.location.href)
      url.search = p.toString()
      window.history.replaceState({}, '', url.toString())
      return p
    })
  }, [])

  return { params, set }
}

function TierBadge({ tier }: { tier?: string | null }) {
  const map: Record<string, string> = {
    QUICKWIN: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    STANDARD: 'bg-sky-100 text-sky-800 border-sky-200',
    PREMIUM:  'bg-indigo-100 text-indigo-800 border-indigo-200',
  }
  const cls = map[tier ?? 'STANDARD'] ?? map.STANDARD
  return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs border ${cls}`}>{tier ?? 'STANDARD'}</span>
}

function Card({ job, onOpen }: { job: Job; onOpen: (id: string) => void }) {
  const bids = job.contactUnlocks ?? 0
  const cap = job.allocCap ?? 3
  const left = Math.max(0, cap - bids)
  const price = [job.priceMin, job.priceMax].filter(Boolean).join('–')

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm hover:shadow-md transition">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-semibold text-neutral-900">{job.title}</h3>
        <TierBadge tier={job.tier ?? undefined} />
      </div>
      {job.summary && <p className="mt-1 text-sm text-neutral-600">{job.summary}</p>}
      <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
        <div><span className="font-medium">£{price}</span></div>
        <div>👁️ {job.views ?? 0} views</div>
        <div>🎯 {left}/{cap} slots left</div>
      </div>
      <div className="mt-3">
        <button
          onClick={() => onOpen(job.id)}
          className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-3 py-2 text-white hover:bg-neutral-800"
        >
          💥 Bid ({job.meta?.bidPrice ?? 2} credits)
        </button>
      </div>
    </div>
  )
}

export default function JobsPage() {
  const { params, set } = useQueryState()
  const [jobs, setJobs] = React.useState<Job[]>([])
  const [loading, setLoading] = React.useState(true)
  const sort = params.get('sort') ?? 'new'

  React.useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetch(`/api/jobs?sort=${encodeURIComponent(sort)}`, { cache: 'no-store' })
      .then(r => r.json())
      .then(d => {
        if (!cancelled) setJobs(d.jobs ?? [])
      })
      .catch(() => {
        if (!cancelled) setJobs([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [sort])

  const openJob = (id: string) => {
    window.location.href = `/trade/jobs/${id}`
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Live jobs</h1>
        <div className="flex items-center gap-2 text-sm">
          <label className="text-neutral-600">Sort</label>
          <select
            value={sort}
            onChange={(e) => set('sort', e.target.value)}
            className="rounded-md border border-neutral-300 bg-white px-2 py-1"
          >
            <option value="new">Newest</option>
            <option value="price">Price</option>
            <option value="heat">Heat</option>
            <option value="slots">Slots</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-neutral-500">Loading…</div>
      ) : jobs.length === 0 ? (
        <div className="text-neutral-500">No jobs available right now.</div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {jobs.map((j) => <Card key={j.id} job={j} onOpen={openJob} />)}
        </div>
      )}
    </div>
  )
}
