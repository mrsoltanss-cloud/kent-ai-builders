// src/components/KpiCards.tsx
export default function KpiCards({ users, leads }: { users: number; leads: number }) {
  const cards = [
    { label: "Total Users", value: users },
    { label: "Total Leads", value: leads },
  ]
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {cards.map(c => (
        <div key={c.label} className="rounded-2xl border bg-white p-4 shadow-sm">
          <div className="text-sm text-slate-600">{c.label}</div>
          <div className="mt-1 text-2xl font-semibold">{c.value.toLocaleString()}</div>
        </div>
      ))}
    </div>
  )
}
