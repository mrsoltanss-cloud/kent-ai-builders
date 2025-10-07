import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    role?: string | null;
    isBlocked?: boolean | null;
  }
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      role?: string | null;
      isBlocked?: boolean | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string | null;
    isBlocked?: boolean | null;
  }
}
