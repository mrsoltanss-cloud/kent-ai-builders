import fs from "fs";

const FILE = "app/page.js";
if (!fs.existsSync(FILE)) {
  console.error("❌ app/page.js not found");
  process.exit(1);
}
let s = fs.readFileSync(FILE, "utf8");

// Ensure React + keep existing imports intact
if (!/components\/layout\/Footer/.test(s)) {
  s = s.replace(/(from ['"]react['"];?)/, `$1`);
}

// Build new 3-column content (Contact + Service Areas + Trust)
const threeCols = `
<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
  {/* Contact — WhatsApp-first */}
  <div>
    <h4 className="text-sm font-semibold text-slate-300">Contact</h4>
    <p className="mt-3 text-slate-200">
      <a
        href={\`https://wa.me/\${(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER||"+441474462265").replace(/^\\+/,"")}?text=\${encodeURIComponent("Hi — I’d like to book a site visit via Brixel. Can you send available times?")}\`}
        className="underline decoration-emerald-400 underline-offset-4 hover:text-emerald-300"
      >
        Chat on WhatsApp
      </a>{" "}
      to book a site visit today — <span className="font-medium">we’ll send times right away</span>. This is the fastest
      way to get started and keep your project moving.
    </p>
  </div>

  {/* Service Areas — primary crumb + readable pills */}
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

    {/* Town pills */}
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

  {/* Trust — restore icons/points */}
  <div>
    <h4 className="text-sm font-semibold text-slate-300">Trust</h4>
    <ul className="mt-3 space-y-2 text-slate-200">
      <li>✅ Fully insured &amp; guaranteed</li>
      <li>🔒 Fair pricing, no pushy sales</li>
      <li className="text-slate-400">© Brixel {new Date().getFullYear()}</li>
    </ul>
  </div>
</div>
`;

// Replace the existing 3-column block under the footer info section.
// We look for the wrapper section (border-top) then swap its first grid row.
const sectionRe = /(\\s*<section className="py-8[^"]*border-t[^"]*"[^>]*>)([\\s\\S]*?)(<\\/section>)/;
if (!sectionRe.test(s)) {
  console.error("⚠️ Could not find the footer info <section>. Appending restored block after it.");
  s += `\n<!-- Restored Footer Info -->\n${threeCols}\n`;
} else {
  s = s.replace(sectionRe, (_m, open, inner, close) => {
    // Replace first grid inside this section:
    const gridRe = /<div className="grid grid-cols-1[\\s\\S]*?<\\/div>/;
    if (gridRe.test(inner)) {
      inner = inner.replace(gridRe, threeCols);
    } else {
      // No grid found; inject ours at the start of the section
      inner = `${threeCols}\n${inner}`;
    }
    return `${open}${inner}${close}`;
  });
}

// Write back
fs.writeFileSync(FILE, s);
console.log("✅ Footer Service Areas + Trust restored with better contrast and WhatsApp-first contact.");
