import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/options";
import { PrismaClient } from "@prisma/client";

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/signin?callbackUrl=/home");

  const email = session.user?.email || "";
  const db = new PrismaClient();

  // Select only fields guaranteed by your current schema/client
  const leads = await db.lead.findMany({
    where: email ? { email } : undefined,
    orderBy: { createdAt: "desc" },
    take: 20,
    select: {
      id: true,
      service: true,
      postcode: true,
      status: true,
      createdAt: true,
    },
  });

  await db.$disconnect();

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold">My projects</h1>
      <p className="text-gray-600 mt-1">Your recent quote requests.</p>

      {leads.length === 0 ? (
        <div className="mt-6 rounded-xl border p-6 text-gray-600">
          No requests yet. <a className="underline" href="/quote">Start a new quotation</a>.
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {leads.map((l) => (
            <div key={l.id} className="rounded-xl border p-4 flex items-center justify-between">
              <div>
                <div className="font-medium">{l.service || "Project"}</div>
                <div className="text-sm text-gray-600">
                  {l.postcode || "—"} • {new Date(l.createdAt).toLocaleDateString()}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">{l.status}</div>
              </div>
              <a
                href={`/quote/success?id=${l.id}`}
                className="px-3 py-1.5 rounded-lg border hover:bg-gray-50 text-sm"
                aria-label={`View details for ${l.service || "project"}`}
              >
                View
              </a>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
