"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/admin/users", label: "Users" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/audit", label: "Audit" },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-2 mb-4 sticky top-0 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 py-2">
      {items.map((it) => {
        const active = pathname?.startsWith(it.href);
        return (
          <Link
            key={it.href}
            href={it.href}
            className={[
              "px-3 py-1.5 rounded border",
              active ? "bg-black text-white border-black" : "hover:bg-gray-50",
            ].join(" ")}
            aria-current={active ? "page" : undefined}
          >
            {it.label}
          </Link>
        );
      })}
    </nav>
  );
}
