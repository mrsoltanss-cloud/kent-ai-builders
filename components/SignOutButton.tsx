"use client";
import { signOut } from "next-auth/react";

export default function SignOutButton({ className = "" }: { className?: string }) {
  return (
    <button
      type="button"
      aria-label="Sign out"
      onClick={() => signOut({ callbackUrl: "/" })}
      className={
        "rounded-full border bg-white/90 backdrop-blur px-4 py-1.5 text-sm font-medium shadow-sm hover:bg-white transition-colors " +
        className
      }
    >
      Sign out
    </button>
  );
}
