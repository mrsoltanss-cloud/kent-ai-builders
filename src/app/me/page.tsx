import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"

export const dynamic = "force-dynamic"

export default async function MePage() {
  const session = await getServerSession(authOptions)
  const u: any = session?.user
  if (!u) redirect("/auth/signin")

  // Only ADMIN vs everyone else (USER)
  if (u.role === "ADMIN") redirect("/admin")
  redirect("/home")
}
