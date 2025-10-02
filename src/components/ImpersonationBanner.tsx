// src/components/ImpersonationBanner.tsx
"use client"
import { useEffect, useState } from "react"

export default function ImpersonationBanner() {
  const [on, setOn] = useState(false)
  const [actor, setActor] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/version")
      .then(r=>r.json())
      .then(j => { setOn(!!j?.impersonating); setActor(j?.actorId ?? null) })
      .catch(()=>{})
  }, [])

  if (!on) return null
  return (
    <div className="w-full bg-amber-600 text-white text-sm px-4 py-2 flex items-center gap-3">
      <strong>Impersonation mode</strong>
      <span className="opacity-90">You’re browsing as another user.</span>
      {actor && <span className="opacity-90">Actor: {actor.slice(0, 8)}</span>}
      <button
        onClick={async ()=>{ await fetch("/api/admin/impersonate", { method:"DELETE" }); location.reload() }}
        className="ml-auto rounded bg-white/20 px-3 py-1 hover:bg-white/30"
      >
        Stop impersonating
      </button>
    </div>
  )
}
