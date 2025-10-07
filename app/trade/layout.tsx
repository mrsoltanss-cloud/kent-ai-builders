import { ReactNode } from "react";
import Link from "next/link";
import { SideNav } from "@/components/SideNav";
import SignOutButton from "@/components/SignOutButton";

export default function TraderLayout({ children }: { children: ReactNode }) {
  const items = [
    { href: "/trade", label: "Leads" },
    { href: "/trade/quotes", label: "Quotes" },
    { href: "/trade/calendar", label: "Calendar" },
    { href: "/trade/company", label: "Company" },
  ];
  return (
    <div>
      <header className="h-16 border-b flex items-center justify-between px-6">
        <Link href="/" className="font-semibold">Brixel — Trader</Link>
        <SignOutButton />
      </header>
      <div className="flex">
        <SideNav items={items} active={""} />
        <main className="p-6 flex-1">{children}</main>
      </div>
    </div>
  );
}
