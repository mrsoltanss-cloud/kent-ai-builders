// lib/useWatchlist.ts
'use client'

import * as React from 'react'

const KEY = 'kab_watchlist_ids_v1'

function readIds(): string[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : []
  } catch {
    return []
  }
}

function writeIds(ids: string[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify([...new Set(ids)]))
  } catch {}
}

export function useWatchlist() {
  const [ids, setIds] = React.useState<string[]>([])

  React.useEffect(() => {
    setIds(readIds())
  }, [])

  const add = React.useCallback((id: string) => {
    setIds((prev) => {
      const next = [...new Set([...prev, id])]
      writeIds(next)
      return next
    })
  }, [])

  const remove = React.useCallback((id: string) => {
    setIds((prev) => {
      const next = prev.filter((x) => x !== id)
      writeIds(next)
      return next
    })
  }, [])

  const toggle = React.useCallback((id: string) => {
    setIds((prev) => {
      const has = prev.includes(id)
      const next = has ? prev.filter((x) => x !== id) : [...prev, id]
      writeIds(next)
      return next
    })
  }, [])

  const has = React.useCallback((id: string) => ids.includes(id), [ids])

  return { ids, add, remove, toggle, has }
}
