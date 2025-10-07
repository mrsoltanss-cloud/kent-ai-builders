import Link from "next/link";

export const metadata = {
  title: "Homeowner sign up",
  description: "Create your account to get quotes and manage your project.",
};

export default function HomeownerSignup() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-14">
      <h1 className="text-2xl font-semibold mb-3">Create your homeowner account</h1>
      <p className="text-gray-600 mb-6">
        You’ll be able to get instant estimates, message builders and track your project.
      </p>

      {/* Change the href below to your actual signup/signin route if different */}
      <div className="flex gap-3">
        <Link
          href="/auth/signin?callbackUrl=/my"
          className="inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium hover:bg-gray-50"
        >
          Sign in
        </Link>
        <Link
          href="/auth/signup?role=homeowner"
          className="inline-flex items-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
        >
          Create account
        </Link>
      </div>

      <p className="text-xs text-gray-500 mt-4">
        Don’t worry, you can also continue as a guest later.
      </p>
    </main>
  );
}
