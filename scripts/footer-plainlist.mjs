import fs from "fs";

const FILE = "app/page.js";
if (!fs.existsSync(FILE)) {
  console.error("❌ app/page.js not found");
  process.exit(1);
}

let s = fs.readFileSync(FILE, "utf8");

// A) Remove any stray duplicate bottom line
s = s.replace(/<p[^>]*>[^<]*Chat on WhatsApp to book a site visit today[\s\S]*?<\/p>\s*/g, "");

// B) Inside the LAST <footer>…</footer>, replace the pill container with a plain, bullet-separated list
const start = s.lastIndexOf("<footer");
const end   = s.indexOf("</footer>", start);
if (start === -1 || end === -1) {
  console.error("❌ Could not find a <footer>…</footer> block.");
  process.exit(1);
}
const before = s.slice(0, start);
let footer   = s.slice(start, end + "</footer>".length);
const after  = s.slice(end + "</footer>".length);

// The pill container div we previously rendered
const pillDivRe = /<div className="mt-4[^"]*flex[^"]*gap-2"[^>]*>[\s\S]*?<\/div>/;

// Build a plain text list with the same style as the crumb (white text, bullets)
const towns = [
  "Sevenoaks","Swanley","Dartford","Gravesend","Longfield","New Ash Green","Rochester",
  "Chatham","Gillingham","Strood","Maidstone","Aylesford","Snodland","West Malling",
  "Sittingbourne","Tonbridge","Royal Tunbridge Wells","Orpington","Bromley","Sidcup",
  "Bexleyheath","Welling","Greenhithe","Swanscombe","Ebbsfleet",
];

const plainList =
  `<div className="mt-4 text-sm">
     <div className="flex flex-wrap gap-x-2 gap-y-1">
       ${towns
         .map((t, i) => {
           const sep = i < towns.length - 1 ? ' <span>•</span> ' : '';
           return `<span className="text-white">${t}</span>${sep}`;
         })
         .join("")}
     </div>
   </div>`.replace(/\n\s+/g, " ").trim();

if (pillDivRe.test(footer)) {
  footer = footer.replace(pillDivRe, plainList);
} else {
  console.warn("⚠️ Pill container not found in footer; no change to towns block.");
}

// Write back
fs.writeFileSync(FILE, before + footer + after);
console.log("✅ Footer updated: pills removed, towns now a plain bullet list matching the crumb style.");
