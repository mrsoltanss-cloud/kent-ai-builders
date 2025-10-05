'use client';

import { signOut } from 'next-auth/react';

export default function SignOutButton({
  label = 'Sign out',
  redirectTo = '/',
  className = '',
}: {
  label?: string;
  redirectTo?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: redirectTo })}
      className={
        className ||
        'inline-flex items-center rounded-xl border border-zinc-300 bg-white px-4 py-2 text-zinc-700 hover:bg-zinc-50'
      }
    >
      {label}
    </button>
  );
}
