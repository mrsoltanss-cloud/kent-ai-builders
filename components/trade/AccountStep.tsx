'use client'
import { useState } from 'react'

export default function AccountStep({ onDone }: { onDone: () => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setErr(null); setBusy(true)
    try {
      // Create the account (your existing API route)
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, password, role: 'BUILDER' }),
      })
      const json = await res.json()
      if (!res.ok || !json.ok) throw new Error(json.error || 'Signup failed')

      // Send them to sign-in (credentials or magic). We preserve trade flow.
      window.location.href = '/auth/signin?next=/trade/onboarding&kind=trade'
    } catch (e:any) {
      setErr(e.message || 'Something went wrong')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700">Work email</label>
        <input
          type="email" required value={email} onChange={e=>setEmail(e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 h-11 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          placeholder="you@company.co.uk"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700">Create password</label>
        <input
          type="password" required minLength={8} value={password} onChange={e=>setPassword(e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 h-11 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          placeholder="At least 8 characters"
        />
        <p className="mt-2 text-xs text-slate-500">By continuing you agree to our Terms & Privacy.</p>
      </div>
      {err && <div className="text-sm text-red-600">{err}</div>}
      <button
        type="submit" disabled={busy}
        className="w-full h-11 rounded-xl bg-cyan-500 text-white font-semibold hover:bg-cyan-600 disabled:opacity-60"
      >
        {busy ? 'Creating account…' : 'Create account & continue'}
      </button>
      <div className="text-sm text-slate-500 text-center">
        Already have an account? <a href="/auth/signin?next=/trade/onboarding&kind=trade" className="text-cyan-600">Sign in</a>
      </div>
    </form>
  )
}
