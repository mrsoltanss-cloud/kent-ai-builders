'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function SignupClient() {
  const router = useRouter()
  const params = useSearchParams()

  // Be defensive: handle undefined/null in strict mode & SSR hydration
  const callbackUrl = params?.get?.('callbackUrl') ?? '/quote'

  const [email, setEmail] = useState('')
  const [name, setName] = useState('')

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: wire magic link flow or NextAuth sign-in
    router.push(callbackUrl)
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <input
        type="text"
        className="input input-bordered w-full"
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="email"
        className="input input-bordered w-full"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button className="btn btn-primary w-full" type="submit">
        Continue
      </button>
    </form>
  )
}
