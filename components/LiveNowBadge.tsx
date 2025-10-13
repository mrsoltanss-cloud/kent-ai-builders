'use client'
export default function LiveNowBadge() {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 text-emerald-700 px-3 py-1 text-sm">
      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
      Live now
    </span>
  )
}
