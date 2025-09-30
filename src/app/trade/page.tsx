import Link from "next/link";
import { requireUser } from "@/lib/auth/requireUser";
import { redirect } from "next/navigation";

export default async function TraderLeads() {
  const { user } = await requireUser();
  if (!user) redirect("/auth/signin");
  if (user.role !== "TRADER" && user.role !== "ADMIN") redirect("/home");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Leads inbox</h1>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="border rounded-xl p-4">
          <h2 className="font-medium mb-2">New leads</h2>
          <p className="text-sm text-gray-600">Incoming leads from the quote wizard will appear here.</p>
          <p className="text-xs text-gray-500 mt-2">Next: accept/decline, send price, book site visit.</p>
        </section>

        <section className="border rounded-xl p-4">
          <h2 className="font-medium mb-2">Quick setup</h2>
          <ul className="text-sm list-disc pl-5 space-y-1 text-gray-700">
            <li><Link href="/trade/company" className="underline">Company profile</Link> (logo, services, areas)</li>
            <li>Verification (ID, insurance) — coming soon</li>
            <li>Calendar sync — coming soon</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
