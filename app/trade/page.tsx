import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"

export const dynamic = "force-dynamic"

export default async function TradePage() {
  const session = await getServerSession(authOptions)
  const u: any = session?.user
  if (!u) redirect("/auth/signin")

  // ADMIN-only (no TRADER role anymore)
  if (u.role !== "ADMIN") redirect("/home")

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-2xl font-semibold">Trade Area</h1>
      <p className="text-slate-600">Admin-only access (TRADER role removed in current schema).</p>
    </div>
  )
}
