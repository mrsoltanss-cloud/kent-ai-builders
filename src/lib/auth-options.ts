// src/lib/auth-options.ts
import type { NextAuthOptions } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import { prisma } from "@/lib/prisma"

const credentials = Credentials({
  name: "Credentials",
  credentials: {
    email: { label: "Email", type: "email" },
    password: { label: "Password", type: "password" },
  },
  async authorize(creds) {
    if (creds?.email === "homeowner@brixel.uk" && creds?.password === "test123") {
      const user = await prisma.user.upsert({
        where: { email: creds.email },
        update: {},
        create: { email: creds.email, name: "Homeowner" },
      })
      return { id: user.id, name: user.name ?? "Homeowner", email: user.email }
    }
    return null
  },
})

// Build providers with correct typing so OAuth + Credentials can coexist
const providers: NextAuthOptions["providers"] = [
  credentials,
  ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
    ? [Google({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        async profile(p) {
          const user = await prisma.user.upsert({
            where: { email: p.email! },
            update: {},
            create: { email: p.email!, name: p.name ?? "User" },
          })
          return { id: user.id, name: user.name ?? "", email: user.email }
        },
      })]
    : []),
]

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  pages: { signIn: "/auth/signin" },
  providers,
  callbacks: {
    async jwt({ token, user }) {
      if (user?.email) {
        const u = await prisma.user.findUnique({ where: { email: user.email } })
        if (u) {
          token.user = {
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
      if (token?.user) (session as any).user = token.user
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
