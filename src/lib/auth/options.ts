import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },

  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email:    { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(creds) {
        const email = (creds?.email || "").toString().toLowerCase().trim();
        const password = (creds?.password || "").toString();
        if (!email || !password) return null;

        const user = await db.user.findUnique({ where: { email } });
        if (!user?.password) return null;            // ✅ use `password`

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) return null;

        // include role so callbacks can lift it into the JWT/session
        return {
          id: user.id,
          email: user.email,
          name: user.name ?? undefined,
          role: (user.role as Role) ?? "HOMEOWNER",
        } as any;
      },
    }),
    // Add Google provider here when Sprint 0 is resumed
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        (token as any).role = (user as any).role ?? "HOMEOWNER";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        (session.user as any).role = (token as any).role ?? "HOMEOWNER";
      }
      return session;
    },
  },
};
