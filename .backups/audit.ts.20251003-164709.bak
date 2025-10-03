// src/lib/audit.ts
import { prisma } from "@/lib/prisma"

type AuditArgs = {
  action: string
  actorId?: string | null
  targetUserId?: string | null
  leadId?: string | null
  // anything JSON-serializable
  meta?: Record<string, any> | null
}

/**
 * Write a row to AuditLog.
 * Maps `targetUserId` -> `targetId` for the schema.
 */
export async function audit(args: AuditArgs) {
  const { action, actorId, targetUserId, leadId, meta } = args
  await prisma.auditLog.create({
    data: {
      action,
      actorId: actorId ?? null,
      targetId: targetUserId ?? null,
      leadId: leadId ?? null,
      meta: meta ?? null,
    },
  })
}
