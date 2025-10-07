import Credentials from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import { PrismaClient } from "@prisma/client";
import { compare } from "bcryptjs";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        const email = credentials?.email?.toString().toLowerCase().trim();
        const pw = credentials?.password?.toString() ?? "";
        if (!email || !pw) return null;

        const user = await prisma.user.findUnique({
          where: { email },
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            password: true,
            isBlocked: true,
          },
        });

        if (!user || !user.password) return null;
        if (user.isBlocked) return null;

        const ok = await compare(pw, user.password);
        if (!ok) return null;

        // Include role & isBlocked so callbacks can persist them
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          isBlocked: user.isBlocked,
        };
      },
    }),
  ],
  pages: { signIn: "/auth/signin" },
  callbacks: {
    async jwt({ token, user }) {
      // On initial sign-in, merge our custom fields
      if (user) {
        token.id = (user as any).id;
        token.role = (user as any).role ?? null;
        token.isBlocked = (user as any).isBlocked ?? null;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = (token.id as string) ?? "";
        (session.user as any).role = (token.role as string | null) ?? null;
        (session.user as any).isBlocked = (token.isBlocked as boolean | null) ?? null;
      }
      return session;
    },
  },
};
