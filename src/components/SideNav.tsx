import Link from "next/link";

export function SideNav({ items, active }: { items: { href: string; label: string }[]; active?: string }) {
  return (
    <aside className="w-56 border-r min-h-[calc(100vh-4rem)] p-4 space-y-2">
      {items.map((i) => (
        <Link key={i.href} href={i.href} className={`block rounded px-3 py-2 hover:bg-gray-50 ${active === i.href ? "bg-gray-100 font-medium" : ""}`}>
          {i.label}
        </Link>
      ))}
    </aside>
  );
}
