'use client'
import { useEffect } from 'react'

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.body.classList.add('onboarding-full')
    return () => document.body.classList.remove('onboarding-full')
  }, [])
  return <div className="onboarding-shell">{children}</div>
}
