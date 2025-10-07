"use client";
import { signOut } from "next-auth/react";

export default function SignOutButton({ className = "" }: { className?: string }) {
  return (
    <button
      type="button"
      aria-label="Sign out"
      onClick={() => signOut({ callbackUrl: "/" })}
      className={
        "rounded-full px-4 py-1.5 text-sm font-medium shadow-sm transition-colors " +
        "bg-emerald-600 text-white hover:bg-emerald-700 " +  // green by default
        className
      }
    >
      Sign out
    </button>
  );
}
