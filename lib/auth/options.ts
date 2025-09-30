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
        try {
          const email = (creds?.email || "").toString().toLowerCase().trim();
          const password = (creds?.password || "").toString();

          if (!email || !password) return null;

          // Fetch user
          const user = await db.user.findUnique({ where: { email } });
          if (!user?.password) return null; // NOTE: using `password` (mapped), not `passwordHash`

          const ok = await bcrypt.compare(password, user.password);
          if (!ok) return null;

          // Return minimal user for JWT
          return {
            id: user.id,
            email: user.email,
            name: user.name ?? undefined,
            // include role so our callbacks can lift it into session
            role: (user.role as Role) ?? "HOMEOWNER",
          } as any;
        } catch {
          return null;
        }
      },
    }),
    // Add Google provider in this array in environments where it's configured
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // persist role on first sign-in
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
