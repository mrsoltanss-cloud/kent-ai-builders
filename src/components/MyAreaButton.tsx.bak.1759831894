"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

export default function MyAreaButton({ className = "" }: { className?: string }) {
  const { status } = useSession();
  if (status !== "authenticated") return null;

  return (
    <Link
      href="/me"
      className={`rounded-full bg-emerald-600 text-white px-4 py-1.5 hover:bg-emerald-700 ${className}`}
      aria-label="Go to my area"
      title="Go to my area"
    >
      My area
    </Link>
  );
}
