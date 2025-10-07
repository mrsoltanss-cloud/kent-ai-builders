// @ts-nocheck
'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function JobOverviewPage() {
  const params = useParams() as { id?: string | string[] };
  const idParam = params?.id;
  const jobId = Array.isArray(idParam) ? (idParam[0] ?? '') : (idParam ?? '');

  return (
    <main className="min-h-[70vh] px-4 py-10 bg-neutral-50">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <Link
            href="/my-live"
            className="inline-flex items-center gap-2 text-sm font-medium text-emerald-700 hover:text-emerald-800"
          >
            ← Back to dashboard
          </Link>
        </div>

        <div className="rounded-2xl bg-white p-6 md:p-8 shadow-sm ring-1 ring-black/5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Job overview</h1>
              <p className="mt-1 text-neutral-600">
                For job <span className="font-mono text-neutral-900">#{jobId}</span>
              </p>
            </div>
            <Link
              href={`/my/jobs/${jobId}/chat`}
              className="rounded-lg bg-emerald-600 text-white font-semibold px-4 py-2 hover:bg-emerald-500"
            >
              Open chat
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link href={`/my/jobs/${jobId}/timeline`} className="rounded-xl ring-1 ring-black/10 bg-neutral-50 p-4 hover:bg-neutral-100">
              <div className="font-semibold">Timeline</div>
              <div className="text-sm text-neutral-600 mt-1">Key milestones & status</div>
            </Link>

            <Link href={`/my/jobs/${jobId}/quotes`} className="rounded-xl ring-1 ring-black/10 bg-neutral-50 p-4 hover:bg-neutral-100">
              <div className="font-semibold">Quotes</div>
              <div className="text-sm text-neutral-600 mt-1">Compare and approve</div>
            </Link>

            <Link href={`/my/jobs/${jobId}/files`} className="rounded-xl ring-1 ring-black/10 bg-neutral-50 p-4 hover:bg-neutral-100">
              <div className="font-semibold">Files & photos</div>
              <div className="text-sm text-neutral-600 mt-1">Plans, images, PDFs</div>
            </Link>

            <Link href={`/my/jobs/${jobId}/payments`} className="rounded-xl ring-1 ring-black/10 bg-neutral-50 p-4 hover:bg-neutral-100">
              <div className="font-semibold">Payments</div>
              <div className="text-sm text-neutral-600 mt-1">Invoices & receipts</div>
            </Link>

            <Link href={`/my/jobs/${jobId}/builder`} className="rounded-xl ring-1 ring-black/10 bg-neutral-50 p-4 hover:bg-neutral-100">
              <div className="font-semibold">Your builder</div>
              <div className="text-sm text-neutral-600 mt-1">Team info & credentials</div>
            </Link>

            <Link href={`/my/jobs/${jobId}/chat`} className="rounded-xl ring-1 ring-black/10 bg-neutral-50 p-4 hover:bg-neutral-100">
              <div className="font-semibold">Chat</div>
              <div className="text-sm text-neutral-600 mt-1">Messages & updates</div>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
