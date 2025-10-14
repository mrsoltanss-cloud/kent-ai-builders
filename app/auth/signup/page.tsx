'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { getSession } from 'next-auth/react';

async function waitForSession(timeoutMs=4000) {
  const t0 = Date.now();
  while (Date.now() - t0 < timeoutMs) {
    const sess = await getSession();
    if (sess) return true;
    await new Promise(r=>setTimeout(r,150));
  }
  return false;
}

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [show, setShow] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json?.error || 'Signup failed');

// Auto sign-in using the same credentials (Credentials provider)
const auth = await signIn('credentials', { email, password, redirect: false });
if (auth?.error) {
  throw new Error('Signed up but could not sign in automatically. Please sign in.');
}

// Now go to the profile completion step
router.push('/my/complete-profile');
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-[80vh] flex items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-black/5 p-6 md:p-8">
          <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
      <p className="text-sm text-slate-500">For homeowners · <a className="text-cyan-600" href="/trade/signup">Are you a builder?</a></p>
          <p className="mt-2 text-sm text-neutral-600">
            Save quotes, track progress, and book vetted local builders.
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium">Full name</label>
              <input
                className="mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-[15px] outline-none focus:ring-2 focus:ring-emerald-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                className="mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-[15px] outline-none focus:ring-2 focus:ring-emerald-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Password</label>
              <div className="mt-1 flex items-center gap-2">
                <input
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-[15px] outline-none focus:ring-2 focus:ring-emerald-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={show ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  className="rounded-md px-2 py-1 text-sm text-emerald-700 hover:bg-emerald-50"
                >
                  {show ? 'Hide' : 'Show'}
                </button>
              </div>
              <p className="mt-1 text-xs text-neutral-500">
                Use 8+ characters with letters and a number.
              </p>
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 text-red-700 text-sm px-3 py-2">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-lg bg-emerald-600 text-white font-semibold py-2.5 hover:bg-emerald-500 disabled:opacity-60"
            >
              {busy ? 'Creating account…' : 'Create account'}
            </button>

            <p className="text-center text-sm text-neutral-600">
              Already have an account?{' '}
              <a href="/auth/signin" className="text-emerald-700 hover:underline">
                Sign in
              </a>
            </p>

            <p className="text-center text-xs text-neutral-500">
              By continuing you agree to our{' '}
              <a className="underline" href="/terms">Terms</a> and{' '}
              <a className="underline" href="/privacy">Privacy</a>.
            </p>
          </form>
        </div>

        <div className="mt-4 flex justify-center gap-3 text-[12px] text-neutral-600">
          <span>DBS-checked teams</span>
          <span>•</span>
          <span>£5m insurance</span>
          <span>•</span>
          <span>12-month guarantee</span>
        </div>
      </div>
    </main>
  );
}
