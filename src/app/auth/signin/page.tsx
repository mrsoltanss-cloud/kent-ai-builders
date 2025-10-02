"use client";
import { Suspense, useMemo, useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export const dynamic = "force-dynamic";

function Banner({ callbackUrl }: { callbackUrl: string }) {
  const show = useMemo(() => callbackUrl?.startsWith("/quote"), [callbackUrl]);
  if (!show) return null;
  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 text-amber-900 px-3 py-2 text-sm">
      Please sign in or create an account to get your instant estimate.
    </div>
  );
}

function SignInInner() {
  const sp = useSearchParams();
  const callbackUrl = sp.get("callbackUrl") || "/home";

  const [email, setEmail] = useState("homeowner@brixel.uk");
  const [password, setPassword] = useState("test123");
  const [loading, setLoading] = useState<"" | "google" | "email">("");

  async function onEmail(e: React.FormEvent) {
    e.preventDefault();
    setLoading("email");
    const res = await signIn("credentials", { redirect: false, email, password, callbackUrl });
    setLoading("");
    if (res?.ok) window.location.href = callbackUrl;
    else alert(res?.error || "Sign-in failed");
  }

  function onGoogle() {
    setLoading("google");
    signIn("google", { callbackUrl });
  }

  return (
    <main className="min-h-[70vh] grid place-items-center px-4 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl border p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-center">Log in to Brixel</h1>
        <p className="text-center text-slate-600 mt-1">Welcome back! 👋</p>

        <div className="mt-4"><Banner callbackUrl={callbackUrl} /></div>

        <button
          onClick={onGoogle}
          className="w-full mt-6 rounded-lg border px-4 py-2 hover:bg-slate-50"
          disabled={loading==="google"}
        >
          {loading==="google" ? "Opening Google…" : "Continue with Google"}
        </button>

        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t" /></div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-slate-500">or</span>
          </div>
        </div>

        <form onSubmit={onEmail} className="space-y-3">
          <div>
            <label className="text-sm">Email</label>
            <input
              type="email" required value={email}
              onChange={e=>setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border px-3 py-2"
              placeholder="homeowner@brixel.uk"
            />
          </div>
          <div>
            <label className="text-sm">Password</label>
            <input
              type="password" required value={password}
              onChange={e=>setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border px-3 py-2"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-emerald-600 text-white px-4 py-2 hover:bg-emerald-700"
            disabled={loading==="email"}
          >
            {loading==="email" ? "Signing in…" : "Sign in with Email"}
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          New to Brixel?{" "}
          <a href="/auth/signup" className="text-emerald-700 hover:underline">Create an account</a>
        </p>
      </div>
    </main>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<main className="min-h-[50vh] grid place-items-center">Loading…</main>}>
      <SignInInner />
    </Suspense>
  );
}
