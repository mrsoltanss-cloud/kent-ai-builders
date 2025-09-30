"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

export default function MyAreaFab() {
  const { status } = useSession();
  if (status !== "authenticated") return null;

  return (
    <Link
      href="/me"
      className="fixed bottom-5 right-5 z-50 rounded-full shadow-lg border bg-white p-3 hover:bg-gray-50 md:hidden"
      aria-label="Go to my area"
      title="Go to my area"
    >
      <svg width="22" height="22" viewBox="0 0 24 24"><path d="M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-10.5Z" fill="currentColor"/></svg>
    </Link>
  );
}
