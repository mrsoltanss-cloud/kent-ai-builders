"use client"
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

export default async function JobDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <ClientJob id={id} />
}

function fmtGBP(min?: number | null, max?: number | null) {
  if (!min && !max) return '—'
  const f = (n: number) =>
    new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(n)
  return [min, max].filter((v) => typeof v === 'number').map((n) => f(n as number)).join(' – ')
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

function TierProgress({ job }: { job: Job }) {
  const bids = job.contactUnlocks ?? 0
  const total = job.allocCap ?? 3
  const pct = Math.min(100, Math.round((Math.max(0, bids) / Math.max(1, total)) * 100))
  const map: Record<string, { bg: string; fill: string }> = {
    QUICKWIN: { bg: 'bg-emerald-100', fill: 'bg-emerald-500' },
    STANDARD: { bg: 'bg-sky-100',     fill: 'bg-sky-500' },
    PREMIUM:  { bg: 'bg-indigo-100',  fill: 'bg-indigo-500' },
  }
  const theme = map[job.tier ?? 'STANDARD'] ?? map.STANDARD
  return (
    <div className="mt-3">
      <div className={`h-2 w-full overflow-hidden rounded-full ${theme.bg}`}>
        <div className={`h-full ${theme.fill}`} style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-1 flex justify-between text-xs text-neutral-600">
        <span>{pct}% capacity</span>
        <span>{Math.max(0, (job.allocCap ?? 0) - (job.contactUnlocks ?? 0))} slots left</span>
      </div>
    </div>
  )
}

function Meta({ job }: { job: Job }) {
  return (
    <div className="grid grid-cols-3 gap-2 text-sm">
      <div>👁️ {job.views ?? 0} views</div>
      <div>💰 {fmtGBP(job.priceMin, job.priceMax)}</div>
      <div>🎯 {(job.contactUnlocks ?? 0)}/{job.allocCap ?? 3} bids</div>
    </div>
  )
}

function Loading() {
  return <div className="text-neutral-500">Loading…</div>
}

function ErrorBox({ msg }: { msg: string }) {
  return <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{msg}</div>
}

function ClientJobInner({ id }: { id: string }) {
  const [job, setJob] = React.useState<Job | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetch(`/api/job/${id}`, { cache: 'no-store' })
      .then(r => r.json())
      .then(d => {
        if (!cancelled) setJob(d.job ?? null)
      })
      .catch(() => { if (!cancelled) setError('Unable to load job') })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [id])

  if (loading) return <Loading />
  if (error || !job) return <ErrorBox msg={error ?? 'Job not found'} />

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-semibold">{job.title}</h1>
        <TierBadge tier={job.tier ?? undefined} />
      </div>
      {job.summary && <p className="mt-2 text-neutral-700">{job.summary}</p>}
      <div className="mt-4">
        <Meta job={job} />
        <TierProgress job={job} />
      </div>
      <div className="mt-6">
        <a
          href={`/trade/jobs`}
          className="inline-flex items-center rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm hover:bg-neutral-50"
        >
          ← Back to jobs
        </a>
      </div>
    </div>
  )
}

function ClientJob({ id }: { id: string }) {
  return (
    <React.Suspense fallback={<Loading />}>
      {/* Client wrapper */}
      <ClientBoundary id={id} />
    </React.Suspense>
  )
}

function ClientBoundary({ id }: { id: string }) {
  // Mark this subtree as client
  return <ClientOnly id={id} />
}

function ClientOnly({ id }: { id: string }) {
  // Little trick: inline 'use client' boundary
  return <ClientJobInner id={id} />
}
