import { PrismaClient } from "@prisma/client";

// Reuse the client in dev to avoid exhausting connections
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query","error","warn"] : ["error"],
  });

// Back-compat alias for files importing { db } from "@/lib/prisma"
export const db = prisma;

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
