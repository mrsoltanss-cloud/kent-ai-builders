import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    role?: "HOMEOWNER" | "TRADER" | "ADMIN";
  }
  interface Session {
    user?: {
      name?: string | null
      email?: string | null
      image?: string | null
      role?: "HOMEOWNER" | "TRADER" | "ADMIN"
    }
  }
}
