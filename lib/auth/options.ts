import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          select: { id: true, email: true, name: true, role: true, passwordHash: true },
        });
        if (!user?.passwordHash) return null;
        const ok = await compare(credentials.password, user.passwordHash);
        if (!ok) return null;
        return { id: user.id, name: user.name ?? "", email: user.email, role: (user as any).role ?? "CUSTOMER" } as any;
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = (user as any).role || "CUSTOMER";
      return token;
    },
    async session({ session, token }) {
      (session as any).role = token.role || "CUSTOMER";
      (session.user as any).role = token.role || "CUSTOMER";
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Force credentials callback → /my/portal
      if (url.includes("/api/auth/callback/credentials")) return `${baseUrl}/my/portal`;

      // Allow same-origin relative/absolute URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (url.startsWith(baseUrl)) return url;

      // Fallback to portal
      return `${baseUrl}/my/portal`;
    },
  },
  pages: { signIn: "/auth/signin" },
};
