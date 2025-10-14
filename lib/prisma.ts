import { PrismaClient } from "@prisma/client";

// Ensure a single Prisma instance in dev & prod
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Named alias so imports using { db } keep working
export const db = prisma;

// Default export so `import prisma from "@/lib/prisma"` works too
export default prisma;
