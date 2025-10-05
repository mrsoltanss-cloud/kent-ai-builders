import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import SignOutButton from '@/components/SignOutButton';

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

function StatCard({
  title,
  value,
  hint,
  href,
}: {
  title: string;
  value: React.ReactNode;
  hint?: string;
  href?: string;
}) {
  const content = (
    <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm ring-1 ring-transparent transition hover:shadow-md hover:ring-emerald-100 grid gap-2">
      <div className="text-sm text-zinc-500">{title}</div>
      <div className="text-3xl font-semibold tracking-tight">{value}</div>
      {hint ? <div className="text-xs text-zinc-500">{hint}</div> : null}
      <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-to-br from-emerald-50 to-transparent" />
    </div>
  );
  if (href) return <Link href={href}>{content}</Link>;
  return content;
}

export default async function Page() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id as string | undefined;
  if (!userId) redirect('/auth/signin');

  const [leadCount, recent, latest, grouped] = await Promise.all([
    prisma.lead.count({ where: { userId } }),
    prisma.lead.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { id: true, service: true, status: true, createdAt: true },
    }),
    prisma.lead.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        service: true,
        scope: true,
        rooms: true,
        sqm: true,
        propertyAge: true,
        urgency: true,
        budget: true,
        timeline: true,
        status: true,
        notes: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.lead.groupBy({
      by: ['status'],
      where: { userId },
      _count: { _all: true },
    }),
  ]);

  const statusCounts: Record<string, number> = Object.fromEntries(
    grouped.map((g) => [g.status, g._count._all])
  );

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-white to-zinc-50">
      {/* Header */}
      <div className="border-b border-zinc-200 bg-gradient-to-b from-white to-emerald-50/40">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">My Dashboard</h1>
              <p className="mt-1 text-sm text-zinc-600">
                Live overview of your requests and recent activity.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/quote"
                className="inline-flex items-center rounded-xl bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
              >
                Start a new quote
              </Link>
              <SignOutButton />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-4 py-6">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total leads"
            value={leadCount.toLocaleString()}
            hint={leadCount === 0 ? 'No requests yet' : `${leadCount} recorded`}
          />
          <StatCard
            title="New"
            value={(statusCounts['NEW'] ?? 0).toLocaleString()}
            hint="Awaiting triage"
          />
          <StatCard
            title="Contacted / Booked"
            value={`${(statusCounts['CONTACTED'] ?? 0) + (statusCounts['BOOKED'] ?? 0)}`}
            hint="Active pipeline"
          />
          <StatCard
            title="Create a new quote"
            value="Start now →"
            hint="Get an instant ballpark estimate"
            href="/quote"
          />
        </div>

        {/* Two-column layout */}
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* Recent */}
          <section className="lg:col-span-2">
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Recent leads</h2>
                <Link className="text-sm text-zinc-600 hover:text-emerald-700" href="/quote">
                  New quote
                </Link>
              </div>

              {recent.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
                  <div className="h-12 w-12 rounded-full bg-emerald-50 ring-1 ring-emerald-100" />
                  <p className="text-sm text-zinc-600">
                    No leads yet. Create your first quote to get started.
                  </p>
                  <Link
                    href="/quote"
                    className="mt-2 inline-flex items-center rounded-xl bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
                  >
                    Start a quote
                  </Link>
                </div>
              ) : (
                <div className="overflow-hidden rounded-xl border border-zinc-200">
                  <table className="w-full text-sm">
                    <thead className="bg-zinc-50 text-left text-zinc-500">
                      <tr>
                        <th className="px-4 py-3">Service</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Created</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recent.map((l) => (
                        <tr key={l.id} className="border-t border-zinc-200">
                          <td className="px-4 py-3">
                            <Link href={`/my/leads/${l.id}`} className="font-medium text-emerald-700 hover:underline">
                              {l.service || '—'}
                            </Link>
                            <div className="text-xs text-zinc-500">ID: {l.id.slice(0, 8)}…</div>
                          </td>
                          <td className="px-4 py-3">
                            <StatusBadge status={l.status} />
                          </td>
                          <td className="px-4 py-3">{formatDate(l.createdAt)}</td>
                          <td className="px-4 py-3 text-right">
                            <Link
                              href={`/my/leads/${l.id}`}
                              className="inline-flex items-center rounded-lg border border-zinc-300 px-3 py-1.5 text-xs text-zinc-700 hover:bg-zinc-50"
                            >
                              View
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>

          {/* Latest lead detail */}
          <aside className="lg:col-span-1">
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold">Latest lead details</h2>
              {!latest ? (
                <p className="text-sm text-zinc-600">No details to show yet.</p>
              ) : (
                <dl className="grid grid-cols-3 gap-3 text-sm">
                  <dt className="col-span-1 text-zinc-500">Service</dt>
                  <dd className="col-span-2 text-zinc-900">{latest.service || '—'}</dd>

                  <dt className="col-span-1 text-zinc-500">Status</dt>
                  <dd className="col-span-2"><StatusBadge status={latest.status} /></dd>

                  <dt className="col-span-1 text-zinc-500">Rooms</dt>
                  <dd className="col-span-2">{latest.rooms ?? '—'}</dd>

                  <dt className="col-span-1 text-zinc-500">Size (sqm)</dt>
                  <dd className="col-span-2">{latest.sqm ?? '—'}</dd>

                  <dt className="col-span-1 text-zinc-500">Property age</dt>
                  <dd className="col-span-2">{(latest as any).propertyAge ?? '—'}</dd>

                  <dt className="col-span-1 text-zinc-500">Urgency</dt>
                  <dd className="col-span-2">{(latest as any).urgency ?? '—'}</dd>

                  <dt className="col-span-1 text-zinc-500">Budget</dt>
                  <dd className="col-span-2">
                    {typeof latest.budget === 'number' ? `£${latest.budget.toLocaleString()}` : '—'}
                  </dd>

                  <dt className="col-span-1 text-zinc-500">Timeline</dt>
                  <dd className="col-span-2">{latest.timeline ?? '—'}</dd>

                  <dt className="col-span-1 text-zinc-500">Created</dt>
                  <dd className="col-span-2">{formatDate(latest.createdAt)}</dd>

                  <dt className="col-span-1 text-zinc-500">Updated</dt>
                  <dd className="col-span-2">{formatDate(latest.updatedAt)}</dd>
                </dl>
              )}

              <div className="mt-5 flex gap-2">
                <Link
                  href="/quote"
                  className="inline-flex w-full items-center justify-center rounded-xl bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
                >
                  Add photos / details
                </Link>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <h3 className="mb-2 text-sm font-semibold text-zinc-900">What happens next?</h3>
              <ol className="list-decimal pl-5 text-sm text-zinc-600">
                <li>We review your scope and photos (if added).</li>
                <li>You’ll get contact within 1–2 business days.</li>
                <li>We firm up your estimate after a site visit.</li>
              </ol>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
