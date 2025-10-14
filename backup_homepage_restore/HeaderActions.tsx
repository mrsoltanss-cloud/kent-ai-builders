'use client'
import { usePathname } from 'next/navigation'
import SignOutButton from './SignOutButton'

export default function HeaderActions() {
  const pathname = usePathname() || ''
  const hide =
    pathname.startsWith('/trade/onboarding') ||
    pathname.startsWith('/trade/signup') ||
    pathname.startsWith('/auth') // optional: also hide on generic auth pages

  if (hide) return null

  return (
    <div className="flex items-center gap-2">
      <SignOutButton />
    </div>
  )
}
