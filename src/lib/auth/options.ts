import type { NextAuthOptions } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/server/db";
import { verifyPassword } from "@/lib/auth/password";
import { z } from "zod";


export const authOptions: NextAuthOptions = {
  pages: { signIn: "/auth/signin" },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    Credentials({
      name: "Email & Password",
      credentials: { email: {}, password: {} },
      async authorize(creds) {
        const schema = z.object({ email: z.string().email(), password: z.string().min(8) });
        const { email, password } = schema.parse(creds);
        const user = await db.user.findUnique({ where: { email } });
        if (!user?.passwordHash) return null;
        const ok = await verifyPassword(user.passwordHash, password);
        return ok ? { id: user.id, email: user.email, name: user.name ?? undefined } : null;
      },
    }),
  ],
  session: { strategy: "jwt" },
};
