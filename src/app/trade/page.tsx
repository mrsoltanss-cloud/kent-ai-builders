import { requireRole } from "@/lib/auth/requireRole";

export default async function TradeHome() {
  await requireRole(["TRADER","ADMIN"]);
  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">Trader dashboard</h1>
      <p className="mt-2">Welcome back.</p>
    </main>
  );
}
