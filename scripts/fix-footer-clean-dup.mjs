import fs from "fs";

const FILE = "app/page.js";
if (!fs.existsSync(FILE)) {
  console.error("❌ app/page.js not found");
  process.exit(1);
}

let s = fs.readFileSync(FILE, "utf8");

/**
 * 1) Remove any stray duplicate paragraph outside the footer that says:
 *    "Chat on WhatsApp to book a site visit today (we’ll send times right away)."
 */
s = s.replace(/<p[^>]*>[^<]*Chat on WhatsApp to book a site visit today[\s\S]*?<\/p>\s*/g, "");

/**
 * 2) Replace the LAST <footer>…</footer> block with a clean footer WITHOUT the green CTA band.
 *    It keeps Contact (WhatsApp-first), Service Areas (crumb in the same style) and Trust.
 */
const start = s.lastIndexOf("<footer");
const end = s.indexOf("</footer>", start);
if (start === -1 || end === -1) {
  console.error("❌ Could not locate an inline <footer>…</footer> block in app/page.js");
  process.exit(1);
}

const newFooter = `
<footer className="bg-slate-900 text-slate-100">
  <div className="mx-auto max-w-6xl px-4 sm:px-6">

    {/* Info rows ONLY (CTA band removed per request) */}
    <section className="py-8 sm:py-10 border-t border-white/10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Contact — WhatsApp-first (phone/email removed) */}
        <div>
          <h4 className="text-sm font-semibold text-slate-300">Contact</h4>
          <p className="mt-3 text-slate-200">
            <a
              href={\`https://wa.me/\${(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "+441474462265").replace(/^\\+/, "")}?text=\${encodeURIComponent("Hi — I’d like to book a site visit via Brixel. Can you send available times?")}\`}
              className="underline decoration-emerald-400 underline-offset-4 hover:text-emerald-300"
            >
              Chat on WhatsApp
            </a>{" "}
            to book a site visit today — <span className="font-medium">we’ll send times right away</span>. This is the
            fastest way to get started and keep your project moving.
          </p>
        </div>

        {/* Service Areas — same style + font as 'Kent • Maidstone • …' */}
        <div>
          <h4 className="text-sm font-semibold text-slate-300">Service Areas</h4>

          {/* Primary crumb line */}
          <div className="mt-3 text-sm">
            <div className="flex flex-wrap gap-x-2">
              <span className="text-white">Kent</span><span> • </span>
              <span className="text-white">Maidstone</span><span> • </span>
              <span className="text-white">Canterbury</span><span> • </span>
              <span className="text-white">Ashford</span><span> • </span>
              <span className="text-white">Medway</span>
            </div>
          </div>

          {/* Town pills — single list, high-contrast */}
          <div className="mt-4 flex flex-wrap gap-2">
            {[
              "Sevenoaks","Swanley","Dartford","Gravesend","Longfield","New Ash Green","Rochester","Chatham","Gillingham","Strood","Maidstone","Aylesford","Snodland","West Malling","Sittingbourne","Tonbridge","Royal Tunbridge Wells","Orpington","Bromley","Sidcup","Bexleyheath","Welling","Greenhithe","Swanscombe","Ebbsfleet",
            ].map((t) => (
              <span
                key={t}
                className="rounded-full bg-white text-slate-900 px-3 py-1 text-xs sm:text-sm shadow-sm ring-1 ring-slate-200 hover:bg-emerald-50"
                title={t}
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Trust — restore points */}
        <div>
          <h4 className="text-sm font-semibold text-slate-300">Trust</h4>
          <ul className="mt-3 space-y-2 text-slate-200">
            <li>✅ Fully insured &amp; guaranteed</li>
            <li>🔒 Fair pricing, no pushy sales</li>
            <li className="text-slate-400">© Brixel {new Date().getFullYear()}</li>
          </ul>
        </div>
      </div>
    </section>
  </div>
</footer>
`;

const updated = s.slice(0, start) + newFooter + s.slice(end + "</footer>".length);

// 3) As a final cleanup, if any duplicate pill blocks lingered elsewhere, collapse any second copy by keeping the first occurrence.
const townArrayRegex = /\[\s*"Sevenoaks","Swanley"[\s\S]*?"Ebbsfleet"\s*\]/g;
let count = 0;
const deduped = updated.replace(townArrayRegex, (m) => (++count === 1 ? m : "[]"));

fs.writeFileSync(FILE, deduped);
console.log("✅ Footer cleaned: CTA removed, WhatsApp-first contact kept, Service Areas crumb styled, pills deduped, stray line removed.");
