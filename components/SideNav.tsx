'use client'
import Link from 'next/link'

type Item = { href: string; label: string }
type Props = { items: Item[]; active?: string }

function SideNav({ items, active = '' }: Props) {
  return (
    <aside className="w-56 shrink-0 border-r border-slate-200 p-4">
      <nav className="flex flex-col gap-1">
        {items.map((it) => {
          const isActive = active === it.href
          return (
            <Link
              key={it.href}
              href={it.href}
              className={[
                'rounded-lg px-3 py-2 text-sm transition',
                isActive
                  ? 'bg-slate-900 text-white'
                  : 'hover:bg-slate-100 text-slate-700'
              ].join(' ')}
            >
              {it.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
export { SideNav }
export default SideNav
