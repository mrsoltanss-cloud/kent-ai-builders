'use client'
import { useState } from 'react'

type Props = {
  disabled?: boolean
  onEstimate?: (result: { min: number; max: number; summary: string }) => void
  className?: string
}
export default function TwoStageEstimateButton({ disabled, onEstimate, className }: Props) {
  const [busy, setBusy] = useState(false)
  async function handleClick() {
    if (busy || disabled) return
    setBusy(true)
    try {
      await new Promise(r => setTimeout(r, 500))
      onEstimate?.({ min: 1500, max: 3000, summary: 'Starter estimate (stubbed)' })
    } finally {
      setBusy(false)
    }
  }
  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={busy || disabled}
      className={className ?? "btn btn-primary w-full"}
    >
      {busy ? 'Calculating…' : 'Get instant estimate'}
    </button>
  )
}
