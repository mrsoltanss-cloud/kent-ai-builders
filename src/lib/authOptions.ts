import type { NextAuthOptions } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import { z } from "zod"
import { prisma } from "@/lib/prisma"

// Credentials (DEV-friendly: checks email exists; no password hash in schema)
const credentials = Credentials({
  name: "Credentials",
  credentials: {
    email: { label: "Email", type: "email" },
    password: { label: "Password", type: "password" },
  },
  async authorize(creds) {
    const schema = z.object({
      email: z.string().email(),
      password: z.string().min(1),
    })
    const parsed = schema.safeParse(creds)
    if (!parsed.success) return null

    const { email } = parsed.data
    // Find existing user; if not exists, create a basic USER
    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: { email, name: email.split("@")[0], role: "USER" },
      select: { id: true, email: true, name: true, isBlocked: true },
    })
    if (!user || user.isBlocked) return null
    return { id: user.id, email: user.email, name: user.name ?? undefined }
  },
})

// Explicit provider typing so we can push OAuth providers too
const providers: NextAuthOptions["providers"] = [credentials as any]

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      async profile(p) {
        // Ensure a user record exists for Google sign-in
        const user = await prisma.user.upsert({
          where: { email: p.email! },
          update: {},
          create: { email: p.email!, name: p.name ?? "User", role: "USER" },
        })
        return { id: user.id, name: user.name ?? "", email: user.email }
      },
    }) as any
  )
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  pages: { signIn: "/auth/signin" },
  providers,
  callbacks: {
    async jwt({ token, user }) {
      // hydrate token with app user fields
      const email = user?.email ?? token?.email
      if (email) {
        const u = await prisma.user.findUnique({ where: { email } })
        if (u) {
          ;(token as any).user = {
            id: u.id,
            email: u.email,
            name: u.name,
            role: u.role,
            isBlocked: u.isBlocked,
          }
        }
      }
      return token
    },
    async session({ session, token }) {
      if ((token as any)?.user) (session as any).user = (token as any).user
      return session
    },
    async signIn({ user }) {
      if (!user?.email) return false
      const u = await prisma.user.findUnique({ where: { email: user.email } })
      if (!u || u.isBlocked) return false
      return true
    },
  },
}
