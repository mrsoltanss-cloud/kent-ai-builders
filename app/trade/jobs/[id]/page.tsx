import { headers } from 'next/headers';

async function getJob(baseUrl: string, id: string) {
  const res = await fetch(`${baseUrl}/api/jobs?id=${encodeURIComponent(id)}`, { cache: 'no-store' });
  if (!res.ok) return null;
  const data = await res.json();
  // tolerate either {item} or {items:[...]}
  return data.item ?? data.items?.[0] ?? null;
}

export default async function JobDetail(props: { params: Promise<{ id: string }> }) {
  // ✅ Next 15: await params first
  const { id } = await props.params;

  // ✅ Build absolute base URL for server-side fetch
  const h = headers();
  const proto = h.get('x-forwarded-proto') ?? 'http';
  const host = h.get('x-forwarded-host') ?? h.get('host') ?? 'localhost:3001';
  const baseUrl = `${proto}://${host}`;

  const job = await getJob(baseUrl, id);
  if (!job) return <div className="p-6">Job not found.</div>;

  // Optional server action to reserve (kept minimal)
  async function reserve() {
    'use server';
    await fetch(`${baseUrl}/api/jobs/reserve`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ id }),
      cache: 'no-store',
    });
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">{job.title}</h1>
      {job.summary && <p className="text-gray-600">{job.summary}</p>}
      <div className="text-sm text-gray-500">Postcode: {job.postcode ?? '—'}</div>

      <form action={reserve}>
        <button className="px-4 py-2 rounded-lg bg-black text-white">
          Reserve job
        </button>
      </form>
    </div>
  );
}
