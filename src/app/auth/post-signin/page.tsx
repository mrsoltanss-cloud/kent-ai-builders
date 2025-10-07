'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';

export default function PostSignIn() {
  const router = useRouter();

  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch('/api/whoami', { cache: 'no-store' });
        if (!alive) return;
        if (!res.ok) {
          router.replace('/auth/signin');
          return;
        }
        const j = await res.json();
        const role = String(j?.user?.role || '').toUpperCase();
        if (role === 'ADMIN') router.replace('/home');
        else router.replace('/my/portal');
      } catch {
        router.replace('/auth/signin');
      }
    })();
    return () => { alive = false; };
  }, [router]);

  return (
    <main className="min-h-[70vh] grid place-items-center">
      <div className="text-center">
        <p className="text-sm text-neutral-500">Signing you in…</p>
      </div>
    </main>
  );
}
