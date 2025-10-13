'use client'
type Kpi = { label: string; value: string | number; sublabel?: string }

type Props =
  | { items?: Kpi[]; users?: never; leads?: never }
  | { items?: never; users?: any; leads?: any }

export default function KpiCards(props: Props) {
  let items: Kpi[] | undefined = undefined

  if ('users' in props || 'leads' in props) {
    const users = (props as any).users ?? 0
    const leads = (props as any).leads ?? 0
    items = [
      { label: 'Users', value: typeof users === 'number' ? users : (users?.count ?? 0), sublabel: 'total' },
      { label: 'Leads', value: typeof leads === 'number' ? leads : (leads?.count ?? 0), sublabel: 'total' },
      { label: 'Quotes', value: 0, sublabel: '7d' },
      { label: 'Win rate', value: '—', sublabel: '7d' },
    ]
  } else if ('items' in props) {
    items = props.items
  }

  const demo = items?.length
    ? items
    : [
        { label: 'Views', value: 1280, sublabel: '7d' },
        { label: 'Leads', value: 42, sublabel: '7d' },
        { label: 'Quotes', value: 19, sublabel: '7d' },
        { label: 'Win rate', value: '32%', sublabel: '7d' },
      ]

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {demo.map((k) => (
        <div key={k.label} className="rounded-xl border border-slate-200 p-4">
          <div className="text-sm text-slate-500">{k.label}</div>
          <div className="mt-1 text-2xl font-semibold">{k.value}</div>
          {k.sublabel && <div className="text-xs text-slate-400">{k.sublabel}</div>}
        </div>
      ))}
    </div>
  )
}
