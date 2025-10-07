import Link from "next/link"
import "../globals.css"
import ImpersonationBanner from "@/components/ImpersonationBanner"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-40 border-b bg-white/90 backdrop-blur">
        <div className="mx-auto max-w-6xl h-14 flex items-center justify-between px-4">
          <div className="font-semibold">Admin – Kent AI Builders</div>
          <nav className="flex items-center gap-3 text-sm">
            <Link href="/admin" className="hover:text-emerald-700">Dashboard</Link>
            <Link href="/admin/users" className="hover:text-emerald-700">Users</Link>
            <Link href="/admin/leads" className="hover:text-emerald-700">Leads</Link>
            <Link href="/admin/audit" className="hover:text-emerald-700">Audit</Link>
            <Link href="/" className="rounded px-3 py-1.5 bg-emerald-600 text-white hover:bg-emerald-700">Site</Link>
          </nav>
        </div>
      </header>
      <ImpersonationBanner />
      <main className="mx-auto max-w-6xl p-4">{children}</main>
    </div>
  )
}
