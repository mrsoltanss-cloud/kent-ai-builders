import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth/options";

function normalizeUK(raw?: string | null) {
  if (!raw) return null;
  const d = raw.replace(/\D/g, "");
  if (!d) return null;
  if (d.startsWith("0")) return `44${d.slice(1)}`;
  return d;
}
function waLink(ref?: string|null, service?: string|null, postcode?: string|null) {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
  const n = normalizeUK(phone);
  const msgParts = [
    ref ? `Hi Brixel — Ref ${ref}.` : `Hi Brixel — I have a job request.`,
    service ? `Service: ${service}` : null,
    postcode ? `Postcode: ${postcode}` : null,
  ].filter(Boolean).join(" ");
  return n ? `/api/wa?text=${encodeURIComponent(msgParts)}` : "/api/wa";
}

export const dynamic = "force-dynamic";

export default async function PortalPage() {
  const session = await getServerSession(authOptions as any);
  if (!session?.user?.email) {
    // not signed in → go to homeowner sign-in
    redirect("/auth/signin?callbackUrl=%2Fmy%2Fportal");
  }

  // Fetch this user's leads
  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
    select: { id: true, name: true, leads: {
      orderBy: { createdAt: "desc" },
      select: { id: true, service: true, details: true, postcode: true, urgency: true, status: true, reference: true, createdAt: true }
    } }
  });

  return (
    <main className="mx-auto max-w-5xl px-4 md:px-6 py-8">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">My Portal</h1>
        <a href="/api/auth/signout" className="rounded-full border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50">Sign out</a>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 text-xs font-medium">All</span>
        <span className="inline-flex items-center rounded-full bg-slate-100 text-slate-700 border border-slate-200 px-3 py-1 text-xs">Matched</span>
        <span className="inline-flex items-center rounded-full bg-slate-100 text-slate-700 border border-slate-200 px-3 py-1 text-xs">Confirming scope</span>
        <span className="inline-flex items-center rounded-full bg-slate-100 text-slate-700 border border-slate-200 px-3 py-1 text-xs">Estimate ready</span>
        <span className="inline-flex items-center rounded-full bg-slate-100 text-slate-700 border border-slate-200 px-3 py-1 text-xs">Work scheduled</span>
        <span className="inline-flex items-center rounded-full bg-slate-100 text-slate-700 border border-slate-200 px-3 py-1 text-xs">Archived</span>
      </div>

      {user?.leads?.length ? (
        <ul className="space-y-4">
          {user.leads.map((l) => (
            <li key={l.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold text-slate-900">{l.service || "Job"}</h2>
                    {l.reference ? (
                      <span className="text-xs text-slate-500">Ref {l.reference}</span>
                    ) : null}
                  </div>
                  <div className="text-sm text-slate-600">
                    {(l.postcode || "")} {l.urgency ? "• " + l.urgency : ""}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={waLink(l.reference, l.service, l.postcode)}
                    className="inline-flex items-center rounded-md bg-emerald-600 text-white px-3 py-1.5 text-sm font-medium hover:bg-emerald-500"
                  >
                    Chat on WhatsApp
                  </a>
                  <a
                    href={`/quote/success?leadId=${l.id}&ref=${encodeURIComponent(l.reference || "")}&service=${encodeURIComponent(l.service || "")}&postcode=${encodeURIComponent(l.postcode || "")}`}
                    className="inline-flex items-center rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-800 hover:bg-slate-50"
                  >
                    View details
                  </a>
                </div>
              </div>
              {l.details && <p className="mt-2 text-sm text-slate-700">{l.details}</p>}

              <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="font-medium text-slate-900 mb-1">What happens next</div>
                <ol className="text-sm text-slate-700 list-decimal pl-5 space-y-1">
                  <li>Chat to us on WhatsApp — you’ll be routed to a specialist.</li>
                  <li>You’re matched — vetted local builder assigned.</li>
                  <li>Book your site survey — pick a time that suits you.</li>
                  <li>Get your estimate — we’ll confirm the scope and price.</li>
                  <li>Schedule the work — agree a start date; covered by our guarantee.</li>
                </ol>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-700">
          No jobs yet. <a className="text-emerald-700 font-medium hover:underline" href="/quote/conversational">Post your first job →</a>
        </div>
      )}
    </main>
  );
}
