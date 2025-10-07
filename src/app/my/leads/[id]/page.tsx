import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';

const prisma = new PrismaClient();

function formatDate(d?: Date | null) {
  if (!d) return '—';
  try {
    return new Date(d).toLocaleString();
  } catch {
    return String(d);
  }
}

function StatusBadge({ status }: { status?: string | null }) {
  const s = (status || '').toUpperCase();
  const base =
    'inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ring-1';
  const variant =
    s === 'NEW' ? 'bg-blue-100 text-blue-700 ring-blue-200' :
    s === 'QUALIFIED' ? 'bg-amber-100 text-amber-700 ring-amber-200' :
    s === 'CONTACTED' ? 'bg-purple-100 text-purple-700 ring-purple-200' :
    s === 'BOOKED' ? 'bg-emerald-100 text-emerald-700 ring-emerald-200' :
    s === 'CLOSED' ? 'bg-zinc-100 text-zinc-700 ring-zinc-200' :
    'bg-zinc-100 text-zinc-700 ring-zinc-200';
  return (
    <span className={`${base} ${variant}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {s || '—'}
    </span>
  );
}

export default async function LeadDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // Auth (server-side)
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id as string | undefined;
  if (!userId) redirect('/auth/signin');

  // Fetch lead scoped to this user (prevents IDOR)
  const lead = await prisma.lead.findFirst({
    where: { id: id, userId },
    select: {
      id: true,
      service: true,
      scope: true,
      rooms: true,
      sqm: true,
      propertyAge: true, // matches your DB
      urgency: true,
      budget: true,
      timeline: true,
      status: true,
      notes: true,
      description: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!lead) notFound();

  const shortId = lead.id.slice(0, 8);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-white to-zinc-50">
      {/* Header */}
      <div className="border-b border-zinc-200 bg-gradient-to-b from-white to-emerald-50/40">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <nav className="text-sm text-zinc-600">
                <Link href="/my/portal" className="hover:text-emerald-700">My Dashboard</Link>
                <span className="px-2">/</span>
                <span className="text-zinc-900">Lead {shortId}</span>
              </nav>
              <h1 className="text-2xl font-semibold tracking-tight">
                {lead.service || 'Lead'} <span className="sr-only">details</span>
              </h1>
              <div className="flex items-center gap-3 text-sm text-zinc-600">
                <StatusBadge status={lead.status} />
                <span>Created: {formatDate(lead.createdAt)}</span>
                <span className="hidden sm:inline">·</span>
                <span className="hidden sm:inline">Updated: {formatDate(lead.updatedAt)}</span>
                <span className="hidden sm:inline">·</span>
                <span className="hidden sm:inline">ID: {shortId}…</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/quote"
                className="inline-flex items-center rounded-xl bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
              >
                Add photos / details
              </Link>
              <Link
                href="/my/portal"
                className="inline-flex items-center rounded-xl border border-zinc-300 bg-white px-4 py-2 text-zinc-700 hover:bg-zinc-50"
              >
                Back to dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-4 py-6 grid gap-6">
        {/* Overview */}
        <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold">Overview</h2>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-3 text-sm">
            <div>
              <dt className="text-zinc-500">Service</dt>
              <dd className="text-zinc-900">{lead.service || '—'}</dd>
            </div>
            <div>
              <dt className="text-zinc-500">Status</dt>
              <dd className="text-zinc-900"><StatusBadge status={lead.status} /></dd>
            </div>
            <div>
              <dt className="text-zinc-500">Created</dt>
              <dd className="text-zinc-900">{formatDate(lead.createdAt)}</dd>
            </div>
            <div>
              <dt className="text-zinc-500">Updated</dt>
              <dd className="text-zinc-900">{formatDate(lead.updatedAt)}</dd>
            </div>
          </dl>
        </section>

        {/* Scope */}
        <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold">Scope</h2>
          <div className="grid gap-3 text-sm">
            <div>
              <div className="text-zinc-500">Scope / description</div>
              <div className="text-zinc-900 whitespace-pre-wrap">{lead.scope || '—'}</div>
            </div>
            <div>
              <div className="text-zinc-500">Additional notes</div>
              <div className="text-zinc-900 whitespace-pre-wrap">{lead.notes || lead.description || '—'}</div>
            </div>
          </div>
        </section>

        {/* Property */}
        <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold">Property</h2>
          <dl className="grid grid-cols-1 sm:grid-cols-3 gap-x-10 gap-y-3 text-sm">
            <div>
              <dt className="text-zinc-500">Rooms</dt>
              <dd className="text-zinc-900">{lead.rooms ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-zinc-500">Size (sqm)</dt>
              <dd className="text-zinc-900">{lead.sqm ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-zinc-500">Property age</dt>
              <dd className="text-zinc-900">{(lead as any).propertyAge ?? '—'}</dd>
            </div>
          </dl>
        </section>

        {/* Constraints */}
        <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold">Constraints</h2>
          <dl className="grid grid-cols-1 sm:grid-cols-3 gap-x-10 gap-y-3 text-sm">
            <div>
              <dt className="text-zinc-500">Urgency</dt>
              <dd className="text-zinc-900">{(lead as any).urgency ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-zinc-500">Budget</dt>
              <dd className="text-zinc-900">
                {typeof lead.budget === 'number' ? `£${lead.budget.toLocaleString()}` : '—'}
              </dd>
            </div>
            <div>
              <dt className="text-zinc-500">Timeline</dt>
              <dd className="text-zinc-900">{lead.timeline ?? '—'}</dd>
            </div>
          </dl>
        </section>
      </div>
    </div>
  );
}
