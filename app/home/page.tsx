import Link from "next/link";
import { requireUser } from "@/lib/auth/requireUser";
import { redirect } from "next/navigation";

export default async function HomeDashboard() {
  const { user } = await requireUser();
  if (!user) redirect("/auth/signin");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Welcome{user?.name ? `, ${user.name}` : ""}</h1>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="border rounded-xl p-4">
          <h2 className="font-medium mb-2">Start a new project</h2>
          <p className="text-sm text-gray-600 mb-3">Describe your job and get instant estimates.</p>
          <Link href="/quote" className="inline-block rounded-md bg-emerald-600 text-white px-4 py-2 hover:bg-emerald-700">Open Quote Wizard</Link>
        </section>

        <section className="border rounded-xl p-4">
          <h2 className="font-medium mb-2">Recent projects</h2>
          <p className="text-sm text-gray-600">Your latest projects will appear here.</p>
        </section>
      </div>

      <section className="border rounded-xl p-4">
        <h2 className="font-medium mb-2">Messages</h2>
        <p className="text-sm text-gray-600">Conversation threads with traders (coming soon).</p>
      </section>
    </div>
  );
}
