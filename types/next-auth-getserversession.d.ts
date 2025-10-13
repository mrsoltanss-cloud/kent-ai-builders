import "next-auth";
import type { Session } from "next-auth";

declare module "next-auth" {
  // Relaxed signature to ensure proper typing in our routes during stabilization
  export function getServerSession(...args: any[]): Promise<Session | null>;
}
