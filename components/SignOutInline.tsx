'use client';
import React from 'react';
import { useSession, signOut } from 'next-auth/react';

export default function SignOutInline({ className = '' }: { className?: string }) {
  const { status } = useSession();
  if (status !== 'authenticated') return null;
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/' })}
      className={`text-sm text-gray-600 hover:text-gray-900 underline ${className}`}
    >
      Sign out
    </button>
  );
}
