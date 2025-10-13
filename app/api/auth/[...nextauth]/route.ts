import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import { db } from "@/lib/prisma";

const providers = [
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
  }),
  EmailProvider({
    server: process.env.EMAIL_SERVER,
    from: process.env.EMAIL_FROM,
  }),
];

const authOptions = {
  providers,
  session: { strategy: "jwt" as const },
  pages: { signIn: "/api/auth/signin" },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user?.email) {
        const dbUser = await db.user.upsert({
          where: { email: user.email },
          update: {},
          create: {
            email: user.email,
            name: user.name ?? null,
            image: (user as any)?.image ?? null,
            role: "BUILDER",
          },
          select: { id: true, role: true, name: true, image: true, email: true },
        });
        (token as any).role = dbUser.role;
        (token as any).uid = dbUser.id;
      } else if (!(token as any).role && token?.email) {
        const existing = await db.user.findUnique({
          where: { email: token.email as string },
          select: { id: true, role: true },
        });
        if (existing) {
          (token as any).role = existing.role;
          (token as any).uid = existing.id;
        }
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        (session.user as any).role = (token as any)?.role ?? "BUILDER";
        (session.user as any).id = (token as any)?.uid ?? null;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
