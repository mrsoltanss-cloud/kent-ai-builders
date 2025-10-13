export type GateUser = { id: string; role?: string };
export type Gate = { ok: boolean; status?: number; user: GateUser };

export async function requireAdmin(): Promise<Gate> {
  // TODO: replace with real session/role checks
  return { ok: true, status: 200, user: { id: 'dev-admin', role: 'ADMIN' } };
}

export async function requireBuilder(): Promise<Gate> {
  // TODO: replace with real session/role checks
  return { ok: true, status: 200, user: { id: 'dev-builder', role: 'BUILDER' } };
}
