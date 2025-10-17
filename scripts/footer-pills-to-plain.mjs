import fs from "fs";

const FILE = "app/page.js";
if (!fs.existsSync(FILE)) {
  console.error("❌ app/page.js not found");
  process.exit(1);
}

let s = fs.readFileSync(FILE, "utf8");

// A) Kill the stray bottom WhatsApp sentence anywhere it appears
s = s.replace(/<p[^>]*>[^<]*Chat on WhatsApp to book a site visit today[\s\S]*?<\/p>\s*/g, "");

// B) Work inside the *last* footer only
const fStart = s.lastIndexOf("<footer");
const fEnd   = s.indexOf("</footer>", fStart);
if (fStart === -1 || fEnd === -1) {
  console.error("❌ Could not find a <footer>…</footer> block.");
  process.exit(1);
}
const before = s.slice(0, fStart);
let footer   = s.slice(fStart, fEnd + "</footer>".length);
const after  = s.slice(fEnd + "</footer>".length);

// C) Find "Service Areas" then the 2nd <div className="..."> block afterwards (that is the pills container)
const svcIdx = footer.indexOf("Service Areas");
if (svcIdx === -1) {
  console.error("❌ 'Service Areas' not found in footer.");
  process.exit(1);
}

// helper to find the next <div ...>…</div> block from a given index (handles nested divs)
function nextDivBlock(html, from) {
  const start = html.indexOf("<div", from);
  if (start === -1) return null;

  const open = /<div\b/gi;
  const close = /<\/div>/gi;
  open.lastIndex = start + 1;
  close.lastIndex = start + 1;

  let depth = 1;
  while (true) {
    const nOpen = open.exec(html);
    const nClose = close.exec(html);
    if (!nClose) return null;
    if (!nOpen || nClose.index < nOpen.index) {
      depth--;
      if (depth === 0) {
        return { start, end: nClose.index + "</div>".length };
      }
    } else {
      depth++;
    }
  }
}

// 1st div after "Service Areas" -> the crumb wrapper
const first = nextDivBlock(footer, svcIdx);
if (!first) { console.error("❌ Could not locate the first <div> after 'Service Areas'"); process.exit(1); }

// 2nd div after "Service Areas" -> the pills container we want to replace
const second = nextDivBlock(footer, first.end);
if (!second) { console.error("❌ Could not locate the pills container (second <div> after 'Service Areas')"); process.exit(1); }

// D) Build a plain bullet list (same style as the crumb: white text + • separators)
const towns = [
  "Sevenoaks","Swanley","Dartford","Gravesend","Longfield","New Ash Green","Rochester",
  "Chatham","Gillingham","Strood","Maidstone","Aylesford","Snodland","West Malling",
  "Sittingbourne","Tonbridge","Royal Tunbridge Wells","Orpington","Bromley","Sidcup",
  "Bexleyheath","Welling","Greenhithe","Swanscombe","Ebbsfleet",
];

const plainList =
  `<div className="mt-4 text-sm">
     <div className="flex flex-wrap gap-x-2 gap-y-1">
       ${towns.map((t,i)=>`<span className="text-white">${t}</span>${i<towns.length-1?' <span>•</span> ':''}`).join("")}
     </div>
   </div>`.replace(/\n\s+/g, " ").trim();

// E) Replace the pills container block with the plain list
footer = footer.slice(0, second.start) + plainList + footer.slice(second.end);

// F) Ensure the primary crumb (“Kent • Maidstone • …”) uses pure white
footer = footer.replace(
  /(<span className=")text-[^"]+(">Kent|">Maidstone|">Canterbury|">Ashford|">Medway)/g,
  (_m,a,b)=>`${a}text-white${b}`
);

// G) Write back
fs.writeFileSync(FILE, before + footer + after);
console.log("✅ Converted pills to plain bullet list and removed rogue WhatsApp line.");
