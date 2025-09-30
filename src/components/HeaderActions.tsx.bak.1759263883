"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import MyAreaButton from "@/components/MyAreaButton";

export default function HeaderActions({ className = "" }: { className?: string }) {
  const { status } = useSession();
  const authed = status === "authenticated";

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Link href="/signup/trader" className="rounded-full border px-3 py-1.5">
        Trade sign up
      </Link>
      {authed ? (
        <MyAreaButton />
      ) : (
        <Link
          href="/auth/signin"
          className="rounded-full bg-emerald-600 text-white px-4 py-1.5 hover:bg-emerald-700"
        >
          Log in
        </Link>
      )}
    </div>
  );
}
