import { promises as fs } from "fs";
import path from "path";

const SIGNIN_FILE = "app/auth/signin/page.tsx";
const TRADE_SIGNIN_PAGE = "app/trade/signin/page.tsx";

async function ensureTradeSigninPage() {
  try {
    await fs.access(TRADE_SIGNIN_PAGE);
    console.log("✓ /trade/signin already exists");
  } catch {
    await fs.mkdir(path.dirname(TRADE_SIGNIN_PAGE), { recursive: true });
    await fs.writeFile(
      TRADE_SIGNIN_PAGE,
      `\"use client\";
import { useState } from "react";
import { signIn } from "next-auth/react";

export default function TradeSignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    await signIn("credentials", {
      redirect: true,
      email,
      password,
      callbackUrl: "/trade/profile",
    }).finally(() => setSubmitting(false));
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-emerald-50 p-4">
      <div className="w-full max-w-md rounded-2xl shadow-lg bg-white p-6 md:p-8">
        <h1 className="text-3xl font-semibold text-center">🔧 Trade sign in</h1>
        <p className="text-sm text-gray-500 text-center mt-1">Access your builder account.</p>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" required value={email} onChange={(e)=>setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="you@company.com" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input type="password" required value={password} onChange={(e)=>setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="••••••••" />
          </div>
          <button type="submit" disabled={submitting}
            className="w-full rounded-lg bg-emerald-600 text-white py-2.5 font-medium hover:bg-emerald-700 transition">
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
`,
      "utf8"
    );
    console.log("✓ Created /trade/signin page");
  }
}

async function patchHomeownerSignin() {
  const src = await fs.readFile(SIGNIN_FILE, "utf8").catch(() => null);
  if (!src) {
    console.error(`✗ Could not find ${SIGNIN_FILE}. Adjust the path if your signin lives elsewhere.`);
    process.exit(1);
  }
  if (src.includes('/trade/signin')) {
    console.log("✓ Link to /trade/signin already present");
    return;
  }

  // Backup
  const backup = SIGNIN_FILE + ".bak." + Date.now();
  await fs.writeFile(backup, src, "utf8");

  // Strategy A: replace the common footer block if present
  const footerBlockRegex = /<div className="flex items-center justify-between mt-6 text-sm">[\\s\\S]*?<\\/div>/m;
  const newFooter =
`<div className="flex items-center justify-between mt-6 text-sm">
          <Link href="/" className="text-gray-500 hover:text-gray-700">
            ← Back home
          </Link>
          <div className="space-x-3">
            <Link href="/auth/signup" className="text-emerald-700 hover:underline">
              New here? Create an account
            </Link>
            <span className="text-gray-300">|</span>
            <Link href="/trade/signin" className="text-emerald-700 hover:underline">
              Trade sign in?
            </Link>
          </div>
        </div>`;

  let out = src;
  if (footerBlockRegex.test(src)) {
    out = src.replace(footerBlockRegex, newFooter);
  } else {
    // Strategy B: inject right after </form> as a safe fallback
    out = src.replace(
      /<\/form>/m,
      `</form>
        ${newFooter}`
    );
  }

  await fs.writeFile(SIGNIN_FILE, out, "utf8");
  console.log(`✓ Patched ${SIGNIN_FILE}\n  • backup saved to ${backup}`);
}

await ensureTradeSigninPage();
await patchHomeownerSignin();
