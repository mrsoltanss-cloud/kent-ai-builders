import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma, { prisma as db } from "@/lib/prisma";
import { compare } from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      // IMPORTANT: must be exactly "credentials"
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await db.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user?.passwordHash) return null;

        const ok = await compare(credentials.password, user.passwordHash);
        if (!ok) return null;

        // Minimal token payload; include role & builderSlug for gating/routing
        return {
          id: user.id,
          name: user.name ?? "",
          email: user.email,
          role: user.role,
          builderSlug: user.builderSlug ?? null,
        } as any;
      },
    }),
    // Do NOT add Email provider here (prevents magic link page from appearing)
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role || "CUSTOMER";
        token.builderSlug = (user as any).builderSlug || null;
      }
      return token;
    },
    async session({ session, token }) {
      (session as any).role = token.role || "CUSTOMER";
      (session.user as any).role = token.role || "CUSTOMER";
      (session.user as any).builderSlug = token.builderSlug || null;
      return session;
    },
  },
  // Keep homeowner sign-in page mapping (we won’t use it for trade)
  pages: { signIn: "/auth/signin" },
};
