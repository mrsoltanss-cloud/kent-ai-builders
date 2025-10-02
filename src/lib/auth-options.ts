import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

/**
 * Dev credentials:
 *   Email:    homeowner@brixel.uk
 *   Password: test123
 * Replace `authorize` with your DB check when ready.
 */
const credentials = CredentialsProvider({
  name: "Credentials",
  credentials: {
    email: { label: "Email", type: "email" },
    password: { label: "Password", type: "password" },
  },
  async authorize(creds) {
    if (creds?.email === "homeowner@brixel.uk" && creds?.password === "test123") {
      return { id: "1", name: "Homeowner", email: creds.email };
    }
    return null;
  },
});

const google =
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
    ? GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      })
    : null;

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  providers: [credentials, ...(google ? [google] : [])],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = { id: (user as any).id, email: user.email, name: user.name };
      }
      return token;
    },
    async session({ session, token }) {
      if ((token as any)?.user) {
        (session as any).user = (token as any).user;
      }
      return session;
    },
  },
};
