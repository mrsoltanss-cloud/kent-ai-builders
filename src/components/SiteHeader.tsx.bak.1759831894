"use client";

import Link from "next/link";
import HeaderActions from "@/components/HeaderActions";

export default function SiteHeader() {
  return (
    <header className="h-16 border-b px-4 flex items-center justify-between">
      <Link href="/" className="font-semibold">Brixel</Link>

      <nav className="hidden md:flex items-center gap-8 text-[15px]">
        <Link href="/#homeowner" className="hover:opacity-80">Homeowner</Link>
        <Link href="/#trades" className="hover:opacity-80">Trades</Link>
      </nav>

      <HeaderActions />
    </header>
  );
}
