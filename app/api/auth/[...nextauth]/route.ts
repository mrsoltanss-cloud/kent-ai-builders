import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

function parseWhitelist(raw?: string | null): string[] {
  if (!raw) return [];
  return raw
    .split(/[\n,]/g)
    .map(s => s.trim().toLowerCase())
    .filter(Boolean);
}

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Admin password",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(creds) {
        const email = (creds?.email || "").trim().toLowerCase();
        const pass  = String(creds?.password || "");

        const whitelist = parseWhitelist(process.env.ADMIN_LOGIN_EMAILS || "");
        const adminPass = process.env.ADMIN_PASSWORD || "";

        // Minimal hardening
        if (!email || !pass) return null;
        if (!whitelist.includes(email)) return null;
        if (adminPass.length === 0) return null;
        if (pass !== adminPass) return null;

        // Return a basic user object; role is enforced elsewhere
        return { id: email, name: "Admin", email };
      },
    }),
  ],
  pages: {
    signIn: "/admin/portal", // keep your custom page
  },
  session: { strategy: "jwt" as const },
  callbacks: {
    async jwt({ token, user }) {
      if (user?.email) token.email = user.email;
      return token;
    },
    async session({ session, token }) {
      if (token?.email) session.user = { ...session.user, email: String(token.email) };
      return session;
    },
  },
};

const handler = NextAuth(authOptions as any);
export { handler as GET, handler as POST };
