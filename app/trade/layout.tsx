'use client'
import { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import SideNav from "@/components/SideNav"
import SignOutButton from "@/components/SignOutButton"

export default function TraderLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isOnboarding = pathname?.startsWith("/trade/onboarding")

  if (isOnboarding) {
    // Full-bleed, no sidebar — clean space for onboarding flow
    return (
      <div className="min-h-[100dvh] bg-gradient-to-b from-slate-50 to-slate-100">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="mx-auto w-[min(1280px,96vw)] flex items-center justify-between px-4 py-3">
            <Link href="/" className="font-semibold tracking-tight">Brixel — Trader</Link>
            <SignOutButton />
          </div>
        </header>
        <main className="mx-auto w-[min(1280px,96vw)] px-4 py-6">
          {children}
        </main>
      </div>
    )
  }

  // Default: dashboard shell with sidebar
  const items = [
    { href: "/trade/jobs", label: "Leads" },
    { href: "/trade/leads", label: "Quotes" },
    { href: "/trade/watchlist", label: "Calendar" },
    { href: "/trade/profile", label: "Company" },
  ]

  return (
    <div className="min-h-[100dvh] bg-slate-50">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto w-[min(1280px,96vw)] flex items-center justify-between px-4 py-3">
          <Link href="/" className="font-semibold tracking-tight">Brixel — Trader</Link>
          <SignOutButton />
        </div>
      </header>
      <div className="mx-auto w-[min(1280px,96vw)] px-4 py-6 flex gap-6">
        <SideNav items={items} active={pathname ?? ""} />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
