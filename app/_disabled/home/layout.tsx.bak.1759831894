import { ReactNode } from "react";
import Link from "next/link";
import { SideNav } from "@/components/SideNav";
import SignOutButton from "@/components/SignOutButton";

export default function HomeLayout({ children }: { children: ReactNode }) {
  const items = [
    { href: "/home", label: "My Projects" },
    { href: "/home/appointments", label: "Appointments" },
    { href: "/home/billing", label: "Billing" },
    { href: "/home/account", label: "Account" },
  ];
  return (
    <div>
      <header className="h-16 border-b flex items-center justify-between px-6">
        <Link href="/" className="font-semibold">Brixel — Homeowner</Link>
        <SignOutButton />
      </header>
      <div className="flex">
        <SideNav items={items} active={""} />
        <main className="p-6 flex-1">{children}</main>
      </div>
    </div>
  );
}
