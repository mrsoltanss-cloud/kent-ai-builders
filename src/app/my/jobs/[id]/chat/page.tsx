'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function Page() {
  const params = useParams() as { id?: string | string[] };
  const idParam = params?.id;
  const jobId = Array.isArray(idParam) ? (idParam[0] ?? '') : (idParam ?? '');

  return (
    <main className="min-h-[70vh] px-4 py-10 bg-neutral-50">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <Link
            href="/my-live"
            className="inline-flex items-center gap-2 text-sm font-medium text-emerald-700 hover:text-emerald-800"
          >
            ← Back to dashboard
          </Link>
        </div>

        <div className="rounded-2xl bg-white p-6 md:p-8 shadow-sm ring-1 ring-black/5">
          <h1 className="text-2xl font-bold tracking-tight">Job chat</h1>
          <p className="mt-2 text-neutral-600">
            For job <span className="font-mono text-neutral-900">#{jobId}</span>.
          </p>

          <div className="mt-6 rounded-lg bg-neutral-100 p-4 text-neutral-600">
            Job chat UI will render here (wired up later).
          </div>
        </div>
      </div>
    </main>
  );
}
