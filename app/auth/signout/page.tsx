'use client';
import { useEffect, useState } from 'react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';

export default function SignOutPage() {
  const [done, setDone] = useState(false);
  useEffect(() => {
    (async () => {
      try { await signOut({ redirect: false }); } finally { setDone(true); }
    })();
    import('canvas-confetti').then(m => {
      try { m.default({ particleCount: 80, spread: 70, origin: { y: 0.6 } }); } catch {}
    }).catch(() => {});
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-emerald-50/50 to-emerald-100/40">
      <div className="mx-auto max-w-3xl px-4 py-14">
        <div className="rounded-3xl border border-emerald-200/60 bg-white p-8 sm:p-12 shadow-sm">
          <h1 className="text-3xl font-semibold text-zinc-900">All set — you’re signed out.</h1>
          <p className="mt-2 text-zinc-600">{done ? 'Your session is cleared.' : 'Finishing up…'}</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <Link href="/my/portal" className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-3 text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-300">Back to my area</Link>
            <Link href="/quote" className="inline-flex items-center justify-center rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-800 hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-300">Start a new quote</Link>
            <Link href="/" className="inline-flex items-center justify-center rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-800 hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-300">Go to homepage</Link>
            <a href="mailto:hello@brixel.uk?subject=Signed%20out%20-%20help" className="inline-flex items-center justify-center rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-800 hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-300">Email us</a>
          </div>
        </div>
      </div>
    </div>
  );
}
