export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/options";
import { PrismaClient } from "@prisma/client";
import CopyRef from "./CopyRef";
import Image from "next/image";
import ConfettiBurst from "./ConfettiBurst"; // 🎉 NEW

/* --- Inline icons --- */
function CheckIcon(){return(<svg viewBox="0 0 24 24" className="w-10 h-10" aria-hidden="true"><path d="M20 6L9 17l-5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>)}
function IconTick(){return(<svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" aria-hidden="true"><path d="M20 6L9 17l-5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>)}
function IconRobot(){return(<svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" aria-hidden="true"><rect x="3" y="6" width="18" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="2"/><circle cx="9" cy="12" r="1.5" fill="currentColor"/><circle cx="15" cy="12" r="1.5" fill="currentColor"/><path d="M12 3v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>)}
function IconMail(){return(<svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" aria-hidden="true"><path d="M4 6h16v12H4z" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M4 7l8 6 8-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>)}
function IconCamera(){return(<svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" aria-hidden="true"><path d="M4 7h4l2-2h4l2 2h4v12H4z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="13" r="3.5" fill="none" stroke="currentColor" strokeWidth="2"/></svg>)}
function IconHardHat(){return(<svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" aria-hidden="true"><path d="M20 19H4a8 8 0 0116 0z" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M12 5v4M8 7v2M16 7v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>)}

type SP = Record<string, string | string[] | undefined>;

export default async function SuccessPage({ searchParams }: { searchParams: Promise<SP> }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect(`/auth/signin?callbackUrl=${encodeURIComponent("/quote/success")}`);

  const sp = await searchParams;
  const id = (sp?.id as string) || "";

  let lead: { id: string; service: string | null; postcode: string | null; areaSqm: number | null; rooms: number | null; urgency: string | null } | null = null;
  if (id && process.env.DATABASE_URL) {
    try {
      const db = new PrismaClient();
      lead = await db.lead.findUnique({
        where: { id },
        select: { id: true, service: true, postcode: true, areaSqm: true, rooms: true, urgency: true },
      });
      await db.$disconnect();
    } catch {}
  }

  const firstName = (session?.user?.name || "").trim().split(" ").filter(Boolean)[0] || undefined;
  const whatsapp = process.env.WHATSAPP_NUMBER_E164 || "";
  const supportEmail = process.env.SUPPORT_EMAIL || "hello@brixel.uk";
  const bookUrl = process.env.BOOK_SURVEY_URL || "/home";
  const waText = `Hi, I just submitted a quote. Ref: ${id || "(pending)"}${firstName ? ` — I'm ${firstName}.` : ""}`;
  const waUrl = whatsapp ? `https://wa.me/${whatsapp}?text=${encodeURIComponent(waText)}` : undefined;
  const logoUrl = process.env.BRAND_LOGO_URL || "";

  return (
    <main className="mx-auto p-6" style={{ maxWidth: "42rem" }}>
      <ConfettiBurst /> {/* 🎉 fire once on page load */}
      <div className="rounded-2xl border shadow-sm overflow-hidden bg-white">
        {/* --- Branded header --- */}
        <div className="relative h-28 bg-gradient-to-r from-emerald-400 to-teal-500">
          <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(white_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="relative h-full flex items-center justify-center px-6">
            <div className="flex items-center gap-3">
              {logoUrl ? (
                <Image src={logoUrl} alt="Brixel logo" width={40} height={40} className="h-10 w-10 rounded-md bg-white/80 backdrop-blur p-1" />
              ) : (
                <div className="h-10 w-10 rounded-md bg-white/80 backdrop-blur flex items-center justify-center font-semibold">B</div>
              )}
              <div className="text-white">
                <div className="text-2xl font-semibold leading-tight">Brixel</div>
                <div className="text-xs opacity-90 -mt-0.5">Home improvements, done right.</div>
              </div>
            </div>
          </div>
        </div>

        <div className="-mt-8 px-8 pb-8">
          <div className="w-16 h-16 rounded-2xl bg-white shadow -mt-8 flex items-center justify-center text-emerald-600"><CheckIcon /></div>

          <h1 className="text-2xl font-semibold mt-4">
            {firstName ? <>Thanks, {firstName} — we’ve got your request.</> : <>Request received</>}
          </h1>
          <p className="text-gray-600 mt-2">We’ve started preparing your quotation. Your reference is below.</p>

          {id && (
            <div className="mt-4 rounded-xl bg-gray-50 border p-3 flex items-center gap-3">
              <div className="grow">
                <p className="text-xs text-gray-500">Reference</p>
                <p className="font-mono text-sm">{id}</p>
              </div>
              <CopyRef value={id} />
            </div>
          )}

          {lead && (
            <div className="mt-4 rounded-xl border p-4">
              <p className="text-sm font-medium">Project summary</p>
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-sm">
                <div><span className="text-gray-500">Service:</span> {lead.service || "—"}</div>
                <div><span className="text-gray-500">Postcode:</span> {lead.postcode || "—"}</div>
                <div><span className="text-gray-500">Area:</span> {lead.areaSqm ? `${lead.areaSqm} sqm` : "—"}</div>
                <div><span className="text-gray-500">Rooms:</span> {lead.rooms ?? "—"}</div>
                <div className="sm:col-span-2"><span className="text-gray-500">Timeline:</span> {lead.urgency || "—"}</div>
              </div>
            </div>
          )}

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <a href={bookUrl} className="text-center px-4 py-2.5 rounded-xl bg-black text-white hover:opacity-90">Book a survey</a>
            {waUrl ? (
              <a href={waUrl} target="_blank" className="text-center px-4 py-2.5 rounded-xl border hover:bg-gray-50">Chat to us on WhatsApp</a>
            ) : (
              <a
                href={`mailto:${supportEmail}?subject=${encodeURIComponent("Quote request")}&body=${encodeURIComponent(`My reference: ${id}`)}`}
                className="text-center px-4 py-2.5 rounded-xl border hover:bg-gray-50"
              >
                Email our team
              </a>
            )}
          </div>

          <div className="mt-8">
            <p className="font-medium text-sm text-gray-900">What happens next</p>
            <ol className="mt-4 relative border-l pl-6 space-y-5">
              <li className="relative pl-8">
                <span className="absolute left-0 top-0 w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center ring-2 ring-white shadow"><IconTick /></span>
                <p className="font-medium">You’re in the system 🎉</p>
                <p className="text-gray-600 text-sm mt-1">We’ve logged your project.</p>
              </li>
              <li className="relative pl-8">
                <span className="absolute left-0 top-0 w-6 h-6 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center ring-2 ring-white"><IconRobot /></span>
                <p className="font-medium">Experts + AI at work</p>
                <p className="text-gray-600 text-sm mt-1">Your details are being reviewed for the most accurate pricing.</p>
              </li>
              <li className="relative pl-8">
                <span className="absolute left-0 top-0 w-6 h-6 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center ring-2 ring-white"><IconMail /></span>
                <p className="font-medium">Your tailored estimate</p>
                <p className="text-gray-600 text-sm mt-1">It will arrive in your inbox soon (typically <strong>24–48 hours</strong>).</p>
              </li>
              <li className="relative pl-8">
                <span className="absolute left-0 top-0 w-6 h-6 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center ring-2 ring-white"><IconCamera /></span>
                <p className="font-medium">Want speed?</p>
                <p className="text-gray-600 text-sm mt-1">Send us photos/plans via WhatsApp to fast-track your quote.</p>
              </li>
              <li className="relative pl-8">
                <span className="absolute left-0 top-0 w-6 h-6 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center ring-2 ring-white"><IconHardHat /></span>
                <p className="font-medium">Next step</p>
                <p className="text-gray-600 text-sm mt-1">Book a site survey and we’ll handle the rest.</p>
              </li>
            </ol>
            <div className="mt-5 text-xs text-gray-500">100+ homeowners in Kent requested quotes last month — you’re in good company.</div>
          </div>

          <div className="mt-6 text-sm text-gray-600">
            <a href="/home" className="underline">View my request</a>
            <span className="px-1.5">•</span>
            <a
              href={`mailto:${supportEmail}?subject=${encodeURIComponent("Add photos to my request")}&body=${encodeURIComponent(`My reference: ${id}\n\nAdd any notes here...`)}`}
              className="underline"
            >
              Add more photos
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
