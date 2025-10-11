import { PrismaClient } from '@prisma/client'

// Reuse PrismaClient across hot reloads in dev to avoid connection exhaustion
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    // log: ['query', 'error', 'warn'], // uncomment if you want SQL logs
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// Some code imports { db } from '@/lib/prisma'
export const db = prisma

// Some code does a default import
export default prisma
