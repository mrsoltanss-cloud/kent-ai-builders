"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/quote";

  const [email, setEmail] = useState("");
  const [name, setName]   = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setMsg(null);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Signup failed");

      // auto-login
      const si = await signIn("credentials", { email, password, callbackUrl });
      // NextAuth handles redirect; if not, push manually:
      setTimeout(()=>router.push(callbackUrl), 300);
    } catch (err:any) {
      setMsg(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-md px-4 py-10">
      <h1 className="text-2xl font-extrabold">Create your account</h1>
      <p className="text-gray-600 mt-1">It’s free and only takes a minute.</p>
      <form onSubmit={onSubmit} className="mt-6 space-y-3">
        <div>
          <label className="block text-sm font-medium">Name (optional)</label>
          <input value={name} onChange={(e)=>setName(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input type="email" required value={email} onChange={(e)=>setEmail(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Password</label>
          <input type="password" required value={password} onChange={(e)=>setPassword(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2" />
        </div>
        {msg && <p className="text-red-600 text-sm">{msg}</p>}
        <button disabled={loading} className="w-full rounded-lg bg-emerald-600 text-white px-4 py-2 font-semibold disabled:opacity-50">
          {loading ? "Creating..." : "Create account"}
        </button>
      </form>
      <p className="mt-3 text-sm text-gray-600">
        Already have an account? <a href={`/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`} className="text-emerald-700 underline">Sign in</a>
      </p>
    </main>
  );
}
