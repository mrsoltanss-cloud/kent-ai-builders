// app/api/_demo/store.ts
// Tiny in-memory store for dev/demo. Resets on server restart or code reload.
type SelectionSet = Set<number>
type Store = { selections: Map<string, SelectionSet> }

const g = globalThis as any
if (!g.__KAB_DEMO__) {
  g.__KAB_DEMO__ = { selections: new Map() } as Store
}
const store: Store = g.__KAB_DEMO__

export default store
