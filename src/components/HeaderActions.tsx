"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function HeaderActions() {
  const { data: session, status } = useSession();

  // Avoid layout shift while loading
  if (status === "loading") return <div className="w-40 h-9" />;

  const user = session?.user as (typeof session)["user"] & {
    role?: "HOMEOWNER" | "TRADER" | "ADMIN";
  };

  if (user) {
    const goTrade = user.role === "TRADER" || user.role === "ADMIN";
    return (
      <div className="flex items-center gap-3">
        <Link
          href={goTrade ? "/trade" : "/home"}
          className="px-4 py-2 rounded-xl font-medium border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition"
        >
          My area
        </Link>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/" })}
          className="px-3 py-2 rounded-xl font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition"
          aria-label="Sign out"
        >
          Sign out
        </button>
      </div>
    );
  }

  // Signed-out state
  return (
    <div className="flex items-center gap-3">
      <Link
        href="/signup/trader"
        className="px-4 py-2 rounded-xl font-medium border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition"
      >
        Trade sign up
      </Link>
      <Link
        href="/auth/signin"
        className="px-4 py-2 rounded-xl font-medium bg-black text-white hover:opacity-90 rounded-xl transition"
      >
        Log in
      </Link>
    </div>
  );
}
