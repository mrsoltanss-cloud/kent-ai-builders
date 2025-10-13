/**
 * Compile-time shim for Prisma types referenced around the codebase.
 * - Keeps the real PrismaClient export intact.
 * - Adds relaxed audit types used by admin routes.
 * - Allows arbitrary model properties (db.user, db.lead, ...)
 * - Declares generic raw query methods ($queryRaw, $queryRawUnsafe, etc.)
 * - Provides enum types/values (Urgency, LeadStatus, Role)
 */
declare module '@prisma/client' {
  // PrismaClient (runtime still from real package)
  export class PrismaClient {
    constructor(...args: any[]);
    $connect(): Promise<void>;
    $disconnect(): Promise<void>;
    $executeRaw(...args: any[]): Promise<number>;
    $executeRawUnsafe(...args: any[]): Promise<number>;
    $queryRaw<T = any>(...args: any[]): Promise<T>;
    $queryRawUnsafe<T = any>(...args: any[]): Promise<T>;
    [key: string]: any; // allow db.user, db.lead, etc.
  }

  // === Enums (type + value) ===
  export type Urgency = 'FLEXIBLE' | 'SOON' | 'URGENT';
  export const Urgency: {
    FLEXIBLE: Urgency;
    SOON: Urgency;
    URGENT: Urgency;
  };

  export type LeadStatus = 'PENDING' | 'QUOTED' | 'CLOSED';
  export const LeadStatus: {
    PENDING: LeadStatus;
    QUOTED: LeadStatus;
    CLOSED: LeadStatus;
  };

  export type Role = 'CUSTOMER' | 'BUILDER' | 'ADMIN';
  export const Role: {
    CUSTOMER: Role;
    BUILDER: Role;
    ADMIN: Role;
  };

  // Relaxed audit types used by admin routes
  namespace Prisma {
    type AuditLogWhereInput = any;
    type AuditLogOrderByWithRelationInput = any;
  }
}
