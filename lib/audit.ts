type AuditInput = {
  action: string;
  actorId?: string | null;
  targetId?: string | null;
  leadId?: string | null;
  meta?: any;
};

/**
 * Temporary audit shim: replace with real DB write when AuditLog model exists.
 */
export async function audit(input: AuditInput): Promise<void> {
  if (process.env.NODE_ENV !== 'production') {
    // Lightweight console trace to prove it's being called
    // eslint-disable-next-line no-console
    console.debug('[audit]', JSON.stringify({ ts: new Date().toISOString(), ...input }));
  }
}
export default audit;
