"use client";
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function CompleteProfilePage() {
  const { status } = useSession();
  const router = useRouter();
  const [busy, setBusy] = React.useState(false);
  const [msg, setMsg] = React.useState<string | null>(null);
  const [err, setErr] = React.useState<string | null>(null);

  // form fields
  const [postcode, setPostcode] = React.useState('');
  const [address1, setAddress1] = React.useState('');
  const [address2, setAddress2] = React.useState('');
  const [city, setCity] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [timeframe, setTimeframe] = React.useState('ASAP');
  const [propertyType, setPropertyType] = React.useState('House');
  const [ownership, setOwnership] = React.useState('Owner');
  const [accessNotes, setAccessNotes] = React.useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setErr(null); setMsg(null);
    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        credentials: 'include',
        cache: 'no-store',
        body: JSON.stringify({
          postcode,
          addressLine1: address1,
          addressLine2: address2,
          city,
          phone,
          timeframe,
          propertyType,
          ownership,
          accessNotes,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json?.error || 'Update failed');

      setMsg('Profile saved. You’re all set!');
      setTimeout(() => router.push('/my/portal'), 800);
    } catch (e: any) {
      setErr(e.message || 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  }

  if (status === 'loading') {
  return <main className="min-h-[70vh] flex items-center justify-center"><p className="text-sm text-neutral-500">Loading…</p></main>;
}
if (status === 'unauthenticated') {
  return <main className="min-h-[70vh] flex items-center justify-center"><div className="text-center"><p className="text-sm text-neutral-600 mb-3">Please sign in to continue.</p><a className="inline-flex rounded-lg bg-emerald-600 text-white px-4 py-2 font-semibold" href="/auth/signin">Sign in</a></div></main>;
}

return (
    <main className="min-h-[80vh] flex items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-2xl">
        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-black/5 p-6 md:p-8">
          <h1 className="text-2xl font-bold tracking-tight">Finish your profile</h1>
          <p className="mt-2 text-sm text-neutral-600">
            This helps us price accurately and match you with the right local team.
          </p>

          <form onSubmit={onSubmit} className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-1">
              <label className="block text-sm font-medium">Postcode</label>
              <input className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 focus:ring-2 focus:ring-emerald-500"
                     value={postcode} onChange={(e)=>setPostcode(e.target.value)} required inputMode="text"/>
            </div>

            <div className="md:col-span-1">
              <label className="block text-sm font-medium">Phone (for updates)</label>
              <input className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 focus:ring-2 focus:ring-emerald-500"
                     value={phone} onChange={(e)=>setPhone(e.target.value)} inputMode="tel"/>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium">Address line 1</label>
              <input className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 focus:ring-2 focus:ring-emerald-500"
                     value={address1} onChange={(e)=>setAddress1(e.target.value)} />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium">Address line 2 (optional)</label>
              <input className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 focus:ring-2 focus:ring-emerald-500"
                     value={address2} onChange={(e)=>setAddress2(e.target.value)} />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium">Town / City</label>
              <input className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 focus:ring-2 focus:ring-emerald-500"
                     value={city} onChange={(e)=>setCity(e.target.value)} />
            </div>

            <div>
              <label className="block text-sm font-medium">Target start</label>
              <select className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 focus:ring-2 focus:ring-emerald-500"
                      value={timeframe} onChange={(e)=>setTimeframe(e.target.value)}>
                <option>ASAP</option>
                <option>2–4 weeks</option>
                <option>Flexible</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium">Property type</label>
              <select className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 focus:ring-2 focus:ring-emerald-500"
                      value={propertyType} onChange={(e)=>setPropertyType(e.target.value)}>
                <option>House</option>
                <option>Flat</option>
                <option>Bungalow</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium">Ownership</label>
              <select className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 focus:ring-2 focus:ring-emerald-500"
                      value={ownership} onChange={(e)=>setOwnership(e.target.value)}>
                <option>Owner</option>
                <option>Landlord</option>
                <option>Tenant</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium">Access notes (parking, hours, etc.)</label>
              <textarea className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 focus:ring-2 focus:ring-emerald-500"
                        rows={3}
                        value={accessNotes} onChange={(e)=>setAccessNotes(e.target.value)} />
            </div>

            {err && <div className="md:col-span-2 rounded-lg bg-red-50 text-red-700 text-sm px-3 py-2">{err}</div>}
            {msg && <div className="md:col-span-2 rounded-lg bg-emerald-50 text-emerald-700 text-sm px-3 py-2">{msg}</div>}

            <div className="md:col-span-2">
              <button type="submit" disabled={busy}
                className="w-full rounded-lg bg-emerald-600 text-white font-semibold py-2.5 hover:bg-emerald-500 disabled:opacity-60">
                {busy ? 'Saving…' : 'Save & continue'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
