import type { NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // Keep Google if you use it (envs optional)
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          }),
        ]
      : []),

    // Email sign-in (requires SMTP envs below)
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST!,
        port: Number(process.env.EMAIL_SERVER_PORT || 587),
        auth: {
          user: process.env.EMAIL_SERVER_USER!,
          pass: process.env.EMAIL_SERVER_PASSWORD!,
        },
      },
      from: process.env.EMAIL_FROM!,
      maxAge: 24 * 60 * 60, // 24 hours
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    // Optional: custom pages if you have them
    // signIn: "/auth/signin",
    // verifyRequest: "/auth/verify-request",
  },
  callbacks: {
    async session({ session, token }) {
      // expose user id on session if present
      if (token?.sub) (session as any).user = { ...(session as any).user, id: token.sub };
      return session;
    },
  },
  // Make sure this matches your production domain in prod
  secret: process.env.NEXTAUTH_SECRET,
};
